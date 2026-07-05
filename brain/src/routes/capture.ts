import { Router } from 'express';
import { getCatalog, getRestaurantById } from '../data/restaurants.js';
import { extractNoteKnowledge } from '../llm/claudeClient.js';
import { recordContribution } from '../memory/memoryStore.js';

export const captureRouter = Router();

const POINTS = 30;

const KIND_LABEL: Record<string, string> = {
  voice: 'una nota de voz',
  photo: 'una foto',
  link: 'un link',
  note: 'una nota',
};

captureRouter.post('/capture', async (req, res) => {
  const kind = typeof req.body?.kind === 'string' ? req.body.kind : 'note';
  const text = typeof req.body?.text === 'string' ? req.body.text.trim() : '';
  const label = KIND_LABEL[kind] ?? 'conocimiento nuevo';

  // Only "note" carries real free text today — voice/photo/reel/link stay honest simulations (no OCR/transcription/scraping yet).
  if (kind === 'note' && text) {
    const extraction = await extractNoteKnowledge({ text, catalog: getCatalog() });
    const restaurant = extraction.restaurantId ? getRestaurantById(extraction.restaurantId) : undefined;
    const learned = extraction.learned || `Gracias por compartir ${label}. El Brain lo sumó a su conocimiento.`;
    recordContribution(restaurant ? `Aportaste una nota sobre ${restaurant.name}` : 'Aportaste una nota', POINTS);
    res.json({ learned, pointsAwarded: POINTS });
    return;
  }

  const learned = `Gracias por compartir ${label}. El Brain lo sumó a su conocimiento sobre la zona.`;
  recordContribution(`Aportaste ${label}`, POINTS);
  res.json({ learned, pointsAwarded: POINTS });
});
