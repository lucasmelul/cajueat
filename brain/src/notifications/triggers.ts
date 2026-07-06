import { getProfile, getUsersWhoSaved } from '../memory/memoryStore.js';
import { matchDna } from '../recommend/recommendationEngine.js';
import type { Restaurant, TrustLevel } from '../types.js';
import { sendPushToUser } from './pushSender.js';
import { getAllSubscriptions } from './pushStore.js';

/**
 * SPEC-016 Notifications: only two of the six named types have a real,
 * synchronous trigger today — both reuse Recommendation/Trust Engine
 * signals that already exist, never new business logic. The other four
 * (Recomendaciones, Recordatorios, Feedback pendiente, Eventos) genuinely
 * need a time-based scheduler that doesn't exist in this project yet —
 * left as an explicit gap rather than faked with an in-process setInterval
 * that would die with the dev process and mislead about being "real".
 */

/** "Matchea fuerte" threshold (Open Question in SPEC-016, left unresolved there) — 2+ real DNA matches, same bar `scoreRestaurant` treats as meaningfully above a coincidence. */
const STRONG_MATCH_THRESHOLD = 2;

/** "Nuevos lugares": fires once, right after an operator adds a restaurant via the Admin CMS — never a poll/scan job. */
export async function notifyNewPlaceIfMatches(restaurant: Restaurant): Promise<void> {
  const subscriptions = getAllSubscriptions();
  await Promise.all(
    subscriptions.map(async ({ userId }) => {
      const { dna } = getProfile(userId);
      const matched = matchDna(restaurant, dna.map((d) => d.label));
      if (matched.length < STRONG_MATCH_THRESHOLD) return;
      await sendPushToUser(userId, {
        title: 'Nuevo lugar que te puede interesar',
        body: `${restaurant.name} matchea con tu ADN: ${matched.join(', ')}.`,
        url: `/restaurant/${restaurant.id}`,
      });
    }),
  );
}

/** "Cambios importantes": fires right when an operator confirms a new Source that actually moves the trust level of a restaurant someone already saved. */
export async function notifyTrustChangeIfSaved(restaurant: Restaurant, previousTrust: TrustLevel): Promise<void> {
  if (restaurant.trust === previousTrust) return;
  const userIds = getUsersWhoSaved(restaurant.id);
  await Promise.all(
    userIds.map((userId) =>
      sendPushToUser(userId, {
        title: `Cambió la confianza de ${restaurant.name}`,
        body: restaurant.trustRationale,
        url: `/restaurant/${restaurant.id}`,
      }),
    ),
  );
}
