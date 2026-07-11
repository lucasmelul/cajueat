import Anthropic from '@anthropic-ai/sdk';
import type { ConversationTurn, Dish, Restaurant } from '../types.js';
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

/**
 * Every call site below used to fall back to a hardcoded empty result (`{ restaurantIds: [],
 * reply: '', chips: [] }` and friends) whenever Claude didn't return a text block — which made
 * a real LLM failure look like a successful-but-empty answer instead of an actual error. This
 * throws instead, so a Claude failure surfaces as a real 500 through each route's existing
 * `try/catch -> next(err)` handler rather than a silent, misleading "no results."
 */
function requireTextBlock(content: Anthropic.ContentBlock[]): Anthropic.TextBlock {
  const textBlock = content.find((b): b is Anthropic.TextBlock => b.type === 'text');
  if (!textBlock) throw new Error('Claude response had no text block');
  return textBlock;
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
    // SPEC-026-style external signal: Google's own words, never a Source, never fed into
    // computeTrust — passed only so Conversation can ground an answer in what Google says
    // ("¿qué dicen las reviews sobre el ruido?") without inventing anything.
    ...(r.googleEditorialSummary ? { googleEditorialSummary: r.googleEditorialSummary } : {}),
    ...(r.googleReviews && r.googleReviews.length > 0
      ? { googleReviews: r.googleReviews.slice(0, 5).map((rv) => ({ text: rv.text.slice(0, 400), rating: rv.rating })) }
      : {}),
  }));
}

/** SPEC-025: only the fields Conversation actually needs to answer a dish/category question grounded in real evidence — never the raw sources array. */
function dishesForPrompt(dishes: Dish[]) {
  return dishes.map((d) => ({ name: d.name, category: d.category, restaurantId: d.restaurantId, trust: d.trust }));
}

export interface InterpretedQuery {
  restaurantIds: string[];
  reply: string;
  chips: string[];
  /** true si `reply` está groundeada en el catálogo/platos reales pasados; false si la pregunta no tiene nada
   *  relevante ahí (ej. no es sobre gastronomía, o es sobre un lugar/dato que Lugarcito no tiene cargado). Cuando
   *  es false, `interpretQuery` intenta un fallback de búsqueda web real — nunca inventa la respuesta él mismo. */
  foundInCatalog: boolean;
}

const QUERY_SYSTEM_PROMPT = `Sos Lugarcito, un concierge gastronómico. Interpretás lo que pide el usuario y elegís,
ÚNICAMENTE de la lista de restaurantes reales que te paso, cuáles recomendar. Nunca inventes un restaurante que no
esté en la lista. Si nada calza bien, elegí la opción más cercana y decilo con honestidad en la respuesta.

También te paso una lista de platos reales cargados (SPEC-025), cada uno con el restaurante real al que pertenece y
su nivel de confianza. Si la pregunta es sobre un plato o categoría puntual (ej. "¿dónde como el mejor chirashi?",
"la mejor torta vasca"), respondé usando ÚNICAMENTE esa lista de platos — nunca asumas que un restaurante sirve algo
por su tipo de cocina o nombre si no está cargado como plato real. Si ningún plato cargado coincide con lo que pide,
decilo con honestidad explícita en la respuesta (ej. "todavía no tengo información sobre eso") en vez de recomendar
un restaurante genérico como si fuera una respuesta real a esa pregunta.

Algunos restaurantes también traen googleEditorialSummary y/o googleReviews (texto real de Google, nunca inventado
por vos). Si la pregunta apunta a eso (ej. "¿qué dicen las reviews?", "¿es ruidoso?"), podés usar ese contenido —
pero siempre aclarando que es una opinión externa de Google, nunca la confianza propia de Lugarcito, y nunca
citando algo que no esté literalmente en esos campos.

Marcá foundInCatalog en false únicamente cuando tu reply es un "no tengo esto" honesto porque nada en la lista de
restaurantes o platos es relevante para lo que pidió — no lo marques false solo porque elegiste la opción "más
cercana" en vez de una perfecta. Con foundInCatalog en true incluí igual el reply normal.

Respondé en español, corto (1-3 oraciones), en tono cercano y con criterio, nunca como un buscador. Sugerí 2-3 chips
de seguimiento breves (ej: "¿Qué pedir?", "Comparar con otro").`;

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
    dishes?: Dish[];
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
        content: `Restaurantes disponibles (JSON):\n${JSON.stringify(catalogForPrompt(input.catalog))}\n\nPlatos cargados (JSON):\n${JSON.stringify(dishesForPrompt(input.dishes ?? []))}\n\nConversación previa:\n${historyText || '(sin historial)'}\n\nNuevo mensaje del usuario: "${input.text}"`,
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
            foundInCatalog: { type: 'boolean' },
          },
          required: ['restaurantIds', 'reply', 'chips', 'foundInCatalog'],
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
  const parsed = JSON.parse(requireTextBlock(finalMessage.content).text) as InterpretedQuery;

  // Never trust the model's IDs blindly — only real, known restaurants leave this function.
  const knownIds = new Set(input.catalog.map((r) => r.id));
  const grounded = { ...parsed, restaurantIds: parsed.restaurantIds.filter((id) => knownIds.has(id)) };
  if (grounded.foundInCatalog) return grounded;

  // El catálogo/platos no tenían nada relevante — último recurso: una búsqueda web real, nunca
  // inventada por el modelo. La aclaración de que es información externa/no verificada por
  // Lugarcito se agrega acá en código, no queda librada a que el modelo se acuerde de escribirla
  // cada vez (mismo criterio que "según Google" en las reviews: el disclaimer nunca es una
  // decisión del LLM). El "no tengo esto" que ya se streameó queda como primera parte honesta.
  const disclaimer = 'No verificado por Lugarcito — resultado de una búsqueda web:\n';
  onDelta?.(`\n\n${disclaimer}`);
  const webAnswer = await answerFromWeb(input.text, onDelta);
  return { ...grounded, reply: webAnswer ? `${grounded.reply}\n\n${disclaimer}${webAnswer}` : grounded.reply };
}

