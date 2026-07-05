import type { GeoPoint } from './restaurant';

/** A gastronomic event pin on the Living Map (CP-006). */
export interface MapEvent {
  id: string;
  name: string;
  when: string;
  position: GeoPoint;
}
