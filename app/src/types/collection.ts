/** A named, user-created grouping of restaurants (CP-019, SPEC-009) — separate from the flat "saved" bookmark. */
export interface Collection {
  id: string;
  name: string;
  restaurantIds: string[];
}
