import { Router } from 'express';
import { addDnaTag, getProfile, removeDnaTag } from '../memory/memoryStore.js';

export const dnaRouter = Router();

dnaRouter.get('/dna', (_req, res) => {
  res.json(getProfile().dna);
});

dnaRouter.post('/dna', (req, res) => {
  const label = typeof req.body?.label === 'string' ? req.body.label.trim() : '';
  if (!label) return res.status(400).json({ error: 'label_required' });
  res.json(addDnaTag(label));
});

dnaRouter.delete('/dna/:id', (req, res) => {
  removeDnaTag(req.params.id);
  res.json({ ok: true });
});
