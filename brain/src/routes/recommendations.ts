import { Router } from 'express';
import { getRecommendations } from '../recommend/recommendationEngine.js';

export const recommendationsRouter = Router();

recommendationsRouter.get('/recommendations', async (req, res, next) => {
  try {
    const neighborhood = typeof req.query.neighborhood === 'string' ? req.query.neighborhood : undefined;
    const recs = await getRecommendations({ neighborhood });
    res.json(recs);
  } catch (err) {
    next(err);
  }
});
