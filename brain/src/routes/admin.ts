import { Router } from 'express';
import { getAllCurators } from '../curators/curatorStore.js';
import { addSourceToRestaurant, createRestaurant, getCatalog, getRestaurantById, updateRestaurant, type RestaurantInput } from '../data/restaurants.js';
import { createEvent, deleteEvent, getEvents } from '../data/eventsStore.js';
import { getPlaceDetails, searchPlaces } from '../integrations/googlePlaces.js';
import { analyzeCuratorContent } from '../llm/claudeClient.js';
import { requireOperator } from '../middleware/operator.js';
import {
  getNewPlaceSuggestionById,
  getNewPlaceSuggestions,
  getPendingContributionById,
  getPendingContributions,
  markContributionStatus,
  markNewPlaceStatus,
} from '../moderation/pendingContributionsStore.js';
import { notifyNewPlaceIfMatches, notifyTrustChangeIfSaved } from '../notifications/triggers.js';
import type { Source, SourceKind, SignalWeight } from '../types.js';

/**
 * SPEC-018 Admin CMS — "otro cliente del Brain, nunca lógica paralela":
 * every route here calls the same catalog store / Claude client the rest
 * of the Brain uses. The only thing new is the operator gate and direct
 * write access a normal end user never gets.
 */
export const adminRouter = Router();

adminRouter.use('/admin', requireOperator);

/** Read-only overview — trust/trustRationale/sources for the whole catalog at once, which no end-user screen ever shows. includeDemo:true so the operator can still see/manage the hand-authored fixture places even though real users never do. */
adminRouter.get('/admin/restaurants', (_req, res) => {
  res.json(getCatalog({ includeDemo: true }));
});

