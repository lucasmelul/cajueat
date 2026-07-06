import { randomUUID } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { computeTrust } from '../trust/trustEngine.js';
import type { Restaurant, Source } from '../types.js';
import { CATALOG_SEED, type RawRestaurant } from './catalogSeed.js';

/**
 * SPEC-018 Admin CMS prerequisite: the catalog stops being `RAW_RESTAURANTS`
 * hardcoded in TypeScript and becomes a JSON file the Brain can actually
 * write to at runtime — same pattern as `memoryStore.ts`'s `data/memory.json`.
 * `CATALOG_SEED` only bootstraps the file the first time it doesn't exist yet.
 */

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(__dirname, '../../data');
const CATALOG_FILE = join(DATA_DIR, 'catalog.json');

function load(): RawRestaurant[] {
  if (!existsSync(CATALOG_FILE)) return structuredClone(CATALOG_SEED);
  try {
    const parsed = JSON.parse(readFileSync(CATALOG_FILE, 'utf-8'));
    return Array.isArray(parsed) ? (parsed as RawRestaurant[]) : structuredClone(CATALOG_SEED);
  } catch {
    return structuredClone(CATALOG_SEED);
  }
}

let catalog: RawRestaurant[] = load();

function persist() {
  if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });
  writeFileSync(CATALOG_FILE, JSON.stringify(catalog, null, 2));
}

if (!existsSync(CATALOG_FILE)) persist();

/** Every restaurant, with trust computed fresh from its sources on every read — never cached across writes now that the CMS can mutate sources at runtime. */
export function getCatalog(): Restaurant[] {
  return catalog.map((raw) => {
    const { level, rationale } = computeTrust(raw.sources);
    return { ...raw, trust: level, trustRationale: rationale };
  });
}

export function getRestaurantById(id: string): Restaurant | undefined {
  return getCatalog().find((r) => r.id === id);
}

export type RestaurantInput = Omit<RawRestaurant, 'id'> & { id?: string };

/** Direct catalog write for the Admin CMS (SPEC-018) — never a parallel copy of this shape. */
export function createRestaurant(input: RestaurantInput): Restaurant {
  const id = input.id?.trim() || randomUUID();
  if (catalog.some((r) => r.id === id)) throw new Error(`restaurant_id_exists:${id}`);
  catalog.push({ ...input, id });
  persist();
  return getRestaurantById(id)!;
}

export function updateRestaurant(id: string, patch: Partial<Omit<RawRestaurant, 'id'>>): Restaurant | undefined {
  const idx = catalog.findIndex((r) => r.id === id);
  if (idx === -1) return undefined;
  catalog[idx] = { ...catalog[idx], ...patch, id };
  persist();
  return getRestaurantById(id);
}

/** Appends a confirmed source (e.g. a curator claim an operator approved) — trust is recomputed on the next read, never stored. */
export function addSourceToRestaurant(id: string, source: Source): Restaurant | undefined {
  const idx = catalog.findIndex((r) => r.id === id);
  if (idx === -1) return undefined;
  catalog[idx].sources.push(source);
  persist();
  return getRestaurantById(id);
}
