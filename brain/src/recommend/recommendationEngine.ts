import { getCatalog } from '../data/restaurants.js';
import { haversineKm, isOpenNow } from '../geo/geo.js';
import { explainRecommendation } from '../llm/claudeClient.js';
import { getProfile, getSavedIds } from '../memory/memoryStore.js';
import type { Recommendations, RecommendationContext, Restaurant, TrustLevel } from '../types.js';

/**
 * SPEC-005 Recommendation Engine: candidates -> filter -> score (Trust +
 * DNA/memory alignment) -> rank -> diversify -> explain (Claude, grounded
 * only in the real contributing signals) -> return.
 */

const TRUST_POINTS: Record<TrustLevel, number> = { high: 3, mid: 2, low: 1 };
const MAX_RESULTS = 5;
/** "Cerca" radius (SPEC-001) — an open product question on the exact distance; 2km is a reasonable walking radius for a city map. Exported so SPEC-022 promo targeting reuses the exact same radius, not a second guess. */
export const NEAR_RADIUS_KM = 2;

interface ScoredRestaurant {
  restaurant: Restaurant;
  score: number;
  matchedDna: string[];
}

/** Which of a user's DNA tags a restaurant actually matches — the same signal `scoreRestaurant` uses, and what SPEC-016's "Nuevos lugares" notification reuses instead of a second copy of this logic. */
export function matchDna(r: Restaurant, dnaLabels: string[]): string[] {
  const haystack = [r.cuisine, r.neighborhood, ...r.tags, ...r.personality].join(' ').toLowerCase();
  return dnaLabels.filter((label) => haystack.includes(label.toLowerCase()) || label.toLowerCase().includes(r.cuisine.toLowerCase()));
}

function scoreRestaurant(r: Restaurant, dnaLabels: string[], savedIds: Set<string>): ScoredRestaurant {
  let score = TRUST_POINTS[r.trust];

  const matchedDna = matchDna(r, dnaLabels);
  score += matchedDna.length * 2;

  if (savedIds.has(r.id)) score += 1;

  return { restaurant: r, score, matchedDna };
}

/** Greedily picks the top N while never repeating a cuisine back-to-back (CP-021: "nunca recomendar siempre lo mismo"). */
function diversify(ranked: ScoredRestaurant[], limit: number): ScoredRestaurant[] {
  const picked: ScoredRestaurant[] = [];
  const remaining = [...ranked];
  while (picked.length < limit && remaining.length > 0) {
    const lastCuisine = picked[picked.length - 1]?.restaurant.cuisine;
    let index = remaining.findIndex((r) => r.restaurant.cuisine !== lastCuisine);
    if (index === -1) index = 0;
    picked.push(remaining.splice(index, 1)[0]);
  }
  return picked;
}

function buildSignals(scored: ScoredRestaurant): string[] {
  const signals = [scored.restaurant.trustRationale];
  if (scored.matchedDna.length > 0) {
    signals.push(`Coincide con tu ADN gastronómico: ${scored.matchedDna.join(', ')}`);
  }
  return signals;
}

export async function getRecommendations(userId: string, context: RecommendationContext = {}): Promise<Recommendations> {
  const { dna } = getProfile(userId);
  const savedIds = new Set(getSavedIds(userId));
  const dnaLabels = dna.map((d) => d.label);

  const catalog = getCatalog();
  let filtered = catalog;
  if (context.neighborhood) {
    filtered = filtered.filter((r) => r.neighborhood.toLowerCase() === context.neighborhood!.toLowerCase());
  }
  if (context.filter === 'date') {
    filtered = filtered.filter((r) => r.idealFor.some((x) => /cita|ocasión especial/i.test(x)) || r.tags.some((t) => /en pareja/i.test(t)));
  } else if (context.filter === 'work') {
    filtered = filtered.filter((r) => r.idealFor.some((x) => /trabajar/i.test(x)) || r.tags.some((t) => /trabajar/i.test(t)));
  } else if (context.filter === 'saved') {
    filtered = filtered.filter((r) => savedIds.has(r.id));
  } else if (context.filter === 'open') {
    filtered = filtered.filter((r) => isOpenNow(r.openHours) === true);
  } else if (context.filter === 'near' && context.near) {
    // Without real geolocation, 'near' has no coordinates to filter by — pass through rather than fake a location.
    filtered = filtered.filter((r) => haversineKm(context.near!, r.position) <= NEAR_RADIUS_KM);
  }

  // A genuinely empty catalog (no real restaurants loaded yet, e.g. right after the demo
  // fixtures were hidden) is a real, honest state — never a bug to paper over with a fake pick.
  if (catalog.length === 0) {
    return {
      brainCard: {
        eyebrow: 'CAJU',
        message: 'Todavía no hay lugares cargados.',
        sub: 'En cuanto se sume el primer restaurante real, vas a empezar a ver recomendaciones acá.',
      },
      restaurants: [],
    };
  }

  // `filtered` is the honest result — it also drives the Living Map's pins now (CP-068 update:
  // Context Chips filter the map, not just the card), so an empty result here has to stay empty,
  // never silently backfilled with the whole catalog like it used to be.
  if (filtered.length === 0) {
    // "Cerca" is the one exception: nobody within NEAR_RADIUS_KM still deserves a real pick for
    // the card (closest-first), even though the map honestly shows zero pins for that filter.
    const cardCandidates =
      context.filter === 'near' && context.near
        ? [...catalog].sort((a, b) => haversineKm(context.near!, a.position) - haversineKm(context.near!, b.position))
        : null;
    // Otherwise there's genuinely nothing to suggest for this filter — no card at all, never a
    // fake pick or an empty-state message standing in for one.
    if (!cardCandidates) {
      return { brainCard: null, restaurants: [] };
    }
    const top = diversify(cardCandidates.map((r) => scoreRestaurant(r, dnaLabels, savedIds)).sort((a, b) => b.score - a.score), 1)[0];
    const message = await explainRecommendation({ restaurant: top.restaurant, signals: buildSignals(top) });
    return {
      brainCard: {
        eyebrow: 'CAJU · RECOMENDACIÓN',
        message: `Hoy elegiría **${top.restaurant.name}**.`,
        sub: message,
        restaurantId: top.restaurant.id,
      },
      restaurants: [],
    };
  }

  const ranked = filtered.map((r) => scoreRestaurant(r, dnaLabels, savedIds)).sort((a, b) => b.score - a.score);
  const picked = diversify(ranked, MAX_RESULTS);
  const top = picked[0];

  const message = await explainRecommendation({ restaurant: top.restaurant, signals: buildSignals(top) });

  return {
    brainCard: {
      eyebrow: 'CAJU · RECOMENDACIÓN',
      message: `Hoy elegiría **${top.restaurant.name}**.`,
      sub: message,
      restaurantId: top.restaurant.id,
    },
    restaurants: filtered,
  };
}
