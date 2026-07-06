import { randomUUID } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { curatorsFileExists, getEffectiveWeight, recordCuratorOutcome } from '../curators/curatorStore.js';
import { computeTrust, detectContradiction } from '../trust/trustEngine.js';
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

/**
 * SPEC-017: whether a curator's claim was sustained or contradicted by the
 * rest of a restaurant's evidence — reuses the Trust Engine's own
 * contradiction detection and kind-diversity consensus check, never a
 * parallel copy of that logic. Returns null when there isn't real
 * corroborating or conflicting evidence yet (a lone unverified claim never
 * moves a curator's reputation).
 */
function evaluateCuratorSource(allSources: Source[], curatorSource: Source): 'sustained' | 'contradicted' | null {
  const conflict = detectContradiction(allSources);
  if (conflict && (conflict.a === curatorSource || conflict.b === curatorSource)) return 'contradicted';
  const hasDiverseCorroboration = new Set(allSources.map((s) => s.kind)).size > 1;
  return hasDiverseCorroboration ? 'sustained' : null;
}

// One-time backfill: the hand-authored seed catalog already has curator
// sources with real co-evidence (e.g. Anafe's contradiction) — bootstrap
// curator reputations from it once instead of starting every curator blank.
if (!curatorsFileExists()) {
  for (const raw of catalog) {
    for (const s of raw.sources) {
      if (s.kind !== 'curator') continue;
      const outcome = evaluateCuratorSource(raw.sources, s);
      if (outcome) recordCuratorOutcome(s.name, raw.cuisine, outcome);
    }
  }
}

/** Every restaurant, with trust computed fresh from its sources on every read — never cached across writes now that the CMS can mutate sources at runtime. Curator-kind sources get their weight overridden by tracked reputation (SPEC-017) — the Trust Engine is fed a better input, never duplicated. */
export function getCatalog(): Restaurant[] {
  return catalog.map((raw) => {
    const sourcesWithReputation = raw.sources.map((s) =>
      s.kind === 'curator' ? { ...s, weight: getEffectiveWeight(s.name, raw.cuisine, s.weight) } : s,
    );
    const { level, rationale } = computeTrust(sourcesWithReputation);
    return { ...raw, sources: sourcesWithReputation, trust: level, trustRationale: rationale };
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

/**
 * Appends a confirmed source (e.g. a curator claim an operator approved) —
 * trust is recomputed on the next read, never stored. If the new source is
 * a curator's claim, this is also the moment its reputation moves for that
 * domain (SPEC-017) — sustained if real corroborating evidence already
 * exists, contradicted if it conflicts with something else on file.
 */
export function addSourceToRestaurant(id: string, source: Source): Restaurant | undefined {
  const idx = catalog.findIndex((r) => r.id === id);
  if (idx === -1) return undefined;
  catalog[idx].sources.push(source);
  persist();

  if (source.kind === 'curator') {
    const outcome = evaluateCuratorSource(catalog[idx].sources, source);
    if (outcome) recordCuratorOutcome(source.name, catalog[idx].cuisine, outcome);
  }

  return getRestaurantById(id);
}
