import { create } from 'zustand';

interface AppState {
  /** Restaurant ids the user saved (CP-019 Collections — MVP: a single flat set). */
  saved: Record<string, boolean>;
  toggleSaved: (id: string) => void;

  /** Selected pin on the Living Map — only one at a time (SPEC-001). */
  selectedRestaurantId: string | null;
  setSelectedRestaurantId: (id: string | null) => void;

  /** A query typed elsewhere (e.g. a Context Chip) that the Conversation screen should open with. */
  pendingQuery: string | null;
  setPendingQuery: (query: string | null) => void;
}

export const useAppStore = create<AppState>((set) => ({
  saved: { osaka: true, cuervo: true },
  toggleSaved: (id) =>
    set((state) => ({
      saved: { ...state.saved, [id]: !state.saved[id] },
    })),

  selectedRestaurantId: null,
  setSelectedRestaurantId: (id) => set({ selectedRestaurantId: id }),

  pendingQuery: null,
  setPendingQuery: (query) => set({ pendingQuery: query }),
}));
