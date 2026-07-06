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
