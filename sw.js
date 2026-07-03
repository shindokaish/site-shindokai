/* Service Worker EKSN — Push Notifications */

self.addEventListener('push', event => {
  const d = event.data ? event.data.json() : {};
  const options = {
    body:             d.body || '',
    icon:             '/shinodkai.png',
    badge:            '/shinodkai.png',
    image:            d.image || undefined,
    vibrate:          d.vibrate || [200, 100, 200],
    requireInteraction: d.persistent || false,
    actions:          d.actions || [],
    data:             { url: d.url || 'https://site-shindokai.vercel.app/' }
  };
  event.waitUntil(
    self.registration.showNotification(d.title || 'EKSN Shindokai', options)
  );
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
      for (const client of list) {
        if (client.url === event.notification.data.url && 'focus' in client) return client.focus();
      }
      if (clients.openWindow) return clients.openWindow(event.notification.data.url);
    })
  );
});
