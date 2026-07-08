import { Router } from 'express';
import { getEvents } from '../data/eventsStore.js';

export const eventsRouter = Router();

eventsRouter.get('/events', (_req, res) => {
  res.json(getEvents());
});
