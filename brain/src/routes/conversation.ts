import { randomUUID } from 'node:crypto';
import { Router } from 'express';
import { getCatalog } from '../data/restaurants.js';
import { extractConversationKnowledge, interpretQuery } from '../llm/claudeClient.js';
import { requireUserId } from '../middleware/identity.js';
import { checkAndConsumeUsage, recordContribution } from '../memory/memoryStore.js';
import { enqueuePendingContribution } from '../moderation/pendingContributionsStore.js';
import type { ConversationTurn } from '../types.js';

const CONVERSATION_LEARN_POINTS = 30;

export const conversationRouter = Router();

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

    // SPEC-004 "Desde conversación": most messages are questions, not knowledge — only worth a
    // second, conservative check when the raw text actually names a real place. Gating on
    // `interpreted.restaurantIds` would miss the main case (sharing an experience produces no
    // recommendation at all, so interpretQuery legitimately grounds nothing) — a cheap local
    // name match is the right gate here, not the recommendation result.
    const mentionsRealPlace = catalog.some((r) => text.toLowerCase().includes(r.name.toLowerCase()));
    let learnedAbout: string | undefined;
    let learnedPoints: number | undefined;
    if (mentionsRealPlace) {
      const knowledge = await extractConversationKnowledge({ text, catalog });
      const restaurant = knowledge.restaurantId ? catalog.find((r) => r.id === knowledge.restaurantId) : undefined;
      if (restaurant && knowledge.learned) {
        recordContribution(req.userId!, `Le enseñaste algo a Caju sobre ${restaurant.name}`, CONVERSATION_LEARN_POINTS);
        // SPEC-019: same moderation queue as Nota/Foto/Voz — never straight to the shared catalog.
        enqueuePendingContribution({ restaurantId: restaurant.id, claim: knowledge.learned, source: 'conversation' });
        learnedAbout = restaurant.name;
        learnedPoints = CONVERSATION_LEARN_POINTS;
      }
    }

    const turn: ConversationTurn = {
      id: randomUUID(),
      role: 'brain',
      text: interpreted.reply,
      restaurants,
      chips: interpreted.chips,
      createdAt: Date.now(),
      learnedAbout,
      learnedPoints,
    };
    res.write(`${JSON.stringify({ type: 'done', turn })}\n`);
    res.end();
  } catch (err) {
    next(err);
  }
});
