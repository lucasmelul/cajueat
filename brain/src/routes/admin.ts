import { Router } from 'express';
import { addSourceToRestaurant, createRestaurant, getCatalog, updateRestaurant, type RestaurantInput } from '../data/restaurants.js';
import { analyzeCuratorContent } from '../llm/claudeClient.js';
import { requireOperator } from '../middleware/operator.js';
import type { Source, SourceKind, SignalWeight } from '../types.js';

/**
 * SPEC-018 Admin CMS — "otro cliente del Brain, nunca lógica paralela":
 * every route here calls the same catalog store / Claude client the rest
 * of the Brain uses. The only thing new is the operator gate and direct
 * write access a normal end user never gets.
 */
export const adminRouter = Router();

adminRouter.use('/admin', requireOperator);

/** Read-only overview — trust/trustRationale/sources for the whole catalog at once, which no end-user screen ever shows. */
adminRouter.get('/admin/restaurants', (_req, res) => {
  res.json(getCatalog());
});

adminRouter.post('/admin/restaurants', (req, res) => {
  const body = req.body as Partial<RestaurantInput>;
  if (!body?.name || !body?.cuisine || !body?.neighborhood) {
    res.status(400).json({ error: 'name_cuisine_neighborhood_required' });
    return;
  }
  const input: RestaurantInput = {
    id: typeof body.id === 'string' ? body.id : undefined,
    name: body.name,
    cuisine: body.cuisine,
    neighborhood: body.neighborhood,
    price: body.price ?? '$$',
    type: body.type ?? 'new',
    why: body.why ?? '',
    tags: body.tags ?? [],
    personality: body.personality ?? [],
    position: body.position ?? { lat: -34.6, lng: -58.43 },
    summary: body.summary ?? '',
    quickFacts: body.quickFacts ?? [],
    order: body.order ?? [],
    tips: body.tips ?? [],
    idealFor: body.idealFor ?? [],
    notFor: body.notFor ?? [],
    sources: body.sources ?? [],
  };
  try {
    res.status(201).json(createRestaurant(input));
  } catch (err) {
    res.status(409).json({ error: (err as Error).message });
  }
});

adminRouter.patch('/admin/restaurants/:id', (req, res) => {
  const updated = updateRestaurant(req.params.id, req.body ?? {});
  if (!updated) {
    res.status(404).json({ error: 'restaurant_not_found' });
    return;
  }
  res.json(updated);
});

const VALID_KINDS = new Set<SourceKind>(['curator', 'community', 'visit', 'press', 'menu']);
const VALID_WEIGHTS = new Set<SignalWeight>(['strong', 'medium', 'weak']);

/** Operator confirms a suggestion from /admin/analyze — appended as a real Source, dated now, never backdated. */
adminRouter.post('/admin/restaurants/:id/sources', (req, res) => {
  const { name, kind, weight, claim } = req.body ?? {};
  if (typeof name !== 'string' || !name.trim() || !VALID_KINDS.has(kind) || !VALID_WEIGHTS.has(weight)) {
    res.status(400).json({ error: 'name_kind_weight_required' });
    return;
  }
  const source: Source = { name: name.trim(), kind, weight, capturedAt: new Date().toISOString(), ...(claim ? { claim: String(claim) } : {}) };
  const updated = addSourceToRestaurant(req.params.id, source);
  if (!updated) {
    res.status(404).json({ error: 'restaurant_not_found' });
    return;
  }
  res.json(updated);
});

/**
 * "Analizá esta lista" / "Analizá a @curador" (SPEC-017's ingestion path):
 * operator pastes real text already read elsewhere — never auto-applied,
 * only returned as suggestions for the operator to confirm one by one via
 * POST /admin/restaurants/:id/sources (Confirmación Inteligente, CP-009).
 */
adminRouter.post('/admin/analyze', async (req, res, next) => {
  try {
    const text = typeof req.body?.text === 'string' ? req.body.text.trim() : '';
    if (!text) {
      res.status(400).json({ error: 'text_required' });
      return;
    }
    const analysis = await analyzeCuratorContent({ text, catalog: getCatalog() });
    res.json(analysis);
  } catch (err) {
    next(err);
  }
});
