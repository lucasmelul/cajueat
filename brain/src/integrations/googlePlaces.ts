import type { OpenPeriod } from '../types.js';

/**
 * Google Places API (New) — used deliberately narrow: only to keep FACTUAL
 * fields in sync (address, position, opening hours, whether a place is still
 * open for business), never opinions. The Trust Engine's `sources[]` stay
 * fully human-sourced (curators/community/visits) — Google's data never
 * becomes a Source, it patches the restaurant's own factual fields directly.
 * Called on demand only (operator action), never a background poll — one
 * Details fetch when a restaurant is first linked, one more each time an
 * operator taps "Refrescar desde Google".
 */

function requireApiKey(): string {
  const key = process.env.GOOGLE_PLACES_API_KEY;
  if (!key) throw new Error('google_places_not_configured');
  return key;
}

export interface PlaceCandidate {
  placeId: string;
  name: string;
  address: string;
}

/** "Analizá esta lista"'s sibling for a single restaurant: operator types a name, picks the real match from real candidates — never auto-picked. */
export async function searchPlaces(query: string): Promise<PlaceCandidate[]> {
  const res = await fetch('https://places.googleapis.com/v1/places:searchText', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': requireApiKey(),
      'X-Goog-FieldMask': 'places.id,places.displayName,places.formattedAddress',
    },
    body: JSON.stringify({ textQuery: query }),
  });
  if (!res.ok) throw new Error(`google_places_search_failed:${res.status}`);
  const data = (await res.json()) as { places?: { id: string; displayName?: { text: string }; formattedAddress?: string }[] };
  return (data.places ?? []).map((p) => ({ placeId: p.id, name: p.displayName?.text ?? '', address: p.formattedAddress ?? '' }));
}

export type GoogleBusinessStatus = 'OPERATIONAL' | 'CLOSED_TEMPORARILY' | 'CLOSED_PERMANENTLY' | 'BUSINESS_STATUS_UNSPECIFIED';

export interface PlaceDetails {
  placeId: string;
  name: string;
  address: string;
  position: { lat: number; lng: number };
  openHours?: OpenPeriod[];
  businessStatus: GoogleBusinessStatus;
  /** SPEC-026: an external, uncurated aggregate — never a Source, never fed into computeTrust. */
  rating?: number;
  userRatingCount?: number;
  /** Google's own category for the place (ej. "Cafetería", "Restaurante de sushi") — only ever used as an initial cuisine guess for a bulk import, never overwrites a cuisine an operator already set. */
  primaryType?: string;
}

interface GoogleTimePoint {
  day: number;
  hour: number;
  minute: number;
}

function pad(n: number): string {
  return String(n).padStart(2, '0');
}

/** One OpenPeriod per Google period, ungrouped by design — isOpenNow() only needs to find a match, grouping days with identical hours into one entry is a display nicety, not a correctness requirement. */
function toOpenHours(periods: { open?: GoogleTimePoint; close?: GoogleTimePoint }[] | undefined): OpenPeriod[] | undefined {
  if (!periods || periods.length === 0) return undefined;
  const converted = periods
    .filter((p): p is { open: GoogleTimePoint; close?: GoogleTimePoint } => !!p.open)
    .map((p) => ({
      days: [p.open.day],
      from: `${pad(p.open.hour)}:${pad(p.open.minute)}`,
      to: p.close ? `${pad(p.close.hour)}:${pad(p.close.minute)}` : '23:59',
    }));
  return converted.length > 0 ? converted : undefined;
}

/** One Details fetch — used both when first linking a restaurant and on a manual "Refrescar desde Google". */
export async function getPlaceDetails(placeId: string): Promise<PlaceDetails> {
  const fieldMask = 'id,displayName,formattedAddress,location,regularOpeningHours,businessStatus,rating,userRatingCount,primaryTypeDisplayName';
  const res = await fetch(`https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}?languageCode=es`, {
    headers: { 'X-Goog-Api-Key': requireApiKey(), 'X-Goog-FieldMask': fieldMask },
  });
  if (!res.ok) throw new Error(`google_places_details_failed:${res.status}`);
  const data = (await res.json()) as {
    id: string;
    displayName?: { text: string };
    formattedAddress?: string;
    location?: { latitude: number; longitude: number };
    regularOpeningHours?: { periods?: { open?: GoogleTimePoint; close?: GoogleTimePoint }[] };
    businessStatus?: GoogleBusinessStatus;
    rating?: number;
    userRatingCount?: number;
    primaryTypeDisplayName?: { text: string };
  };
  return {
    placeId: data.id,
    name: data.displayName?.text ?? '',
    address: data.formattedAddress ?? '',
    position: { lat: data.location?.latitude ?? 0, lng: data.location?.longitude ?? 0 },
    openHours: toOpenHours(data.regularOpeningHours?.periods),
    businessStatus: data.businessStatus ?? 'BUSINESS_STATUS_UNSPECIFIED',
    rating: data.rating,
    userRatingCount: data.userRatingCount,
    primaryType: data.primaryTypeDisplayName?.text,
  };
}
