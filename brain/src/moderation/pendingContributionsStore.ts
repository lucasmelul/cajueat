import { randomUUID } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { DATA_DIR } from '../paths.js';

/**
 * SPEC-019 User Contribution Moderation: a third store, separate from the
 * private per-user `memoryStore.ts` and the shared `catalogStore.ts` — what
 * a regular user's Nota/Foto/Voz/conversation message taught the Brain about
 * a real restaurant sits here until an operator confirms or rejects it via
 * the Admin CMS. Never applied on its own, no matter how old or how many
 * similar ones exist — the operator is always the filter (SPEC-007's
 * "never invent, never blindly trust" applies here too). Deliberately
 * doesn't store which user contributed — the operator reviews the claim
 * and the restaurant, never the identity behind it (SPEC-013).
 */

export type ContributionSource = 'note' | 'photo' | 'voice' | 'conversation';
export type ContributionStatus = 'pending' | 'confirmed' | 'rejected';

export interface PendingContribution {
  id: string;
  restaurantId: string;
  claim: string;
  source: ContributionSource;
  createdAt: number;
  status: ContributionStatus;
}

interface Store {
  contributions: PendingContribution[];
}

const DATA_FILE = join(DATA_DIR, 'pending-contributions.json');

function load(): Store {
  if (!existsSync(DATA_FILE)) return { contributions: [] };
  try {
    const parsed = JSON.parse(readFileSync(DATA_FILE, 'utf-8')) as Partial<Store>;
    return { contributions: parsed.contributions ?? [] };
  } catch {
    return { contributions: [] };
  }
}

let store = load();

function persist() {
  if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });
  writeFileSync(DATA_FILE, JSON.stringify(store, null, 2));
}

export function enqueuePendingContribution(input: { restaurantId: string; claim: string; source: ContributionSource }): PendingContribution {
  const entry: PendingContribution = {
    id: randomUUID(),
    restaurantId: input.restaurantId,
    claim: input.claim,
    source: input.source,
    createdAt: Date.now(),
    status: 'pending',
  };
  store.contributions.unshift(entry);
  persist();
  return entry;
}

export function getPendingContributions(): PendingContribution[] {
  return store.contributions.filter((c) => c.status === 'pending');
}

export function getPendingContributionById(id: string): PendingContribution | undefined {
  return store.contributions.find((c) => c.id === id);
}

export function markContributionStatus(id: string, status: Exclude<ContributionStatus, 'pending'>): PendingContribution | undefined {
  const entry = store.contributions.find((c) => c.id === id);
  if (!entry) return undefined;
  entry.status = status;
  persist();
  return entry;
}
