import { randomUUID } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

/** SPEC-023: a real, immutable record of Caju Points spent at a venue — never a monetary value. */
export interface Consumption {
  id: string;
  userId: string;
  restaurantId: string;
  pointsSpent: number;
  consumedAt: number;
}

interface Store {
  consumptions: Consumption[];
}

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(__dirname, '../../data');
const DATA_FILE = join(DATA_DIR, 'consumptions.json');

function load(): Store {
  if (!existsSync(DATA_FILE)) return { consumptions: [] };
  try {
    const parsed = JSON.parse(readFileSync(DATA_FILE, 'utf-8')) as Partial<Store>;
    return { consumptions: parsed.consumptions ?? [] };
  } catch {
    return { consumptions: [] };
  }
}

let store = load();

function persist() {
  if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });
  writeFileSync(DATA_FILE, JSON.stringify(store, null, 2));
}

export function lastConsumptionAt(userId: string, restaurantId: string): number | undefined {
  const rows = store.consumptions.filter((c) => c.userId === userId && c.restaurantId === restaurantId);
  if (rows.length === 0) return undefined;
  return Math.max(...rows.map((c) => c.consumedAt));
}

export function recordConsumption(input: { userId: string; restaurantId: string; pointsSpent: number }): Consumption {
  const entry: Consumption = { id: randomUUID(), userId: input.userId, restaurantId: input.restaurantId, pointsSpent: input.pointsSpent, consumedAt: Date.now() };
  store.consumptions.push(entry);
  persist();
  return entry;
}

/** SPEC-023 Admin panel: real consumption per restaurant — the system never proposes or calculates a peso equivalent, only counts. */
export function getConsumptionSummary(): { restaurantId: string; totalPoints: number; count: number }[] {
  const byRestaurant = new Map<string, { totalPoints: number; count: number }>();
  for (const c of store.consumptions) {
    const row = byRestaurant.get(c.restaurantId) ?? { totalPoints: 0, count: 0 };
    row.totalPoints += c.pointsSpent;
    row.count += 1;
    byRestaurant.set(c.restaurantId, row);
  }
  return [...byRestaurant.entries()].map(([restaurantId, row]) => ({ restaurantId, ...row }));
}
