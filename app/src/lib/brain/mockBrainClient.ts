import type { BrainClient } from './BrainClient';
import type { ConversationTurn, RecommendationContext } from '../../types';
import { FIXTURE_EVENTS, FIXTURE_RESTAURANTS, FIXTURE_USER } from './fixtures';

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

export const mockBrainClient: BrainClient = {
  async getUser() {
    return delay(FIXTURE_USER, 150);
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
};
