import { mockBrainClient } from './mockBrainClient';
import type { BrainClient } from './BrainClient';

// Swap this for a real HTTP-backed implementation once the Brain API exists.
// Every screen imports `brain` from here — never `mockBrainClient` directly.
export const brain: BrainClient = mockBrainClient;

export type { BrainClient } from './BrainClient';
