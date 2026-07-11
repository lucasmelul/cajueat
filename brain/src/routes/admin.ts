import { Router } from 'express';
import { generateCheckinToken } from '../checkin/checkinTokens.js';
import { getConsumptionSummary } from '../checkin/consumptionStore.js';
import { getAllCurators, renameCurator } from '../curators/curatorStore.js';
import { createPromotion, getPromotionsForRestaurant, type PromotionType } from '../promotions/promotionsStore.js';
import { addSourceToRestaurant, createRestaurant, getCatalog, getRestaurantById, updateRestaurant, type RestaurantInput } from '../data/restaurants.js';
import { addSourceToDish, createDish, findDishByRestaurantAndName, getDishes } from '../data/dishStore.js';
import { createEvent, deleteEvent, getEvents } from '../data/eventsStore.js';
import { resolveRelativeDate } from '../dates/resolveRelativeDate.js';
import { getPlaceDetails, searchPlaces } from '../integrations/googlePlaces.js';
import { analyzeCuratorContent, extractEventsFromImage } from '../llm/claudeClient.js';
import { getUserStats } from '../memory/memoryStore.js';
import { requireOperator } from '../middleware/operator.js';
import {
  getNewPlaceSuggestionById,
  getNewPlaceSuggestions,
  getPendingContributionById,
  getPendingContributions,
  getPendingDishMentionById,
  getPendingDishMentions,
  getPendingLinks,
  markContributionStatus,
  markDishMentionStatus,
  markNewPlaceStatus,
  markPendingLinkStatus,
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
  res.json(getCatalog({ includeDemo: true, includeUnverified: true }));
});

/** SPEC-017: curator reputation per domain — internal to the operator view only, per the spec's own open question on end-user visibility (kept unresolved, so kept unexposed). */
adminRouter.get('/admin/curators', (_req, res) => {
  res.json(getAllCurators());
});

/**
 * Corrige un handle mal cargado (ej. faltaba un carácter) sin perder la reputación real ya
 * acumulada bajo ese curador — renombra la fila de `curatorStore` y, en el mismo request,
 * actualiza cada `Source.name` que citaba el handle viejo en cualquier restaurante, para que
 * ambos lugares queden consistentes. Nunca crea un curador nuevo desde cero.
 */
adminRouter.post('/admin/curators/rename', (req, res) => {
  const { oldHandle, newHandle } = req.body ?? {};
  if (typeof oldHandle !== 'string' || !oldHandle.trim() || typeof newHandle !== 'string' || !newHandle.trim()) {
    res.status(400).json({ error: 'oldHandle_newHandle_required' });
    return;
  }
  const renamed = renameCurator(oldHandle, newHandle);
  if (!renamed) {
    res.status(404).json({ error: 'curator_not_found' });
    return;
  }
  let restaurantsUpdated = 0;
  for (const restaurant of getCatalog({ includeDemo: true, includeUnverified: true })) {
    if (!restaurant.sources.some((s) => s.name === oldHandle)) continue;
    const sources = restaurant.sources.map((s) => (s.name === oldHandle ? { ...s, name: newHandle } : s));
    updateRestaurant(restaurant.id, { sources });
    restaurantsUpdated++;
  }
  res.json({ curator: renamed, restaurantsUpdated });
});

/** Days since a restaurant's freshest source — same definition the Radar de desactualizados uses client-side, kept in sync here for the Dashboard's aggregate count. */
const STALE_THRESHOLD_DAYS = 180;
function daysSinceFreshestSource(sources: { capturedAt: string }[]): number | null {
  const freshestMs = sources.reduce((max, s) => Math.max(max, new Date(s.capturedAt).getTime()), 0);
  return freshestMs === 0 ? null : Math.floor((Date.now() - freshestMs) / (24 * 60 * 60 * 1000));
}

