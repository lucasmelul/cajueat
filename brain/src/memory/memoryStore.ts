import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { Collection, DnaTag, User } from '../types.js';

/**
 * SPEC-006 Memory Engine: what the Brain remembers about the (single, MVP)
 * user, persisted to disk so it survives restarts and page reloads —
 * memory stops living in the browser's Zustand store. A JSON file is
 * enough for one user; a real database is a later step once there's
 * auth/multi-user (see the plan's explicit scope note).
 */

interface Contribution {
  label: string;
  points: number;
  when: number;
}

interface MemoryState {
  user: User;
  saved: Record<string, boolean>;
  dna: DnaTag[];
  contributions: Contribution[];
  collections: Collection[];
}

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(__dirname, '../../data');
const DATA_FILE = join(DATA_DIR, 'memory.json');

const DEFAULT_STATE: MemoryState = {
  user: { id: 'u1', name: 'Lucas', initials: 'L', cajuPoints: 1240, onboarded: false },
  saved: { osaka: true, cuervo: true },
  dna: [
    { id: 'd1', label: 'Sushi tradicional' },
    { id: 'd2', label: 'Barras de chef' },
    { id: 'd3', label: 'Pescado' },
    { id: 'd4', label: 'Café de especialidad' },
    { id: 'd5', label: 'Poco ruido' },
    { id: 'd6', label: 'Palermo · Chacarita' },
  ],
  contributions: [
    { label: 'Confirmaste horarios de Anafe', points: 15, when: Date.now() - 2 * 86400_000 },
    { label: 'Subiste una foto del omakase', points: 20, when: Date.now() - 7 * 86400_000 },
    { label: 'Respondiste un quiz de ambiente', points: 10, when: Date.now() - 14 * 86400_000 },
  ],
  collections: [{ id: 'c1', name: 'Sushi', restaurantIds: ['osaka'] }],
};

let state: MemoryState;
let dnaCounter = 0;
let collectionCounter = 1;

function load(): MemoryState {
  if (!existsSync(DATA_FILE)) return structuredClone(DEFAULT_STATE);
  try {
    const parsed = JSON.parse(readFileSync(DATA_FILE, 'utf-8')) as Partial<MemoryState>;
    // Backward-compatible with memory.json files written before `collections`/`user.onboarded` existed.
    return {
      ...structuredClone(DEFAULT_STATE),
      ...parsed,
      user: { ...structuredClone(DEFAULT_STATE.user), ...parsed.user },
      collections: parsed.collections ?? structuredClone(DEFAULT_STATE.collections),
    };
  } catch {
    return structuredClone(DEFAULT_STATE);
  }
}

function persist() {
  if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });
  writeFileSync(DATA_FILE, JSON.stringify(state, null, 2));
}

state = load();
dnaCounter = state.dna.length;
collectionCounter = state.collections.length;

export function getProfile() {
  return { user: state.user, saved: state.saved, dna: state.dna, contributions: state.contributions };
}

export function isSaved(restaurantId: string): boolean {
  return !!state.saved[restaurantId];
}

export function getSavedIds(): string[] {
  return Object.entries(state.saved)
    .filter(([, saved]) => saved)
    .map(([id]) => id);
}

export function setSaved(restaurantId: string, saved: boolean) {
  state.saved[restaurantId] = saved;
  persist();
}

export function addDnaTag(label: string): DnaTag {
  dnaCounter += 1;
  const tag: DnaTag = { id: `d-${dnaCounter}`, label };
  state.dna.push(tag);
  persist();
  return tag;
}

export function removeDnaTag(id: string) {
  state.dna = state.dna.filter((d) => d.id !== id);
  persist();
}

export function completeOnboarding() {
  state.user.onboarded = true;
  persist();
}

export function addCajuPoints(n: number): number {
  state.user.cajuPoints += n;
  persist();
  return state.user.cajuPoints;
}

export function recordContribution(label: string, points: number) {
  state.contributions.unshift({ label, points, when: Date.now() });
  state.contributions = state.contributions.slice(0, 20);
  addCajuPoints(points);
}

export function getCollections(): Collection[] {
  return state.collections;
}

export function createCollection(name: string): Collection {
  collectionCounter += 1;
  const collection: Collection = { id: `c-${collectionCounter}`, name, restaurantIds: [] };
  state.collections.push(collection);
  persist();
  return collection;
}

/** Guardar es enseñar (CP-019): find-or-create by name, then add the restaurant. */
export function addRestaurantToCollectionByName(name: string, restaurantId: string): Collection {
  const trimmed = name.trim();
  let collection = state.collections.find((c) => c.name.toLowerCase() === trimmed.toLowerCase());
  if (!collection) {
    collectionCounter += 1;
    collection = { id: `c-${collectionCounter}`, name: trimmed, restaurantIds: [] };
    state.collections.push(collection);
  }
  if (!collection.restaurantIds.includes(restaurantId)) {
    collection.restaurantIds.push(restaurantId);
  }
  persist();
  return collection;
}

export function removeRestaurantFromCollection(collectionId: string, restaurantId: string) {
  const collection = state.collections.find((c) => c.id === collectionId);
  if (collection) collection.restaurantIds = collection.restaurantIds.filter((id) => id !== restaurantId);
  persist();
}

export function deleteCollection(id: string) {
  state.collections = state.collections.filter((c) => c.id !== id);
  persist();
}
