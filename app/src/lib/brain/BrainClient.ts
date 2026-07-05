import type { ConversationTurn, DnaTag, MapEvent, RecommendationContext, Recommendations, Restaurant, User } from '../../types';

/**
 * The only way any screen talks to the Brain (CP-002 Product Architecture:
 * "la inteligencia vive únicamente en el Brain"; SPEC-005: "la UI nunca
 * consulta directamente múltiples fuentes"). All enriched data — why,
 * trust, sources, summaries — arrives already computed through here.
 *
 * `mockBrainClient` and `httpBrainClient` both implement this interface —
 * screens never know which one they're talking to.
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

  /** Memory now lives in the Brain (SPEC-006) — these mutate server-side state, not local UI state. */
  getSavedIds(): Promise<string[]>;
  toggleSaved(id: string, saved: boolean): Promise<void>;
  getDna(): Promise<DnaTag[]>;
  addDnaTag(label: string): Promise<DnaTag>;
  removeDnaTag(id: string): Promise<void>;
  submitFeedback(input: { restaurantId: string; answers: string[] }): Promise<{ learned: string; pointsAwarded: number }>;
  submitCapture(input: { kind: string }): Promise<{ learned: string; pointsAwarded: number }>;
}
