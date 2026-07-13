import { Router } from 'express';
import { getEvents } from '../data/eventsStore.js';

export const eventsRouter = Router();

/** Admin keeps seeing every event (including past ones, to manage/delete them) via getEvents() directly — only the public map hides what's already happened. */
eventsRouter.get('/events', (_req, res) => {
  const now = Date.now();
  res.json(getEvents().filter((e) => new Date(e.whenAt).getTime() >= now));
});
