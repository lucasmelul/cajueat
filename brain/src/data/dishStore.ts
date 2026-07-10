import { randomUUID } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { DATA_DIR } from '../paths.js';
import { computeTrust } from '../trust/trustEngine.js';
import type { Dish, Source } from '../types.js';

/**
 * SPEC-025 Catálogo de Platos: a plate is its own entity, not a string inside a restaurant's
 * `order[]` — same `Source`/`computeTrust` model the Trust Engine already uses for restaurants,
 * no parallel confidence system. Deliberate modeling simplification (the spec leaves this as an
 * explicit Open Question): each Dish row is scoped to ONE restaurant — "el chirashi de Osaka" is
 * a real, sourceable claim about Osaka specifically, not an abstract "chirashi" floating free of
 * evidence. The shared `category` field is what groups dishes across restaurants for a
 * "¿dónde está el mejor X?" comparison — a place that serves the same category shows up as its
 * own Dish row with its own sources, never merged trust across restaurants.
 */

interface RawDish {
  id: string;
  name: string;
  category: string;
  restaurantId: string;
  sources: Source[];
}

interface Store {
  dishes: RawDish[];
}

const DATA_FILE = join(DATA_DIR, 'dishes.json');

function load(): Store {
  if (!existsSync(DATA_FILE)) return { dishes: [] };
  try {
    const parsed = JSON.parse(readFileSync(DATA_FILE, 'utf-8')) as Partial<Store>;
    return { dishes: parsed.dishes ?? [] };
  } catch {
    return { dishes: [] };
  }
}

let store = load();

function persist() {
  if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });
  writeFileSync(DATA_FILE, JSON.stringify(store, null, 2));
}

function withComputedTrust(raw: RawDish): Dish {
  const { level, rationale } = computeTrust(raw.sources);
  return { ...raw, trust: level, trustRationale: rationale };
}

/** Trust computed fresh on every read, same discipline as getCatalog() — never cached across writes. */
export function getDishes(): Dish[] {
  return store.dishes.map(withComputedTrust);
}

export function getDishById(id: string): Dish | undefined {
  const raw = store.dishes.find((d) => d.id === id);
  return raw ? withComputedTrust(raw) : undefined;
}

export function getDishesByCategory(category: string): Dish[] {
  const needle = category.trim().toLowerCase();
  return store.dishes.filter((d) => d.category.toLowerCase() === needle).map(withComputedTrust);
}

/** Real dishes for one restaurant's "Menú" section — never a full menu, only what's actually been sourced. */
export function getDishesByRestaurant(restaurantId: string): Dish[] {
  return store.dishes.filter((d) => d.restaurantId === restaurantId).map(withComputedTrust);
}

/** Direct operator creation (Admin CMS) — same convention as createRestaurant: an operator's own action, never queued. Requires at least one real source so a dish is never sourceless from the moment it exists. */
export function createDish(input: { name: string; category: string; restaurantId: string; source: Source }): Dish {
  const raw: RawDish = {
    id: randomUUID(),
    name: input.name,
    category: input.category,
    restaurantId: input.restaurantId,
    sources: [input.source],
  };
  store.dishes.push(raw);
  persist();
  return withComputedTrust(raw);
}

/** Same "Confirmación Inteligente" pattern as addSourceToRestaurant — appends, never replaces, never auto-applied by anything but an explicit operator confirmation. */
export function addSourceToDish(dishId: string, source: Source): Dish | undefined {
  const raw = store.dishes.find((d) => d.id === dishId);
  if (!raw) return undefined;
  raw.sources.push(source);
  persist();
  return withComputedTrust(raw);
}

/** Finds an existing (restaurantId, name) pair case-insensitively — so confirming the same dish mentioned twice adds a source instead of creating a duplicate row. */
export function findDishByRestaurantAndName(restaurantId: string, name: string): Dish | undefined {
  const needle = name.trim().toLowerCase();
  const raw = store.dishes.find((d) => d.restaurantId === restaurantId && d.name.trim().toLowerCase() === needle);
  return raw ? withComputedTrust(raw) : undefined;
}
