import { Router } from 'express';
import { requireUserId } from '../middleware/identity.js';
import { setLastKnownLocation } from '../memory/memoryStore.js';
import { getRecommendations } from '../recommend/recommendationEngine.js';
import type { ContextFilter } from '../types.js';

export const recommendationsRouter = Router();

const VALID_FILTERS: ContextFilter[] = ['near', 'open', 'date', 'work', 'saved'];

recommendationsRouter.get('/recommendations', requireUserId, async (req, res, next) => {
  try {
    const neighborhood = typeof req.query.neighborhood === 'string' ? req.query.neighborhood : undefined;
    const rawFilter = typeof req.query.filter === 'string' ? req.query.filter : undefined;
    const filter = VALID_FILTERS.includes(rawFilter as ContextFilter) ? (rawFilter as ContextFilter) : undefined;
    const lat = typeof req.query.lat === 'string' ? Number(req.query.lat) : undefined;
    const lng = typeof req.query.lng === 'string' ? Number(req.query.lng) : undefined;
    const near = lat !== undefined && lng !== undefined && !Number.isNaN(lat) && !Number.isNaN(lng) ? { lat, lng } : undefined;
    // SPEC-022: a real "Cerca" request already carries real geolocation — remember it as the
    // user's last known location for promo targeting, never a request made just to poll it.
    if (near) setLastKnownLocation(req.userId!, near);
    const recs = await getRecommendations(req.userId!, { neighborhood, filter, near });
    res.json(recs);
  } catch (err) {
    next(err);
  }
});
