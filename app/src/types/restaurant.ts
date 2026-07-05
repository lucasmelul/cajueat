import type { SourceKind, SignalWeight } from './trust';

/** Where a restaurant sits on the map. Real coordinates (not the prototype's top/left %). */
export interface GeoPoint {
  lat: number;
  lng: number;
}

/** Matches MapPin's PinType minus the non-restaurant kinds ('event' | 'collection'). */
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
  /** Short, free-text stance this source takes (e.g. "Ambiente ruidoso") — feeds contradiction detection (SPEC-007). */
  claim?: string;
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
}
