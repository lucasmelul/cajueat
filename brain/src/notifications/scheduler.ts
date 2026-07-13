import { getEvents } from '../data/eventsStore.js';
import { getRestaurantById } from '../data/restaurants.js';
import { getProfile, getPendingFeedback, getLastActiveAt, getTargetingSignal, getUsersWhoSaved, wasNotifiedRecently, markNotified } from '../memory/memoryStore.js';
import { getAllActivePromotions } from '../promotions/promotionsStore.js';
import { haversineKm } from '../geo/geo.js';
import { matchDna, NEAR_RADIUS_KM, getRecommendations } from '../recommend/recommendationEngine.js';
import { sendPushToUser } from './pushSender.js';
import { getAllSubscriptions } from './pushStore.js';

/**
 * SPEC-016 Notifications: the 4 time-based types this project didn't have
 * infrastructure for yet (Recomendaciones, Recordatorios, Feedback pendiente,
 * Eventos — the other 2 already fire synchronously from `triggers.ts`).
 * Real, not faked: every condition below is checked against a persisted
 * timestamp (`memoryStore.ts`), so a dev-server restart just means the next
 * tick re-evaluates real elapsed wall-clock time — nothing resets to zero.
 *
 * The exact cadence/thresholds are placeholders the spec's own Open
 * Questions leave unresolved (frequency, "matchea fuerte" for events, lead
 * time) — documented here the same way `NEAR_RADIUS_KM`/`STRONG_MATCH_THRESHOLD`
 * were elsewhere, not guessed silently.
 */

const TICK_MS = 60_000;
const INACTIVITY_THRESHOLD_MS = 3 * 24 * 60 * 60_000; // "Recomendaciones": 3 days without a request
const FEEDBACK_NUDGE_DELAY_MS = 24 * 60 * 60_000; // "Recordatorios"/"Feedback pendiente": 1 day after saving, still no feedback
const EVENT_LEAD_TIME_MS = 24 * 60 * 60_000; // "Eventos": notify starting 1 day before
const RENOTIFY_COOLDOWN_MS = 24 * 60 * 60_000; // never repeat the same (user, key) push more than once/day
const PROMO_NOTIFIED_COOLDOWN_MS = 30 * 24 * 60 * 60_000; // SPEC-022: "notified once" per promo, reusing the same cooldown mechanism instead of a separate dedup table
const PROMO_LOCATION_FRESHNESS_MS = 60 * 60_000; // an hour-old location is still a reasonable "near" signal; older than that is stale, not real proximity

/** "Recomendaciones": push the same real Brain Card the app would show, only once real inactivity + real DNA signal both exist. */
async function checkRecommendation(userId: string): Promise<void> {
  if (wasNotifiedRecently(userId, 'recommendation', RENOTIFY_COOLDOWN_MS)) return;
  if (Date.now() - getLastActiveAt(userId) < INACTIVITY_THRESHOLD_MS) return;
  const { dna } = getProfile(userId);
  if (dna.length === 0) return; // not enough real signal to recommend meaningfully yet

  const recs = await getRecommendations(userId);
  const { brainCard } = recs;
  if (!brainCard) return; // unfiltered call — only null if the catalog itself is genuinely empty, nothing to push then
  await sendPushToUser(userId, {
    title: 'Una recomendación para vos',
    body: brainCard.sub ? `${brainCard.message.replace(/\*\*/g, '')} ${brainCard.sub}` : brainCard.message.replace(/\*\*/g, ''),
    url: brainCard.restaurantId ? `/restaurant/${brainCard.restaurantId}` : '/',
  });
  markNotified(userId, 'recommendation');
}

