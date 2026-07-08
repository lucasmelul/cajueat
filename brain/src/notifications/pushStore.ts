import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { DATA_DIR } from '../paths.js';
import type { PushSubscription } from 'web-push';

/**
 * SPEC-016 Notifications: a push subscription (endpoint + keys, from
 * `pushManager.subscribe()` in the browser) tied to the same anonymous/
 * phone-linked userId from SPEC-013 — depends directly on it, per the
 * spec's own note ("no tiene sentido diseñar el guardado de subscriptions
 * antes de tener una identidad estable a la cual atarlas"). JSON-persisted,
 * same pattern as memoryStore.ts/catalogStore.ts.
 */

interface Store {
  subscriptions: Record<string, PushSubscription>;
}

const DATA_FILE = join(DATA_DIR, 'push-subscriptions.json');

function load(): Store {
  if (!existsSync(DATA_FILE)) return { subscriptions: {} };
  try {
    const parsed = JSON.parse(readFileSync(DATA_FILE, 'utf-8')) as Partial<Store>;
    return { subscriptions: parsed.subscriptions ?? {} };
  } catch {
    return { subscriptions: {} };
  }
}

let store = load();

function persist() {
  if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });
  writeFileSync(DATA_FILE, JSON.stringify(store, null, 2));
}

export function saveSubscription(userId: string, subscription: PushSubscription) {
  store.subscriptions[userId] = subscription;
  persist();
}

export function removeSubscription(userId: string) {
  delete store.subscriptions[userId];
  persist();
}

export function getSubscription(userId: string): PushSubscription | undefined {
  return store.subscriptions[userId];
}

export function getAllSubscriptions(): { userId: string; subscription: PushSubscription }[] {
  return Object.entries(store.subscriptions).map(([userId, subscription]) => ({ userId, subscription }));
}
