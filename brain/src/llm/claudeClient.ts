import Anthropic from '@anthropic-ai/sdk';
import type { ConversationTurn, Restaurant } from '../types.js';
import { createStringFieldExtractor } from './streamingJsonField.js';

/**
 * The only place the Brain talks to Claude (SPEC-002 Conversation, SPEC-005
 * explanations). Two narrow jobs, both grounded in the real catalog passed
 * in — never the model's training knowledge:
 *   - interpretQuery: free text -> which real restaurants + a reply + chips
 *   - explainRecommendation: a short, grounded "why" sentence
 * Haiku is the default (cheap, fast, plenty for short structured tasks);
 * override via ANTHROPIC_MODEL.
 */

const MODEL = process.env.ANTHROPIC_MODEL || 'claude-haiku-4-5';

let client: Anthropic | null = null;
function getClient(): Anthropic {
  if (!client) client = new Anthropic();
  return client;
}

function catalogForPrompt(catalog: Restaurant[]) {
  return catalog.map((r) => ({
    id: r.id,
    name: r.name,
    cuisine: r.cuisine,
    neighborhood: r.neighborhood,
    price: r.price,
    why: r.why,
    tags: r.tags,
    personality: r.personality,
    idealFor: r.idealFor,
    notFor: r.notFor,
    summary: r.summary,
  }));
}

export interface InterpretedQuery {
  restaurantIds: string[];
  reply: string;
  chips: string[];
}

const QUERY_SYSTEM_PROMPT = `Sos el Brain de CajuEat, un concierge gastronómico. Interpretás lo que pide el usuario y elegís,
ÚNICAMENTE de la lista de restaurantes reales que te paso, cuáles recomendar. Nunca inventes un restaurante que no
esté en la lista. Si nada calza bien, elegí la opción más cercana y decilo con honestidad en la respuesta. Respondé
en español, corto (1-3 oraciones), en tono cercano y con criterio, nunca como un buscador. Sugerí 2-3 chips de
seguimiento breves (ej: "¿Qué pedir?", "Comparar con otro").`;

/**
 * Streams the model's raw JSON as it's generated (SPEC-002: "el usuario debe
 * sentir que el Brain está razonando", never a spinner followed by a full
 * block). `onDelta` fires with just the growing `reply` field's plain text,
 * extracted incrementally from the still-generating JSON — restaurantIds and
 * chips are only read once the full response is in and schema-validated, same
 * grounding check as before.
 */
export async function interpretQuery(
  input: {
    text: string;
    history: ConversationTurn[];
    catalog: Restaurant[];
  },
  onDelta?: (chunk: string) => void,
): Promise<InterpretedQuery> {
  const historyText = input.history
    .slice(-6)
    .map((t) => `${t.role === 'user' ? 'Usuario' : 'Brain'}: ${t.text ?? ''}`)
    .join('\n');

  const stream = getClient().messages.stream({
    model: MODEL,
    max_tokens: 500,
    system: QUERY_SYSTEM_PROMPT,
    messages: [
      {
        role: 'user',
        content: `Restaurantes disponibles (JSON):\n${JSON.stringify(catalogForPrompt(input.catalog))}\n\nConversación previa:\n${historyText || '(sin historial)'}\n\nNuevo mensaje del usuario: "${input.text}"`,
      },
    ],
    output_config: {
      format: {
        type: 'json_schema',
        schema: {
          type: 'object',
          properties: {
            restaurantIds: { type: 'array', items: { type: 'string' } },
            reply: { type: 'string' },
            chips: { type: 'array', items: { type: 'string' } },
          },
          required: ['restaurantIds', 'reply', 'chips'],
          additionalProperties: false,
        },
      },
    },
  });

  const replyExtractor = createStringFieldExtractor('reply');
  for await (const event of stream) {
    if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
      const delta = replyExtractor.push(event.delta.text);
      if (delta) onDelta?.(delta);
    }
  }

  const finalMessage = await stream.finalMessage();
  const textBlock = finalMessage.content.find((b): b is Anthropic.TextBlock => b.type === 'text');
  const parsed = textBlock ? (JSON.parse(textBlock.text) as InterpretedQuery) : { restaurantIds: [], reply: '', chips: [] };

  // Never trust the model's IDs blindly — only real, known restaurants leave this function.
  const knownIds = new Set(input.catalog.map((r) => r.id));
  return { ...parsed, restaurantIds: parsed.restaurantIds.filter((id) => knownIds.has(id)) };
}

