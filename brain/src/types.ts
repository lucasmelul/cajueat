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

/** SPEC-022: a real, time-bound offer — informative only, never a discount code CajuEat calculates or redeems. */
export type PromotionType = 'liquidacion' | 'lanzamiento';
export interface Promotion {
  id: string;
  restaurantId: string;
  text: string;
  type: PromotionType;
  from: number;
  until: number;
  createdAt: number;
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

/** SPEC-025: a plate is its own sourceable entity, scoped to the one restaurant a given Source's claim is actually about — never a string loose inside `Restaurant.order`. */
export interface Dish {
  id: string;
  name: string;
  /** Groups dishes across restaurants for "¿dónde está el mejor X?" comparisons (e.g. "torta vasca", "chirashi"). */
  category: string;
  restaurantId: string;
  sources: Source[];
  trust: TrustLevel;
  trustRationale: string;
}

export interface Restaurant {
  id: string;
  name: string;
  cuisine: string;
  neighborhood: string;
  /** Real street address (calle y altura) — absence means we genuinely don't know it yet, never guessed. */
  address?: string;
  /** Google Places ID, set once when the operator links this restaurant to a real Google Place — never inferred, always an explicit operator action. Powers "Refrescar desde Google" (address/position/openHours/business status only, never trust or sources). */
  googlePlaceId?: string;
  /** SPEC-026: external, uncurated Google aggregate — shown separately from CajuEat's own trust, never fed into computeTrust or turned into a Source. */
  googleRating?: number;
  googleRatingCount?: number;
  /** Google's own short editorial blurb and up to 5 real review excerpts — same external/uncurated boundary as googleRating (never a Source, never fed into computeTrust). Passed to the Brain as grounding context so Conversation can answer questions about them. */
  googleEditorialSummary?: string;
  googleReviews?: { text: string; rating: number }[];
  /** Distinción real de la Guía Michelin — independiente entre sí (un lugar puede tener estrella Y estrella verde a la vez), nunca inferida, siempre cargada por un operador con una fuente real citada. */
  michelinStars?: number;
  michelinGreenStar?: boolean;
  michelinBibGourmand?: boolean;
  /** "restaurante" | "cafe" — inferido de la cocina/tipo de Google al cargar, editable por un operador. Alimenta el filtro de tipo de pin en el mapa. */
  venueType?: 'restaurant' | 'cafe';
  /** Handle real de Instagram (sin @), cargado a mano por un operador — Google Places no expone redes sociales. Solo un link directo a la cuenta, nunca un feed embebido (requeriría acceso de la propia cuenta vía Graph API). */
  instagramHandle?: string;
  price: string;
  trust: TrustLevel;
  /** Rationale behind the computed trust level (SPEC-007) — surfaced to the PWA, never a raw score. */
  trustRationale: string;
  /** Al menos una fuente no-"weak" (o evidencia insuficiente) — un lugar sin esto no llega a `getCatalog()` público hasta que otra fuente lo corrobore. Siempre presente en la respuesta, útil para el badge de Admin. */
  hasEnoughEvidence: boolean;
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
  /** Hand-authored demo/fixture data, never a real place — hidden from every end-user-facing read (getCatalog defaults to excluding it), visible only in the Admin CMS. */
  isDemo?: boolean;
  /** SPEC-022: attached only when a promo is currently within its from/until window — computed at read time, never stored on the restaurant itself. */
  activePromotion?: Promotion;
}

export interface MapEvent {
  id: string;
  name: string;
  /** Short display label shown on the map/UI (e.g. "sáb") — not parseable, kept for the existing pin copy. */
  when: string;
  /** Real ISO datetime the event happens — the actual signal the SPEC-016 "Eventos" push trigger schedules against. */
  whenAt: string;
  position: GeoPoint;
  /** Real street address from Google Places, captured once when the operator picks the venue — never typed by hand. */
  address?: string;
  /** The Google Place the event's venue resolved to — kept only as provenance, never re-fetched on a schedule. */
  googlePlaceId?: string;
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
  /** Null when the active filter genuinely matches nothing — never a fake pick to fill the card. */
  brainCard: BrainCardData | null;
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
  /** Set when this user message also taught the Brain something new about a real place (SPEC-004 "Desde conversación") — the restaurant name, for a subtle UI acknowledgment. */
  learnedAbout?: string;
  /** Real Caju Points awarded for `learnedAbout`, so the client can update the local balance instead of guessing the amount. */
  learnedPoints?: number;
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
