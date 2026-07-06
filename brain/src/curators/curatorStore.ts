import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { SignalWeight } from '../types.js';

/**
 * SPEC-017 Curators & Sources: a curator stops being a plain string repeated
 * inside each restaurant's `sources[]` and becomes a real entity — identified
 * by the same handle already used as `Source.name` (e.g. "@buenospaladaires"),
 * no new ID scheme, no migration of existing catalog data. Reputation is
 * tracked per domain (cuisine) — a curator strong in parrillas isn't
 * automatically strong in café de especialidad — and only moves when real
 * evidence confirms or contradicts a claim (see `catalogStore.ts`'s
 * `addSourceToRestaurant`), never assigned once and left static.
 */

interface DomainRecord {
  sustained: number;
  contradicted: number;
}

export interface CuratorRecord {
  handle: string;
  domains: Record<string, DomainRecord>;
}

interface Store {
  curators: Record<string, CuratorRecord>;
}

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(__dirname, '../../data');
const DATA_FILE = join(DATA_DIR, 'curators.json');

function load(): Store {
  if (!existsSync(DATA_FILE)) return { curators: {} };
  try {
    const parsed = JSON.parse(readFileSync(DATA_FILE, 'utf-8')) as Partial<Store>;
    return { curators: parsed.curators ?? {} };
  } catch {
    return { curators: {} };
  }
}

let store = load();

function persist() {
  if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });
  writeFileSync(DATA_FILE, JSON.stringify(store, null, 2));
}

function getOrCreate(handle: string): CuratorRecord {
  let record = store.curators[handle];
  if (!record) {
    record = { handle, domains: {} };
    store.curators[handle] = record;
  }
  return record;
}

/**
 * Umbral de reputación — SPEC-017 lo deja explícitamente como Open Question
 * sin resolver ("umbral exacto... y en cuánto"). net = sostenidas - contradichas.
 * Un curador sin historial en un dominio arranca neutral (el llamador usa el
 * peso original de la fuente, ver `getEffectiveWeight`) — nunca se castiga lo
 * todavía-no-evaluado, solo lo que activamente se sostuvo o contradijo.
 */
function weightFromNet(net: number): SignalWeight {
  if (net >= 3) return 'strong';
  if (net <= -2) return 'weak';
  return 'medium';
}

/** El peso efectivo de la afirmación de un curador en un dominio puntual — si no hay historial todavía, se usa el `fallback` (el peso con el que se cargó la fuente). */
export function getEffectiveWeight(handle: string, domain: string, fallback: SignalWeight): SignalWeight {
  const domainRecord = store.curators[handle]?.domains[domain];
  if (!domainRecord || (domainRecord.sustained === 0 && domainRecord.contradicted === 0)) return fallback;
  return weightFromNet(domainRecord.sustained - domainRecord.contradicted);
}

/** Se llama solo cuando evidencia nueva realmente confirma o contradice la afirmación de un curador — nunca por una afirmación aislada sin corroborar. */
export function recordCuratorOutcome(handle: string, domain: string, outcome: 'sustained' | 'contradicted') {
  const record = getOrCreate(handle);
  const domainRecord = record.domains[domain] ?? { sustained: 0, contradicted: 0 };
  domainRecord[outcome] += 1;
  record.domains[domain] = domainRecord;
  persist();
}

export function getAllCurators(): CuratorRecord[] {
  return Object.values(store.curators);
}

export function curatorsFileExists(): boolean {
  return existsSync(DATA_FILE);
}
