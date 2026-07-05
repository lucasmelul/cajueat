import { create } from 'zustand';
import { brain } from '../brain';
import type { Collection, DnaTag, User } from '../../types';

export type OverlayKind = 'capture' | 'feedback' | 'search' | null;

interface AppState {
  /** Restaurant ids the user saved (CP-019 Collections). Server-authoritative (SPEC-006) — this is a cache. */
  saved: Record<string, boolean>;
  toggleSaved: (id: string) => Promise<void>;

  /** Selected pin on the Living Map — only one at a time (SPEC-001). */
  selectedRestaurantId: string | null;
  setSelectedRestaurantId: (id: string | null) => void;

  /** A query typed elsewhere (e.g. a Context Chip) that the Conversation screen should open with. */
  pendingQuery: string | null;
  setPendingQuery: (query: string | null) => void;

  /**
   * Shared across screens so Caju Points earned in one place (Feedback,
   * Knowledge Capture) show up everywhere (Living Map header, Profile)
   * without re-fetching. Hydrated once from the Brain, then mutated locally
   * (optimistic — the Brain already recorded the points server-side when
   * submitFeedback/submitCapture resolved).
   */
  user: User | null;
  setUser: (u: User) => void;
  addCajuPoints: (n: number) => void;

  /** Knowledge Capture / Feedback / Search overlays — global because their triggers live outside any single screen (SPEC-004, SPEC-011, SPEC-008). */
  overlay: OverlayKind;
  openOverlay: (kind: Exclude<OverlayKind, null>) => void;
  closeOverlay: () => void;

  /** ADN gastronómico (CP-011, SPEC-010) — server-authoritative cache, same pattern as `saved`. */
  dna: DnaTag[];
  removeDnaTag: (id: string) => Promise<void>;
  addDnaTag: (label: string) => Promise<void>;

  /** Named collections (CP-019, SPEC-009) — separate from the flat `saved` bookmark. Refetched after every mutation rather than patched optimistically, since nested restaurantIds arrays make optimistic patching error-prone for little benefit here. */
  collections: Collection[];
  loadCollections: () => Promise<void>;
  createCollection: (name: string) => Promise<void>;
  addToCollectionByName: (name: string, restaurantId: string) => Promise<void>;
  removeFromCollection: (collectionId: string, restaurantId: string) => Promise<void>;
  deleteCollection: (id: string) => Promise<void>;

  /** Guards against re-fetching saved/dna on every screen mount once loaded. */
  memoryHydrated: boolean;
  hydrateMemory: () => Promise<void>;
}

export const useAppStore = create<AppState>((set, get) => ({
  saved: {},
  toggleSaved: async (id) => {
    const next = !get().saved[id];
    set((state) => ({ saved: { ...state.saved, [id]: next } }));
    await brain.toggleSaved(id, next);
  },

  selectedRestaurantId: null,
  setSelectedRestaurantId: (id) => set({ selectedRestaurantId: id }),

  pendingQuery: null,
  setPendingQuery: (query) => set({ pendingQuery: query }),

  user: null,
  setUser: (u) => set({ user: u }),
  addCajuPoints: (n) =>
    set((state) => (state.user ? { user: { ...state.user, cajuPoints: state.user.cajuPoints + n } } : state)),

  overlay: null,
  openOverlay: (kind) => set({ overlay: kind }),
  closeOverlay: () => set({ overlay: null }),

  dna: [],
  removeDnaTag: async (id) => {
    set((state) => ({ dna: state.dna.filter((d) => d.id !== id) }));
    await brain.removeDnaTag(id);
  },
  addDnaTag: async (label) => {
    const tag = await brain.addDnaTag(label);
    set((state) => ({ dna: [...state.dna, tag] }));
  },

  collections: [],
  loadCollections: async () => {
    set({ collections: await brain.getCollections() });
  },
  createCollection: async (name) => {
    await brain.createCollection(name);
    await get().loadCollections();
  },
  addToCollectionByName: async (name, restaurantId) => {
    await brain.addRestaurantToCollectionByName(name, restaurantId);
    await get().loadCollections();
  },
  removeFromCollection: async (collectionId, restaurantId) => {
    await brain.removeFromCollection(collectionId, restaurantId);
    await get().loadCollections();
  },
  deleteCollection: async (id) => {
    await brain.deleteCollection(id);
    await get().loadCollections();
  },

  memoryHydrated: false,
  hydrateMemory: async () => {
    if (get().memoryHydrated) return;
    set({ memoryHydrated: true });
    const [savedIds, dna] = await Promise.all([brain.getSavedIds(), brain.getDna()]);
    set({ saved: Object.fromEntries(savedIds.map((id) => [id, true])), dna });
  },
}));
