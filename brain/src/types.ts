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

/** One real opening shift. `days`: 0=domingo .. 6=sábado. `from`/`to` en "HH:mm", hora de Buenos Aires — `to` puede cruzar medianoche (ej. "23:00" a "00:30"). */
export interface OpenPeriod {
  days: number[];
  from: string;
  to: string;
}

export interface Source {
  name: string;
  kind: SourceKind;
  weight: SignalWeight;
  /** ISO date the signal was captured — feeds the Trust Engine's freshness factor. */
  capturedAt: string;
  /** Short, free-text stance this source takes (e.g. "Ambiente ruidoso") — feeds contradiction detection (SPEC-007). */
  claim?: string;
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
  /** Real weekly hours (SPEC-001 "Abierto ahora") — absence means we genuinely don't know, never guessed. */
  openHours?: OpenPeriod[];
}

export interface MapEvent {
  id: string;
  name: string;
  /** Short display label shown on the map/UI (e.g. "sáb") — not parseable, kept for the existing pin copy. */
  when: string;
  /** Real ISO datetime the event happens — the actual signal the SPEC-016 "Eventos" push trigger schedules against. */
  whenAt: string;
  position: GeoPoint;
}

export interface User {
  id: string;
  name: string;
  initials: string;
  cajuPoints: number;
  /** Whether the first-run flow (PRD-010 Onboarding) has been completed. */
  onboarded: boolean;
  /** Set once "Guardá tu Brain" (SPEC-013) links a verified phone to this anonymous row. */
  phone?: string;
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

/** Context Chips on the Living Map (SPEC-001). All five filter for real now — 'near' needs the caller to pass `near` (real geolocation), 'open' uses real per-restaurant hours. */
export type ContextFilter = 'near' | 'open' | 'date' | 'work' | 'saved';

export interface RecommendationContext {
  neighborhood?: string;
  filter?: ContextFilter;
  /** Real user coordinates for the 'near' filter — absent means no geolocation was granted. */
  near?: GeoPoint;
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

/** A named, user-created grouping of restaurants (CP-019, SPEC-009) — separate from the flat "saved" bookmark. */
export interface Collection {
  id: string;
  name: string;
  restaurantIds: string[];
}
