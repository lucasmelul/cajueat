/**
 * SPEC-027: resolves a raw date/time string an image showed (e.g. "Sábado 12/7, 19hs",
 * "Este finde", "Mañana a la noche") into a real ISO datetime — deterministic arithmetic
 * against a real reference timestamp, never the LLM guessing which Saturday "this Saturday"
 * means. Same philosophy as isOpenNow() in geo.ts: no LLM, just real calendar math anchored
 * to Buenos Aires time. Best-effort by design — the operator always sees the raw text next
 * to the resolved date and can correct it by hand (Acceptance Criteria), so an imperfect
 * parse is a reasonable outcome, a silently wrong one is not (returns null when unsure).
 */

const BA_TIME_ZONE = 'America/Argentina/Buenos_Aires';

const WEEKDAY_NAMES: Record<string, number> = {
  domingo: 0,
  lunes: 1,
  martes: 2,
  miercoles: 3,
  jueves: 4,
  viernes: 5,
  sabado: 6,
};

const DEFAULT_HOUR = 20; // placeholder, same open-decision pattern as other undocumented cadences in this project — most flyers are evening events

function stripAccents(s: string): string {
  return s.normalize('NFD').replace(/[̀-ͯ]/g, '');
}

/** Real year/month/day/weekday for a given instant, in Buenos Aires time — never the server's own timezone. */
function partsInBuenosAires(date: Date): { year: number; month: number; day: number; weekday: number } {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: BA_TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    weekday: 'short',
  }).formatToParts(date);
  const get = (type: string) => parts.find((p) => p.type === type)!.value;
  const weekdayShort = get('weekday');
  const weekdayIndex = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(weekdayShort);
  return { year: Number(get('year')), month: Number(get('month')), day: Number(get('day')), weekday: weekdayIndex };
}

/** Builds a real ISO instant for a Buenos Aires wall-clock date+time (UTC-3, no DST in Argentina since 2009). */
function toIsoAtBuenosAiresTime(year: number, month: number, day: number, hour: number, minute: number): string {
  const utcMs = Date.UTC(year, month - 1, day, hour + 3, minute);
  return new Date(utcMs).toISOString();
}

function addDays(parts: { year: number; month: number; day: number }, days: number): { year: number; month: number; day: number } {
  const d = new Date(Date.UTC(parts.year, parts.month - 1, parts.day));
  d.setUTCDate(d.getUTCDate() + days);
  return { year: d.getUTCFullYear(), month: d.getUTCMonth() + 1, day: d.getUTCDate() };
}

/** Extracts an "HH" or "HH:mm" time near the word "hs"/"h"/"hrs", or a bare "HH:mm" — returns null if none found. */
function extractTime(text: string): { hour: number; minute: number } | null {
  const withSuffix = text.match(/\b(\d{1,2})(?::(\d{2}))?\s*(?:hs|hrs|h)\b/i);
  if (withSuffix) return { hour: Number(withSuffix[1]), minute: Number(withSuffix[2] ?? 0) };
  const bareColon = text.match(/\b([01]?\d|2[0-3]):([0-5]\d)\b/);
  if (bareColon) return { hour: Number(bareColon[1]), minute: Number(bareColon[2]) };
  return null;
}

export function resolveRelativeDate(whenRaw: string, referenceDate: Date): string | null {
  const normalized = stripAccents(whenRaw.toLowerCase());
  const time = extractTime(whenRaw) ?? { hour: DEFAULT_HOUR, minute: 0 };
  const refParts = partsInBuenosAires(referenceDate);

  // 1. Explicit day/month, e.g. "12/7", "12-07", "12/7/2026" — Argentina's DD/MM order.
  const explicit = normalized.match(/\b(\d{1,2})[/-](\d{1,2})(?:[/-](\d{2,4}))?\b/);
  if (explicit) {
    const day = Number(explicit[1]);
    const month = Number(explicit[2]);
    let year = explicit[3] ? Number(explicit[3]) : refParts.year;
    if (explicit[3] && explicit[3].length === 2) year += 2000;
    if (!explicit[3]) {
      // No year stated — assume the soonest real occurrence, never a date already in the past.
      const candidate = Date.UTC(year, month - 1, day);
      const refUtc = Date.UTC(refParts.year, refParts.month - 1, refParts.day);
      if (candidate < refUtc) year += 1;
    }
    if (month >= 1 && month <= 12 && day >= 1 && day <= 31) {
      return toIsoAtBuenosAiresTime(year, month, day, time.hour, time.minute);
    }
  }

  // 2. "hoy" / "mañana" / "pasado mañana"
  if (/\bhoy\b/.test(normalized)) {
    return toIsoAtBuenosAiresTime(refParts.year, refParts.month, refParts.day, time.hour, time.minute);
  }
  if (/\bpasado\s*manana\b/.test(normalized)) {
    const d = addDays(refParts, 2);
    return toIsoAtBuenosAiresTime(d.year, d.month, d.day, time.hour, time.minute);
  }
  if (/\bmanana\b/.test(normalized)) {
    const d = addDays(refParts, 1);
    return toIsoAtBuenosAiresTime(d.year, d.month, d.day, time.hour, time.minute);
  }

  // 3. "finde" / "fin de semana" — the nearest upcoming Saturday (today if today already is Sat/Sun).
  if (/\bfinde\b|\bfin de semana\b/.test(normalized)) {
    const daysUntilSaturday = refParts.weekday === 0 ? 6 : (6 - refParts.weekday + 7) % 7;
    const d = addDays(refParts, refParts.weekday === 6 || refParts.weekday === 0 ? 0 : daysUntilSaturday);
    return toIsoAtBuenosAiresTime(d.year, d.month, d.day, time.hour, time.minute);
  }

  // 4. A bare weekday name ("sábado", "este sábado", "próximo viernes") — nearest occurrence on or after today.
  for (const [name, targetWeekday] of Object.entries(WEEKDAY_NAMES)) {
    if (!normalized.includes(name)) continue;
    const diff = (targetWeekday - refParts.weekday + 7) % 7;
    const d = addDays(refParts, diff);
    return toIsoAtBuenosAiresTime(d.year, d.month, d.day, time.hour, time.minute);
  }

  return null;
}
