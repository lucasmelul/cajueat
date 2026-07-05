/**
 * Mirrors cajueat/app/src/types/*.ts field-for-field. Duplicated on purpose —
 * the Brain is a separate service (CP-002) and a shared package for a
 * single consumer would be premature; keep both sides honest by hand.
 */

export type SourceKind = 'curator' | 'community' | 'visit' | 'press' | 'menu';
export type SignalWeight = 'strong' | 'medium' | 'weak';
export type TrustLevel = 'high' | 'mid' | 'low';

export interface GeoPoint {
  lat: number;
  lng: number;
}

export type RestaurantSignal = 'recommended' | 'new' | 'saved' | 'visited';

export interface QuickFact {
  icon: string;
  label: string;
}

export interface OrderSuggestion {
  when: string;
  dish: string;
}

export interface Source {
  name: string;
  kind: SourceKind;
  weight: SignalWeight;
  /** ISO date the signal was captured — feeds the Trust Engine's freshness factor. */
  capturedAt: string;
}

export interface Restaurant {
  id: string;
  name: string;
  cuisine: string;
  neighborhood: string;
  price: string;
  trust: TrustLevel;
  /** Rationale behind the computed trust level (SPEC-007) — surfaced to the PWA, never a raw score. */
  trustRationale: string;
  type: RestaurantSignal;
  why: string;
  tags: string[];
  personality: string[];
  position: GeoPoint;
  summary: string;
  quickFacts: QuickFact[];
  order: OrderSuggestion[];
  tips: string[];
  idealFor: string[];
  notFor: string[];
  sources: Source[];
  image?: string;
}

export interface MapEvent {
  id: string;
  name: string;
  when: string;
  position: GeoPoint;
}

export interface User {
  id: string;
  name: string;
  initials: string;
  cajuPoints: number;
}

export interface DnaTag {
  id: string;
  label: string;
}

export interface BrainCardData {
  eyebrow: string;
  message: string;
  sub?: string;
  restaurantId?: string;
}

export interface RecommendationContext {
  neighborhood?: string;
}

export interface Recommendations {
  brainCard: BrainCardData;
  restaurants: Restaurant[];
}

export type ConversationRole = 'user' | 'brain';

export interface ConversationTurn {
  id: string;
  role: ConversationRole;
  text?: string;
  restaurants?: Restaurant[];
  chips?: string[];
  thinking?: boolean;
  createdAt: number;
}

/** A learned, evidence-backed fact about the user (SPEC-006 Memory Engine). */
export interface MemoryFact {
  id: string;
  label: string;
  evidenceCount: number;
  createdAt: number;
  updatedAt: number;
}
