import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { identityMiddleware } from './middleware/identity.js';
import { userRouter } from './routes/user.js';
import { restaurantsRouter } from './routes/restaurants.js';
import { recommendationsRouter } from './routes/recommendations.js';
import { eventsRouter } from './routes/events.js';
import { conversationRouter } from './routes/conversation.js';
import { dnaRouter } from './routes/dna.js';
import { feedbackRouter } from './routes/feedback.js';
import { captureRouter } from './routes/capture.js';
import { searchRouter } from './routes/search.js';
import { collectionsRouter } from './routes/collections.js';
import { onboardingRouter } from './routes/onboarding.js';
import { compareRouter } from './routes/compare.js';
import { identityRouter } from './routes/identity.js';
import { adminRouter } from './routes/admin.js';
import { pushRouter } from './routes/push.js';
import { activityRouter } from './routes/activity.js';
import { startNotificationScheduler } from './notifications/scheduler.js';

const app = express();
// Open by default (fine for local dev / a single trusted PWA origin isn't set up yet).
// In production, set ALLOWED_ORIGIN to the deployed PWA's real origin (e.g. the Vercel
// domain) to stop stray browsers from hitting the API directly with someone else's data.
app.use(cors(process.env.ALLOWED_ORIGIN ? { origin: process.env.ALLOWED_ORIGIN } : undefined));
// Default 100kb limit is too small for base64-encoded photos (SPEC-015 Knowledge Capture).
app.use(express.json({ limit: '10mb' }));
app.use(identityMiddleware);

app.use('/api', identityRouter);
app.use('/api', userRouter);
app.use('/api', restaurantsRouter);
app.use('/api', recommendationsRouter);
app.use('/api', eventsRouter);
app.use('/api', conversationRouter);
app.use('/api', dnaRouter);
app.use('/api', feedbackRouter);
app.use('/api', captureRouter);
app.use('/api', searchRouter);
app.use('/api', collectionsRouter);
app.use('/api', onboardingRouter);
app.use('/api', compareRouter);
app.use('/api', adminRouter);
app.use('/api', pushRouter);
app.use('/api', activityRouter);

app.use((err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err);
  res.status(500).json({ error: 'internal_error' });
});

const port = Number(process.env.PORT) || 8787;
app.listen(port, () => {
  console.log(`CajuEat Brain listening on http://localhost:${port}`);
  startNotificationScheduler();
});
