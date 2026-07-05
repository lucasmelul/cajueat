import { create } from 'zustand';
import type { DnaTag, User } from '../../types';

export type OverlayKind = 'capture' | 'feedback' | null;

const INITIAL_DNA: DnaTag[] = [
  { id: 'd1', label: 'Sushi tradicional' },
  { id: 'd2', label: 'Barras de chef' },
  { id: 'd3', label: 'Pescado' },
  { id: 'd4', label: 'Café de especialidad' },
  { id: 'd5', label: 'Poco ruido' },
  { id: 'd6', label: 'Palermo · Chacarita' },
];

let dnaTagCounter = 0;

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

  /**
   * Shared across screens so Caju Points earned in one place (Feedback,
   * Knowledge Capture) show up everywhere (Living Map header, Profile)
   * without re-fetching. Hydrated once from the Brain, then mutated locally.
   */
  user: User | null;
  setUser: (u: User) => void;
  addCajuPoints: (n: number) => void;

  /** Knowledge Capture / Feedback overlays — global because the FAB that opens them lives in the tab bar (SPEC-004, SPEC-011). */
  overlay: OverlayKind;
  openOverlay: (kind: Exclude<OverlayKind, null>) => void;
  closeOverlay: () => void;

  /** ADN gastronómico — how the Brain currently understands the user (CP-011, SPEC-010), editable. */
  dna: DnaTag[];
  removeDnaTag: (id: string) => void;
  addDnaTag: (label: string) => void;
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

  user: null,
  setUser: (u) => set({ user: u }),
  addCajuPoints: (n) =>
    set((state) => (state.user ? { user: { ...state.user, cajuPoints: state.user.cajuPoints + n } } : state)),

  overlay: null,
  openOverlay: (kind) => set({ overlay: kind }),
  closeOverlay: () => set({ overlay: null }),

  dna: INITIAL_DNA,
  removeDnaTag: (id) => set((state) => ({ dna: state.dna.filter((d) => d.id !== id) })),
  addDnaTag: (label) =>
    set((state) => {
      dnaTagCounter += 1;
      return { dna: [...state.dna, { id: `d-new-${dnaTagCounter}`, label }] };
    }),
}));
