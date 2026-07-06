import { Router } from 'express';
import { requireUserId } from '../middleware/identity.js';
import { getProfile, requestOtp, verifyOtp } from '../memory/memoryStore.js';

export const identityRouter = Router();

/** "Guardá tu Brain" (SPEC-013): step 1 of 2. No SMS/WhatsApp vendor is wired up yet — returns the code directly so the flow works end to end in the meantime, instead of faking a "sent" response. */
identityRouter.post('/identity/otp/request', (req, res) => {
  const phone = typeof req.body?.phone === 'string' ? req.body.phone.trim() : '';
  if (!phone) return res.status(400).json({ error: 'phone_required' });
  const { code } = requestOtp(phone);
  res.json({ sent: true, devCode: code });
});

/** Step 2: attaches the phone to the caller's existing anonymous row — never migrates, never silently merges (SPEC-013). */
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
