import { Router } from 'express';
import { completeOnboarding, getProfile } from '../memory/memoryStore.js';

export const onboardingRouter = Router();

onboardingRouter.post('/onboarding/complete', (_req, res) => {
  completeOnboarding();
  res.json(getProfile().user);
});
