export interface User {
  id: string;
  name: string;
  initials: string;
  cajuPoints: number;
  /** Whether the first-run flow (PRD-010 Onboarding) has been completed. */
  onboarded: boolean;
}

/** MVP dna is a flat list of chips (CP-011 User Memory) — editable in Profile (SPEC-010). */
export interface DnaTag {
  id: string;
  label: string;
}
