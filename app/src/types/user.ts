export interface User {
  id: string;
  name: string;
  initials: string;
  cajuPoints: number;
}

/** MVP dna is a flat list of chips (CP-011 User Memory) — editable in Profile (SPEC-010). */
export interface DnaTag {
  id: string;
  label: string;
}
