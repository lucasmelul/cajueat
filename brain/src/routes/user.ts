import { Router } from 'express';
import { requireUserId } from '../middleware/identity.js';
import { getProfile } from '../memory/memoryStore.js';

export const userRouter = Router();

userRouter.get('/user', requireUserId, (req, res) => {
  res.json(getProfile(req.userId!).user);
});
