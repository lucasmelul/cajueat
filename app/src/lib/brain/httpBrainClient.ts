import type { BrainClient } from './BrainClient';
import { getAnonId } from './identity';
import type { ConversationTurn } from '../../types';

const BASE_URL = import.meta.env.VITE_BRAIN_URL as string;

/** Thrown when SPEC-013's anonymous rate limit kicks in — screens catch this to nudge "Guardá tu Brain" instead of showing a generic error. */
export class BrainSyncRequiredError extends Error {
  constructor() {
    super('Se alcanzó el límite de uso anónimo — hace falta sincronizar el Brain para seguir.');
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}/api${path}`, {
    headers: { 'Content-Type': 'application/json', 'X-Caju-User-Id': getAnonId() },
    ...init,
  });
  if (res.status === 429) throw new BrainSyncRequiredError();
  if (!res.ok) throw new Error(`Brain request failed: ${init?.method ?? 'GET'} ${path} (${res.status})`);
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

/** Real Brain implementation of BrainClient — talks to cajueat/brain/ over HTTP (CP-002). */
export const httpBrainClient: BrainClient = {
  getUser: () => request('/user'),

  completeOnboarding: () => request('/onboarding/complete', { method: 'POST' }),

  getRecommendations: (context) => {
    const params = new URLSearchParams();
    if (context?.neighborhood) params.set('neighborhood', context.neighborhood);
    if (context?.filter) params.set('filter', context.filter);
    if (context?.near) {
      params.set('lat', String(context.near.lat));
      params.set('lng', String(context.near.lng));
    }
    const qs = params.toString();
    return request(`/recommendations${qs ? `?${qs}` : ''}`);
  },

  getEvents: () => request('/events'),

  getAllRestaurants: () => request('/restaurants'),

  getRestaurant: async (id) => {
    try {
      return await request(`/restaurants/${id}`);
    } catch {
      return undefined;
    }
  },

  getSimilarRestaurants: (id, limit = 3) => request(`/restaurants/${id}/similar?limit=${limit}`),

  // SPEC-002: the Brain sends the reply as a chunked ND-JSON body, not a single JSON
  // object — read it as a stream so `onDelta` can fire as text is actually generated,
  // rather than buffering the whole response before showing anything.
  sendMessage: async ({ text, history }, onDelta) => {
    const res = await fetch(`${BASE_URL}/api/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Caju-User-Id': getAnonId() },
      body: JSON.stringify({ text, history }),
    });
    if (res.status === 429) throw new BrainSyncRequiredError();
    if (!res.ok || !res.body) throw new Error(`Brain request failed: POST /messages (${res.status})`);

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    let turn: ConversationTurn | null = null;

    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      let newlineIdx = buffer.indexOf('\n');
      while (newlineIdx !== -1) {
        const line = buffer.slice(0, newlineIdx);
        buffer = buffer.slice(newlineIdx + 1);
        if (line.trim()) {
          const msg = JSON.parse(line) as { type: 'delta'; text: string } | { type: 'done'; turn: ConversationTurn };
          if (msg.type === 'delta') onDelta?.(msg.text);
          else turn = msg.turn;
        }
        newlineIdx = buffer.indexOf('\n');
      }
    }

    if (!turn) throw new Error('Brain stream ended without a final turn');
    return turn;
  },

  getSavedIds: () => request('/saved'),

  toggleSaved: (id, saved) => request(`/restaurants/${id}/save`, { method: 'POST', body: JSON.stringify({ saved }) }),

  getDna: () => request('/dna'),

  addDnaTag: (label) => request('/dna', { method: 'POST', body: JSON.stringify({ label }) }),

  removeDnaTag: (id) => request(`/dna/${id}`, { method: 'DELETE' }),

  submitFeedback: (input) => request('/feedback', { method: 'POST', body: JSON.stringify(input) }),

  submitCapture: (input) => request('/capture', { method: 'POST', body: JSON.stringify(input) }),

  search: (query, limit = 8) => request(`/search?q=${encodeURIComponent(query)}&limit=${limit}`),

  compareRestaurants: (restaurantIds, question) =>
    request('/compare', { method: 'POST', body: JSON.stringify({ restaurantIds, question }) }),

  getCollections: () => request('/collections'),

  createCollection: (name) => request('/collections', { method: 'POST', body: JSON.stringify({ name }) }),

  addRestaurantToCollectionByName: (name, restaurantId) =>
    request('/collections/by-name', { method: 'POST', body: JSON.stringify({ name, restaurantId }) }),

  removeFromCollection: (collectionId, restaurantId) => request(`/collections/${collectionId}/restaurants/${restaurantId}`, { method: 'DELETE' }),

  deleteCollection: (id) => request(`/collections/${id}`, { method: 'DELETE' }),

  requestSyncCode: (phone) => request('/identity/otp/request', { method: 'POST', body: JSON.stringify({ phone }) }),

  verifySyncCode: (phone, code) => request('/identity/otp/verify', { method: 'POST', body: JSON.stringify({ phone, code }) }),

  getActivity: () => request('/activity'),

  // SPEC-020/023: every expected outcome (out of range, already checked in, cooldown,
  // insufficient points) is a real, documented error the backend returns as a typed JSON
  // body on a non-2xx status — read here instead of using `request()`, which would only
  // throw a generic Error and lose that detail.
  checkin: async ({ token, position, mode, points }) => {
    const res = await fetch(`${BASE_URL}/api/checkin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Caju-User-Id': getAnonId() },
      body: JSON.stringify({ token, position, mode, points }),
    });
    const body = await res.json();
    if (!res.ok) return { ok: false, error: body.error, balance: body.balance, retryAt: body.retryAt };
    return { ok: true, ...body };
  },

  getPassport: () => request('/passport'),
};
