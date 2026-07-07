import type { NextFunction, Request, Response } from 'express';
import { touchLastActive } from '../memory/memoryStore.js';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

/**
 * SPEC-013 Deferred Identity: the client generates and owns the anonymous
 * ID (a UUID persisted in localStorage) — the Brain never issues it, only
 * trusts whatever arrives and creates a row the first time it sees one.
 * Attaches req.userId when present; does not block requests that don't
 * need personalization (catalog browsing, events, search).
 */
export function identityMiddleware(req: Request, _res: Response, next: NextFunction) {
  const header = req.header('x-caju-user-id');
  req.userId = typeof header === 'string' && header.trim() ? header.trim() : undefined;
  if (req.userId) touchLastActive(req.userId);
  next();
}

/** Routes that read/write per-user memory require an id — 400s rather than silently falling back to a shared row. */
export function requireUserId(req: Request, res: Response, next: NextFunction) {
  if (!req.userId) {
    res.status(400).json({ error: 'missing_user_id' });
    return;
  }
  next();
}
