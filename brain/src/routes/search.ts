import { Router } from 'express';
import { getCatalog } from '../data/restaurants.js';
import { interpretSearchQuery } from '../llm/claudeClient.js';
import { searchCatalog } from '../search/searchEngine.js';

export const searchRouter = Router();

/**
 * SPEC-008: real intent understanding via Claude, grounded in the real catalog — never a
 * keyword scorer. `searchCatalog` (deterministic) stays as a fallback only for when the Claude
 * call itself fails (network/API error), so search degrades to "still works" instead of 500ing,
 * never as the primary path.
 */
searchRouter.get('/search', async (req, res) => {
  const q = typeof req.query.q === 'string' ? req.query.q : '';
  const limit = Number(req.query.limit) || 8;
  const catalog = getCatalog();

  if (!q.trim()) {
    res.json({ restaurants: [], suggestions: [] });
    return;
  }

  try {
    const { restaurantIds, suggestions } = await interpretSearchQuery({ text: q, catalog });
    const byId = new Map(catalog.map((r) => [r.id, r]));
    const restaurants = restaurantIds.map((id) => byId.get(id)!).slice(0, limit);
    res.json({ restaurants, suggestions });
  } catch (err) {
    console.error('search_llm_failed', err);
    res.json({ restaurants: searchCatalog(q, limit), suggestions: [] });
  }
});