const WEB_FALLBACK_SYSTEM_PROMPT = `Sos Lugarcito. La pregunta del usuario no tiene nada relevante en el catálogo
interno de restaurantes/platos reales de Lugarcito. Buscá en la web una respuesta útil y concreta.

Reglas:
- No hace falta que aclares que es información externa — eso ya lo antepone el sistema. Andá directo al dato.
- Mencioná de dónde sale (el sitio/dominio real que encontraste en la búsqueda), en una frase corta.
- Español, 1-3 oraciones, tono cercano.
- Si la búsqueda tampoco encuentra nada útil, decilo con honestidad — nunca inventes una respuesta.`;

/** Último recurso de SPEC-002 cuando `interpretQuery` no groundeó nada: una búsqueda web real vía la
 *  tool nativa de Claude, nunca el conocimiento de entrenamiento del modelo solo. Separada de
 *  `interpretQuery` a propósito — sin JSON schema, para poder usar la tool de búsqueda sin pelear
 *  con el output estructurado. */
export async function answerFromWeb(text: string, onDelta?: (chunk: string) => void): Promise<string> {
  const stream = getClient().messages.stream({
    model: MODEL,
    max_tokens: 400,
    system: WEB_FALLBACK_SYSTEM_PROMPT,
    messages: [{ role: 'user', content: text }],
    tools: [{ type: 'web_search_20250305', name: 'web_search', max_uses: 3 }],
  });

  let full = '';
  for await (const event of stream) {
    if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
      full += event.delta.text;
      onDelta?.(event.delta.text);
    }
  }
  await stream.finalMessage();
  return full.trim();
}

