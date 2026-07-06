import type { BrainClient } from './BrainClient';
import { getAnonId } from './identity';

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

  sendMessage: ({ text, history }) =>
    request('/messages', { method: 'POST', body: JSON.stringify({ text, history }) }),

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
};
