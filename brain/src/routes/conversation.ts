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

    // SPEC-002: "las respuestas nunca aparecen completas" — a chunked ND-JSON body (not
    // a single res.json()) so the client can render the reply as it's generated, not
    // after it's done. `delta` lines carry plain text; the final `done` line carries the
    // full, grounding-checked turn, identical in shape to the old non-streaming response.
    res.setHeader('Content-Type', 'application/x-ndjson');
    const interpreted = await interpretQuery({ text, history, catalog }, (chunk) => {
      res.write(`${JSON.stringify({ type: 'delta', text: chunk })}\n`);
    });
    const restaurants = interpreted.restaurantIds.map((id) => catalog.find((r) => r.id === id)).filter((r): r is NonNullable<typeof r> => !!r);

    const turn: ConversationTurn = {
      id: nextTurnId(),
      role: 'brain',
      text: interpreted.reply,
      restaurants,
      chips: interpreted.chips,
      createdAt: Date.now(),
    };
    res.write(`${JSON.stringify({ type: 'done', turn })}\n`);
    res.end();
  } catch (err) {
    next(err);
  }
});
