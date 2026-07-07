import { randomUUID } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { Collection, DnaTag, User } from '../types.js';

/**
 * SPEC-006 Memory Engine + SPEC-013 Deferred Identity: what the Brain
 * remembers, keyed by userId (an anonymous client-generated UUID until a
 * phone gets linked — same row either way, per SPEC-013's "no migration,
 * no merge in the simple case"). A JSON file is enough for this MVP's
 * user counts; a real database is a later step (explicit scope note).
 */

interface Contribution {
  label: string;
  points: number;
  when: number;
}

interface UsageCounter {
  day: string; // YYYY-MM-DD, resets counts when it no longer matches today
  messages: number;
  captures: number;
}

interface MemoryState {
  user: User;
  saved: Record<string, boolean>;
  /** When each restaurant was saved (ms epoch) — real signal for the "Recordatorios"/"Feedback pendiente" notification triggers (SPEC-016), not a guess. */
  savedAt: Record<string, number>;
  /** restaurantId -> when feedback was actually submitted for it — lets the pending-feedback trigger stop nudging once real feedback exists. */
  feedbackGiven: Record<string, number>;
  /** Last time this row was touched by an authenticated request — real inactivity signal for the "Recomendaciones" push trigger. */
  lastActiveAt: number;
  /** Per-notification-key cooldown (e.g. "recommendation", "feedback:osaka") so the scheduler never re-sends the same push every tick. */
  notifiedAt: Record<string, number>;
  dna: DnaTag[];
  contributions: Contribution[];
  collections: Collection[];
  usage: UsageCounter;
}

interface Store {
  users: Record<string, MemoryState>;
  phoneIndex: Record<string, string>; // phone -> userId
}

/** Anonymous usage limits before Conversation/Knowledge Capture require "Guardá tu Brain" (SPEC-013's cost-abuse gate). Placeholder values — exact thresholds are an open product question. */
const ANON_DAILY_LIMITS = { message: 15, capture: 8 } as const;
type UsageKind = keyof typeof ANON_DAILY_LIMITS;

/** OTP codes are short-lived secrets — kept in-memory only, never written to disk. */
interface PendingOtp {
  code: string;
  expiresAt: number;
}
const pendingOtps = new Map<string, PendingOtp>();
const OTP_TTL_MS = 5 * 60_000;

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(__dirname, '../../data');
const DATA_FILE = join(DATA_DIR, 'memory.json');

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

function freshUsage(): UsageCounter {
  return { day: todayKey(), messages: 0, captures: 0 };
}

/** Brand-new anonymous row — empty, per SPEC-013 ("el Brain crea una fila de usuario la primera vez que ve ese ID", no pre-populated history). */
function freshState(userId: string): MemoryState {
  return {
    user: { id: userId, name: 'Vos', initials: '?', cajuPoints: 0, onboarded: false },
    saved: {},
    savedAt: {},
    feedbackGiven: {},
    lastActiveAt: Date.now(),
    notifiedAt: {},
    dna: [],
    contributions: [],
    collections: [],
    usage: freshUsage(),
  };
}

/** Seed data for the very first anonymous row this service ever sees — keeps the existing demo/preview experience intact instead of starting every fresh install completely blank. */
function seededDemoState(userId: string): MemoryState {
  return {
    user: { id: userId, name: 'Lucas', initials: 'L', cajuPoints: 1240, onboarded: false },
    saved: { osaka: true, cuervo: true },
    savedAt: { osaka: Date.now() - 10 * 86400_000, cuervo: Date.now() - 3 * 86400_000 },
    feedbackGiven: {},
    lastActiveAt: Date.now(),
    notifiedAt: {},
    dna: [
      { id: randomUUID(), label: 'Sushi tradicional' },
      { id: randomUUID(), label: 'Barras de chef' },
      { id: randomUUID(), label: 'Pescado' },
      { id: randomUUID(), label: 'Café de especialidad' },
      { id: randomUUID(), label: 'Poco ruido' },
      { id: randomUUID(), label: 'Palermo · Chacarita' },
    ],
    contributions: [
      { label: 'Confirmaste horarios de Anafe', points: 15, when: Date.now() - 2 * 86400_000 },
      { label: 'Subiste una foto del omakase', points: 20, when: Date.now() - 7 * 86400_000 },
      { label: 'Respondiste un quiz de ambiente', points: 10, when: Date.now() - 14 * 86400_000 },
    ],
    collections: [{ id: randomUUID(), name: 'Sushi', restaurantIds: ['osaka'] }],
    usage: freshUsage(),
  };
}