const EXPLAIN_SYSTEM_PROMPT = `Sos el Brain de CajuEat. Te doy una recomendación y las señales reales que la sostienen.
Escribí UNA sola oración corta y natural explicando por qué la elegiste, usando solo esas señales — nunca inventes
datos que no te di. Español, tono cercano, sin adornos de marketing.`;

export async function explainRecommendation(input: { restaurant: Restaurant; signals: string[] }): Promise<string> {
  const response = await getClient().messages.create({
    model: MODEL,
    max_tokens: 150,
    system: EXPLAIN_SYSTEM_PROMPT,
    messages: [
      {
        role: 'user',
        content: `Restaurante: ${input.restaurant.name} (${input.restaurant.cuisine}, ${input.restaurant.neighborhood}).\nSeñales reales: ${input.signals.join('; ')}`,
      },
    ],
  });
  const textBlock = response.content.find((b): b is Anthropic.TextBlock => b.type === 'text');
  return textBlock?.text.trim() ?? input.restaurant.why;
}

export interface NoteExtraction {
  restaurantId: string | null;
  learned: string;
}

const NOTE_SYSTEM_PROMPT = `Sos el Brain de CajuEat. El usuario te escribió una nota libre contando algo que
vivió o sabe sobre un lugar. Tu trabajo: identificar, ÚNICAMENTE de la lista de restaurantes reales que te paso,
a cuál se refiere la nota (o null si no se refiere a ninguno de la lista), y resumir en UNA oración corta qué
aprendiste, basándote solo en lo que el usuario escribió — nunca inventes datos que no estén en la nota. Español,
tono cercano.`;

export async function extractNoteKnowledge(input: { text: string; catalog: Restaurant[] }): Promise<NoteExtraction> {
  const response = await getClient().messages.create({
    model: MODEL,
    max_tokens: 300,
    system: NOTE_SYSTEM_PROMPT,
    messages: [
      {
        role: 'user',
        content: `Restaurantes disponibles (JSON):\n${JSON.stringify(catalogForPrompt(input.catalog))}\n\nNota del usuario: "${input.text}"`,
      },
    ],
    output_config: {
      format: {
        type: 'json_schema',
        schema: {
          type: 'object',
          properties: {
            restaurantId: { type: ['string', 'null'] },
            learned: { type: 'string' },
          },
          required: ['restaurantId', 'learned'],
          additionalProperties: false,
        },
      },
    },
  });

  const textBlock = response.content.find((b): b is Anthropic.TextBlock => b.type === 'text');
  const parsed = textBlock ? (JSON.parse(textBlock.text) as NoteExtraction) : { restaurantId: null, learned: '' };

  // Never trust the model's ID blindly — only a real, known restaurant leaves this function.
  const knownIds = new Set(input.catalog.map((r) => r.id));
  return { ...parsed, restaurantId: parsed.restaurantId && knownIds.has(parsed.restaurantId) ? parsed.restaurantId : null };
}

const CONVERSATION_KNOWLEDGE_SYSTEM_PROMPT = `Sos el Brain de CajuEat, en medio de una conversación normal — la
mayoría de los mensajes son preguntas o pedidos de recomendación, NO aportes de conocimiento nuevo. Tu única tarea
acá es detectar el caso excepcional: que el usuario, de paso, te haya contado algo real que vivió o sabe sobre un
lugar (una opinión, una experiencia, una corrección, un dato concreto) — nunca una pregunta ni un pedido, aunque
mencione un restaurante real. Si el mensaje es una pregunta o un pedido (ej. "recomendame algo cerca", "¿Osaka es
bueno para ir en pareja?"), devolvé restaurantId null y learned vacío — ahí no hay nada que aprender. Si realmente
compartió algo nuevo sobre un restaurante real de la lista, identificá cuál (o null si no está en la lista) y
resumí en UNA oración corta qué aprendiste, basándote solo en lo que escribió — nunca inventes. Español.`;

