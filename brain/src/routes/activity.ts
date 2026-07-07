import { Router } from 'express';
import { getRestaurantById } from '../data/restaurants.js';
import { requireUserId } from '../middleware/identity.js';
import { getPendingFeedback, getProfile } from '../memory/memoryStore.js';

export const activityRouter = Router();

/**
 * Real per-user activity for Profile (SPEC-011/SPEC-016): the feedback nudge and
 * "Tus aportes" timeline used to be hardcoded fixture text regardless of who was
 * looking — this joins the real `contributions` log with the real pending-feedback
 * signal the SPEC-016 scheduler already computes (`getPendingFeedback`), oldest
 * save first, so the UI can show (or hide) a real place instead of a fixed name.
 */
activityRouter.get('/activity', requireUserId, (req, res) => {
  const { contributions } = getProfile(req.userId!);
  const pendingFeedback = getPendingFeedback(req.userId!)
    .map(({ restaurantId, savedAt }) => {
      const restaurant = getRestaurantById(restaurantId);
      return restaurant ? { restaurantId, restaurantName: restaurant.name, savedAt } : null;
    })
    .filter((x): x is { restaurantId: string; restaurantName: string; savedAt: number } => x !== null)
    .sort((a, b) => a.savedAt - b.savedAt);

  res.json({ contributions, pendingFeedback });
});
