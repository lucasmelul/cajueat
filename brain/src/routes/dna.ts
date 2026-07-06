import { Router } from 'express';
import { requireUserId } from '../middleware/identity.js';
import { addDnaTag, getProfile, removeDnaTag } from '../memory/memoryStore.js';

export const dnaRouter = Router();

dnaRouter.get('/dna', requireUserId, (req, res) => {
  res.json(getProfile(req.userId!).dna);
});

dnaRouter.post('/dna', requireUserId, (req, res) => {
  const label = typeof req.body?.label === 'string' ? req.body.label.trim() : '';
  if (!label) return res.status(400).json({ error: 'label_required' });
  res.json(addDnaTag(req.userId!, label));
});

dnaRouter.delete('/dna/:id', requireUserId, (req, res) => {
  removeDnaTag(req.userId!, req.params.id);
  res.json({ ok: true });
});
