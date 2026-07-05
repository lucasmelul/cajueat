import { Router } from 'express';
import { addRestaurantToCollectionByName, createCollection, deleteCollection, getCollections, removeRestaurantFromCollection } from '../memory/memoryStore.js';

export const collectionsRouter = Router();

collectionsRouter.get('/collections', (_req, res) => {
  res.json(getCollections());
});

collectionsRouter.post('/collections', (req, res) => {
  const name = typeof req.body?.name === 'string' ? req.body.name.trim() : '';
  if (!name) return res.status(400).json({ error: 'name_required' });
  res.json(createCollection(name));
});

collectionsRouter.post('/collections/by-name', (req, res) => {
  const name = typeof req.body?.name === 'string' ? req.body.name.trim() : '';
  const restaurantId = typeof req.body?.restaurantId === 'string' ? req.body.restaurantId : '';
  if (!name || !restaurantId) return res.status(400).json({ error: 'name_and_restaurantId_required' });
  res.json(addRestaurantToCollectionByName(name, restaurantId));
});

collectionsRouter.delete('/collections/:id', (req, res) => {
  deleteCollection(req.params.id);
  res.json({ ok: true });
});

collectionsRouter.delete('/collections/:id/restaurants/:restaurantId', (req, res) => {
  removeRestaurantFromCollection(req.params.id, req.params.restaurantId);
  res.json({ ok: true });
});
