import { createHmac, timingSafeEqual } from 'node:crypto';

/**
 * SPEC-020: the QR a café displays is a static, signed token — not a link to a public
 * URL, not a rotating code the venue needs connectivity to refresh (that would add real
 * operational cost, which the spec explicitly rules out). Anti-replay instead comes from
 * requiring real geolocation + server timestamp on every scan (see routes/checkin.ts) —
 * the token only proves "this restaurantId, signed by us", nothing about freshness.
 */
function secret(): string {
  const value = process.env.CHECKIN_SECRET;
  if (!value) throw new Error('CHECKIN_SECRET not configured');
  return value;
}

function base64url(input: Buffer): string {
  return input.toString('base64url');
}

export function generateCheckinToken(restaurantId: string): string {
  const payload = base64url(Buffer.from(restaurantId, 'utf-8'));
  const signature = base64url(createHmac('sha256', secret()).update(payload).digest());
  return `${payload}.${signature}`;
}

export function verifyCheckinToken(token: string): string | null {
  const [payload, signature] = token.split('.');
  if (!payload || !signature) return null;
  const expected = base64url(createHmac('sha256', secret()).update(payload).digest());
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  return Buffer.from(payload, 'base64url').toString('utf-8');
}
