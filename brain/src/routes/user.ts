import { Router } from 'express';
import { getProfile } from '../memory/memoryStore.js';

export const userRouter = Router();

userRouter.get('/user', (_req, res) => {
  res.json(getProfile().user);
});
