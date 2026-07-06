import { mockBrainClient } from './mockBrainClient';
import { httpBrainClient, BrainSyncRequiredError } from './httpBrainClient';
import type { BrainClient } from './BrainClient';

export { BrainSyncRequiredError };

// Chosen once at build time — memory is now server-authoritative (SPEC-006),
// so swapping clients mid-session would desync state. Set VITE_BRAIN_URL to
// point at a running cajueat/brain/ service; otherwise falls back to the
// mock so the PWA still works standalone.
const brainUrl = import.meta.env.VITE_BRAIN_URL as string | undefined;
export const brain: BrainClient = brainUrl ? httpBrainClient : mockBrainClient;

export type { BrainClient } from './BrainClient';
