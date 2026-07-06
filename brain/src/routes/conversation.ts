import { Router } from 'express';
import { getCatalog } from '../data/restaurants.js';
import { interpretQuery } from '../llm/claudeClient.js';
import { requireUserId } from '../middleware/identity.js';
import { checkAndConsumeUsage } from '../memory/memoryStore.js';
import type { ConversationTurn } from '../types.js';

export const conversationRouter = Router();

let turnCounter = 0;
function nextTurnId() {
  turnCounter += 1;
  return `turn-${turnCounter}`;
}

conversationRouter.post('/messages', requireUserId, async (req, res, next) => {
  try {
    const text = typeof req.body?.text === 'string' ? req.body.text : '';
    const history: ConversationTurn[] = Array.isArray(req.body?.history) ? req.body.history : [];
    if (!text.trim()) return res.status(400).json({ error: 'text_required' });

    // SPEC-013 abuse gate: Conversation calls Claude with real cost, and an anonymous ID has no identity check behind it yet.
    const usage = checkAndConsumeUsage(req.userId!, 'message');
    if (!usage.allowed) return res.status(429).json({ error: 'anon_limit_reached', requiresSync: true });

    const catalog = getCatalog();
    const interpreted = await interpretQuery({ text, history, catalog });
    const restaurants = interpreted.restaurantIds.map((id) => catalog.find((r) => r.id === id)).filter((r): r is NonNullable<typeof r> => !!r);

    const turn: ConversationTurn = {
      id: nextTurnId(),
      role: 'brain',
      text: interpreted.reply,
      restaurants,
      chips: interpreted.chips,
      createdAt: Date.now(),
    };
    res.json(turn);
  } catch (err) {
    next(err);
  }
});
