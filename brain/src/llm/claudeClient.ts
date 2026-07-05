import Anthropic from '@anthropic-ai/sdk';
import type { ConversationTurn, Restaurant } from '../types.js';

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

export async function interpretQuery(input: {
  text: string;
  history: ConversationTurn[];
  catalog: Restaurant[];
}): Promise<InterpretedQuery> {
  const historyText = input.history
    .slice(-6)
    .map((t) => `${t.role === 'user' ? 'Usuario' : 'Brain'}: ${t.text ?? ''}`)
    .join('\n');

  const response = await getClient().messages.create({
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

  const textBlock = response.content.find((b): b is Anthropic.TextBlock => b.type === 'text');
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