let store: Store;

function load(): Store {
  if (!existsSync(DATA_FILE)) return { users: {}, phoneIndex: {} };
  try {
    const parsed = JSON.parse(readFileSync(DATA_FILE, 'utf-8')) as Partial<Store>;
    return { users: parsed.users ?? {}, phoneIndex: parsed.phoneIndex ?? {} };
  } catch {
    return { users: {}, phoneIndex: {} };
  }
}

function persist() {
  if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });
  writeFileSync(DATA_FILE, JSON.stringify(store, null, 2));
}

store = load();

function getOrCreateUser(userId: string): MemoryState {
  let state = store.users[userId];
  if (!state) {
    state = Object.keys(store.users).length === 0 ? seededDemoState(userId) : freshState(userId);
    store.users[userId] = state;
    persist();
  }
  // Backward-compatible with rows persisted before `usage` existed.
  if (!state.usage) {
    state.usage = freshUsage();
    persist();
  }
  // Backward-compatible with rows persisted before the SPEC-016 scheduler fields existed.
  if (!state.savedAt) state.savedAt = {};
  if (!state.feedbackGiven) state.feedbackGiven = {};
  if (!state.lastActiveAt) state.lastActiveAt = Date.now();
  if (!state.notifiedAt) state.notifiedAt = {};
  return state;
}

export function getProfile(userId: string) {
  const state = getOrCreateUser(userId);
  return { user: state.user, saved: state.saved, dna: state.dna, contributions: state.contributions };
}

export function isSaved(userId: string, restaurantId: string): boolean {
  return !!getOrCreateUser(userId).saved[restaurantId];
}

export function getSavedIds(userId: string): string[] {
  return Object.entries(getOrCreateUser(userId).saved)
    .filter(([, saved]) => saved)
    .map(([id]) => id);
}

/** SPEC-016 "Cambios importantes": who needs to hear that a place they already saved just changed. */
export function getUsersWhoSaved(restaurantId: string): string[] {
  return Object.entries(store.users)
    .filter(([, state]) => state.saved[restaurantId])
    .map(([userId]) => userId);
}

export function setSaved(userId: string, restaurantId: string, saved: boolean) {
  const state = getOrCreateUser(userId);
  state.saved[restaurantId] = saved;
  // Real timestamp for the "Recordatorios"/"Feedback pendiente" scheduler (SPEC-016) — re-saving
  // later counts as a fresh save, since there's no feedback yet either way.
  if (saved) state.savedAt[restaurantId] = Date.now();
  persist();
}

/** SPEC-016: marks that real feedback was actually given for a saved place, so the pending-feedback trigger stops nudging about it. */
export function markFeedbackGiven(userId: string, restaurantId: string) {
  getOrCreateUser(userId).feedbackGiven[restaurantId] = Date.now();
  persist();
}

/** Saved restaurants with no feedback yet, and when each was saved — the real signal behind "Recordatorios"/"Feedback pendiente" (SPEC-016), not a guessed visit. */
export function getPendingFeedback(userId: string): { restaurantId: string; savedAt: number }[] {
  const state = getOrCreateUser(userId);
  return Object.entries(state.saved)
    .filter(([, saved]) => saved)
    .filter(([id]) => !state.feedbackGiven[id])
    .map(([id]) => ({ restaurantId: id, savedAt: state.savedAt[id] ?? Date.now() }));
}

/** Touches "last seen" without creating a row for anonymous visitors who never did anything personal — only updates an existing one. Real inactivity signal for the "Recomendaciones" push trigger (SPEC-016). */
export function touchLastActive(userId: string) {
  const state = store.users[userId];
  if (!state) return;
  state.lastActiveAt = Date.now();
  persist();
}

export function getLastActiveAt(userId: string): number {
  return getOrCreateUser(userId).lastActiveAt;
}

/** Per-(user, notification key) cooldown so the scheduler tick never re-sends the same push before `cooldownMs` elapses (SPEC-016). */
export function wasNotifiedRecently(userId: string, key: string, cooldownMs: number): boolean {
  const last = getOrCreateUser(userId).notifiedAt[key];
  return typeof last === 'number' && Date.now() - last < cooldownMs;
}

export function markNotified(userId: string, key: string) {
  getOrCreateUser(userId).notifiedAt[key] = Date.now();
  persist();
}

export function addDnaTag(userId: string, label: string): DnaTag {
  const tag: DnaTag = { id: randomUUID(), label };
  getOrCreateUser(userId).dna.push(tag);
  persist();
  return tag;
}

