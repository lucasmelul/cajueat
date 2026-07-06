import webpush from 'web-push';
import { getSubscription, removeSubscription } from './pushStore.js';

/**
 * SPEC-016: cada notificación real que sale de acá tiene que poder
 * explicarse — `reason` viaja en el payload y el service worker lo muestra
 * como parte del cuerpo, nunca aparece una notificación sin motivo (CP-029).
 */
export interface PushPayload {
  title: string;
  body: string;
  url?: string;
}

let configured = false;

function ensureConfigured() {
  if (configured) return;
  const publicKey = process.env.VAPID_PUBLIC_KEY;
  const privateKey = process.env.VAPID_PRIVATE_KEY;
  const subject = process.env.VAPID_SUBJECT || 'mailto:dev@cajueat.local';
  if (!publicKey || !privateKey) throw new Error('vapid_keys_not_configured');
  webpush.setVapidDetails(subject, publicKey, privateKey);
  configured = true;
}

/** Sends to whatever subscription this user has on file — silently no-ops if they never opted in, and self-cleans a dead/expired subscription instead of retrying it forever. */
export async function sendPushToUser(userId: string, payload: PushPayload): Promise<void> {
  const subscription = getSubscription(userId);
  if (!subscription) return;
  ensureConfigured();
  try {
    await webpush.sendNotification(subscription, JSON.stringify(payload));
  } catch (err) {
    const status = (err as { statusCode?: number }).statusCode;
    if (status === 404 || status === 410) removeSubscription(userId);
    else console.error('push_send_failed', userId, err);
  }
}
