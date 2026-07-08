import { randomUUID } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { GeoPoint } from '../types.js';

/** SPEC-020: real evidence of a visit — append-only, never edited or deleted once created. */
export interface Checkin {
  id: string;
  userId: string;
  restaurantId: string;
  scannedAt: number;
  position: GeoPoint;
}

interface Store {
  checkins: Checkin[];
}

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(__dirname, '../../data');
const DATA_FILE = join(DATA_DIR, 'checkins.json');

function load(): Store {
  if (!existsSync(DATA_FILE)) return { checkins: [] };
  try {
    const parsed = JSON.parse(readFileSync(DATA_FILE, 'utf-8')) as Partial<Store>;
    return { checkins: parsed.checkins ?? [] };
  } catch {
    return { checkins: [] };
  }
}

let store = load();

function persist() {
  if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });
  writeFileSync(DATA_FILE, JSON.stringify(store, null, 2));
}

const BA_TIME_ZONE = 'America/Argentina/Buenos_Aires';
const dayKeyFormatter = new Intl.DateTimeFormat('en-CA', { timeZone: BA_TIME_ZONE });

/** "Día natural" per SPEC-020 — Buenos Aires calendar day, same timezone discipline as geo.ts's isOpenNow. */
function dayKey(ms: number): string {
  return dayKeyFormatter.format(new Date(ms));
}

export function hasCheckedInToday(userId: string, restaurantId: string): boolean {
  const today = dayKey(Date.now());
  return store.checkins.some((c) => c.userId === userId && c.restaurantId === restaurantId && dayKey(c.scannedAt) === today);
}

export function hasEverCheckedIn(userId: string, restaurantId: string): boolean {
  return store.checkins.some((c) => c.userId === userId && c.restaurantId === restaurantId);
}

export function recordCheckin(input: { userId: string; restaurantId: string; position: GeoPoint }): Checkin {
  const entry: Checkin = { id: randomUUID(), userId: input.userId, restaurantId: input.restaurantId, scannedAt: Date.now(), position: input.position };
  store.checkins.push(entry);
  persist();
  return entry;
}

/** First-ever checkin per (user, restaurant), sorted by scannedAt — SPEC-021 passport "fecha del primero". */
export function getCheckinsForUser(userId: string): Checkin[] {
  return store.checkins.filter((c) => c.userId === userId).sort((a, b) => a.scannedAt - b.scannedAt);
}
