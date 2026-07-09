import type { SourceKind, SignalWeight } from './trust';

/** Where a restaurant sits on the map. Real coordinates (not the prototype's top/left %). */
export interface GeoPoint {
  lat: number;
  lng: number;
}

/** Matches MapPin's PinType minus the non-restaurant kinds ('event' | 'collection'). */
export type RestaurantSignal = 'recommended' | 'new' | 'saved' | 'visited';

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
  /** ISO date the signal was captured — the Brain already sends this (feeds its Trust Engine freshness decay), just wasn't typed here yet since nothing on this side needed it. */
  capturedAt: string;
  /** Short, free-text stance this source takes (e.g. "Ambiente ruidoso") — feeds contradiction detection (SPEC-007). */
  claim?: string;
}

/** SPEC-025: a plate is its own sourceable entity, scoped to the one restaurant a given Source's claim is actually about. */
export interface Dish {
  id: string;
  name: string;
  /** Groups dishes across restaurants for "¿dónde está el mejor X?" comparisons. */
  category: string;
  restaurantId: string;
  sources: Source[];
  trust: 'high' | 'mid' | 'low';
  trustRationale: string;
}

/**
 * A restaurant as the Brain understands it: not a directory row, a decision.
 * Shape mirrors design/ui_kits/pwa/data.js, typed and with real geo instead
 * of prototype percentages (CP-015 Restaurant Entity Model, SPEC-003).
 */
export interface Restaurant {
  id: string;
  name: string;
  cuisine: string;
  neighborhood: string;
  /** Real street address (calle y altura) — absent means we genuinely don't know it yet, never guessed. */
  address?: string;
  /** Google Places ID, set once the operator links this restaurant — only meaningful in the Admin CMS. */
  googlePlaceId?: string;
  /** SPEC-026: external, uncurated Google aggregate — shown separately from CajuEat's own trust, never part of it. */
  googleRating?: number;
  googleRatingCount?: number;
  /** Price band, e.g. "$$" / "$$$". */
  price: string;
  trust: 'high' | 'mid' | 'low';
  /** Plain-language explanation behind `trust` (SPEC-007) — "el usuario nunca ve números, ve explicaciones". */
  trustRationale?: string;
  type: RestaurantSignal;
  /** The Brain's one-line reason to go. */
  why: string;
  tags: string[];
  personality: string[];
  position: GeoPoint;
  /** ≤3 paragraphs, the Brain's editorial summary (SPEC-003). */
  summary: string;
  quickFacts: QuickFact[];
  order: OrderSuggestion[];
  tips: string[];
  idealFor: string[];
  notFor: string[];
  sources: Source[];
  image?: string;
  /** Hand-authored demo/fixture data, never a real place — only ever present (and true) in the Admin CMS's catalog view. */
  isDemo?: boolean;
  /** SPEC-022: present only when a promo is currently within its from/until window. */
  activePromotion?: Promotion;
}
