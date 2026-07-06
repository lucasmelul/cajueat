import { getAnonId } from '../brain/identity';

/**
 * SPEC-016 Notifications: opt-in only, requested in context — never on
 * first app open (see Profile.tsx, gated on having at least one saved
 * restaurant). Talks to the Brain directly rather than through BrainClient
 * since a push subscription isn't part of the end-user data model, it's
 * browser plumbing tied to the same anonymous/phone identity (SPEC-013).
 */
const BASE_URL = import.meta.env.VITE_BRAIN_URL as string;

export function isPushSupported(): boolean {
  return 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window;
}

export function getPermissionState(): NotificationPermission | 'unsupported' {
  if (!isPushSupported()) return 'unsupported';
  return Notification.permission;
}

function urlBase64ToUint8Array(base64: string): Uint8Array {
  const padding = '='.repeat((4 - (base64.length % 4)) % 4);
  const base64Safe = (base64 + padding).replace(/-/g, '+').replace(/_/g, '/');
  const raw = atob(base64Safe);
  return Uint8Array.from([...raw].map((c) => c.charCodeAt(0)));
}

export async function getCurrentSubscription(): Promise<PushSubscription | null> {
  if (!isPushSupported()) return null;
  const registration = await navigator.serviceWorker.ready;
  return registration.pushManager.getSubscription();
}

export async function subscribeToPush(): Promise<boolean> {
  if (!isPushSupported()) return false;

  const permission = await Notification.requestPermission();
  if (permission !== 'granted') return false;

  const keyRes = await fetch(`${BASE_URL}/api/push/vapid-public-key`);
  if (!keyRes.ok) return false;
  const { key } = (await keyRes.json()) as { key: string };

  const registration = await navigator.serviceWorker.ready;
  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(key) as BufferSource,
  });

  const res = await fetch(`${BASE_URL}/api/push/subscribe`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Caju-User-Id': getAnonId() },
    body: JSON.stringify({ subscription: subscription.toJSON() }),
  });
  return res.ok;
}

export async function unsubscribeFromPush(): Promise<void> {
  const subscription = await getCurrentSubscription();
  if (subscription) await subscription.unsubscribe();
  await fetch(`${BASE_URL}/api/push/unsubscribe`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Caju-User-Id': getAnonId() },
  });
}
