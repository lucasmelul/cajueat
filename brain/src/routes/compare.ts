import { Router } from 'express';
import { getRestaurantById } from '../data/restaurants.js';
import { compareRestaurants } from '../llm/claudeClient.js';
import type { Restaurant } from '../types.js';

export const compareRouter = Router();

compareRouter.post('/compare', async (req, res) => {
  const ids: string[] = Array.isArray(req.body?.restaurantIds)
    ? req.body.restaurantIds.filter((id: unknown): id is string => typeof id === 'string')
    : [];
  const question = typeof req.body?.question === 'string' ? req.body.question.trim() : undefined;

  // Never compare more than 3 (SPEC-014) — more than that stops being "ayudar a decidir".
  const restaurants = ids
    .slice(0, 3)
    .map((id) => getRestaurantById(id))
    .filter((r): r is Restaurant => !!r);

  if (restaurants.length < 2) {
    res.status(400).json({ error: 'compare_needs_at_least_two_restaurants' });
    return;
  }

  const result = await compareRestaurants({ restaurants, question });
  res.json(result);
});
