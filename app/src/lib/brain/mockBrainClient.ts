import type { BrainClient } from './BrainClient';
import type { Collection, ConversationTurn, DnaTag, RecommendationContext, TrustLevel } from '../../types';
import { FIXTURE_EVENTS, FIXTURE_RESTAURANTS, FIXTURE_USER } from './fixtures';

const TRUST_POINTS: Record<TrustLevel, number> = { high: 3, mid: 2, low: 1 };

/** Same deterministic keyword+trust scoring as brain/src/search/searchEngine.ts — never empty (SPEC-008). */
function searchCatalog(query: string, limit = 8) {
  const terms = query
    .toLowerCase()
    .split(/\s+/)
    .filter((t) => t.length > 1);
  const searchableText = (r: (typeof FIXTURE_RESTAURANTS)[number]) =>
    [r.name, r.cuisine, r.neighborhood, r.why, r.summary, ...r.tags, ...r.personality, ...r.idealFor].join(' ').toLowerCase();

  return FIXTURE_RESTAURANTS.map((r) => ({
    restaurant: r,
    score: terms.filter((t) => searchableText(r).includes(t)).length * 3 + TRUST_POINTS[r.trust],
  }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((s) => s.restaurant);
}

/** Simulates real network/thinking latency so loading states aren't instant (SPEC-001/SPEC-002). */
function delay<T>(value: T, ms = 420): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

let turnCounter = 0;
function nextTurnId() {
  turnCounter += 1;
  return `turn-${turnCounter}`;
}

/**
 * Very small keyword match standing in for real intent understanding
 * (SPEC-005's Recommendation Engine, SPEC-002's Conversation Experience).
 * Never returns an empty result — always proposes something (CP-018).
 */
function pickRestaurantsForQuery(text: string) {
  const q = text.toLowerCase();
  if (/sushi|nikkei|japon|omakase/.test(q)) {
    return FIXTURE_RESTAURANTS.filter((r) => r.id === 'osaka');
  }
  if (/caf[eé]|trabajar|laptop|especialidad/.test(q)) {
    return FIXTURE_RESTAURANTS.filter((r) => r.id === 'cuervo');
  }
  if (/grupo|amigos|bodeg[oó]n|after/.test(q)) {
    return FIXTURE_RESTAURANTS.filter((r) => r.id === 'anafe');
  }
  return [FIXTURE_RESTAURANTS[0]];
}

function replyTextForQuery(text: string, matches: typeof FIXTURE_RESTAURANTS): string {
  if (matches.length === 1) {
    const r = matches[0];
    return `Para "${text}" te recomiendo ${r.name}: ${r.why}`;
  }
  return 'No estoy seguro de haber entendido del todo, pero esto es lo que más se acerca a lo que buscás.';
}

/** Mock's own in-memory "Memory Engine" — kept simple, mirrors the real Brain's shape (SPEC-006). */
const memory = {
  user: { ...FIXTURE_USER },
  saved: { osaka: true, cuervo: true } as Record<string, boolean>,
  dna: [
    { id: 'd1', label: 'Sushi tradicional' },
    { id: 'd2', label: 'Barras de chef' },
    { id: 'd3', label: 'Pescado' },
    { id: 'd4', label: 'Café de especialidad' },
    { id: 'd5', label: 'Poco ruido' },
    { id: 'd6', label: 'Palermo · Chacarita' },
  ] as DnaTag[],
  dnaCounter: 6,
  collections: [{ id: 'c1', name: 'Sushi', restaurantIds: ['osaka'] }] as Collection[],
  collectionCounter: 1,
};

export const mockBrainClient: BrainClient = {
  async getUser() {
    return delay(memory.user, 150);
  },

  async getRecommendations(_context?: RecommendationContext) {
    const restaurants = FIXTURE_RESTAURANTS.slice(0, 5);
    const pick = restaurants[0];
    return delay(
      {
        brainCard: {
          eyebrow: 'CAJU · RECOMENDACIÓN',
          message: `Hoy elegiría **${pick.name}**.`,
          sub: pick.why,
          restaurantId: pick.id,
        },
        restaurants,
      },
      500,
    );
  },

  async getEvents() {
    return delay(FIXTURE_EVENTS, 150);
  },

  async getAllRestaurants() {
    return delay(FIXTURE_RESTAURANTS, 200);
  },

  async getRestaurant(id: string) {
    return delay(FIXTURE_RESTAURANTS.find((r) => r.id === id), 250);
  },

  async getSimilarRestaurants(id: string, limit = 3) {
    return delay(
      FIXTURE_RESTAURANTS.filter((r) => r.id !== id).slice(0, limit),
      250,
    );
  },

  async sendMessage({ text }) {
    const matches = pickRestaurantsForQuery(text);
    const turn: ConversationTurn = {
      id: nextTurnId(),
      role: 'brain',
      text: replyTextForQuery(text, matches),
      restaurants: matches,
      chips: ['¿Qué pedir?', 'Comparar con otro', '¿Vale la pena?'],
      createdAt: Date.now(),
    };
    return delay(turn, 650);
  },

  async getSavedIds() {
    return delay(Object.entries(memory.saved).filter(([, v]) => v).map(([id]) => id), 100);
  },

  async toggleSaved(id, saved) {
    memory.saved[id] = saved;
    return delay(undefined, 100);
  },

  async getDna() {
    return delay(memory.dna, 100);
  },

  async addDnaTag(label) {
    memory.dnaCounter += 1;
    const tag: DnaTag = { id: `d-${memory.dnaCounter}`, label };
    memory.dna.push(tag);
    return delay(tag, 150);
  },

  async removeDnaTag(id) {
    memory.dna = memory.dna.filter((d) => d.id !== id);
    return delay(undefined, 100);
  },

  async submitFeedback({ restaurantId, answers }) {
    const restaurant = FIXTURE_RESTAURANTS.find((r) => r.id === restaurantId);
    memory.user.cajuPoints += 45;
    const learned = answers.length
      ? `Aprendimos que tu experiencia en ${restaurant?.name ?? 'ese lugar'} fue: ${answers.join(', ')}.`
      : `Gracias por contarnos sobre tu visita a ${restaurant?.name ?? 'ese lugar'}.`;
    return delay({ learned, pointsAwarded: 45 }, 300);
  },

  async submitCapture({ kind, text }) {
    memory.user.cajuPoints += 30;
    // No Claude access in the mock — simple keyword match standing in for extractNoteKnowledge.
    if (kind === 'note' && text?.trim()) {
      const q = text.toLowerCase();
      const restaurant = FIXTURE_RESTAURANTS.find((r) => q.includes(r.name.toLowerCase()));
      const learned = restaurant
        ? `Sumamos lo que contaste sobre ${restaurant.name} a su conocimiento.`
        : 'Gracias por la nota. El Brain la sumó a su conocimiento sobre la zona.';
      return delay({ learned, pointsAwarded: 30 }, 300);
    }
    const learned = `Gracias por compartir ${kind === 'photo' ? 'una foto' : kind === 'link' ? 'un link' : 'conocimiento nuevo'}. El Brain lo sumó a su conocimiento.`;
    return delay({ learned, pointsAwarded: 30 }, 300);
  },

  async search(query, limit = 8) {
    return delay(searchCatalog(query, limit), 200);
  },

  async getCollections() {
    return delay(memory.collections, 150);
  },

  async createCollection(name) {
    memory.collectionCounter += 1;
    const collection: Collection = { id: `c-${memory.collectionCounter}`, name, restaurantIds: [] };
    memory.collections.push(collection);
    return delay(collection, 150);
  },

  async addRestaurantToCollectionByName(name, restaurantId) {
    const trimmed = name.trim();
    let collection = memory.collections.find((c) => c.name.toLowerCase() === trimmed.toLowerCase());
    if (!collection) {
      memory.collectionCounter += 1;
      collection = { id: `c-${memory.collectionCounter}`, name: trimmed, restaurantIds: [] };
      memory.collections.push(collection);
    }
    if (!collection.restaurantIds.includes(restaurantId)) collection.restaurantIds.push(restaurantId);
    return delay(collection, 200);
  },

  async removeFromCollection(collectionId, restaurantId) {
    const collection = memory.collections.find((c) => c.id === collectionId);
    if (collection) collection.restaurantIds = collection.restaurantIds.filter((id) => id !== restaurantId);
    return delay(undefined, 100);
  },

  async deleteCollection(id) {
    memory.collections = memory.collections.filter((c) => c.id !== id);
    return delay(undefined, 100);
  },
};
