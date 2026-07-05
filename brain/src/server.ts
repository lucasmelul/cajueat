import 'dotenv/config';
import express from 'express';
import cors from 'cors';
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

const app = express();
app.use(cors());
app.use(express.json());

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

app.use((err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err);
  res.status(500).json({ error: 'internal_error' });
});

const port = Number(process.env.PORT) || 8787;
app.listen(port, () => {
  console.log(`CajuEat Brain listening on http://localhost:${port}`);
});
