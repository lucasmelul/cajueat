import { Router } from 'express';
import { requireUserId } from '../middleware/identity.js';
import { addRestaurantToCollectionByName, createCollection, deleteCollection, getCollections, removeRestaurantFromCollection } from '../memory/memoryStore.js';

export const collectionsRouter = Router();

collectionsRouter.get('/collections', requireUserId, (req, res) => {
  res.json(getCollections(req.userId!));
});

collectionsRouter.post('/collections', requireUserId, (req, res) => {
  const name = typeof req.body?.name === 'string' ? req.body.name.trim() : '';
  if (!name) return res.status(400).json({ error: 'name_required' });
  res.json(createCollection(req.userId!, name));
});

collectionsRouter.post('/collections/by-name', requireUserId, (req, res) => {
  const name = typeof req.body?.name === 'string' ? req.body.name.trim() : '';
  const restaurantId = typeof req.body?.restaurantId === 'string' ? req.body.restaurantId : '';
  if (!name || !restaurantId) return res.status(400).json({ error: 'name_and_restaurantId_required' });
  res.json(addRestaurantToCollectionByName(req.userId!, name, restaurantId));
});

collectionsRouter.delete('/collections/:id', requireUserId, (req, res) => {
  deleteCollection(req.userId!, req.params.id);
  res.json({ ok: true });
});

collectionsRouter.delete('/collections/:id/restaurants/:restaurantId', requireUserId, (req, res) => {
  removeRestaurantFromCollection(req.userId!, req.params.id, req.params.restaurantId);
  res.json({ ok: true });
});
