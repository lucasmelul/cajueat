import type { GeoPoint, OpenPeriod } from '../types.js';

/**
 * SPEC-001 gaps: "Cerca" and "Abierto ahora" were accepted as context
 * filters but never actually filtered anything, since neither real geo
 * distance nor real opening hours existed. Both are deterministic —
 * no LLM, same philosophy as the Trust Engine ("explicable, no una caja negra").
 */

const EARTH_RADIUS_KM = 6371;

function toRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

export function haversineKm(a: GeoPoint, b: GeoPoint): number {
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * EARTH_RADIUS_KM * Math.asin(Math.sqrt(h));
}

const BA_TIME_ZONE = 'America/Argentina/Buenos_Aires';
const WEEKDAY_INDEX: Record<string, number> = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };

function timeToMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
}

/** Day-of-week + minutes-since-midnight in Buenos Aires, regardless of the server's own timezone. */
function nowInBuenosAires(now: Date): { day: number; minutes: number } {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: BA_TIME_ZONE,
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).formatToParts(now);
  const weekday = parts.find((p) => p.type === 'weekday')!.value;
  const hour = Number(parts.find((p) => p.type === 'hour')!.value) % 24; // "24:00" at midnight in some locales
  const minute = Number(parts.find((p) => p.type === 'minute')!.value);
  return { day: WEEKDAY_INDEX[weekday], minutes: hour * 60 + minute };
}

/** No `openHours` on file means we genuinely don't know — never guessed as open or closed. */
export function isOpenNow(openHours: OpenPeriod[] | undefined, now: Date = new Date()): boolean | null {
  if (!openHours || openHours.length === 0) return null;
  const { day, minutes } = nowInBuenosAires(now);
  return openHours.some((period) => {
    if (!period.days.includes(day)) return false;
    const from = timeToMinutes(period.from);
    const to = timeToMinutes(period.to);
    if (to > from) return minutes >= from && minutes < to;
    return minutes >= from || minutes < to; // wraps past midnight (e.g. 20:00 -> 00:30)
  });
}
