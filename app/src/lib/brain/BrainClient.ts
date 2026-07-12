import type {
  CheckinResult,
  Collection,
  CompareResult,
  ConversationTurn,
  Contribution,
  Dish,
  DnaTag,
  GeoPoint,
  MapEvent,
  Passport,
  PendingFeedback,
  RecommendationContext,
  Recommendations,
  Restaurant,
  User,
} from '../../types';

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
  /** Marks the first-run flow (PRD-010 Onboarding) as done — never shown again for this user. */
  completeOnboarding(): Promise<void>;
  getRecommendations(context?: RecommendationContext): Promise<Recommendations>;
  getEvents(): Promise<MapEvent[]>;
  /** Every known restaurant — used by Profile to resolve the user's saved ids into cards. */
  getAllRestaurants(): Promise<Restaurant[]>;
  getRestaurant(id: string): Promise<Restaurant | undefined>;
  getSimilarRestaurants(id: string, limit?: number): Promise<Restaurant[]>;
  /** SPEC-025 "Ver menú": real sourced dishes for this restaurant — never a full invented menu. */
  getDishesForRestaurant(id: string): Promise<Dish[]>;
  /** `onDelta` fires with plain-text chunks of the reply as they're generated (SPEC-002: never a single completed block). */
  sendMessage(input: { text: string; history: ConversationTurn[] }, onDelta?: (chunk: string) => void): Promise<ConversationTurn>;

  /** Memory now lives in the Brain (SPEC-006) — these mutate server-side state, not local UI state. */
  getSavedIds(): Promise<string[]>;
  toggleSaved(id: string, saved: boolean): Promise<void>;
  getDna(): Promise<DnaTag[]>;
  addDnaTag(label: string): Promise<DnaTag>;
  removeDnaTag(id: string): Promise<void>;
  submitFeedback(input: { restaurantId: string; answers: string[] }): Promise<{ learned: string; pointsAwarded: number }>;
  /** `pending: true` means we couldn't process this automatically (e.g. a non-TikTok link) — it's parked for an operator to review by hand, never a real "we learned this" claim. */
  submitCapture(input: { kind: string; text?: string; image?: string; mediaType?: string }): Promise<{ learned: string; pointsAwarded: number; pending?: boolean }>;

  /** SPEC-008 Search Experience — intent-lite matching, never returns an empty list. */
  search(query: string, limit?: number): Promise<Restaurant[]>;

  /** SPEC-014 Compare Experience — 2-3 restaurants the user already narrowed down to, never more. */
  compareRestaurants(restaurantIds: string[], question?: string): Promise<CompareResult>;

  /** SPEC-009 Collections — named groupings, separate from the flat "saved" bookmark. */
  getCollections(): Promise<Collection[]>;
  createCollection(name: string): Promise<Collection>;
  /** "Guardar es enseñar": find-or-create by name, then add the restaurant. */
  addRestaurantToCollectionByName(name: string, restaurantId: string): Promise<Collection>;
  removeFromCollection(collectionId: string, restaurantId: string): Promise<void>;
  deleteCollection(id: string): Promise<void>;

  /** SPEC-013 "Guardá tu Brain" — step 1: no SMS vendor wired up yet, so devCode comes back directly in dev instead of faking delivery. */
  requestSyncCode(phone: string): Promise<{ sent: boolean; devCode?: string }>;
  /** Step 2: attaches the phone to this anonymous Brain. `conflict: true` means that phone is already linked elsewhere — never silently merged. */
  verifySyncCode(phone: string, code: string): Promise<{ linked: boolean; conflict?: boolean }>;

  /** SPEC-011/SPEC-016: real contributions timeline + real saved-without-feedback restaurants — never fixture text. */
  getActivity(): Promise<{ contributions: Contribution[]; pendingFeedback: PendingFeedback[] }>;

  /** SPEC-020 QR Check-in / SPEC-023 redemption — `mode` defaults to 'checkin'; 'redeem' requires `points`. */
  checkin(input: { token: string; position: GeoPoint; mode?: 'checkin' | 'redeem'; points?: number }): Promise<CheckinResult>;
  /** SPEC-021 Mi Pasaporte — real visited/pending state, never fixture. */
  getPassport(): Promise<Passport>;
}
