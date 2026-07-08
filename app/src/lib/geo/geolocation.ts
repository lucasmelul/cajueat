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

/** Same haversine the real Brain uses for "Cerca" (SPEC-001) — kept client-side too so the Living Map can label the nearest real neighborhood instead of a fixed one. */
export function haversineKm(a: GeoPoint, b: GeoPoint): number {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const lat1 = (a.lat * Math.PI) / 180;
  const lat2 = (b.lat * Math.PI) / 180;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}
