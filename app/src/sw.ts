/// <reference lib="webworker" />
import { precacheAndRoute } from 'workbox-precaching';

declare const self: ServiceWorkerGlobalScope;

// vite-plugin-pwa's injectManifest strategy replaces this with the real precache list at build time.
precacheAndRoute(self.__WB_MANIFEST);

interface PushPayload {
  title: string;
  body: string;
  url?: string;
}

/**
 * SPEC-016 Notifications: every push the Brain sends carries its own
 * explanation in `body` — never a bare "you have a notification". Tapping
 * opens the app straight to the relevant screen (`url`) instead of just
 * bringing the app to the foreground.
 */
self.addEventListener('push', (event) => {
  if (!event.data) return;
  const payload = event.data.json() as PushPayload;
  event.waitUntil(
    self.registration.showNotification(payload.title, {
      body: payload.body,
      icon: '/favicon.svg',
      data: { url: payload.url ?? '/' },
    }),
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = (event.notification.data as { url?: string })?.url ?? '/';
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientsList) => {
      for (const client of clientsList) {
        if ('focus' in client) {
          client.navigate(url);
          return client.focus();
        }
      }
      return self.clients.openWindow(url);
    }),
  );
});