const EXPLAIN_SYSTEM_PROMPT = `Sos Lugarcito. Te doy una recomendación y las señales reales que la sostienen.
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
  return requireTextBlock(response.content).text.trim();
}

/** A place the user described that isn't in the catalog yet — fields are only ever what the text actually said, empty string means genuinely unstated (an operator fills gaps before it becomes real, never Claude guessing). */
export interface NewPlaceInfo {
  name: string;
  cuisine: string;
  neighborhood: string;
}

const NEW_PLACE_SCHEMA = {
  type: ['object', 'null'],
  properties: {
    name: { type: 'string' },
    cuisine: { type: 'string' },
    neighborhood: { type: 'string' },
  },
  required: ['name', 'cuisine', 'neighborhood'],
  additionalProperties: false,
} as const;

/** SPEC-025: a specific plate the text/photo names — only meaningful attached to a real, already-matched restaurant, never a brand-new place (nothing to attach a dish claim to yet). */
export interface DishMention {
  name: string;
  category: string;
  claim: string;
}

const DISH_MENTION_SCHEMA = {
  type: ['object', 'null'],
  properties: {
    name: { type: 'string' },
    category: { type: 'string' },
    claim: { type: 'string' },
  },
  required: ['name', 'category', 'claim'],
  additionalProperties: false,
} as const;

const DISH_MENTION_INSTRUCTIONS = `Si además el texto nombra un plato específico de ese restaurante (ej. "el tiradito
de toro de Osaka", "la torta vasca estaba espectacular"), completá dish con name (el plato tal cual se nombra),
category (el tipo de plato, ej. "torta vasca", "sushi", "brunch") y claim (qué se dice de ese plato) — nunca lo
completes si el texto no nombra un plato concreto, y nunca lo completes si no identificaste un restaurante real de
la lista (dish solo tiene sentido atado a un restaurante real ya confirmado).`;

export interface NoteExtraction {
  restaurantId: string | null;
  learned: string;
  /** Set only when the note is clearly about a real place that ISN'T in the catalog — the previous behavior silently dropped this case entirely. */
  newPlace: NewPlaceInfo | null;
  dish: DishMention | null;
}

const NOTE_SYSTEM_PROMPT = `Sos Lugarcito. El usuario te escribió una nota libre contando algo que
vivió o sabe sobre un lugar. Tu trabajo: identificar a cuál restaurante se refiere. Primero buscá si es alguno de
la lista de restaurantes reales que te paso — si es así, devolvé su restaurantId y newPlace null. Si la nota
claramente habla de un lugar real que NO está en esa lista (un lugar nuevo que el usuario está recomendando),
devolvé restaurantId null y completá newPlace con lo que el texto realmente diga: name siempre que lo mencione,
cuisine y neighborhood solo si el texto los deja claro (si no los dice, dejalos como string vacío — nunca
inventes un barrio o tipo de cocina que la nota no mencionó). Si la nota no habla de ningún lugar concreto
(ninguno de la lista ni uno nuevo), devolvé restaurantId null y newPlace null. ${DISH_MENTION_INSTRUCTIONS} Resumí
siempre en UNA oración corta qué aprendiste, basándote solo en lo que el usuario escribió — nunca inventes datos
que no estén en la nota. Español, tono cercano.`;

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
            newPlace: NEW_PLACE_SCHEMA,
            dish: DISH_MENTION_SCHEMA,
          },
          required: ['restaurantId', 'learned', 'newPlace', 'dish'],
          additionalProperties: false,
        },
      },
    },
  });

  const parsed = JSON.parse(requireTextBlock(response.content).text) as NoteExtraction;

  // Never trust the model's ID blindly — only a real, known restaurant leaves this function.
  const knownIds = new Set(input.catalog.map((r) => r.id));
  const restaurantId = parsed.restaurantId && knownIds.has(parsed.restaurantId) ? parsed.restaurantId : null;
  // Mutually exclusive by construction — a matched restaurant never also carries a newPlace suggestion, and a dish never survives without a matched restaurant.
  return { ...parsed, restaurantId, newPlace: restaurantId ? null : parsed.newPlace, dish: restaurantId ? parsed.dish : null };
}

const CONVERSATION_KNOWLEDGE_SYSTEM_PROMPT = `Sos Lugarcito, en medio de una conversación normal — la
mayoría de los mensajes son preguntas o pedidos de recomendación, NO aportes de conocimiento nuevo. Tu única tarea
acá es detectar el caso excepcional: que el usuario, de paso, te haya contado algo real que vivió o sabe sobre un
lugar (una opinión, una experiencia, una corrección, un dato concreto, o una recomendación de un lugar nuevo) —
nunca una pregunta ni un pedido. Si el mensaje es una pregunta o un pedido (ej. "recomendame algo cerca", "¿Osaka
es bueno para ir en pareja?"), devolvé restaurantId null, newPlace null y learned vacío — ahí no hay nada que
aprender. Si realmente compartió algo nuevo sobre un restaurante real de la lista, identificá cuál y devolvé
newPlace null. Si compartió algo sobre un lugar real que NO está en la lista (por ejemplo, recomendándolo), devolvé
restaurantId null y completá newPlace con lo que el mensaje realmente diga (name siempre, cuisine/neighborhood
solo si los menciona, string vacío si no — nunca inventes). Resumí siempre en UNA oración corta qué aprendiste,
basándote solo en lo que escribió — nunca inventes. Español.`;

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
            newPlace: NEW_PLACE_SCHEMA,
          },
          required: ['restaurantId', 'learned', 'newPlace'],
          additionalProperties: false,
        },
      },
    },
  });

  const parsed = JSON.parse(requireTextBlock(response.content).text) as NoteExtraction;

  const knownIds = new Set(input.catalog.map((r) => r.id));
  const restaurantId = parsed.restaurantId && knownIds.has(parsed.restaurantId) ? parsed.restaurantId : null;
  return { ...parsed, restaurantId, newPlace: restaurantId ? null : parsed.newPlace };
}

export interface CompareResult {
  recommendedId: string | null;
  reasoning: string;
  whenToChooseOther: string | null;
}

const COMPARE_SYSTEM_PROMPT = `Sos Lugarcito. El usuario ya redujo sus opciones a 2 o 3 restaurantes reales
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

  const parsed = JSON.parse(requireTextBlock(response.content).text) as CompareResult;

  // Never trust the model's ID blindly — only a real, known restaurant leaves this function.
  const knownIds = new Set(input.restaurants.map((r) => r.id));
  return { ...parsed, recommendedId: parsed.recommendedId && knownIds.has(parsed.recommendedId) ? parsed.recommendedId : null };
}

export interface PhotoExtraction {
  restaurantId: string | null;
  learned: string;
  /** Set only when the photo (e.g. a storefront sign or a menu header) clearly names a real place that ISN'T in the catalog. */
  newPlace: NewPlaceInfo | null;
  dish: DishMention | null;
}

const PHOTO_SYSTEM_PROMPT = `Sos Lugarcito. El usuario te mandó una foto (menú, plato, ticket, carta de
vinos, fachada) sobre un lugar. Tu trabajo: identificar a cuál restaurante se refiere. Primero buscá si es alguno
de la lista de restaurantes reales que te paso — si es así, devolvé su restaurantId y newPlace null. Si la foto
deja ver claramente el nombre de un lugar real que NO está en esa lista (ej. un cartel, el encabezado de un menú),
devolvé restaurantId null y completá newPlace con name (y cuisine/neighborhood solo si son evidentes en la imagen,
string vacío si no) — nunca inventes un dato que la foto no muestre. Si no podés identificar ningún lugar, devolvé
restaurantId null y newPlace null. ${DISH_MENTION_INSTRUCTIONS} Resumí siempre en UNA oración corta qué
aprendiste — basado únicamente en lo que la imagen realmente muestra, nunca inventando un plato o precio que no
sea legible. Si la imagen es ilegible o ambigua, decilo explícitamente en vez de adivinar. Español, tono cercano.`;

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
            newPlace: NEW_PLACE_SCHEMA,
            dish: DISH_MENTION_SCHEMA,
          },
          required: ['restaurantId', 'learned', 'newPlace', 'dish'],
          additionalProperties: false,
        },
      },
    },
  });

  const parsed = JSON.parse(requireTextBlock(response.content).text) as PhotoExtraction;

  // Never trust the model's ID blindly — only a real, known restaurant leaves this function.
  const knownIds = new Set(input.catalog.map((r) => r.id));
  const restaurantId = parsed.restaurantId && knownIds.has(parsed.restaurantId) ? parsed.restaurantId : null;
  return { ...parsed, restaurantId, newPlace: restaurantId ? null : parsed.newPlace, dish: restaurantId ? parsed.dish : null };
}

