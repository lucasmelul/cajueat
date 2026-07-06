import type { GeoPoint } from '../../types';

/**
 * SPEC-001: "Si no existe ubicación... Con CTA. 'Usar mi ubicación'." — real
 * geolocation is requested only in context (a CTA, a chip, a FAB tap), never
 * automatically on load. Resolves to `null` on denial/timeout/unsupported
 * instead of throwing — "el usuario igualmente puede explorar" (never blocks
 * the map).
 */
export function getCurrentPosition(timeoutMs = 8000): Promise<GeoPoint | null> {
  return new Promise((resolve) => {
    if (!('geolocation' in navigator)) {
      resolve(null);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => resolve(null),
      { timeout: timeoutMs, maximumAge: 5 * 60_000 },
    );
  });
}
