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
/** "Cerca" radius (SPEC-001) — an open product question on the exact distance; 2km is a reasonable walking radius for a city map. */
const NEAR_RADIUS_KM = 2;

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

  let candidates = getCatalog();
  if (context.neighborhood) {
    candidates = candidates.filter((r) => r.neighborhood.toLowerCase() === context.neighborhood!.toLowerCase());
  }
  if (context.filter === 'date') {
    candidates = candidates.filter((r) => r.idealFor.some((x) => /cita|ocasión especial/i.test(x)) || r.tags.some((t) => /en pareja/i.test(t)));
  } else if (context.filter === 'work') {
    candidates = candidates.filter((r) => r.idealFor.some((x) => /trabajar/i.test(x)) || r.tags.some((t) => /trabajar/i.test(t)));
  } else if (context.filter === 'saved') {
    candidates = candidates.filter((r) => savedIds.has(r.id));
  } else if (context.filter === 'open') {
    candidates = candidates.filter((r) => isOpenNow(r.openHours) === true);
  } else if (context.filter === 'near' && context.near) {
    const point = context.near;
    const withinRadius = candidates.filter((r) => haversineKm(point, r.position) <= NEAR_RADIUS_KM);
    // Nobody within the radius doesn't mean "show anything" — closest-first still respects what "Cerca" means.
    candidates = withinRadius.length > 0 ? withinRadius : [...candidates].sort((a, b) => haversineKm(point, a.position) - haversineKm(point, b.position));
  }
  // Without real geolocation, 'near' has no coordinates to filter by — pass through rather than fake a location.
  if (candidates.length === 0) candidates = getCatalog(); // never an empty result from filtering alone (CP-018 Discovery Engine)

  // A genuinely empty catalog (no real restaurants loaded yet, e.g. right after the demo
  // fixtures were hidden) is a real, honest state — never a bug to paper over with a fake pick.
  if (candidates.length === 0) {
    return {
      brainCard: {
        eyebrow: 'CAJU',
        message: 'Todavía no hay lugares cargados.',
        sub: 'En cuanto se sume el primer restaurante real, vas a empezar a ver recomendaciones acá.',
      },
      restaurants: [],
    };
  }

  const ranked = candidates.map((r) => scoreRestaurant(r, dnaLabels, savedIds)).sort((a, b) => b.score - a.score);
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
    restaurants: picked.map((p) => p.restaurant),
  };
}
