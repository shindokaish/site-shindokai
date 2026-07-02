/* Service Worker EKSN — Push Notifications */

self.addEventListener('push', event => {
  const data = event.data ? event.data.json() : {};
  event.waitUntil(
    self.registration.showNotification(data.title || 'EKSN Shindokai', {
      body: data.body || '',
      icon: '/shinodkai.png',
      badge: '/shinodkai.png',
      vibrate: [200, 100, 200],
      data: { url: data.url || 'https://site-shindokai.vercel.app/' }
    })
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