/** "Recordatorios" + "Feedback pendiente": the spec treats these as the same underlying nudge, pushed once real time has passed since a real save with no real feedback yet. */
async function checkPendingFeedback(userId: string): Promise<void> {
  for (const { restaurantId, savedAt } of getPendingFeedback(userId)) {
    if (Date.now() - savedAt < FEEDBACK_NUDGE_DELAY_MS) continue;
    const key = `feedback:${restaurantId}`;
    if (wasNotifiedRecently(userId, key, RENOTIFY_COOLDOWN_MS)) continue;
    const restaurant = getRestaurantById(restaurantId);
    if (!restaurant) continue;

    await sendPushToUser(userId, {
      title: `¿Cómo estuvo ${restaurant.name}?`,
      body: 'Contanos en 20s y mejorás tus próximas recomendaciones.',
      url: `/restaurant/${restaurantId}`,
    });
    markNotified(userId, key);
  }
}

/** "Eventos": push once a real event's real date enters the lead-time window — never for an event already past. */
async function checkEvents(userId: string): Promise<void> {
  const { dna } = getProfile(userId);
  if (dna.length === 0) return; // no established profile yet — same bar as "Recomendaciones"

  const now = Date.now();
  for (const event of getEvents()) {
    const eventAt = Date.parse(event.whenAt);
    if (Number.isNaN(eventAt) || eventAt <= now || eventAt - now > EVENT_LEAD_TIME_MS) continue;
    const key = `event:${event.id}`;
    if (wasNotifiedRecently(userId, key, RENOTIFY_COOLDOWN_MS)) continue;

    await sendPushToUser(userId, {
      title: event.name,
      body: `Pasa mañana. Podría interesarte por lo que ya sabemos de tus gustos.`,
      url: '/',
    });
    markNotified(userId, key);
  }
}

const PROMO_TITLES: Record<'liquidacion' | 'lanzamiento', string> = {
  liquidacion: 'Últimas unidades cerca tuyo',
  lanzamiento: 'Un lugar nuevo quiere conocerte',
};

/**
 * SPEC-022: never a broadcast — a promo only reaches a user for a real reason (ya lo guardó,
 * matchea su ADN, o está realmente cerca ahora), and never before `from` nor after `until`
 * since `getAllActivePromotions()` only returns promos currently inside that window.
 */
async function checkPromotions(userId: string): Promise<void> {
  const promos = getAllActivePromotions();
  if (promos.length === 0) return;
  const signal = getTargetingSignal(userId);

  for (const promo of promos) {
    const key = `promo:${promo.id}`;
    if (wasNotifiedRecently(userId, key, PROMO_NOTIFIED_COOLDOWN_MS)) continue;
    const restaurant = getRestaurantById(promo.restaurantId);
    if (!restaurant) continue;

    const alreadySaved = getUsersWhoSaved(promo.restaurantId).includes(userId);
    const dnaMatch = matchDna(restaurant, signal.dna).length > 0;
    const isNear =
      !!signal.location &&
      !!signal.locationAt &&
      Date.now() - signal.locationAt < PROMO_LOCATION_FRESHNESS_MS &&
      haversineKm(signal.location, restaurant.position) <= NEAR_RADIUS_KM;
    if (!alreadySaved && !dnaMatch && !isNear) continue;

    await sendPushToUser(userId, {
      title: PROMO_TITLES[promo.type],
      body: `${restaurant.name}: ${promo.text}`,
      url: `/restaurant/${restaurant.id}`,
    });
    markNotified(userId, key);
  }
}

/** Each check runs independently — one type failing (e.g. a push send error) must never block the others for the same user. */
export async function runNotificationTick(): Promise<void> {
  const subscriptions = getAllSubscriptions();
  for (const { userId } of subscriptions) {
    for (const check of [checkRecommendation, checkPendingFeedback, checkEvents, checkPromotions]) {
      try {
        await check(userId);
      } catch (err) {
        console.error('notification_tick_failed', check.name, userId, err);
      }
    }
  }
}

let intervalHandle: NodeJS.Timeout | null = null;

/** Starts the real scheduler loop — idempotent, safe to call once at boot. */
export function startNotificationScheduler(): void {
  if (intervalHandle) return;
  intervalHandle = setInterval(() => {
    runNotificationTick().catch((err) => console.error('notification_tick_failed', err));
  }, TICK_MS);
}
