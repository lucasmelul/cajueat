import { randomUUID } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { DATA_DIR } from '../paths.js';

export type PromotionType = 'liquidacion' | 'lanzamiento';

/** SPEC-022: a real, time-bound offer a local loaded from Admin — never deleted once created, only aged out by its own `until`. */
export interface Promotion {
  id: string;
  restaurantId: string;
  text: string;
  type: PromotionType;
  from: number;
  until: number;
  createdAt: number;
}

interface Store {
  promotions: Promotion[];
}

const DATA_FILE = join(DATA_DIR, 'promotions.json');

function load(): Store {
  if (!existsSync(DATA_FILE)) return { promotions: [] };
  try {
    const parsed = JSON.parse(readFileSync(DATA_FILE, 'utf-8')) as Partial<Store>;
    return { promotions: parsed.promotions ?? [] };
  } catch {
    return { promotions: [] };
  }
}

let store = load();

function persist() {
  if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });
  writeFileSync(DATA_FILE, JSON.stringify(store, null, 2));
}

export function createPromotion(input: { restaurantId: string; text: string; type: PromotionType; from: number; until: number }): Promotion {
  const promo: Promotion = { id: randomUUID(), ...input, createdAt: Date.now() };
  store.promotions.push(promo);
  persist();
  return promo;
}

export function getPromotionsForRestaurant(restaurantId: string): Promotion[] {
  return store.promotions.filter((p) => p.restaurantId === restaurantId).sort((a, b) => b.createdAt - a.createdAt);
}

/** The one promo currently within its `from`/`until` window for a restaurant, if any — never a past or future one. */
export function getActivePromotion(restaurantId: string, now = Date.now()): Promotion | undefined {
  return store.promotions.find((p) => p.restaurantId === restaurantId && p.from <= now && now <= p.until);
}

/** Every promo currently in its active window, across all restaurants — what the scheduler tick checks each run. */
export function getAllActivePromotions(now = Date.now()): Promotion[] {
  return store.promotions.filter((p) => p.from <= now && now <= p.until);
}
