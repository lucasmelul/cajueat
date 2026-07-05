import { Router } from 'express';
import { searchCatalog } from '../search/searchEngine.js';

export const searchRouter = Router();

searchRouter.get('/search', (req, res) => {
  const q = typeof req.query.q === 'string' ? req.query.q : '';
  const limit = Number(req.query.limit) || 8;
  res.json(searchCatalog(q, limit));
});