/** SPEC-004 "Desde conversación": a normal chat message can also teach the Brain something, without a separate capture flow — same grounded discipline as extractNoteKnowledge, but conservative about not treating questions as knowledge. */
export async function extractConversationKnowledge(input: { text: string; catalog: Restaurant[] }): Promise<NoteExtraction> {
  const response = await getClient().messages.create({
    model: MODEL,
    max_tokens: 200,
    system: CONVERSATION_KNOWLEDGE_SYSTEM_PROMPT,
    messages: [
      {
        role: 'user',
        content: `Restaurantes disponibles (JSON):\n${JSON.stringify(catalogForPrompt(input.catalog))}\n\nMensaje del usuario: "${input.text}"`,
      },
    ],
    output_config: {
      format: {
        type: 'json_schema',
        schema: {
          type: 'object',
          properties: {
            restaurantId: { type: ['string', 'null'] },
            learned: { type: 'string' },
          },
          required: ['restaurantId', 'learned'],
          additionalProperties: false,
        },
      },
    },
  });

  const textBlock = response.content.find((b): b is Anthropic.TextBlock => b.type === 'text');
  const parsed = textBlock ? (JSON.parse(textBlock.text) as NoteExtraction) : { restaurantId: null, learned: '' };

  const knownIds = new Set(input.catalog.map((r) => r.id));
  return { ...parsed, restaurantId: parsed.restaurantId && knownIds.has(parsed.restaurantId) ? parsed.restaurantId : null };
}

export interface CompareResult {
  recommendedId: string | null;
  reasoning: string;
  whenToChooseOther: string | null;
}

const COMPARE_SYSTEM_PROMPT = `Sos el Brain de CajuEat. El usuario ya redujo sus opciones a 2 o 3 restaurantes reales
y necesita ayuda para elegir — no queremos una tabla comparativa, queremos criterio. Siempre das una conclusión.
Si hay una opción claramente mejor para lo que pide (o para el contexto más probable si no especifica), elegila
como recomendedId y explicá por qué usando solo comida/ambiente/precio/personalidad/confianza reales — nunca
inventes datos fuera de lo que te paso. Sumá en qué caso la opción NO recomendada también sería válida (nunca la
descartes sin más). Si de verdad no hay evidencia suficiente para preferir una sobre otra, recomendedId debe ser
null y reasoning debe decirlo con honestidad, sugiriendo qué criterio ayudaría a desempatar. Español, tono cercano,
1-2 oraciones por campo.`;

export async function compareRestaurants(input: {
  restaurants: Restaurant[];
  question?: string;
}): Promise<CompareResult> {
  const response = await getClient().messages.create({
    model: MODEL,
    max_tokens: 400,
    system: COMPARE_SYSTEM_PROMPT,
    messages: [
      {
        role: 'user',
        content: `Restaurantes a comparar (JSON):\n${JSON.stringify(catalogForPrompt(input.restaurants))}\n\nPregunta del usuario: "${input.question ?? '(sin pregunta explícita — inferí el criterio más relevante del contexto)'}"`,
      },
    ],
    output_config: {
      format: {
        type: 'json_schema',
        schema: {
          type: 'object',
          properties: {
            recommendedId: { type: ['string', 'null'] },
            reasoning: { type: 'string' },
            whenToChooseOther: { type: ['string', 'null'] },
          },
          required: ['recommendedId', 'reasoning', 'whenToChooseOther'],
          additionalProperties: false,
        },
      },
    },
  });

  const textBlock = response.content.find((b): b is Anthropic.TextBlock => b.type === 'text');
  const parsed = textBlock
    ? (JSON.parse(textBlock.text) as CompareResult)
    : { recommendedId: null, reasoning: '', whenToChooseOther: null };

  // Never trust the model's ID blindly — only a real, known restaurant leaves this function.
  const knownIds = new Set(input.restaurants.map((r) => r.id));
  return { ...parsed, recommendedId: parsed.recommendedId && knownIds.has(parsed.recommendedId) ? parsed.recommendedId : null };
}

export interface PhotoExtraction {
  restaurantId: string | null;
  learned: string;
}

const PHOTO_SYSTEM_PROMPT = `Sos el Brain de CajuEat. El usuario te mandó una foto (menú, plato, ticket, carta de
vinos, fachada) sobre un lugar. Tu trabajo: identificar, ÚNICAMENTE de la lista de restaurantes reales que te paso,
a cuál se refiere la foto (o null si no aplica ninguno o no podés identificarlo), y resumir en UNA oración corta qué
aprendiste — basado únicamente en lo que la imagen realmente muestra, nunca inventando un plato o precio que no sea
legible. Si la imagen es ilegible o ambigua, decilo explícitamente en vez de adivinar. Español, tono cercano.`;