/** SPEC-017: curator reputation per domain — internal to the operator view only, per the spec's own open question on end-user visibility (kept unresolved, so kept unexposed). */
adminRouter.get('/admin/curators', (_req, res) => {
  res.json(getAllCurators());
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
    ...(body.address ? { address: body.address } : {}),
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
    const created = createRestaurant(input);
    res.status(201).json(created);
    // SPEC-016 "Nuevos lugares" — after the response, never blocking it on a push send.
    notifyNewPlaceIfMatches(created).catch((err) => console.error('notify_new_place_failed', err));
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
  const before = getRestaurantById(req.params.id);
  const source: Source = { name: name.trim(), kind, weight, capturedAt: new Date().toISOString(), ...(claim ? { claim: String(claim) } : {}) };
  const updated = addSourceToRestaurant(req.params.id, source);
  if (!updated) {
    res.status(404).json({ error: 'restaurant_not_found' });
    return;
  }
  res.json(updated);
  // SPEC-016 "Cambios importantes" — only fires if the trust level actually moved for someone who already saved this place.
  if (before) notifyTrustChangeIfSaved(updated, before.trust).catch((err) => console.error('notify_trust_change_failed', err));
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

/**
 * SPEC-019 User Contribution Moderation: what a regular user's Nota/Foto/Voz/conversation
 * message taught the Brain, joined with the real restaurant name for display — same
 * "confirm one by one, never applied on its own" pattern as /admin/analyze's suggestions.
 */
adminRouter.get('/admin/pending-contributions', (_req, res) => {
  const catalog = getCatalog();
  const pending = getPendingContributions()
    .map((c) => {
      const restaurant = catalog.find((r) => r.id === c.restaurantId);
      return restaurant ? { ...c, restaurantName: restaurant.name } : null;
    })
    .filter((c): c is NonNullable<typeof c> => c !== null);
  res.json(pending);
});

/** Confirm: becomes a real Source, kind `community`, weight `weak` — never a higher weight just because an operator approved it fast. */
adminRouter.post('/admin/pending-contributions/:id/confirm', (req, res) => {
  const pending = getPendingContributionById(req.params.id);
  if (!pending || pending.status !== 'pending') {
    res.status(404).json({ error: 'pending_contribution_not_found' });
    return;
  }
  const before = getRestaurantById(pending.restaurantId);
  const source: Source = { name: 'Un usuario', kind: 'community', weight: 'weak', capturedAt: new Date().toISOString(), claim: pending.claim };
  const updated = addSourceToRestaurant(pending.restaurantId, source);
  if (!updated) {
    res.status(404).json({ error: 'restaurant_not_found' });
    return;
  }
  markContributionStatus(pending.id, 'confirmed');
  res.json(updated);
  if (before) notifyTrustChangeIfSaved(updated, before.trust).catch((err) => console.error('notify_trust_change_failed', err));
});

/** Reject: marked, never deleted — same "keeps history" convention as the rest of the project. */
adminRouter.post('/admin/pending-contributions/:id/reject', (req, res) => {
  const updated = markContributionStatus(req.params.id, 'rejected');
  if (!updated) {
    res.status(404).json({ error: 'pending_contribution_not_found' });
    return;
  }
  res.json(updated);
});

/**
 * A place a user described that wasn't in the catalog yet (SPEC-019 extension): before this,
 * recommending an unknown place from a Nota/Foto/Voz/conversation vanished with no admin trace
 * at all. Same "operator reviews, never applies on its own" pattern — except confirming here
 * creates a brand-new restaurant instead of adding a source to an existing one, so the operator
 * can fill in whatever the extraction left blank (cuisine/neighborhood/address) before it goes live.
 */
adminRouter.get('/admin/pending-new-places', (_req, res) => {
  res.json(getNewPlaceSuggestions());
});

adminRouter.post('/admin/pending-new-places/:id/confirm', (req, res) => {
  const pending = getNewPlaceSuggestionById(req.params.id);
  if (!pending || pending.status !== 'pending') {
    res.status(404).json({ error: 'pending_new_place_not_found' });
    return;
  }
  const body = req.body ?? {};
  const name = typeof body.name === 'string' && body.name.trim() ? body.name.trim() : pending.name;
  const cuisine = typeof body.cuisine === 'string' && body.cuisine.trim() ? body.cuisine.trim() : pending.cuisine;
  const neighborhood = typeof body.neighborhood === 'string' && body.neighborhood.trim() ? body.neighborhood.trim() : pending.neighborhood;
  const address = typeof body.address === 'string' && body.address.trim() ? body.address.trim() : pending.address;
  const position = body.position && typeof body.position.lat === 'number' && typeof body.position.lng === 'number' ? body.position : undefined;
  if (!name || !cuisine || !neighborhood) {
    res.status(400).json({ error: 'name_cuisine_neighborhood_required' });
    return;
  }
  try {
    const created = createRestaurant({
      name,
      cuisine,
      neighborhood,
      ...(address ? { address } : {}),
      price: '$$',
      type: 'new',
      why: '',
      tags: [],
      personality: [],
      position: position ?? { lat: -34.6, lng: -58.43 },
      summary: '',
      quickFacts: [],
      order: [],
      tips: [],
      idealFor: [],
      notFor: [],
      sources: [{ name: 'Un usuario', kind: 'community', weight: 'weak', capturedAt: new Date().toISOString(), claim: pending.claim }],
    });
    markNewPlaceStatus(pending.id, 'confirmed');
    res.status(201).json(created);
    notifyNewPlaceIfMatches(created).catch((err) => console.error('notify_new_place_failed', err));
  } catch (err) {
    res.status(409).json({ error: (err as Error).message });
  }
});

/** Reject: marked, never deleted — same convention as the rest of the moderation queues. */
adminRouter.post('/admin/pending-new-places/:id/reject', (req, res) => {
  const updated = markNewPlaceStatus(req.params.id, 'rejected');
  if (!updated) {
    res.status(404).json({ error: 'pending_new_place_not_found' });
    return;
  }
  res.json(updated);
});

/**
 * Google Places: only ever keeps FACTUAL fields in sync (address, position, opening hours,
 * whether a place is still in business) — never touches `sources[]` or trust. One Details fetch
 * when the operator links a restaurant, one more each time they tap "Refrescar" — never a
 * background poll, so cost stays exactly proportional to operator action.
 */
adminRouter.get('/admin/google-places/search', async (req, res, next) => {
  try {
    const q = typeof req.query.q === 'string' ? req.query.q.trim() : '';
    if (!q) {
      res.status(400).json({ error: 'q_required' });
      return;
    }
    res.json(await searchPlaces(q));
  } catch (err) {
    if (err instanceof Error && err.message === 'google_places_not_configured') {
      res.status(503).json({ error: 'google_places_not_configured' });
      return;
    }
    next(err);
  }
});

/** Operator picked a real candidate from search — one Details fetch prefills address/position/openHours and stores the id for future refreshes. */
adminRouter.post('/admin/restaurants/:id/link-google', async (req, res, next) => {
  try {
    const placeId = typeof req.body?.placeId === 'string' ? req.body.placeId.trim() : '';
    if (!placeId) {
      res.status(400).json({ error: 'placeId_required' });
      return;
    }
    const details = await getPlaceDetails(placeId);
    const updated = updateRestaurant(req.params.id, {
      googlePlaceId: details.placeId,
      address: details.address || undefined,
      position: details.position,
      ...(details.openHours ? { openHours: details.openHours } : {}),
    });
    if (!updated) {
      res.status(404).json({ error: 'restaurant_not_found' });
      return;
    }
    res.json({ restaurant: updated, businessStatus: details.businessStatus });
  } catch (err) {
    if (err instanceof Error && err.message === 'google_places_not_configured') {
      res.status(503).json({ error: 'google_places_not_configured' });
      return;
    }
    next(err);
  }
});

/** Manual refresh against the already-linked place — same factual-fields-only patch, no new Source, no trust change. */
adminRouter.post('/admin/restaurants/:id/refresh-google', async (req, res, next) => {
  try {
    const restaurant = getRestaurantById(req.params.id);
    if (!restaurant) {
      res.status(404).json({ error: 'restaurant_not_found' });
      return;
    }
    if (!restaurant.googlePlaceId) {
      res.status(400).json({ error: 'not_linked_to_google' });
      return;
    }
    const details = await getPlaceDetails(restaurant.googlePlaceId);
    const updated = updateRestaurant(req.params.id, {
      address: details.address || undefined,
      position: details.position,
      ...(details.openHours ? { openHours: details.openHours } : {}),
    });
    res.json({ restaurant: updated, businessStatus: details.businessStatus });
  } catch (err) {
    if (err instanceof Error && err.message === 'google_places_not_configured') {
      res.status(503).json({ error: 'google_places_not_configured' });
      return;
    }
    next(err);
  }
});

/**
 * Events had no CRUD before this — the map only ever showed a single
 * hardcoded fixture, with no way for an operator to add a real one. Same
 * pattern as restaurants: direct create/delete, no confirmation queue,
 * because an operator typing a real event isn't an AI extraction that needs
 * review.
 */
adminRouter.get('/admin/events', (_req, res) => {
  res.json(getEvents());
});

adminRouter.post('/admin/events', (req, res) => {
  const { name, whenAt, position } = req.body ?? {};
  const validPosition = position && typeof position.lat === 'number' && typeof position.lng === 'number';
  if (typeof name !== 'string' || !name.trim() || typeof whenAt !== 'string' || Number.isNaN(Date.parse(whenAt)) || !validPosition) {
    res.status(400).json({ error: 'name_whenAt_position_required' });
    return;
  }
  const created = createEvent({ name: name.trim(), whenAt, position });
  res.status(201).json(created);
});

adminRouter.delete('/admin/events/:id', (req, res) => {
  const deleted = deleteEvent(req.params.id);
  if (!deleted) {
    res.status(404).json({ error: 'event_not_found' });
    return;
  }
  res.status(204).end();
});
