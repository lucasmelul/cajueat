import type { Restaurant } from './restaurant';

/** The single floating Brain Card on the Living Map (SPEC-001, BrainCard.d.ts). */
export interface BrainCardData {
  eyebrow: string;
  message: string;
  sub?: string;
  /** When present, the card's primary action opens this restaurant. */
  restaurantId?: string;
}

/** Context Chips on the Living Map (SPEC-001). Only 'date'/'work'/'saved' have real
 * signals to filter on today (idealFor/tags, saved ids) — 'near' needs geolocation and
 * 'open' needs opening-hours data that don't exist yet, so they're accepted but not filtered. */
export type ContextFilter = 'near' | 'open' | 'date' | 'work' | 'saved';

/** Signals the Recommendation Engine considers (SPEC-005, CP-023 Context Engine). Saved ids are Brain-owned memory now, not passed in. */
export interface RecommendationContext {
  neighborhood?: string;
  filter?: ContextFilter;
}

export interface Recommendations {
  brainCard: BrainCardData;
  restaurants: Restaurant[];
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
}
