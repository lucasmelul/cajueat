import type { BrainClient } from './BrainClient';
import type { Collection, CompareResult, Contribution, ConversationTurn, DnaTag, RecommendationContext, TrustLevel } from '../../types';
import { FIXTURE_EVENTS, FIXTURE_RESTAURANTS, FIXTURE_USER } from './fixtures';

const TRUST_POINTS: Record<TrustLevel, number> = { high: 3, mid: 2, low: 1 };
const NEAR_RADIUS_KM = 2;

/** Same haversine the real Brain uses for "Cerca" (SPEC-001) — the mock has real fixture coordinates, so it's worth filtering for real too instead of a pass-through. */
function haversineKm(a: { lat: number; lng: number }, b: { lat: number; lng: number }): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

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

const CONVERSATION_LEARN_POINTS = 30;

/**
 * SPEC-004 "Desde conversación", mock version — no LLM here, so a simple heuristic stands in for
 * extractConversationKnowledge: a question is never knowledge, and only a first-hand-sounding
 * statement that names a real restaurant counts. Explicitly simulated, same honesty as the rest
 * of this mock (never claims to actually understand the message).
 */
function detectConversationKnowledge(text: string): { restaurantId: string; restaurantName: string } | null {
  if (text.includes('?')) return null;
  const q = text.toLowerCase();
  if (!/\bfui\b|\bestuve\b|com[ií]|prob[ée]|estuvo|recomiendo|qued[oó]|cambiaron|cambi[oó]/.test(q)) return null;
  const mentioned = FIXTURE_RESTAURANTS.find((r) => q.includes(r.name.toLowerCase()));
  return mentioned ? { restaurantId: mentioned.id, restaurantName: mentioned.name } : null;
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
  // Real timestamps, same as memoryStore.ts — osaka already has feedback, cuervo doesn't (mirrors the
  // real Brain's seeded demo state), so the mock's pending-feedback nudge has something real to show.
  savedAt: { osaka: Date.now() - 10 * 86400_000, cuervo: Date.now() - 3 * 86400_000 } as Record<string, number>,
  feedbackGiven: { osaka: Date.now() - 9 * 86400_000 } as Record<string, number>,
  contributions: [
    { label: 'Confirmaste horarios de Anafe', points: 15, when: Date.now() - 2 * 86400_000 },
    { label: 'Subiste una foto del omakase', points: 20, when: Date.now() - 7 * 86400_000 },
    { label: 'Respondiste un quiz de ambiente', points: 10, when: Date.now() - 14 * 86400_000 },
  ] as Contribution[],
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
  // SPEC-020/023: restaurantId -> real timestamps, same shape as the Brain's checkinStore/consumptionStore.
  checkins: {} as Record<string, number[]>,
  consumptions: {} as Record<string, number[]>,
};

const CHECKIN_RADIUS_KM = 0.1;
const DISCOVERY_POINTS = 50;
const REDEEM_COOLDOWN_MS = 15 * 24 * 60 * 60_000;

