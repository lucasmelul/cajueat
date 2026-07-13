const KEY = 'caju_anon_id';

/**
 * SPEC-013 Deferred Identity: the client owns and generates this — never
 * the Brain. Persisted in localStorage so it survives reloads; a fresh
 * browser/device without it is, by design, a brand-new anonymous Brain.
 */
export function getAnonId(): string {
  let id = localStorage.getItem(KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(KEY, id);
  }
  return id;
}

/**
 * "Continuar con este perfil" (SPEC-013 phone login): this device stops sending its own
 * anonymous id and adopts an existing account's — the guest activity under the old id is
 * abandoned, never merged, same tradeoff SPEC-013 already documents for a fresh device.
 */
export function setAnonId(id: string): void {
  localStorage.setItem(KEY, id);
}
