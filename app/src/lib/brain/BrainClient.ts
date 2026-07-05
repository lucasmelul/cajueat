import type { ConversationTurn, MapEvent, RecommendationContext, Recommendations, Restaurant, User } from '../../types';

/**
 * The only way any screen talks to the Brain (CP-002 Product Architecture:
 * "la inteligencia vive únicamente en el Brain"; SPEC-005: "la UI nunca
 * consulta directamente múltiples fuentes"). All enriched data — why,
 * trust, sources, summaries — arrives already computed through here.
 *
 * `mockBrainClient` is the only implementation today. A real HTTP-backed
 * client can implement this same interface later without touching any
 * screen.
 */
export interface BrainClient {
  getUser(): Promise<User>;
  getRecommendations(context?: RecommendationContext): Promise<Recommendations>;
  getEvents(): Promise<MapEvent[]>;
  /** Every known restaurant — used by Profile to resolve the user's saved ids into cards. */
  getAllRestaurants(): Promise<Restaurant[]>;
  getRestaurant(id: string): Promise<Restaurant | undefined>;
  getSimilarRestaurants(id: string, limit?: number): Promise<Restaurant[]>;
  sendMessage(input: { text: string; history: ConversationTurn[] }): Promise<ConversationTurn>;
}
