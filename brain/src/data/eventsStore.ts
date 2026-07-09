import { randomUUID } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { DATA_DIR } from '../paths.js';
import type { MapEvent } from '../types.js';

/**
 * Until now the only event on the map was a single one hardcoded in
 * `data/restaurants.ts`, with no way to add a real one — an operator could
 * create/edit restaurants from the Admin CMS but never events. Same JSON-file
 * pattern as `catalogStore.ts`/`memoryStore.ts`: a seed only materializes the
 * file the first time it doesn't exist, real writes go through here after.
 */

const SEED: MapEvent[] = [
  { id: 'feria', name: 'Feria gastronómica', when: 'sáb', whenAt: '2026-07-11T18:00:00-03:00', position: { lat: -34.585, lng: -58.43 } },
];

const EVENTS_FILE = join(DATA_DIR, 'events.json');

function load(): MapEvent[] {
  if (!existsSync(EVENTS_FILE)) return structuredClone(SEED);
  try {
    const parsed = JSON.parse(readFileSync(EVENTS_FILE, 'utf-8'));
    return Array.isArray(parsed) ? (parsed as MapEvent[]) : structuredClone(SEED);
  } catch {
    return structuredClone(SEED);
  }
}

let events: MapEvent[] = load();

function persist() {
  if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });
  writeFileSync(EVENTS_FILE, JSON.stringify(events, null, 2));
}

if (!existsSync(EVENTS_FILE)) persist();

const WEEKDAY_ABBR = ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'];

/** Derived from the real `whenAt`, never typed separately — a display label can't drift from the actual date. */
function shortWeekdayLabel(whenAt: string): string {
  return WEEKDAY_ABBR[new Date(whenAt).getDay()];
}

export function getEvents(): MapEvent[] {
  return events;
}

export type EventInput = {
  name: string;
  whenAt: string;
  position: { lat: number; lng: number };
  address?: string;
  googlePlaceId?: string;
};

export function createEvent(input: EventInput): MapEvent {
  const event: MapEvent = {
    id: randomUUID(),
    name: input.name,
    whenAt: input.whenAt,
    when: shortWeekdayLabel(input.whenAt),
    position: input.position,
    ...(input.address ? { address: input.address } : {}),
    ...(input.googlePlaceId ? { googlePlaceId: input.googlePlaceId } : {}),
  };
  events = [...events, event];
  persist();
  return event;
}

export function deleteEvent(id: string): boolean {
  const before = events.length;
  events = events.filter((e) => e.id !== id);
  if (events.length !== before) persist();
  return events.length !== before;
}
