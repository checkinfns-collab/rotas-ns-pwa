// ============================================================
// Firebase Messaging Service Worker — Rotas NS
// Recebe push notifications em background
// ============================================================

importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey:            'AIzaSyA1pX97JMVtCuUsnDehvFaIpd30eIr7YxU',
  projectId:         'rotas-ns',
  messagingSenderId: '532204301425',
  appId:             '1:532204301425:web:775860c2f0545aa0a4bfd0'
});

var messaging = firebase.messaging();

// Handler de mensagens em background
messaging.onBackgroundMessage(function(payload) {
  console.log('[SW] Background message:', payload);

  var notificationTitle = payload.notification.title || 'Rotas NS';
  var notificationOptions = {
    body:    payload.notification.body || '',
    icon:    '/icons/icon-192.png',
    badge:   '/icons/icon-72.png',
    vibrate: [200, 100, 200, 100, 200],
    tag:     'rotas-ns-' + Date.now(),
    data:    payload.data || {},
    actions: [
      { action: 'open', title: 'Abrir App' }
    ]
  };

  return self.registration.showNotification(notificationTitle, notificationOptions);
});

// Ao clicar na notificação → abrir/focar o app
self.addEventListener('notificationclick', function(event) {
  event.notification.close();

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then(function(clientList) {
        // Se já tem uma aba aberta, foca nela
        for (var i = 0; i < clientList.length; i++) {
          var client = clientList[i];
          if (client.url.includes(self.location.origin) && 'focus' in client) {
            return client.focus();
          }
        }
        // Senão, abre uma nova
        if (clients.openWindow) {
          return clients.openWindow('/');
        }
      })
  );
});

// Ativação imediata do SW
self.addEventListener('install', function(event) {
  self.skipWaiting();
});

self.addEventListener('activate', function(event) {
  event.waitUntil(clients.claim());
});
