import type { GeoPoint, Restaurant } from './restaurant';

/** The single floating Brain Card on the Living Map (SPEC-001, BrainCard.d.ts). */
export interface BrainCardData {
  eyebrow: string;
  message: string;
  sub?: string;
  /** When present, the card's primary action opens this restaurant. */
  restaurantId?: string;
}

/** Context Chips on the Living Map (SPEC-001). All five filter for real — 'near' needs `near` (real geolocation) to actually narrow by distance. */
export type ContextFilter = 'near' | 'open' | 'date' | 'work' | 'saved';

/** Signals the Recommendation Engine considers (SPEC-005, CP-023 Context Engine). Saved ids are Brain-owned memory now, not passed in. */
export interface RecommendationContext {
  neighborhood?: string;
  filter?: ContextFilter;
  /** Real user coordinates for the 'near' filter — omit when geolocation wasn't granted. */
  near?: GeoPoint;
}

export interface Recommendations {
  brainCard: BrainCardData;
  restaurants: Restaurant[];
}

/** SPEC-014 Compare Experience — always a conclusion, never just data side by side. */
export interface CompareResult {
  recommendedId: string | null;
  reasoning: string;
  whenToChooseOther: string | null;
}

export type ConversationRole = 'user' | 'brain';

/** One turn in a Conversation session (SPEC-002). Brain turns render on-canvas: text + cards + chips. */
export interface ConversationTurn {
  id: string;
  role: ConversationRole;
  text?: string;
  restaurants?: Restaurant[];
  chips?: string[];
  thinking?: boolean;
  createdAt: number;
  /** Set when this user message also taught the Brain something new about a real place (SPEC-004 "Desde conversación"). */
  learnedAbout?: string;
  /** Real Caju Points awarded for `learnedAbout`. */
  learnedPoints?: number;
}

/** SPEC-020 QR Check-in / SPEC-023 redemption — a discriminated result, not a thrown error, for every expected outcome (same pattern as verifySyncCode's `conflict`). */
export interface CheckinResult {
  ok: boolean;
  restaurant?: Restaurant;
  pointsAwarded?: number;
  firstVisit?: boolean;
  pointsSpent?: number;
  remainingBalance?: number;
  error?: 'out_of_range' | 'already_checked_in_today' | 'invalid_token' | 'restaurant_not_found' | 'insufficient_points' | 'cooldown_active' | 'points_required';
  balance?: number;
  retryAt?: number;
}

/** SPEC-021 Mi Pasaporte — real visited/pending state against the real catalog, never a fixture goal. */
export interface Passport {
  catalogSize: number;
  visited: { restaurant: Restaurant; firstVisitAt: number }[];
  pendingByNeighborhood: { neighborhood: string; restaurants: Restaurant[] }[];
}
