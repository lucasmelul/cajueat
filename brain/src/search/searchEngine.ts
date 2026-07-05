import { getCatalog } from '../data/restaurants.js';
import type { Restaurant, TrustLevel } from '../types.js';

/**
 * SPEC-008 Search Experience: "Google busca palabras. Caju entiende
 * intención." No LLM here — a deterministic keyword+trust scorer, same
 * spirit as the Conversation mock before Claude was wired in. Never
 * returns nothing: "Siempre responder... nunca 'no encontramos
 * resultados'" — if nothing truly matches, the best-trusted places still
 * come back so the PWA can soften the copy instead of showing a dead end.
 */

const TRUST_POINTS: Record<TrustLevel, number> = { high: 3, mid: 2, low: 1 };

function searchableText(r: Restaurant): string {
  return [r.name, r.cuisine, r.neighborhood, r.why, r.summary, ...r.tags, ...r.personality, ...r.idealFor].join(' ').toLowerCase();
}

export function searchCatalog(query: string, limit = 8): Restaurant[] {
  const terms = query
    .toLowerCase()
    .split(/\s+/)
    .filter((t) => t.length > 1);

  const scored = getCatalog().map((r) => {
    const haystack = searchableText(r);
    const matches = terms.filter((t) => haystack.includes(t)).length;
    return { restaurant: r, score: matches * 3 + TRUST_POINTS[r.trust] };
  });

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((s) => s.restaurant);
}