export async function extractPhotoKnowledge(input: {
  imageBase64: string;
  mediaType: 'image/jpeg' | 'image/png' | 'image/webp' | 'image/gif';
  catalog: Restaurant[];
}): Promise<PhotoExtraction> {
  const response = await getClient().messages.create({
    model: MODEL,
    max_tokens: 300,
    system: PHOTO_SYSTEM_PROMPT,
    messages: [
      {
        role: 'user',
        content: [
          { type: 'image', source: { type: 'base64', media_type: input.mediaType, data: input.imageBase64 } },
          {
            type: 'text',
            text: `Restaurantes disponibles (JSON):\n${JSON.stringify(catalogForPrompt(input.catalog))}\n\n¿Qué aprendiste de esta foto?`,
          },
        ],
      },
    ],
    output_config: {
      format: {
        type: 'json_schema',
        schema: {
          type: 'object',
          properties: {
            restaurantId: { type: ['string', 'null'] },
            learned: { type: 'string' },
          },
          required: ['restaurantId', 'learned'],
          additionalProperties: false,
        },
      },
    },
  });

  const textBlock = response.content.find((b): b is Anthropic.TextBlock => b.type === 'text');
  const parsed = textBlock ? (JSON.parse(textBlock.text) as PhotoExtraction) : { restaurantId: null, learned: '' };

  // Never trust the model's ID blindly — only a real, known restaurant leaves this function.
  const knownIds = new Set(input.catalog.map((r) => r.id));
  return { ...parsed, restaurantId: parsed.restaurantId && knownIds.has(parsed.restaurantId) ? parsed.restaurantId : null };
}

export interface CuratorMatch {
  restaurantId: string;
  restaurantName: string;
  claim: string;
  suggestedWeight: 'strong' | 'medium' | 'weak';
}

export interface CuratorAnalysis {
  matches: CuratorMatch[];
  unmatchedMentions: string[];
}

/** SPEC-018 Admin CMS: an operator pastes real curator/Reel text they already read — this never reads the platform itself. */
const CURATOR_SYSTEM_PROMPT = `Sos el Brain de CajuEat, en modo operador (Admin CMS). Un miembro del equipo pegó texto
real de un curador o post (caption, comentario, lista) que ya leyó — vos nunca leés la fuente original, solo este texto.
Tu trabajo: identificar, ÚNICAMENTE contra la lista de restaurantes reales que te paso, cuáles menciona el texto, con
qué afirmación concreta (claim) hace sobre cada uno y qué peso (strong/medium/weak) te parece razonable según cuán
específico y respaldado suena ese fragmento — nunca inventes un restaurante que no esté en la lista ni un dato que el
texto no diga. Si el texto menciona un lugar que no reconocés en la lista, incluilo en unmatchedMentions con el nombre
tal como aparece, nunca lo descartes en silencio. Español.`;

export async function analyzeCuratorContent(input: { text: string; catalog: Restaurant[] }): Promise<CuratorAnalysis> {
  const response = await getClient().messages.create({
    model: MODEL,
    max_tokens: 800,
    system: CURATOR_SYSTEM_PROMPT,
    messages: [
      {
        role: 'user',
        content: `Restaurantes disponibles (JSON):\n${JSON.stringify(catalogForPrompt(input.catalog))}\n\nTexto pegado por el operador:\n"""\n${input.text}\n"""`,
      },
    ],
    output_config: {
      format: {
        type: 'json_schema',
        schema: {
          type: 'object',
          properties: {
            matches: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  restaurantId: { type: 'string' },
                  claim: { type: 'string' },
                  suggestedWeight: { type: 'string', enum: ['strong', 'medium', 'weak'] },
                },
                required: ['restaurantId', 'claim', 'suggestedWeight'],
                additionalProperties: false,
              },
            },
            unmatchedMentions: { type: 'array', items: { type: 'string' } },
          },
          required: ['matches', 'unmatchedMentions'],
          additionalProperties: false,
        },
      },
    },
  });

  const textBlock = response.content.find((b): b is Anthropic.TextBlock => b.type === 'text');
  const parsed = textBlock
    ? (JSON.parse(textBlock.text) as {
        matches: { restaurantId: string; claim: string; suggestedWeight: 'strong' | 'medium' | 'weak' }[];
        unmatchedMentions: string[];
      })
    : { matches: [], unmatchedMentions: [] };

  // Grounding check: only a real, known restaurant can leave this function as a match.
  const byId = new Map(input.catalog.map((r) => [r.id, r]));
  const matches: CuratorMatch[] = parsed.matches
    .filter((m) => byId.has(m.restaurantId))
    .map((m) => ({
      restaurantId: m.restaurantId,
      restaurantName: byId.get(m.restaurantId)!.name,
      claim: m.claim,
      suggestedWeight: m.suggestedWeight,
    }));

  return { matches, unmatchedMentions: parsed.unmatchedMentions ?? [] };
}
