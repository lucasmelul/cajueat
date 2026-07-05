import { Router } from 'express';
import { recordContribution } from '../memory/memoryStore.js';

export const captureRouter = Router();

const POINTS = 30;

const KIND_LABEL: Record<string, string> = {
  voice: 'una nota de voz',
  photo: 'una foto',
  link: 'un link',
  note: 'una nota',
};

captureRouter.post('/capture', (req, res) => {
  const kind = typeof req.body?.kind === 'string' ? req.body.kind : 'note';
  const label = KIND_LABEL[kind] ?? 'conocimiento nuevo';
  const learned = `Gracias por compartir ${label}. El Brain lo sumó a su conocimiento sobre la zona.`;

  recordContribution(`Aportaste ${label}`, POINTS);
  res.json({ learned, pointsAwarded: POINTS });
});
