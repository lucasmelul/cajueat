import { Router } from 'express';
import { requireUserId } from '../middleware/identity.js';
import { isSmsConfigured, sendOtpSms } from '../integrations/sms.js';
import { confirmAdoptAccount, getProfile, requestOtp, verifyOtp } from '../memory/memoryStore.js';

export const identityRouter = Router();

/**
 * "Guardá tu perfil" (SPEC-013): step 1 of 2. If TWILIO_* is configured, sends a real SMS and
 * never echoes the code back. Unconfigured local dev falls back to returning the code directly
 * so the flow stays genuinely testable end to end instead of silently faking a "sent" response.
 */
identityRouter.post('/identity/otp/request', async (req, res) => {
  const phone = typeof req.body?.phone === 'string' ? req.body.phone.trim() : '';
  if (!phone) return res.status(400).json({ error: 'phone_required' });
  const { code } = requestOtp(phone);
  if (!isSmsConfigured()) return res.json({ sent: true, devCode: code });

  const delivered = await sendOtpSms(phone, code);
  res.json({ sent: delivered });
});

/**
 * Step 2: attaches the phone to the caller's existing anonymous row — never migrates, never
 * silently merges (SPEC-013). If the phone is already linked to a *different* row, this is a
 * real "I have a saved profile on another device" case, not an error — the code stays valid
 * (not consumed here) so the client can confirm via /identity/otp/adopt without re-entering it.
 */
identityRouter.post('/identity/otp/verify', requireUserId, (req, res) => {
  const phone = typeof req.body?.phone === 'string' ? req.body.phone.trim() : '';
  const code = typeof req.body?.code === 'string' ? req.body.code.trim() : '';
  if (!phone || !code) return res.status(400).json({ error: 'phone_and_code_required' });

  const result = verifyOtp(req.userId!, phone, code);
  // Wrong/expired code is an expected user-facing outcome, not a request error — 200 with linked:false so the client shows it inline.
  if (!result.ok) return res.json({ linked: false });
  if (result.conflict) return res.json({ linked: false, conflict: true });

  res.json({ linked: true, user: getProfile(req.userId!).user });
});

/**
 * Confirms "sí, continuar con ese perfil" after /verify reported a conflict — the client
 * resubmits the same still-valid code, never a re-typed one, since re-entering the OTP would
 * add no real security here (the phone ownership proof already happened in step 1).
 */
identityRouter.post('/identity/otp/adopt', (req, res) => {
  const phone = typeof req.body?.phone === 'string' ? req.body.phone.trim() : '';
  const code = typeof req.body?.code === 'string' ? req.body.code.trim() : '';
  if (!phone || !code) return res.status(400).json({ error: 'phone_and_code_required' });

  const result = confirmAdoptAccount(phone, code);
  if (!result.ok) return res.json({ linked: false });

  res.json({ linked: true, userId: result.userId, user: getProfile(result.userId).user });
});
