/** A real, timestamped contribution the user made (feedback, capture, etc.) — SPEC-011. */
export interface Contribution {
  label: string;
  points: number;
  when: number;
}

/** A saved restaurant with no feedback yet — the real signal behind the "¿Cómo estuvo...?" nudge (SPEC-016). */
export interface PendingFeedback {
  restaurantId: string;
  restaurantName: string;
  savedAt: number;
}
