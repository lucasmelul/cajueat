import { Router } from 'express';
import { getRestaurantById } from '../data/restaurants.js';
import { requireUserId } from '../middleware/identity.js';
import { markFeedbackGiven, recordContribution } from '../memory/memoryStore.js';

export const feedbackRouter = Router();

const POINTS = 45;

feedbackRouter.post('/feedback', requireUserId, (req, res) => {
  const { restaurantId, answers } = req.body ?? {};
  const restaurant = typeof restaurantId === 'string' ? getRestaurantById(restaurantId) : undefined;
  const answerList: string[] = Array.isArray(answers) ? answers.filter((a) => typeof a === 'string') : [];

  const place = restaurant?.name ?? 'ese lugar';
  const learned = answerList.length
    ? `Aprendimos que tu experiencia en ${place} fue: ${answerList.join(', ')}.`
    : `Gracias por contarnos sobre tu visita a ${place}.`;

  recordContribution(req.userId!, `Feedback sobre ${place}`, POINTS);
  if (restaurant) markFeedbackGiven(req.userId!, restaurant.id);
  res.json({ learned, pointsAwarded: POINTS });
});