export interface CuratorMatch {
  restaurantId: string;
  restaurantName: string;
  claim: string;
  suggestedWeight: 'strong' | 'medium' | 'weak';
}

/** A place the pasted text mentions that isn't in the catalog yet — same grounding discipline as NewPlaceInfo, plus the claim the text actually makes about it (an operator reviews before it becomes a real restaurant + source). */
export interface NewRestaurantMention {
  name: string;
  cuisine: string;
  neighborhood: string;
  claim: string;
}

/** SPEC-025: a specific dish the pasted text names for one of the matched restaurants — same grounding as CuratorMatch, only ever attached to a restaurant already confirmed real. */
export interface CuratorDishMatch {
  restaurantId: string;
  restaurantName: string;
  dishName: string;
  category: string;
  claim: string;
  suggestedWeight: 'strong' | 'medium' | 'weak';
}

export interface CuratorAnalysis {
  matches: CuratorMatch[];
  newRestaurants: NewRestaurantMention[];
  dishMatches: CuratorDishMatch[];
}

/** SPEC-018 Admin CMS: an operator pastes real curator/Reel text they already read — this never reads the platform itself. */
const CURATOR_SYSTEM_PROMPT = `Sos el Brain de Lugarcito, en modo operador (Admin CMS). Un miembro del equipo pegó texto
real de un curador o post (caption, comentario, lista) que ya leyó — vos nunca leés la fuente original, solo este texto.
Tu trabajo: identificar todos los lugares reales que el texto menciona. Para cada uno, primero buscá si está en la
lista de restaurantes reales que te paso — si es así, va en matches, con la afirmación concreta (claim) que el texto
hace sobre él y qué peso (strong/medium/weak) te parece razonable según cuán específico y respaldado suena ese
fragmento. Si el texto menciona un lugar real que NO está en esa lista, va en newRestaurants con su name, y
cuisine/neighborhood solo si el texto los deja claro (string vacío si no) y el claim que el texto hace sobre él —
nunca inventes un dato que el texto no diga, y nunca descartes en silencio un lugar mencionado. Si además el texto
nombra un plato específico de un restaurante que SÍ está en la lista (ej. "el tiradito de toro de Osaka es
espectacular"), agregalo a dishMatches con restaurantId, dishName, category (tipo de plato, ej. "sushi", "torta
vasca"), el claim real y un peso sugerido — nunca inventes un plato para un restaurante que no esté confirmado en
matches. Español.`;

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
            newRestaurants: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  cuisine: { type: 'string' },
                  neighborhood: { type: 'string' },
                  claim: { type: 'string' },
                },
                required: ['name', 'cuisine', 'neighborhood', 'claim'],
                additionalProperties: false,
              },
            },
            dishMatches: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  restaurantId: { type: 'string' },
                  dishName: { type: 'string' },
                  category: { type: 'string' },
                  claim: { type: 'string' },
                  suggestedWeight: { type: 'string', enum: ['strong', 'medium', 'weak'] },
                },
                required: ['restaurantId', 'dishName', 'category', 'claim', 'suggestedWeight'],
                additionalProperties: false,
              },
            },
          },
          required: ['matches', 'newRestaurants', 'dishMatches'],
          additionalProperties: false,
        },
      },
    },
  });

  const parsed = JSON.parse(requireTextBlock(response.content).text) as {
    matches: { restaurantId: string; claim: string; suggestedWeight: 'strong' | 'medium' | 'weak' }[];
    newRestaurants: NewRestaurantMention[];
    dishMatches: { restaurantId: string; dishName: string; category: string; claim: string; suggestedWeight: 'strong' | 'medium' | 'weak' }[];
  };

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
  const dishMatches: CuratorDishMatch[] = (parsed.dishMatches ?? [])
    .filter((d) => byId.has(d.restaurantId))
    .map((d) => ({
      restaurantId: d.restaurantId,
      restaurantName: byId.get(d.restaurantId)!.name,
      dishName: d.dishName,
      category: d.category,
      claim: d.claim,
      suggestedWeight: d.suggestedWeight,
    }));

  return { matches, newRestaurants: parsed.newRestaurants ?? [], dishMatches };
}

