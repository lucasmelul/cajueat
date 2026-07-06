import type { Restaurant } from '../../types';

/**
 * SPEC-018 Admin CMS: a genuinely different client of the Brain, not a
 * variant of the end-user BrainClient — different auth (operator shared
 * secret, never the anonymous/phone identity from SPEC-013), different
 * operations (direct catalog writes no end user ever gets). Kept as its
 * own module on purpose instead of extending BrainClient's interface.
 */
const BASE_URL = import.meta.env.VITE_BRAIN_URL as string;
const TOKEN_KEY = 'caju_operator_token';

export function getOperatorToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setOperatorToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearOperatorToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export class AdminAuthError extends Error {
  constructor() {
    super('Token de operador inválido.');
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}/api${path}`, {
    headers: { 'Content-Type': 'application/json', 'X-Caju-Operator-Token': getOperatorToken() ?? '' },
    ...init,
  });
  if (res.status === 401) throw new AdminAuthError();
  if (!res.ok) throw new Error(`Admin request failed: ${init?.method ?? 'GET'} ${path} (${res.status})`);
  return res.json() as Promise<T>;
}

export interface CuratorMatch {
  restaurantId: string;
  restaurantName: string;
  claim: string;
  suggestedWeight: 'strong' | 'medium' | 'weak';
}

export interface CuratorAnalysis {
  matches: CuratorMatch[];
  unmatchedMentions: string[];
}

export type CreateRestaurantInput = Pick<Restaurant, 'name' | 'cuisine' | 'neighborhood'> & Partial<Restaurant>;

export interface CuratorRecord {
  handle: string;
  domains: Record<string, { sustained: number; contradicted: number }>;
}

export const adminClient = {
  getCatalog: () => request<Restaurant[]>('/admin/restaurants'),

  getCurators: () => request<CuratorRecord[]>('/admin/curators'),

  updateRestaurant: (id: string, patch: Partial<Restaurant>) =>
    request<Restaurant>(`/admin/restaurants/${id}`, { method: 'PATCH', body: JSON.stringify(patch) }),

  createRestaurant: (input: CreateRestaurantInput) =>
    request<Restaurant>('/admin/restaurants', { method: 'POST', body: JSON.stringify(input) }),

  analyze: (text: string) => request<CuratorAnalysis>('/admin/analyze', { method: 'POST', body: JSON.stringify({ text }) }),

  addSource: (restaurantId: string, source: { name: string; kind: string; weight: string; claim?: string }) =>
    request<Restaurant>(`/admin/restaurants/${restaurantId}/sources`, { method: 'POST', body: JSON.stringify(source) }),
};