export const mockBrainClient: BrainClient = {
  async getUser() {
    return delay(memory.user, 150);
  },

  async completeOnboarding() {
    memory.user.onboarded = true;
    return delay(undefined, 150);
  },

  async getRecommendations(context?: RecommendationContext) {
    let filtered = FIXTURE_RESTAURANTS;
    if (context?.filter === 'date') {
      filtered = filtered.filter((r) => r.idealFor.some((x) => /cita|ocasión especial/i.test(x)) || r.tags.some((t) => /en pareja/i.test(t)));
    } else if (context?.filter === 'work') {
      filtered = filtered.filter((r) => r.idealFor.some((x) => /trabajar/i.test(x)) || r.tags.some((t) => /trabajar/i.test(t)));
    } else if (context?.filter === 'saved') {
      filtered = filtered.filter((r) => memory.saved[r.id]);
    } else if (context?.filter === 'near' && context.near) {
      filtered = filtered.filter((r) => haversineKm(context.near!, r.position) <= NEAR_RADIUS_KM);
    }
    // 'open' has no real hours data in the mock's fixtures — pass through unfiltered (the real Brain filters for real).

    // Mirrors the real Brain: the filtered result also drives the Living Map's pins now, so an
    // empty result stays honestly empty — "Cerca" is the one exception, closest-first still
    // picks a card even when nothing is literally within range.
    if (filtered.length === 0) {
      const cardCandidates =
        context?.filter === 'near' && context.near
          ? [...FIXTURE_RESTAURANTS].sort((a, b) => haversineKm(context.near!, a.position) - haversineKm(context.near!, b.position))
          : null;
      if (!cardCandidates) {
        return delay({ brainCard: null, restaurants: [] }, 500);
      }
      const pick = cardCandidates[0];
      return delay(
        { brainCard: { eyebrow: 'CAJU · RECOMENDACIÓN', message: `Hoy elegiría **${pick.name}**.`, sub: pick.why, restaurantId: pick.id }, restaurants: [] },
        500,
      );
    }

    const pick = filtered[0];
    return delay(
      {
        brainCard: {
          eyebrow: 'CAJU · RECOMENDACIÓN',
          message: `Hoy elegiría **${pick.name}**.`,
          sub: pick.why,
          restaurantId: pick.id,
        },
        restaurants: filtered,
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

  async getDishesForRestaurant() {
    // The mock catalog never had real sourced dishes — an empty list is honest here, not a gap.
    return delay([], 200);
  },

  async sendMessage({ text }, onDelta) {
    const matches = pickRestaurantsForQuery(text);
    const replyText = replyTextForQuery(text, matches);
    // Simulated word-by-word delivery — there's no real LLM behind the mock, but this
    // exercises the same progressive-rendering path Conversation.tsx uses for real
    // streaming (SPEC-002), so the mock stays a behaviorally valid BrainClient.
    if (onDelta) {
      const words = replyText.split(' ');
      for (let i = 0; i < words.length; i += 1) {
        await delay(undefined, 40);
        onDelta(i === 0 ? words[i] : ` ${words[i]}`);
      }
    }
    const knowledge = detectConversationKnowledge(text);
    if (knowledge) {
      memory.contributions.unshift({ label: `Le enseñaste algo a Lugarcito sobre ${knowledge.restaurantName}`, points: CONVERSATION_LEARN_POINTS, when: Date.now() });
      memory.user.cajuPoints += CONVERSATION_LEARN_POINTS;
    }
    const turn: ConversationTurn = {
      id: nextTurnId(),
      role: 'brain',
      text: replyText,
      restaurants: matches,
      chips: ['¿Qué pedir?', 'Comparar con otro', '¿Vale la pena?'],
      createdAt: Date.now(),
      learnedAbout: knowledge?.restaurantName,
      learnedPoints: knowledge ? CONVERSATION_LEARN_POINTS : undefined,
    };
    return delay(turn, 200);
  },

  async getSavedIds() {
    return delay(Object.entries(memory.saved).filter(([, v]) => v).map(([id]) => id), 100);
  },

  async toggleSaved(id, saved) {
    memory.saved[id] = saved;
    if (saved) memory.savedAt[id] = Date.now();
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
    // SPEC-020 Acceptance Criteria: mirrors the real Brain's 403 — a review always requires a prior real check-in.
    if (!memory.checkins[restaurantId]?.length) throw new Error('checkin_required');
    const restaurant = FIXTURE_RESTAURANTS.find((r) => r.id === restaurantId);
    memory.user.cajuPoints += 45;
    memory.feedbackGiven[restaurantId] = Date.now();
    memory.contributions.unshift({ label: `Feedback sobre ${restaurant?.name ?? 'ese lugar'}`, points: 45, when: Date.now() });
    const learned = answers.length
      ? `Aprendimos que tu experiencia en ${restaurant?.name ?? 'ese lugar'} fue: ${answers.join(', ')}.`
      : `Gracias por contarnos sobre tu visita a ${restaurant?.name ?? 'ese lugar'}.`;
    return delay({ learned, pointsAwarded: 45 }, 300);
  },

  async submitCapture({ kind, text }) {
    memory.user.cajuPoints += 30;
    // No Claude access in the mock — simple keyword match standing in for extractNoteKnowledge.
    // Voz llega ya transcripta a texto (SPEC-015) — mismo camino que una Nota.
    if ((kind === 'note' || kind === 'voice') && text?.trim()) {
      const q = text.toLowerCase();
      const restaurant = FIXTURE_RESTAURANTS.find((r) => q.includes(r.name.toLowerCase()));
      const learned = restaurant
        ? `Sumamos lo que contaste sobre ${restaurant.name} a su conocimiento.`
        : 'Gracias por la nota. El Brain la sumó a su conocimiento sobre la zona.';
      return delay({ learned, pointsAwarded: 30 }, 300);
    }
    // El mock no tiene visión — respuesta honesta en vez de simular análisis de imagen.
    if (kind === 'photo') {
      return delay({ learned: 'Guardamos la foto. El Brain real la va a poder leer cuando estés online.', pointsAwarded: 30 }, 300);
    }
    // El mock no tiene acceso a oEmbed real — mismo camino honesto que el link no-TikTok en producción.
    const learned = `Gracias por compartir ${kind === 'link' ? 'un link' : 'conocimiento nuevo'}. Lo guardamos para que el equipo lo revise a mano.`;
    return delay({ learned, pointsAwarded: 30, pending: true }, 300);
  },

  // Mock has no LLM to call — keeps the deterministic keyword scorer as a local-dev-only
  // approximation, never claims real intent understanding (that's what httpBrainClient does).
  async search(query, limit = 8) {
    return delay({ restaurants: searchCatalog(query, limit), suggestions: [] }, 200);
  },

  async compareRestaurants(restaurantIds, question) {
    const restaurants = restaurantIds.slice(0, 3).map((id) => FIXTURE_RESTAURANTS.find((r) => r.id === id)).filter((r): r is (typeof FIXTURE_RESTAURANTS)[number] => !!r);
    if (restaurants.length < 2) {
      return delay({ recommendedId: null, reasoning: 'Necesito al menos dos lugares reales para comparar.', whenToChooseOther: null }, 300);
    }
    // Sin Claude en el mock — criterio determinístico simple: mayor confianza gana.
    const sorted = [...restaurants].sort((a, b) => TRUST_POINTS[b.trust] - TRUST_POINTS[a.trust]);
    const winner = sorted[0];
    const runnerUp = sorted[1];
    const tie = TRUST_POINTS[winner.trust] === TRUST_POINTS[runnerUp.trust];
    const result: CompareResult = tie
      ? {
          recommendedId: null,
          reasoning: `${winner.name} y ${runnerUp.name} están parejos${question ? ` para "${question}"` : ''} — no hay evidencia suficiente para elegir uno sobre el otro.`,
          whenToChooseOther: 'Contame más sobre el contexto (con quién vas, qué buscás) y puedo ser más específico.',
        }
      : {
          recommendedId: winner.id,
          reasoning: `${winner.name}${question ? ` para "${question}"` : ''}: ${winner.why}`,
          whenToChooseOther: `${runnerUp.name} vale la pena si buscás algo distinto a lo que ofrece ${winner.name}.`,
        };
    return delay(result, 400);
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

  // No servicio de SMS en el mock — el código "enviado" es fijo y se devuelve directo, mismo honestidad que el Brain real en dev.
  async requestSyncCode() {
    return delay({ sent: true, devCode: '123456' }, 300);
  },

  async verifySyncCode(phone, code) {
    if (code !== '123456') return delay({ linked: false }, 200);
    memory.user.phone = phone;
    return delay({ linked: true }, 200);
  },

  // Mock has a single in-memory user, so there's never a real "phone already linked to someone
  // else" conflict to resolve — this exists only to satisfy the interface for local dev without VITE_BRAIN_URL.
  async adoptAccount(phone, code) {
    if (code !== '123456') return delay({ linked: false }, 200);
    memory.user.phone = phone;
    return delay({ linked: true, userId: memory.user.id, user: memory.user }, 200);
  },

  async getActivity() {
    const pendingFeedback = Object.entries(memory.saved)
      .filter(([, saved]) => saved)
      .filter(([id]) => !memory.feedbackGiven[id])
      .map(([id]) => {
        const restaurant = FIXTURE_RESTAURANTS.find((r) => r.id === id);
        return restaurant ? { restaurantId: id, restaurantName: restaurant.name, savedAt: memory.savedAt[id] ?? Date.now() } : null;
      })
      .filter((x): x is { restaurantId: string; restaurantName: string; savedAt: number } => x !== null)
      .sort((a, b) => a.savedAt - b.savedAt);
    return delay({ contributions: memory.contributions, pendingFeedback }, 150);
  },

  // No real HMAC in the mock — the "token" is just the restaurantId itself, same honesty
  // level as the mock's fake devCode. Real geolocation + real haversineKm still apply.
  async checkin({ token, position, mode, points }) {
    const restaurant = FIXTURE_RESTAURANTS.find((r) => r.id === token);
    if (!restaurant) return delay({ ok: false, error: 'invalid_token' as const }, 200);

    const distanceKm = haversineKm(position, restaurant.position);
    if (distanceKm > CHECKIN_RADIUS_KM) return delay({ ok: false, error: 'out_of_range' as const }, 400);

    if (mode === 'redeem') {
      const pointsSpent = Number(points);
      if (!Number.isInteger(pointsSpent) || pointsSpent <= 0) return delay({ ok: false, error: 'points_required' as const }, 100);
      const history = memory.consumptions[restaurant.id] ?? [];
      const last = history.length ? Math.max(...history) : undefined;
      if (last && Date.now() - last < REDEEM_COOLDOWN_MS) {
        return delay({ ok: false, error: 'cooldown_active' as const, retryAt: last + REDEEM_COOLDOWN_MS }, 200);
      }
      if (pointsSpent > memory.user.cajuPoints) return delay({ ok: false, error: 'insufficient_points' as const, balance: memory.user.cajuPoints }, 200);
      memory.user.cajuPoints -= pointsSpent;
      memory.consumptions[restaurant.id] = [...history, Date.now()];
      return delay({ ok: true, restaurant, pointsSpent, remainingBalance: memory.user.cajuPoints }, 300);
    }

    const today = new Date().toDateString();
    const checkinsToday = (memory.checkins[restaurant.id] ?? []).filter((ms) => new Date(ms).toDateString() === today);
    if (checkinsToday.length > 0) return delay({ ok: false, error: 'already_checked_in_today' as const }, 200);

    const firstVisit = !(memory.checkins[restaurant.id]?.length > 0);
    memory.checkins[restaurant.id] = [...(memory.checkins[restaurant.id] ?? []), Date.now()];
    const pointsAwarded = firstVisit ? DISCOVERY_POINTS : 0;
    if (firstVisit) {
      memory.user.cajuPoints += DISCOVERY_POINTS;
      memory.contributions.unshift({ label: `Descubriste ${restaurant.name}`, points: DISCOVERY_POINTS, when: Date.now() });
    }
    return delay({ ok: true, restaurant, pointsAwarded, firstVisit }, 300);
  },

  async getPassport() {
    const firstVisitByRestaurant = new Map<string, number>();
    for (const [id, timestamps] of Object.entries(memory.checkins)) {
      if (timestamps.length) firstVisitByRestaurant.set(id, Math.min(...timestamps));
    }
    const visited = FIXTURE_RESTAURANTS.filter((r) => firstVisitByRestaurant.has(r.id)).map((r) => ({
      restaurant: r,
      firstVisitAt: firstVisitByRestaurant.get(r.id)!,
    }));
    const pending = FIXTURE_RESTAURANTS.filter((r) => !firstVisitByRestaurant.has(r.id));
    const byNeighborhood = new Map<string, typeof pending>();
    for (const r of pending) {
      const list = byNeighborhood.get(r.neighborhood) ?? [];
      list.push(r);
      byNeighborhood.set(r.neighborhood, list);
    }
    const pendingByNeighborhood = [...byNeighborhood.entries()]
      .map(([neighborhood, restaurants]) => ({ neighborhood, restaurants }))
      .sort((a, b) => b.restaurants.length - a.restaurants.length);
    return delay({ catalogSize: FIXTURE_RESTAURANTS.length, visited, pendingByNeighborhood }, 150);
  },
};