/** SPEC-027: one event exactly as an image shows it — `whenRaw` is resolved to a real date deterministically (resolveRelativeDate), never guessed by the model. */
export interface EventExtraction {
  name: string;
  whenRaw: string;
  instagramHandle: string | null;
  claim: string;
}

const EVENTS_SYSTEM_PROMPT = `Sos el Brain de Lugarcito, en modo operador (Admin CMS). Un miembro del equipo subió una
captura real (historia de Instagram, flyer, cronograma) que puede contener uno o más eventos gastronómicos. Tu
trabajo: por cada evento que la imagen REALMENTE muestra, devolver name (el nombre tal cual aparece), whenRaw (el
texto de fecha/hora tal cual está escrito, ej. "Sábado 12/7, 19hs" o "Este finde" — nunca lo conviertas vos a una
fecha, dejalo como texto crudo), instagramHandle (el @usuario de la cuenta fuente si aparece, o null si no aparece),
y claim (cualquier dato adicional relevante: lugar mencionado, tipo de evento). Nunca inventes un evento, una fecha,
o un handle que la imagen no muestre con claridad. Si la imagen no contiene ningún evento identificable, devolvé una
lista vacía. Español.`;

export async function extractEventsFromImage(input: {
  imageBase64: string;
  mediaType: 'image/jpeg' | 'image/png' | 'image/webp' | 'image/gif';
}): Promise<EventExtraction[]> {
  const response = await getClient().messages.create({
    model: MODEL,
    max_tokens: 1200,
    system: EVENTS_SYSTEM_PROMPT,
    messages: [
      {
        role: 'user',
        content: [
          { type: 'image', source: { type: 'base64', media_type: input.mediaType, data: input.imageBase64 } },
          { type: 'text', text: '¿Qué eventos reales muestra esta imagen?' },
        ],
      },
    ],
    output_config: {
      format: {
        type: 'json_schema',
        schema: {
          type: 'object',
          properties: {
            events: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  whenRaw: { type: 'string' },
                  instagramHandle: { type: ['string', 'null'] },
                  claim: { type: 'string' },
                },
                required: ['name', 'whenRaw', 'instagramHandle', 'claim'],
                additionalProperties: false,
              },
            },
          },
          required: ['events'],
          additionalProperties: false,
        },
      },
    },
  });

  const parsed = JSON.parse(requireTextBlock(response.content).text) as { events: EventExtraction[] };
  return parsed.events ?? [];
}
