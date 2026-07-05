import { Router } from 'express';
import { EVENTS } from '../data/restaurants.js';

export const eventsRouter = Router();

eventsRouter.get('/events', (_req, res) => {
  res.json(EVENTS);
});
