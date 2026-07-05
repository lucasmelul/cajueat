import { Router } from 'express';
import { getRecommendations } from '../recommend/recommendationEngine.js';
import type { ContextFilter } from '../types.js';

export const recommendationsRouter = Router();

const VALID_FILTERS: ContextFilter[] = ['near', 'open', 'date', 'work', 'saved'];

recommendationsRouter.get('/recommendations', async (req, res, next) => {
  try {
    const neighborhood = typeof req.query.neighborhood === 'string' ? req.query.neighborhood : undefined;
    const rawFilter = typeof req.query.filter === 'string' ? req.query.filter : undefined;
    const filter = VALID_FILTERS.includes(rawFilter as ContextFilter) ? (rawFilter as ContextFilter) : undefined;
    const recs = await getRecommendations({ neighborhood, filter });
    res.json(recs);
  } catch (err) {
    next(err);
  }
});
