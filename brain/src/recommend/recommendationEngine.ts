import { getCatalog } from '../data/restaurants.js';
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

interface ScoredRestaurant {
  restaurant: Restaurant;
  score: number;
  matchedDna: string[];
}

function scoreRestaurant(r: Restaurant, dnaLabels: string[], savedIds: Set<string>): ScoredRestaurant {
  let score = TRUST_POINTS[r.trust];

  const haystack = [r.cuisine, r.neighborhood, ...r.tags, ...r.personality].join(' ').toLowerCase();
  const matchedDna = dnaLabels.filter((label) => haystack.includes(label.toLowerCase()) || label.toLowerCase().includes(r.cuisine.toLowerCase()));
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

export async function getRecommendations(context: RecommendationContext = {}): Promise<Recommendations> {
  const { dna } = getProfile();
  const savedIds = new Set(getSavedIds());
  const dnaLabels = dna.map((d) => d.label);

  let candidates = getCatalog();
  if (context.neighborhood) {
    candidates = candidates.filter((r) => r.neighborhood.toLowerCase() === context.neighborhood!.toLowerCase());
  }
  if (candidates.length === 0) candidates = getCatalog(); // never an empty result (CP-018 Discovery Engine)

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
