import { Router } from 'express';
import { getCatalog, getRestaurantById } from '../data/restaurants.js';
import { isSaved, setSaved } from '../memory/memoryStore.js';

export const restaurantsRouter = Router();

restaurantsRouter.get('/restaurants', (_req, res) => {
  res.json(getCatalog());
});

restaurantsRouter.get('/restaurants/:id', (req, res) => {
  const restaurant = getRestaurantById(req.params.id);
  if (!restaurant) return res.status(404).json({ error: 'not_found' });
  res.json(restaurant);
});

restaurantsRouter.get('/restaurants/:id/similar', (req, res) => {
  const target = getRestaurantById(req.params.id);
  const limit = Number(req.query.limit) || 3;
  if (!target) return res.status(404).json({ error: 'not_found' });

  const similar = getCatalog()
    .filter((r) => r.id !== target.id)
    .map((r) => {
      const sharedTags = r.personality.filter((p) => target.personality.includes(p)).length;
      const sameCuisine = r.cuisine === target.cuisine ? 2 : 0;
      return { restaurant: r, score: sharedTags + sameCuisine };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((s) => s.restaurant);

  res.json(similar);
});

restaurantsRouter.post('/restaurants/:id/save', (req, res) => {
  const restaurant = getRestaurantById(req.params.id);
  if (!restaurant) return res.status(404).json({ error: 'not_found' });
  const saved = req.body?.saved !== false;
  setSaved(restaurant.id, saved);
  res.json({ ok: true });
});

restaurantsRouter.get('/saved', (_req, res) => {
  res.json(getCatalog().filter((r) => isSaved(r.id)).map((r) => r.id));
});
