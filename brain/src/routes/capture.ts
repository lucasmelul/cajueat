import { Router } from 'express';
import { getCatalog, getRestaurantById } from '../data/restaurants.js';
import { extractNoteKnowledge, extractPhotoKnowledge } from '../llm/claudeClient.js';
import { fetchTikTokOEmbed, isTikTokUrl } from '../integrations/tiktok.js';
import { requireUserId } from '../middleware/identity.js';
import { checkAndConsumeUsage, recordContribution } from '../memory/memoryStore.js';
import { enqueueNewPlaceSuggestion, enqueuePendingContribution, enqueuePendingDishMention, enqueuePendingLink } from '../moderation/pendingContributionsStore.js';

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
    const contributionSource = kind === 'voice' ? 'voice' : 'note';
    recordContribution(req.userId!, restaurant ? `Aportaste ${label} sobre ${restaurant.name}` : `Aportaste ${label}`, POINTS);
    // SPEC-019: real, grounded knowledge about a real place goes to the moderation queue —
    // never straight to the shared catalog, no matter how confident the extraction is.
    if (restaurant && extraction.learned) {
      enqueuePendingContribution({ restaurantId: restaurant.id, claim: extraction.learned, source: contributionSource, contributorId: req.userId });
    } else if (extraction.newPlace?.name) {
      // Previously: a note about a place not yet in the catalog silently vanished here — no
      // admin trace, generic points only. Now it queues as a reviewable new-place suggestion.
      enqueueNewPlaceSuggestion({ ...extraction.newPlace, claim: extraction.learned, source: contributionSource, contributorId: req.userId });
    }
    // SPEC-025: a specific dish mention, always tied to an already-real restaurant — queued the same way.
    if (restaurant && extraction.dish?.name) {
      enqueuePendingDishMention({ restaurantId: restaurant.id, dishName: extraction.dish.name, category: extraction.dish.category, claim: extraction.dish.claim, source: contributionSource, contributorId: req.userId });
    }
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
    if (restaurant && extraction.learned) {
      enqueuePendingContribution({ restaurantId: restaurant.id, claim: extraction.learned, source: 'photo', contributorId: req.userId });
    } else if (extraction.newPlace?.name) {
      enqueueNewPlaceSuggestion({ ...extraction.newPlace, claim: extraction.learned, source: 'photo', contributorId: req.userId });
    }
    if (restaurant && extraction.dish?.name) {
      enqueuePendingDishMention({ restaurantId: restaurant.id, dishName: extraction.dish.name, category: extraction.dish.category, claim: extraction.dish.claim, source: 'photo', contributorId: req.userId });
    }
    res.json({ learned, pointsAwarded: POINTS });
    return;
  }

  // Reel/TikTok/link (SPEC-015): Instagram/YouTube dan una URL opaca — sin scraping real del
  // contenido (requiere una decisión legal/de costo, no técnica), así que esos nunca pasan por
  // Claude ni se aplican solos. TikTok es la excepción real: su oEmbed público (sin API key) da
  // el título/caption real del video, que sí alcanza para groundear una extracción como si fuera
  // una nota de texto — mismo camino de moderación que Nota/Foto, nunca aplicado directo.
  if (!text) {
    res.status(400).json({ error: 'link_required' });
    return;
  }

  if (isTikTokUrl(text)) {
    const usage = checkAndConsumeUsage(req.userId!, 'capture');
    if (usage.allowed) {
      const oembed = await fetchTikTokOEmbed(text);
      if (oembed) {
        const caption = [oembed.title, oembed.authorName ? `(@${oembed.authorName})` : ''].filter(Boolean).join(' ');
        const extraction = await extractNoteKnowledge({ text: caption, catalog: getCatalog() });
        const restaurant = extraction.restaurantId ? getRestaurantById(extraction.restaurantId) : undefined;
        const learned =
          extraction.learned ||
          'Leímos el video, pero no pudimos identificar un lugar real ahí — lo guardamos para que el equipo lo revise a mano.';
        recordContribution(req.userId!, restaurant ? `Aportaste un TikTok sobre ${restaurant.name}` : 'Aportaste un TikTok', POINTS);
        if (restaurant && extraction.learned) {
          enqueuePendingContribution({ restaurantId: restaurant.id, claim: extraction.learned, source: 'link', contributorId: req.userId });
        } else if (extraction.newPlace?.name) {
          enqueueNewPlaceSuggestion({ ...extraction.newPlace, claim: extraction.learned, source: 'link', contributorId: req.userId });
        } else {
          enqueuePendingLink({ url: text, contributorId: req.userId });
        }
        if (restaurant && extraction.dish?.name) {
          enqueuePendingDishMention({ restaurantId: restaurant.id, dishName: extraction.dish.name, category: extraction.dish.category, claim: extraction.dish.claim, source: 'link', contributorId: req.userId });
        }
        res.json({ learned, pointsAwarded: POINTS });
        return;
      }
    }
    // oEmbed failed (private/deleted video) or usage exhausted — fall through to the honest manual-review path below.
  }

  enqueuePendingLink({ url: text, contributorId: req.userId });
  const learned = `Gracias por compartir ${label}. Lo guardamos para que el equipo lo revise a mano — todavía no podemos leer el contenido de este link automáticamente.`;
  recordContribution(req.userId!, `Aportaste ${label}: ${text.slice(0, 80)}`, POINTS);
  res.json({ learned, pointsAwarded: POINTS, pending: true });
});
