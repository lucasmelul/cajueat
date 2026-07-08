import { Router } from 'express';
import { verifyCheckinToken } from '../checkin/checkinTokens.js';
import { getCheckinsForUser, hasCheckedInToday, hasEverCheckedIn, recordCheckin } from '../checkin/checkinStore.js';
import { lastConsumptionAt, recordConsumption } from '../checkin/consumptionStore.js';
import { getCatalog, getRestaurantById } from '../data/restaurants.js';
import { haversineKm } from '../geo/geo.js';
import { requireUserId } from '../middleware/identity.js';
import { getProfile, recordContribution, setLastKnownLocation, spendCajuPoints } from '../memory/memoryStore.js';
import type { GeoPoint } from '../types.js';

export const checkinRouter = Router();

// Placeholders, same documented-open-decision pattern as NEAR_RADIUS_KM (SPEC-001) —
// adjust with real fraud/usage data, not guessed up front (SPEC-020 Open Questions).
const CHECKIN_RADIUS_KM = 0.1;
const DISCOVERY_POINTS = 50;
const REDEEM_COOLDOWN_MS = 15 * 24 * 60 * 60_000;

function isValidPosition(value: unknown): value is GeoPoint {
  return !!value && typeof (value as GeoPoint).lat === 'number' && typeof (value as GeoPoint).lng === 'number';
}

checkinRouter.post('/checkin', requireUserId, (req, res) => {
  const { token, position, mode, points } = req.body ?? {};
  if (typeof token !== 'string' || !isValidPosition(position)) {
    res.status(400).json({ error: 'token_and_position_required' });
    return;
  }
  const restaurantId = verifyCheckinToken(token);
  if (!restaurantId) {
    res.status(401).json({ error: 'invalid_token' });
    return;
  }
  const restaurant = getRestaurantById(restaurantId);
  if (!restaurant) {
    res.status(404).json({ error: 'restaurant_not_found' });
    return;
  }

  // SPEC-022: a check-in/redeem scan always carries real geolocation — remember it as the
  // user's last known location for promo targeting, same reuse as the "Cerca" chip.
  setLastKnownLocation(req.userId!, position);

  // Real signal, never trusted from the client beyond the raw coordinates it reports —
  // the distance check itself is what makes a faked position hard to pass silently.
  const distanceKm = haversineKm(position, restaurant.position);
  if (distanceKm > CHECKIN_RADIUS_KM) {
    res.status(422).json({ error: 'out_of_range' });
    return;
  }

  if (mode === 'redeem') {
    const last = lastConsumptionAt(req.userId!, restaurantId);
    if (last && Date.now() - last < REDEEM_COOLDOWN_MS) {
      res.status(409).json({ error: 'cooldown_active', retryAt: last + REDEEM_COOLDOWN_MS });
      return;
    }
    const balance = getProfile(req.userId!).user.cajuPoints;

    // Two-phase on purpose: the UI validates the real scan (token + geolocation) and shows
    // the "elegí cuántos puntos" stepper against the real balance BEFORE the user commits to
    // an amount — `points` omitted means "just validate and tell me the balance", never spend.
    if (points === undefined) {
      res.json({ restaurant, balance });
      return;
    }

    const pointsSpent = Number(points);
    if (!Number.isInteger(pointsSpent) || pointsSpent <= 0) {
      res.status(400).json({ error: 'points_required' });
      return;
    }
    if (pointsSpent > balance) {
      res.status(422).json({ error: 'insufficient_points', balance });
      return;
    }
    spendCajuPoints(req.userId!, pointsSpent);
    recordConsumption({ userId: req.userId!, restaurantId, pointsSpent });
    res.json({ restaurant, pointsSpent, remainingBalance: balance - pointsSpent });
    return;
  }

  // mode === 'checkin' (default)
  if (hasCheckedInToday(req.userId!, restaurantId)) {
    res.status(409).json({ error: 'already_checked_in_today' });
    return;
  }
  const firstVisit = !hasEverCheckedIn(req.userId!, restaurantId);
  recordCheckin({ userId: req.userId!, restaurantId, position });
  const pointsAwarded = firstVisit ? DISCOVERY_POINTS : 0;
  if (firstVisit) recordContribution(req.userId!, `Descubriste ${restaurant.name}`, DISCOVERY_POINTS);
  res.json({ restaurant, pointsAwarded, firstVisit });
});

/** SPEC-021 Pasaporte: visited (real check-ins only) + pending grouped by neighborhood, against the real non-demo catalog. */
checkinRouter.get('/passport', requireUserId, (req, res) => {
  const catalog = getCatalog();
  const checkins = getCheckinsForUser(req.userId!);
  const firstVisitByRestaurant = new Map<string, number>();
  for (const c of checkins) {
    if (!firstVisitByRestaurant.has(c.restaurantId)) firstVisitByRestaurant.set(c.restaurantId, c.scannedAt);
  }

  const visited = catalog
    .filter((r) => firstVisitByRestaurant.has(r.id))
    .map((r) => ({ restaurant: r, firstVisitAt: firstVisitByRestaurant.get(r.id)! }));
  const pending = catalog.filter((r) => !firstVisitByRestaurant.has(r.id));

  const byNeighborhood = new Map<string, typeof pending>();
  for (const r of pending) {
    const list = byNeighborhood.get(r.neighborhood) ?? [];
    list.push(r);
    byNeighborhood.set(r.neighborhood, list);
  }
  const pendingByNeighborhood = [...byNeighborhood.entries()]
    .map(([neighborhood, restaurants]) => ({ neighborhood, restaurants }))
    .sort((a, b) => b.restaurants.length - a.restaurants.length);

  res.json({ catalogSize: catalog.length, visited, pendingByNeighborhood });
});
