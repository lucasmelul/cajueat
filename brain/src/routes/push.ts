import { Router } from 'express';
import { requireUserId } from '../middleware/identity.js';
import { removeSubscription, saveSubscription } from '../notifications/pushStore.js';

export const pushRouter = Router();

/** Public — the VAPID public key is not a secret, it's what the browser needs to create a subscription. */
pushRouter.get('/push/vapid-public-key', (_req, res) => {
  const key = process.env.VAPID_PUBLIC_KEY;
  if (!key) return res.status(503).json({ error: 'push_not_configured' });
  res.json({ key });
});

pushRouter.post('/push/subscribe', requireUserId, (req, res) => {
  const subscription = req.body?.subscription;
  if (!subscription?.endpoint || !subscription?.keys?.p256dh || !subscription?.keys?.auth) {
    return res.status(400).json({ error: 'invalid_subscription' });
  }
  saveSubscription(req.userId!, subscription);
  res.json({ ok: true });
});

pushRouter.post('/push/unsubscribe', requireUserId, (req, res) => {
  removeSubscription(req.userId!);
  res.json({ ok: true });
});
