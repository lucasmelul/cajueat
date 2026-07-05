import type { BrainClient } from './BrainClient';

const BASE_URL = import.meta.env.VITE_BRAIN_URL as string;

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}/api${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...init,
  });
  if (!res.ok) throw new Error(`Brain request failed: ${init?.method ?? 'GET'} ${path} (${res.status})`);
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

/** Real Brain implementation of BrainClient — talks to cajueat/brain/ over HTTP (CP-002). */
export const httpBrainClient: BrainClient = {
  getUser: () => request('/user'),

  getRecommendations: (context) => {
    const params = new URLSearchParams();
    if (context?.neighborhood) params.set('neighborhood', context.neighborhood);
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

  getCollections: () => request('/collections'),

  createCollection: (name) => request('/collections', { method: 'POST', body: JSON.stringify({ name }) }),

  addRestaurantToCollectionByName: (name, restaurantId) =>
    request('/collections/by-name', { method: 'POST', body: JSON.stringify({ name, restaurantId }) }),

  removeFromCollection: (collectionId, restaurantId) => request(`/collections/${collectionId}/restaurants/${restaurantId}`, { method: 'DELETE' }),

  deleteCollection: (id) => request(`/collections/${id}`, { method: 'DELETE' }),
};
