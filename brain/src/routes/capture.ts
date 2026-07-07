import { Router } from 'express';
import { getCatalog, getRestaurantById } from '../data/restaurants.js';
import { extractNoteKnowledge, extractPhotoKnowledge } from '../llm/claudeClient.js';
import { requireUserId } from '../middleware/identity.js';
import { checkAndConsumeUsage, recordContribution } from '../memory/memoryStore.js';

export const captureRouter = Router();

const POINTS = 30;

const KIND_LABEL: Record<string, string> = {
  voice: 'una nota de voz',
  photo: 'una foto',
  link: 'un link',
  note: 'una nota',
};

const VALID_MEDIA_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);
const CLAUDE_BACKED_KINDS = new Set(['note', 'voice', 'photo']);

captureRouter.post('/capture', requireUserId, async (req, res) => {
  const kind = typeof req.body?.kind === 'string' ? req.body.kind : 'note';
  const text = typeof req.body?.text === 'string' ? req.body.text.trim() : '';
  const image = typeof req.body?.image === 'string' ? req.body.image : '';
  const mediaType = typeof req.body?.mediaType === 'string' ? req.body.mediaType : '';
  const label = KIND_LABEL[kind] ?? 'conocimiento nuevo';

  // SPEC-013 abuse gate: only the Claude-backed kinds have real cost per request — link/reel stay unmetered.
  if (CLAUDE_BACKED_KINDS.has(kind)) {
    const usage = checkAndConsumeUsage(req.userId!, 'capture');
    if (!usage.allowed) return res.status(429).json({ error: 'anon_limit_reached', requiresSync: true });
  }

  // Texto libre (SPEC-004) y Voz ya transcripta (SPEC-015) pasan por el mismo camino — la voz,
  // una vez transcripta en el navegador, es texto, sin lógica nueva acá.
  if ((kind === 'note' || kind === 'voice') && text) {
    const extraction = await extractNoteKnowledge({ text, catalog: getCatalog() });
    const restaurant = extraction.restaurantId ? getRestaurantById(extraction.restaurantId) : undefined;
    const learned = extraction.learned || `Gracias por compartir ${label}. El Brain lo sumó a su conocimiento.`;
    recordContribution(req.userId!, restaurant ? `Aportaste ${label} sobre ${restaurant.name}` : `Aportaste ${label}`, POINTS);
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
    recordContribution(req.userId!, restaurant ? `Aportaste una foto de ${restaurant.name}` : 'Aportaste una foto', POINTS);
    res.json({ learned, pointsAwarded: POINTS });
    return;
  }

  // Reel/TikTok/link: sigue como simulación honesta — requiere una decisión legal/de costo (SPEC-015), no técnica.
  // El link en sí ahora sí llega y queda registrado (antes se descartaba en el cliente) — lo que sigue sin
  // pasar es el scraping real del contenido, no la recepción del link.
  const learned = `Gracias por compartir ${label}. El Brain lo sumó a su conocimiento sobre la zona.`;
  recordContribution(req.userId!, text ? `Aportaste ${label}: ${text.slice(0, 80)}` : `Aportaste ${label}`, POINTS);
  res.json({ learned, pointsAwarded: POINTS });
});
