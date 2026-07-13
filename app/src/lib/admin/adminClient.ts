import type { Dish, MapEvent, Promotion, PromotionType, Restaurant } from '../../types';

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

/** By the time any other admin call happens the operator already got past the login gate, so a 503 here can only mean the Brain's GOOGLE_PLACES_API_KEY isn't set — never the operator gate itself. */
export class GooglePlacesNotConfiguredError extends Error {
  constructor() {
    super('Google Places no está configurado en el Brain (falta GOOGLE_PLACES_API_KEY).');
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}/api${path}`, {
    headers: { 'Content-Type': 'application/json', 'X-Caju-Operator-Token': getOperatorToken() ?? '' },
    ...init,
  });
  if (res.status === 401) throw new AdminAuthError();
  if (res.status === 503) throw new GooglePlacesNotConfiguredError();
  if (!res.ok) throw new Error(`Admin request failed: ${init?.method ?? 'GET'} ${path} (${res.status})`);
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export interface CuratorMatch {
  restaurantId: string;
  restaurantName: string;
  claim: string;
  suggestedWeight: 'strong' | 'medium' | 'weak';
}

/** A place the pasted curator text mentions that isn't in the catalog yet — cuisine/neighborhood may be empty when the text didn't state them. */
export interface NewRestaurantMention {
  name: string;
  cuisine: string;
  neighborhood: string;
  claim: string;
}

/** SPEC-025: a specific dish the pasted text names for a matched restaurant — only ever attached to a restaurant already confirmed real in `matches`. */
export interface CuratorDishMatch {
  restaurantId: string;
  restaurantName: string;
  dishName: string;
  category: string;
  claim: string;
  suggestedWeight: 'strong' | 'medium' | 'weak';
}

export interface CuratorAnalysis {
  matches: CuratorMatch[];
  newRestaurants: NewRestaurantMention[];
  dishMatches: CuratorDishMatch[];
}

export type CreateRestaurantInput = Pick<Restaurant, 'name' | 'cuisine' | 'neighborhood'> & Partial<Restaurant>;

export interface CuratorRecord {
  handle: string;
  domains: Record<string, { sustained: number; contradicted: number }>;
}

/** SPEC-019: what a regular user's Nota/Foto/Voz/conversation message taught the Brain, awaiting operator review. */
/** Optional context on who submitted a moderation item — never a raw phone, only enough for an operator to recognize a repeat contributor. */
export interface ContributorSummary {
  phoneVerified: boolean;
  maskedPhone?: string;
  points: number;
  contributionsCount: number;
}

export interface PendingContribution {
  id: string;
  restaurantId: string;
  restaurantName: string;
  claim: string;
  source: 'note' | 'photo' | 'voice' | 'conversation' | 'link';
  createdAt: number;
  status: 'pending' | 'confirmed' | 'rejected';
  contributor: ContributorSummary | null;
}

export type CreateEventInput = {
  name: string;
  whenAt: string;
  position: { lat: number; lng: number };
  address?: string;
  googlePlaceId?: string;
};

/** SPEC-019 extension: a place a user described that wasn't in the catalog yet — name/cuisine/neighborhood/address may be blank where the source text didn't say, an operator fills gaps before confirming. */
export interface NewPlaceSuggestion {
  id: string;
  name: string;
  cuisine: string;
  neighborhood: string;
  address?: string;
  claim: string;
  source: 'note' | 'photo' | 'voice' | 'conversation' | 'link';
  createdAt: number;
  status: 'pending' | 'confirmed' | 'rejected';
  contributor: ContributorSummary | null;
}

export type ConfirmNewPlaceInput = { name?: string; cuisine?: string; neighborhood?: string; address?: string; position?: { lat: number; lng: number } };

/** SPEC-025 extension of SPEC-019: a specific dish a user's Nota/Foto/Voz named for an already-real restaurant. */
export interface PendingDishMention {
  id: string;
  restaurantId: string;
  restaurantName: string;
  dishName: string;
  category: string;
  claim: string;
  source: 'note' | 'photo' | 'voice' | 'conversation' | 'link';
  createdAt: number;
  status: 'pending' | 'confirmed' | 'rejected';
  contributor: ContributorSummary | null;
}

/** SPEC-015: a Reel/TikTok/link a user pasted — the Brain never reads the content, so an operator opens it by hand. */
export interface PendingLink {
  id: string;
  url: string;
  note?: string;
  createdAt: number;
  status: 'pending' | 'confirmed' | 'rejected';
  contributor: ContributorSummary | null;
}

export type CreateDishInput = {
  name: string;
  category: string;
  restaurantId: string;
  source: { name: string; kind: string; weight: string; claim?: string };
};

export type CreatePromotionInput = { text: string; type: PromotionType; from: string; until: string };

/** SPEC-027: ephemeral — never persisted server-side, the operator confirms each one via the plain createEvent below. */
export interface EventImageSuggestion {
  name: string;
  whenRaw: string;
  whenAt: string | null;
  instagramHandle: string | null;
  claim: string;
}

export interface GooglePlaceCandidate {
  placeId: string;
  name: string;
  address: string;
}

/** Not bound to a restaurant — position + address for any real venue an operator picks, e.g. an event's venue. */
export interface GooglePlaceDetails extends GooglePlaceCandidate {
  position: { lat: number; lng: number };
  primaryType?: string;
}

export type GoogleBusinessStatus = 'OPERATIONAL' | 'CLOSED_TEMPORARILY' | 'CLOSED_PERMANENTLY' | 'BUSINESS_STATUS_UNSPECIFIED';

export interface GoogleLinkResult {
  restaurant: Restaurant;
  businessStatus: GoogleBusinessStatus;
}

/** SPEC-023: real Caju Points consumed per restaurant — never a peso equivalent, only counts. */
export interface ConsumptionSummaryRow {
  restaurantId: string;
  restaurantName: string;
  totalPoints: number;
  count: number;
}

/** Dashboard overview — every field is a direct read of real data (never a placeholder metric). */
export interface AdminStats {
  restaurants: {
    total: number;
    demo: number;
    byTrust: { high: number; mid: number; low: number };
    linkedToGoogle: number;
    stale: number;
  };
  users: {
    totalUsers: number;
    phoneLinked: number;
    activeLast7d: number;
    activeLast30d: number;
    totalCajuPoints: number;
    totalSavedRestaurants: number;
  };
  curators: number;
  events: number;
  pending: { contributions: number; newPlaces: number };
}

export const adminClient = {
  getStats: () => request<AdminStats>('/admin/stats'),

  getCatalog: () => request<Restaurant[]>('/admin/restaurants'),

  getCurators: () => request<CuratorRecord[]>('/admin/curators'),

  getEvents: () => request<MapEvent[]>('/admin/events'),

  createEvent: (input: CreateEventInput) => request<MapEvent>('/admin/events', { method: 'POST', body: JSON.stringify(input) }),

  deleteEvent: (id: string) => request<void>(`/admin/events/${id}`, { method: 'DELETE' }),

  getPendingContributions: () => request<PendingContribution[]>('/admin/pending-contributions'),

  confirmPendingContribution: (id: string) => request<Restaurant>(`/admin/pending-contributions/${id}/confirm`, { method: 'POST' }),

  rejectPendingContribution: (id: string) => request<PendingContribution>(`/admin/pending-contributions/${id}/reject`, { method: 'POST' }),

  getPendingNewPlaces: () => request<NewPlaceSuggestion[]>('/admin/pending-new-places'),

  confirmNewPlace: (id: string, input?: ConfirmNewPlaceInput) =>
    request<Restaurant>(`/admin/pending-new-places/${id}/confirm`, { method: 'POST', body: JSON.stringify(input ?? {}) }),

  rejectNewPlace: (id: string) => request<NewPlaceSuggestion>(`/admin/pending-new-places/${id}/reject`, { method: 'POST' }),

  updateRestaurant: (id: string, patch: Partial<Restaurant>) =>
    request<Restaurant>(`/admin/restaurants/${id}`, { method: 'PATCH', body: JSON.stringify(patch) }),

  createRestaurant: (input: CreateRestaurantInput) =>
    request<Restaurant>('/admin/restaurants', { method: 'POST', body: JSON.stringify(input) }),

  analyze: (text: string) => request<CuratorAnalysis>('/admin/analyze', { method: 'POST', body: JSON.stringify({ text }) }),

  addSource: (restaurantId: string, source: { name: string; kind: string; weight: string; claim?: string }) =>
    request<Restaurant>(`/admin/restaurants/${restaurantId}/sources`, { method: 'POST', body: JSON.stringify(source) }),

  searchGooglePlaces: (query: string) => request<GooglePlaceCandidate[]>(`/admin/google-places/search?q=${encodeURIComponent(query)}`),

  /** Generic Details fetch, not bound to a restaurant — used to pick any real venue (e.g. an event's location). */
  getGooglePlaceDetails: (placeId: string) => request<GooglePlaceDetails>(`/admin/google-places/details?placeId=${encodeURIComponent(placeId)}`),

  linkGooglePlace: (restaurantId: string, placeId: string) =>
    request<GoogleLinkResult>(`/admin/restaurants/${restaurantId}/link-google`, { method: 'POST', body: JSON.stringify({ placeId }) }),

  refreshFromGoogle: (restaurantId: string) =>
    request<GoogleLinkResult>(`/admin/restaurants/${restaurantId}/refresh-google`, { method: 'POST' }),

  /** SPEC-020: the static signed token this restaurant's printed/displayed QR should encode — the operator renders it as an image client-side. */
  getCheckinToken: (restaurantId: string) => request<{ token: string }>(`/admin/restaurants/${restaurantId}/checkin-token`),

  getConsumption: () => request<ConsumptionSummaryRow[]>('/admin/consumption'),

  /** SPEC-022: never sent immediately — the scheduler tick is the only path that actually pushes, exactly within [from, until]. */
  createPromotion: (restaurantId: string, input: CreatePromotionInput) =>
    request<Promotion>(`/admin/restaurants/${restaurantId}/promotions`, { method: 'POST', body: JSON.stringify(input) }),

  getPromotions: (restaurantId: string) => request<Promotion[]>(`/admin/restaurants/${restaurantId}/promotions`),

  /** SPEC-027: extraction + deterministic date resolution together — re-call with a corrected `referenceDate` to re-resolve, never the LLM guessing the date. */
  extractEventsFromImage: (image: string, mediaType: string, referenceDate?: string) =>
    request<{ suggestions: EventImageSuggestion[] }>('/admin/events/from-image', { method: 'POST', body: JSON.stringify({ image, mediaType, referenceDate }) }),

  /** SPEC-025: every dish, trust computed fresh from its own sources — same discipline as the restaurant catalog. */
  getDishes: () => request<Dish[]>('/admin/dishes'),

  /** Direct operator creation — same convention as createRestaurant: an operator's own action, never queued. */
  createDish: (input: CreateDishInput) => request<Dish>('/admin/dishes', { method: 'POST', body: JSON.stringify(input) }),

  addDishSource: (dishId: string, source: { name: string; kind: string; weight: string; claim?: string }) =>
    request<Dish>(`/admin/dishes/${dishId}/sources`, { method: 'POST', body: JSON.stringify(source) }),

  /** Confirming a curator's dishMatch — find-or-create by (restaurantId, dishName), same discipline as confirming a restaurant match. */
  confirmDishMatch: (input: { restaurantId: string; dishName: string; category: string; name: string; kind: string; weight: string; claim?: string }) =>
    request<Dish>('/admin/dishes/confirm-match', { method: 'POST', body: JSON.stringify(input) }),

  getPendingDishMentions: () => request<PendingDishMention[]>('/admin/pending-dish-mentions'),

  confirmPendingDishMention: (id: string) => request<Dish>(`/admin/pending-dish-mentions/${id}/confirm`, { method: 'POST' }),

  rejectPendingDishMention: (id: string) => request<PendingDishMention>(`/admin/pending-dish-mentions/${id}/reject`, { method: 'POST' }),

  getPendingLinks: () => request<PendingLink[]>('/admin/pending-links'),

  markPendingLinkReviewed: (id: string) => request<PendingLink>(`/admin/pending-links/${id}/reviewed`, { method: 'POST' }),

  rejectPendingLink: (id: string) => request<PendingLink>(`/admin/pending-links/${id}/reject`, { method: 'POST' }),
};
