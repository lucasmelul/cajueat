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

export type ContributionSource = 'note' | 'photo' | 'voice' | 'conversation' | 'link';
export type ContributionStatus = 'pending' | 'confirmed' | 'rejected';

export interface PendingContribution {
  id: string;
  restaurantId: string;
  claim: string;
  source: ContributionSource;
  createdAt: number;
  status: ContributionStatus;
}

/**
 * A place a user described that wasn't in the catalog yet — the case the
 * original SPEC-019 queue above couldn't represent at all (it only ever
 * attaches a claim to an EXISTING restaurantId). Before this, a note/photo/
 * voice/conversation message about an unknown place silently vanished with
 * generic points and no admin trace. name/cuisine/neighborhood/address may
 * be empty strings — whatever the source text didn't state, an operator
 * fills in before confirming, never Claude guessing.
 */
export interface NewPlaceSuggestion {
  id: string;
  name: string;
  cuisine: string;
  neighborhood: string;
  address?: string;
  claim: string;
  source: ContributionSource;
  createdAt: number;
  status: ContributionStatus;
}

/** SPEC-025: a specific dish a user's Nota/Foto/Voz named for an already-real restaurant — same "never applied on its own" discipline as the other two queues above. */
export interface PendingDishMention {
  id: string;
  restaurantId: string;
  dishName: string;
  category: string;
  claim: string;
  source: ContributionSource;
  createdAt: number;
  status: ContributionStatus;
}

/**
 * A Reel/TikTok/Instagram link a user pasted — the Brain can't fetch or read the actual
 * content (SPEC-015: needs a real scraping/API integration, a legal/cost decision, not a
 * technical one), so this is never auto-processed. It exists purely so an operator can open
 * the link by hand, see what it's actually about, and manually add a source/new place using
 * the tools that already exist — instead of the link vanishing with a fake "learned" message.
 */
export interface PendingLink {
  id: string;
  url: string;
  note?: string;
  createdAt: number;
  status: ContributionStatus;
}

interface Store {
  contributions: PendingContribution[];
  newPlaces: NewPlaceSuggestion[];
  dishMentions: PendingDishMention[];
  links: PendingLink[];
}

const DATA_FILE = join(DATA_DIR, 'pending-contributions.json');

function load(): Store {
  if (!existsSync(DATA_FILE)) return { contributions: [], newPlaces: [], dishMentions: [], links: [] };
  try {
    const parsed = JSON.parse(readFileSync(DATA_FILE, 'utf-8')) as Partial<Store>;
    return {
      contributions: parsed.contributions ?? [],
      newPlaces: parsed.newPlaces ?? [],
      dishMentions: parsed.dishMentions ?? [],
      links: parsed.links ?? [],
    };
  } catch {
    return { contributions: [], newPlaces: [], dishMentions: [], links: [] };
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

export function enqueueNewPlaceSuggestion(input: {
  name: string;
  cuisine: string;
  neighborhood: string;
  claim: string;
  source: ContributionSource;
}): NewPlaceSuggestion {
  const entry: NewPlaceSuggestion = {
    id: randomUUID(),
    name: input.name,
    cuisine: input.cuisine,
    neighborhood: input.neighborhood,
    claim: input.claim,
    source: input.source,
    createdAt: Date.now(),
    status: 'pending',
  };
  store.newPlaces.unshift(entry);
  persist();
  return entry;
}

export function getNewPlaceSuggestions(): NewPlaceSuggestion[] {
  return store.newPlaces.filter((p) => p.status === 'pending');
}

export function getNewPlaceSuggestionById(id: string): NewPlaceSuggestion | undefined {
  return store.newPlaces.find((p) => p.id === id);
}

export function markNewPlaceStatus(id: string, status: Exclude<ContributionStatus, 'pending'>): NewPlaceSuggestion | undefined {
  const entry = store.newPlaces.find((p) => p.id === id);
  if (!entry) return undefined;
  entry.status = status;
  persist();
  return entry;
}

export function enqueuePendingDishMention(input: {
  restaurantId: string;
  dishName: string;
  category: string;
  claim: string;
  source: ContributionSource;
}): PendingDishMention {
  const entry: PendingDishMention = {
    id: randomUUID(),
    restaurantId: input.restaurantId,
    dishName: input.dishName,
    category: input.category,
    claim: input.claim,
    source: input.source,
    createdAt: Date.now(),
    status: 'pending',
  };
  store.dishMentions.unshift(entry);
  persist();
  return entry;
}

export function getPendingDishMentions(): PendingDishMention[] {
  return store.dishMentions.filter((d) => d.status === 'pending');
}

export function getPendingDishMentionById(id: string): PendingDishMention | undefined {
  return store.dishMentions.find((d) => d.id === id);
}

export function enqueuePendingLink(input: { url: string; note?: string }): PendingLink {
  const entry: PendingLink = {
    id: randomUUID(),
    url: input.url,
    note: input.note,
    createdAt: Date.now(),
    status: 'pending',
  };
  store.links.unshift(entry);
  persist();
  return entry;
}

export function getPendingLinks(): PendingLink[] {
  return store.links.filter((l) => l.status === 'pending');
}

export function markPendingLinkStatus(id: string, status: Exclude<ContributionStatus, 'pending'>): PendingLink | undefined {
  const entry = store.links.find((l) => l.id === id);
  if (!entry) return undefined;
  entry.status = status;
  persist();
  return entry;
}

export function markDishMentionStatus(id: string, status: Exclude<ContributionStatus, 'pending'>): PendingDishMention | undefined {
  const entry = store.dishMentions.find((d) => d.id === id);
  if (!entry) return undefined;
  entry.status = status;
  persist();
  return entry;
}
