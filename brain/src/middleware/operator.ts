import type { NextFunction, Request, Response } from 'express';

/**
 * SPEC-018 Admin CMS: a third identity tier, separate from end-user
 * identity (SPEC-013's anonymous/phone-linked userId). A team operator is
 * never a regular user, verified or not — an allowlist of one shared
 * secret is "operación mínima" enough for the current team size (CP-034);
 * no roles/permissions system until that stops being true.
 */
export function requireOperator(req: Request, res: Response, next: NextFunction) {
  const expected = process.env.ADMIN_TOKEN;
  const provided = req.header('x-caju-operator-token');
  if (!expected) {
    res.status(503).json({ error: 'admin_not_configured' });
    return;
  }
  if (provided !== expected) {
    res.status(401).json({ error: 'invalid_operator_token' });
    return;
  }
  next();
}