/** Dashboard overview: every number here is a direct read of real data (catalog, curator store, moderation queues, user stats) — never a placeholder metric. */
adminRouter.get('/admin/stats', (_req, res) => {
  const real = getCatalog({ includeDemo: true, includeUnverified: true }).filter((r) => !r.isDemo);
  const demoCount = getCatalog({ includeDemo: true, includeUnverified: true }).length - real.length;
  res.json({
    restaurants: {
      total: real.length,
      demo: demoCount,
      byTrust: {
        high: real.filter((r) => r.trust === 'high').length,
        mid: real.filter((r) => r.trust === 'mid').length,
        low: real.filter((r) => r.trust === 'low').length,
      },
      linkedToGoogle: real.filter((r) => !!r.googlePlaceId).length,
      stale: real.filter((r) => {
        const days = daysSinceFreshestSource(r.sources);
        return days === null || days > STALE_THRESHOLD_DAYS;
      }).length,
    },
    users: getUserStats(),
    curators: getAllCurators().length,
    events: getEvents().length,
    pending: {
      contributions: getPendingContributions().length,
      newPlaces: getNewPlaceSuggestions().length,
    },
  });
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

/** SPEC-025: every dish, trust computed fresh from its own sources — same discipline as the restaurant catalog. */
adminRouter.get('/admin/dishes', (_req, res) => {
  res.json(getDishes());
});

/** Direct operator creation — same convention as POST /admin/restaurants: an operator's own action, never queued. Requires one real source so a dish is never sourceless. */
adminRouter.post('/admin/dishes', (req, res) => {
  const { name, category, restaurantId, source } = req.body ?? {};
  const restaurant = typeof restaurantId === 'string' ? getRestaurantById(restaurantId) : undefined;
  if (
    typeof name !== 'string' ||
    !name.trim() ||
    typeof category !== 'string' ||
    !category.trim() ||
    !restaurant ||
    !source ||
    typeof source.name !== 'string' ||
    !source.name.trim() ||
    !VALID_KINDS.has(source.kind) ||
    !VALID_WEIGHTS.has(source.weight)
  ) {
    res.status(400).json({ error: 'name_category_restaurantId_source_required' });
    return;
  }
  const created = createDish({
    name: name.trim(),
    category: category.trim(),
    restaurantId,
    source: {
      name: source.name.trim(),
      kind: source.kind,
      weight: source.weight,
      capturedAt: new Date().toISOString(),
      ...(source.claim ? { claim: String(source.claim) } : {}),
    },
  });
  res.status(201).json(created);
});

/** Same "Confirmación Inteligente" pattern as restaurant sources — appends, never auto-applied. */
adminRouter.post('/admin/dishes/:id/sources', (req, res) => {
  const { name, kind, weight, claim } = req.body ?? {};
  if (typeof name !== 'string' || !name.trim() || !VALID_KINDS.has(kind) || !VALID_WEIGHTS.has(weight)) {
    res.status(400).json({ error: 'name_kind_weight_required' });
    return;
  }
  const source: Source = { name: name.trim(), kind, weight, capturedAt: new Date().toISOString(), ...(claim ? { claim: String(claim) } : {}) };
  const updated = addSourceToDish(req.params.id, source);
  if (!updated) {
    res.status(404).json({ error: 'dish_not_found' });
    return;
  }
  res.json(updated);
});

/**
 * SPEC-025: confirming a curator's dish match from /admin/analyze (ephemeral, never persisted
 * server-side) — finds the existing (restaurant, dish name) row to append a source to, or
 * creates it if this is the first evidence for that dish. Same find-or-create discipline as
 * SPEC-019's contribution confirmations, just for dishes instead of restaurants.
 */
adminRouter.post('/admin/dishes/confirm-match', (req, res) => {
  const { restaurantId, dishName, category, name, kind, weight, claim } = req.body ?? {};
  const restaurant = typeof restaurantId === 'string' ? getRestaurantById(restaurantId) : undefined;
  if (
    !restaurant ||
    typeof dishName !== 'string' ||
    !dishName.trim() ||
    typeof category !== 'string' ||
    !category.trim() ||
    typeof name !== 'string' ||
    !name.trim() ||
    !VALID_KINDS.has(kind) ||
    !VALID_WEIGHTS.has(weight)
  ) {
    res.status(400).json({ error: 'restaurantId_dishName_category_name_kind_weight_required' });
    return;
  }
  const source: Source = { name: name.trim(), kind, weight, capturedAt: new Date().toISOString(), ...(claim ? { claim: String(claim) } : {}) };
  const existing = findDishByRestaurantAndName(restaurant.id, dishName.trim());
  const dish = existing ? addSourceToDish(existing.id, source)! : createDish({ name: dishName.trim(), category: category.trim(), restaurantId: restaurant.id, source });
  res.status(existing ? 200 : 201).json(dish);
});

/** SPEC-025 extension of SPEC-019: what a regular user's Nota/Foto/Voz named as a specific dish, awaiting operator review. */
adminRouter.get('/admin/pending-dish-mentions', (_req, res) => {
  const catalog = getCatalog();
  const pending = getPendingDishMentions()
    .map((d) => {
      const restaurant = catalog.find((r) => r.id === d.restaurantId);
      return restaurant ? { ...d, restaurantName: restaurant.name } : null;
    })
    .filter((d): d is NonNullable<typeof d> => d !== null);
  res.json(pending);
});

/** Confirm: same "Un usuario" / community / weak convention as SPEC-019's restaurant-level contribution confirm — never a higher weight just because an operator approved fast. */
adminRouter.post('/admin/pending-dish-mentions/:id/confirm', (req, res) => {
  const pending = getPendingDishMentionById(req.params.id);
  if (!pending || pending.status !== 'pending') {
    res.status(404).json({ error: 'pending_dish_mention_not_found' });
    return;
  }
  const source: Source = { name: 'Un usuario', kind: 'community', weight: 'weak', capturedAt: new Date().toISOString(), claim: pending.claim };
  const existing = findDishByRestaurantAndName(pending.restaurantId, pending.dishName);
  const dish = existing
    ? addSourceToDish(existing.id, source)
    : createDish({ name: pending.dishName, category: pending.category, restaurantId: pending.restaurantId, source });
  if (!dish) {
    res.status(404).json({ error: 'restaurant_not_found' });
    return;
  }
  markDishMentionStatus(pending.id, 'confirmed');
  res.json(dish);
});

adminRouter.post('/admin/pending-dish-mentions/:id/reject', (req, res) => {
  const updated = markDishMentionStatus(req.params.id, 'rejected');
  if (!updated) {
    res.status(404).json({ error: 'pending_dish_mention_not_found' });
    return;
  }
  res.json(updated);
});

/**
 * Reels/TikTok/links (SPEC-015): the Brain never reads the content, so there's no automatic
 * "confirm" action — an operator opens the link, decides what to do (add a source, create a
 * new place, or nothing), and does that manually with the tools above. These two routes just
 * clear the item from the queue once it's been looked at.
 */
adminRouter.get('/admin/pending-links', (_req, res) => {
  res.json(getPendingLinks());
});

adminRouter.post('/admin/pending-links/:id/reviewed', (req, res) => {
  const updated = markPendingLinkStatus(req.params.id, 'confirmed');
  if (!updated) {
    res.status(404).json({ error: 'pending_link_not_found' });
    return;
  }
  res.json(updated);
});

adminRouter.post('/admin/pending-links/:id/reject', (req, res) => {
  const updated = markPendingLinkStatus(req.params.id, 'rejected');
  if (!updated) {
    res.status(404).json({ error: 'pending_link_not_found' });
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

/**
 * Generic Details fetch, not bound to a restaurant — same underlying call as link-google, just
 * returning the raw place instead of patching a restaurant. Used wherever an operator picks a
 * real venue and needs its position/address directly (e.g. an event's venue) rather than linking
 * a restaurant record to it.
 */
adminRouter.get('/admin/google-places/details', async (req, res, next) => {
  try {
    const placeId = typeof req.query.placeId === 'string' ? req.query.placeId.trim() : '';
    if (!placeId) {
      res.status(400).json({ error: 'placeId_required' });
      return;
    }
    const details = await getPlaceDetails(placeId);
    res.json({ placeId: details.placeId, name: details.name, address: details.address, position: details.position, primaryType: details.primaryType });
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
      googleRating: details.rating,
      googleRatingCount: details.userRatingCount,
      googleEditorialSummary: details.editorialSummary,
      googleReviews: details.reviews,
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
      googleRating: details.rating,
      googleRatingCount: details.userRatingCount,
      googleEditorialSummary: details.editorialSummary,
      googleReviews: details.reviews,
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
  const { name, whenAt, position, address, googlePlaceId } = req.body ?? {};
  const validPosition = position && typeof position.lat === 'number' && typeof position.lng === 'number';
  if (typeof name !== 'string' || !name.trim() || typeof whenAt !== 'string' || Number.isNaN(Date.parse(whenAt)) || !validPosition) {
    res.status(400).json({ error: 'name_whenAt_position_required' });
    return;
  }
  const created = createEvent({
    name: name.trim(),
    whenAt,
    position,
    ...(typeof address === 'string' && address.trim() ? { address: address.trim() } : {}),
    ...(typeof googlePlaceId === 'string' && googlePlaceId.trim() ? { googlePlaceId: googlePlaceId.trim() } : {}),
  });
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

const IMAGE_MEDIA_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);

/**
 * SPEC-027: same "operator confirms one by one, never applies itself" pattern as /admin/analyze
 * — this returns ephemeral suggestions, never persisted server-side (unlike SPEC-019's queues,
 * which exist because end users contribute asynchronously over days; here the operator uploads
 * and reviews in the same sitting, so there's nothing to keep around between requests).
 * Confirming a suggestion is a plain POST /admin/events with the same createEvent as always.
 */
adminRouter.post('/admin/events/from-image', async (req, res, next) => {
  try {
    const { image, mediaType, referenceDate } = req.body ?? {};
    if (typeof image !== 'string' || !image || !IMAGE_MEDIA_TYPES.has(mediaType)) {
      res.status(400).json({ error: 'image_and_mediaType_required' });
      return;
    }
    const refDate = typeof referenceDate === 'string' && !Number.isNaN(Date.parse(referenceDate)) ? new Date(referenceDate) : new Date();
    const events = await extractEventsFromImage({ imageBase64: image, mediaType });
    const suggestions = events.map((e) => ({ ...e, whenAt: resolveRelativeDate(e.whenRaw, refDate) }));
    res.json({ suggestions });
  } catch (err) {
    next(err);
  }
});

/**
 * SPEC-020: the static signed token this restaurant's printed/displayed QR encodes.
 * Deterministic from restaurantId + CHECKIN_SECRET — regenerating it here any time
 * shows the exact same QR, nothing to persist.
 */
adminRouter.get('/admin/restaurants/:id/checkin-token', (req, res) => {
  const restaurant = getRestaurantById(req.params.id);
  if (!restaurant) {
    res.status(404).json({ error: 'restaurant_not_found' });
    return;
  }
  res.json({ token: generateCheckinToken(restaurant.id) });
});

/** SPEC-023: real Caju Points consumed per restaurant — the system only reports, a human decides how to compensate the venue outside CajuEat. */
adminRouter.get('/admin/consumption', (_req, res) => {
  const catalog = getCatalog({ includeDemo: true, includeUnverified: true });
  const summary = getConsumptionSummary()
    .map((row) => {
      const restaurant = catalog.find((r) => r.id === row.restaurantId);
      return restaurant ? { ...row, restaurantName: restaurant.name } : null;
    })
    .filter((row): row is NonNullable<typeof row> => row !== null)
    .sort((a, b) => b.totalPoints - a.totalPoints);
  res.json(summary);
});

const VALID_PROMOTION_TYPES = new Set<PromotionType>(['liquidacion', 'lanzamiento']);

/**
 * SPEC-022: the operator loads a real, time-bound promo. It's never sent immediately here —
 * the scheduler tick (scheduler.ts) is the single path that actually pushes, exactly once its
 * real `from` is reached and never after `until`, reusing the same cooldown/dedup pattern as
 * every other notification type instead of a parallel "send now" branch.
 */
adminRouter.post('/admin/restaurants/:id/promotions', (req, res) => {
  const restaurant = getRestaurantById(req.params.id);
  if (!restaurant) {
    res.status(404).json({ error: 'restaurant_not_found' });
    return;
  }
  const { text, type, from, until } = req.body ?? {};
  const fromMs = Date.parse(from);
  const untilMs = Date.parse(until);
  if (typeof text !== 'string' || !text.trim() || !VALID_PROMOTION_TYPES.has(type) || Number.isNaN(fromMs) || Number.isNaN(untilMs) || fromMs >= untilMs) {
    res.status(400).json({ error: 'text_type_from_until_required' });
    return;
  }
  const promo = createPromotion({ restaurantId: restaurant.id, text: text.trim(), type, from: fromMs, until: untilMs });
  res.status(201).json(promo);
});

adminRouter.get('/admin/restaurants/:id/promotions', (req, res) => {
  res.json(getPromotionsForRestaurant(req.params.id));
});
