import { Router } from 'express';
import { hasEverCheckedIn } from '../checkin/checkinStore.js';
import { getRestaurantById } from '../data/restaurants.js';
import { requireUserId } from '../middleware/identity.js';
import { markFeedbackGiven, recordContribution } from '../memory/memoryStore.js';

export const feedbackRouter = Router();

const POINTS = 45;

feedbackRouter.post('/feedback', requireUserId, (req, res) => {
  const { restaurantId, answers } = req.body ?? {};
  // includeUnverified: true — a restaurant reachable only via a real prior check-in (SPEC-020,
  // e.g. one that hasn't cleared the public evidence bar yet) must still resolve here, otherwise
  // `restaurant` silently becomes undefined and the check-in gate below never fires at all.
  const restaurant = typeof restaurantId === 'string' ? getRestaurantById(restaurantId, { includeUnverified: true }) : undefined;
  const answerList: string[] = Array.isArray(answers) ? answers.filter((a) => typeof a === 'string') : [];

  // SPEC-020 Acceptance Criteria: "sin excepción, ni siquiera para el operador" — a review
  // always requires a real, prior check-in in that same restaurant.
  if (restaurant && !hasEverCheckedIn(req.userId!, restaurant.id)) {
    res.status(403).json({ error: 'checkin_required' });
    return;
  }

  const place = restaurant?.name ?? 'ese lugar';
  const learned = answerList.length
    ? `Aprendimos que tu experiencia en ${place} fue: ${answerList.join(', ')}.`
    : `Gracias por contarnos sobre tu visita a ${place}.`;

  recordContribution(req.userId!, `Feedback sobre ${place}`, POINTS);
  if (restaurant) markFeedbackGiven(req.userId!, restaurant.id);
  res.json({ learned, pointsAwarded: POINTS });
});
