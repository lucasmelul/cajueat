import { Router } from 'express';
import { requireUserId } from '../middleware/identity.js';
import { completeOnboarding, getProfile } from '../memory/memoryStore.js';

export const onboardingRouter = Router();

onboardingRouter.post('/onboarding/complete', requireUserId, (req, res) => {
  completeOnboarding(req.userId!);
  res.json(getProfile(req.userId!).user);
});
