import { Router } from 'express';
import { getCatalog, getRestaurantById } from '../data/restaurants.js';
import { extractNoteKnowledge, extractPhotoKnowledge } from '../llm/claudeClient.js';
import { recordContribution } from '../memory/memoryStore.js';

export const captureRouter = Router();

const POINTS = 30;

const KIND_LABEL: Record<string, string> = {
  voice: 'una nota de voz',
  photo: 'una foto',
  link: 'un link',
  note: 'una nota',
};

const VALID_MEDIA_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);

captureRouter.post('/capture', async (req, res) => {
  const kind = typeof req.body?.kind === 'string' ? req.body.kind : 'note';
  const text = typeof req.body?.text === 'string' ? req.body.text.trim() : '';
  const image = typeof req.body?.image === 'string' ? req.body.image : '';
  const mediaType = typeof req.body?.mediaType === 'string' ? req.body.mediaType : '';
  const label = KIND_LABEL[kind] ?? 'conocimiento nuevo';

  // Texto libre (SPEC-004) y Voz ya transcripta (SPEC-015) pasan por el mismo camino — la voz,
  // una vez transcripta en el navegador, es texto, sin lógica nueva acá.
  if ((kind === 'note' || kind === 'voice') && text) {
    const extraction = await extractNoteKnowledge({ text, catalog: getCatalog() });
    const restaurant = extraction.restaurantId ? getRestaurantById(extraction.restaurantId) : undefined;
    const learned = extraction.learned || `Gracias por compartir ${label}. El Brain lo sumó a su conocimiento.`;
    recordContribution(restaurant ? `Aportaste ${label} sobre ${restaurant.name}` : `Aportaste ${label}`, POINTS);
    res.json({ learned, pointsAwarded: POINTS });
    return;
  }

  // Foto (SPEC-015): va directo por el mismo cliente de Claude vía content block de imagen — sin OCR ni proveedor nuevo.
  if (kind === 'photo' && image && VALID_MEDIA_TYPES.has(mediaType)) {
    const extraction = await extractPhotoKnowledge({
      imageBase64: image,
      mediaType: mediaType as 'image/jpeg' | 'image/png' | 'image/webp' | 'image/gif',
      catalog: getCatalog(),
    });
    const restaurant = extraction.restaurantId ? getRestaurantById(extraction.restaurantId) : undefined;
    const learned = extraction.learned || 'Gracias por compartir la foto. El Brain la sumó a su conocimiento.';
    recordContribution(restaurant ? `Aportaste una foto de ${restaurant.name}` : 'Aportaste una foto', POINTS);
    res.json({ learned, pointsAwarded: POINTS });
    return;
  }

  // Reel/TikTok/link: sigue como simulación honesta — requiere una decisión legal/de costo (SPEC-015), no técnica.
  const learned = `Gracias por compartir ${label}. El Brain lo sumó a su conocimiento sobre la zona.`;
  recordContribution(`Aportaste ${label}`, POINTS);
  res.json({ learned, pointsAwarded: POINTS });
});