export function removeDnaTag(userId: string, id: string) {
  const state = getOrCreateUser(userId);
  state.dna = state.dna.filter((d) => d.id !== id);
  persist();
}

export function completeOnboarding(userId: string) {
  getOrCreateUser(userId).user.onboarded = true;
  persist();
}

export function addCajuPoints(userId: string, n: number): number {
  const state = getOrCreateUser(userId);
  state.user.cajuPoints += n;
  persist();
  return state.user.cajuPoints;
}

export function recordContribution(userId: string, label: string, points: number) {
  const state = getOrCreateUser(userId);
  state.contributions.unshift({ label, points, when: Date.now() });
  state.contributions = state.contributions.slice(0, 20);
  addCajuPoints(userId, points);
}

export function getCollections(userId: string): Collection[] {
  return getOrCreateUser(userId).collections;
}

export function createCollection(userId: string, name: string): Collection {
  const collection: Collection = { id: randomUUID(), name, restaurantIds: [] };
  getOrCreateUser(userId).collections.push(collection);
  persist();
  return collection;
}

/** Guardar es enseñar (CP-019): find-or-create by name, then add the restaurant. */
export function addRestaurantToCollectionByName(userId: string, name: string, restaurantId: string): Collection {
  const state = getOrCreateUser(userId);
  const trimmed = name.trim();
  let collection = state.collections.find((c) => c.name.toLowerCase() === trimmed.toLowerCase());
  if (!collection) {
    collection = { id: randomUUID(), name: trimmed, restaurantIds: [] };
    state.collections.push(collection);
  }
  if (!collection.restaurantIds.includes(restaurantId)) {
    collection.restaurantIds.push(restaurantId);
  }
  persist();
  return collection;
}

export function removeRestaurantFromCollection(userId: string, collectionId: string, restaurantId: string) {
  const state = getOrCreateUser(userId);
  const collection = state.collections.find((c) => c.id === collectionId);
  if (collection) collection.restaurantIds = collection.restaurantIds.filter((id) => id !== restaurantId);
  persist();
}

export function deleteCollection(userId: string, id: string) {
  const state = getOrCreateUser(userId);
  state.collections = state.collections.filter((c) => c.id !== id);
  persist();
}

/**
 * SPEC-013 abuse gate: Conversation and Knowledge Capture call Claude with
 * real cost per request — an anonymous ID has no identity check behind it,
 * so both are rate-limited per day until the user syncs a phone.
 */
export function checkAndConsumeUsage(userId: string, kind: UsageKind): { allowed: boolean; remaining: number } {
  const state = getOrCreateUser(userId);
  if (state.usage.day !== todayKey()) state.usage = freshUsage();

  const key = kind === 'message' ? 'messages' : 'captures';
  const limit = ANON_DAILY_LIMITS[kind];
  if (state.usage[key] >= limit) return { allowed: false, remaining: 0 };

  state.usage[key] += 1;
  persist();
  return { allowed: true, remaining: limit - state.usage[key] };
}

/**
 * "Guardá tu Brain": generates a demo OTP. There's no SMS/WhatsApp vendor
 * wired up yet (SPEC-013 leaves the OTP mechanism as an explicit open
 * question) — the code is returned directly in the response so the flow
 * is genuinely testable end to end instead of silently faked.
 */
export function requestOtp(phone: string): { code: string } {
  const code = String(Math.floor(100000 + Math.random() * 900000));
  pendingOtps.set(phone, { code, expiresAt: Date.now() + OTP_TTL_MS });
  return { code };
}

export type VerifyOtpResult =
  | { ok: true; conflict: false }
  | { ok: true; conflict: true; existingUserId: string }
  | { ok: false; error: 'invalid_or_expired_code' };

/** Never fuses two Brains silently (SPEC-013) — a phone already linked elsewhere comes back as a conflict for the client to resolve explicitly. */
export function verifyOtp(userId: string, phone: string, code: string): VerifyOtpResult {
  const pending = pendingOtps.get(phone);
  if (!pending || pending.code !== code || pending.expiresAt < Date.now()) {
    return { ok: false, error: 'invalid_or_expired_code' };
  }
  pendingOtps.delete(phone);

  const existingUserId = store.phoneIndex[phone];
  if (existingUserId && existingUserId !== userId) {
    return { ok: true, conflict: true, existingUserId };
  }

  const state = getOrCreateUser(userId);
  state.user.phone = phone;
  store.phoneIndex[phone] = userId;
  persist();
  return { ok: true, conflict: false };
}
