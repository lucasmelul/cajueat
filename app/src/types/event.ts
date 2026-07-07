import type { GeoPoint } from './restaurant';

/** A gastronomic event pin on the Living Map (CP-006). */
export interface MapEvent {
  id: string;
  name: string;
  /** Short display label (e.g. "sáb") — not parseable. */
  when: string;
  /** Real ISO datetime the event happens (SPEC-016 "Eventos" scheduling). */
  whenAt: string;
  position: GeoPoint;
}
