import { randomUUID } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { curatorsFileExists, getEffectiveWeight, recordCuratorOutcome } from '../curators/curatorStore.js';
import { isOpenNow } from '../geo/geo.js';
import { computeTrust, detectContradiction, hasEnoughEvidence } from '../trust/trustEngine.js';
import { DATA_DIR } from '../paths.js';
import type { QuickFact, Restaurant, Source } from '../types.js';
import { CATALOG_SEED, DEMO_SEED_IDS, type RawRestaurant } from './catalogSeed.js';

/**
 * SPEC-018 Admin CMS prerequisite: the catalog stops being `RAW_RESTAURANTS`
 * hardcoded in TypeScript and becomes a JSON file the Brain can actually
 * write to at runtime — same pattern as `memoryStore.ts`'s `data/memory.json`.
 * `CATALOG_SEED` only bootstraps the file the first time it doesn't exist yet.
 */

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

// One-time backfill: a catalog.json persisted before `isDemo` existed still has the 6
// fixture places without the flag — self-healing here means both local dev and an
// already-deployed Railway volume pick it up on next boot, no manual migration script.
{
  let backfilled = false;
  for (const raw of catalog) {
    if (DEMO_SEED_IDS.has(raw.id) && raw.isDemo !== true) {
      raw.isDemo = true;
      backfilled = true;
    }
  }
  if (backfilled) persist();
}

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

/**
 * Every restaurant, with trust computed fresh from its sources on every
 * read — never cached across writes now that the CMS can mutate sources
 * at runtime. Curator-kind sources get their weight overridden by tracked
 * reputation (SPEC-017) — the Trust Engine is fed a better input, never
 * duplicated. The "Abierto/Cerrado ahora" quickFact (SPEC-001) is computed
 * the same way — never a hardcoded label that could go stale the moment
 * the clock moves.
 */
/**
 * `includeDemo` defaults to false: every end-user-facing caller (recommendations, search,
 * conversation, capture extraction, the plain restaurants routes) sees only real places.
 * Only the Admin CMS's own catalog view passes includeDemo:true, since an operator still
 * needs to see/manage the hand-authored fixture places even though real users never do.
 */
export function getCatalog(opts?: { includeDemo?: boolean; includeUnverified?: boolean }): Restaurant[] {
  const withComputedFields = catalog.map((raw) => {
    const sourcesWithReputation = raw.sources.map((s) =>
      s.kind === 'curator' ? { ...s, weight: getEffectiveWeight(s.name, raw.cuisine, s.weight) } : s,
    );
    const { level, rationale } = computeTrust(sourcesWithReputation);
    const openNow = isOpenNow(raw.openHours);
    const openFact: QuickFact | null =
      openNow === null ? null : openNow ? { icon: 'circle-check', label: 'Abierto ahora' } : { icon: 'circle-x', label: 'Cerrado ahora' };
    return {
      ...raw,
      sources: sourcesWithReputation,
      quickFacts: openFact ? [openFact, ...raw.quickFacts] : raw.quickFacts,
      trust: level,
      trustRationale: rationale,
      hasEnoughEvidence: hasEnoughEvidence(sourcesWithReputation),
    };
  });
  const demoFiltered = opts?.includeDemo ? withComputedFields : withComputedFields.filter((r) => !r.isDemo);
  // Un lugar con evidencia insuficiente (todas sus fuentes "weak" — ej. un solo curador sin
  // reputación probada todavía) no llega a un usuario real hasta que otra fuente independiente
  // lo corrobore. El operador sigue viéndolo siempre (Admin pide includeUnverified explícito).
  return opts?.includeUnverified ? demoFiltered : demoFiltered.filter((r) => r.hasEnoughEvidence);
}

/**
 * Lookup by an explicit, already-known id. Mirrors `getCatalog`'s own `includeDemo`/
 * `includeUnverified` defaults (both false) — every end-user-facing route (restaurant detail,
 * save, similar, dishes, feedback, check-in) must never resolve one of the 6 fixture places, or
 * a real place that hasn't cleared the evidence bar yet, by a guessed/bookmarked id. Admin CMS
 * call sites, already behind `requireOperator`, pass both flags true — a real restaurant an
 * operator is actively managing (generating its QR, linking Google, adding a promotion) must
 * resolve regardless of its current public trust/evidence state.
 */
export function getRestaurantById(id: string, opts?: { includeDemo?: boolean; includeUnverified?: boolean }): Restaurant | undefined {
  return getCatalog({ includeDemo: opts?.includeDemo ?? false, includeUnverified: opts?.includeUnverified ?? false }).find((r) => r.id === id);
}

export type RestaurantInput = Omit<RawRestaurant, 'id'> & { id?: string };

/** Direct catalog write for the Admin CMS (SPEC-018) — never a parallel copy of this shape. */
export function createRestaurant(input: RestaurantInput): Restaurant {
  const id = input.id?.trim() || randomUUID();
  if (catalog.some((r) => r.id === id)) throw new Error(`restaurant_id_exists:${id}`);
  catalog.push({ ...input, id });
  persist();
  return getRestaurantById(id, { includeDemo: true, includeUnverified: true })!;
}

export function updateRestaurant(id: string, patch: Partial<Omit<RawRestaurant, 'id'>>): Restaurant | undefined {
  const idx = catalog.findIndex((r) => r.id === id);
  if (idx === -1) return undefined;
  catalog[idx] = { ...catalog[idx], ...patch, id };
  persist();
  return getRestaurantById(id, { includeDemo: true, includeUnverified: true });
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

  return getRestaurantById(id, { includeDemo: true, includeUnverified: true });
}
