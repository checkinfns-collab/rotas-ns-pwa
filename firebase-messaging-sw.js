// Firebase Messaging Service Worker
// Recebe push notifications em background (app fechado)

importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyA1pX97JMVtCuUsnDehvFaIpd30eIr7YxU",
  authDomain: "rotas-ns.firebaseapp.com",
  projectId: "rotas-ns",
  storageBucket: "rotas-ns.firebasestorage.app",
  messagingSenderId: "532204301425",
  appId: "1:532204301425:web:775860c2f0545aa0a4bfd0"
});

const messaging = firebase.messaging();

// Background message handler
messaging.onBackgroundMessage(function(payload) {
  console.log('[SW] Push recebido em background:', payload);

  var title = payload.notification ? payload.notification.title : 'Rotas NS';
  var body = payload.notification ? payload.notification.body : 'Nova rota atribuída!';

  return self.registration.showNotification(title, {
    body: body,
    icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 192"><rect width="192" height="192" rx="32" fill="%23EE4D2D"/><text x="96" y="120" text-anchor="middle" font-size="100" fill="white">🚛</text></svg>',
    badge: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96"><rect width="96" height="96" rx="16" fill="%23EE4D2D"/></svg>',
    vibrate: [200, 100, 200],
    data: payload.data || {}
  });
});

// Ao clicar na notificação, abre o app
self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(clientList) {
      for (var i = 0; i < clientList.length; i++) {
        if (clientList[i].url.includes('/') && 'focus' in clientList[i]) {
          return clientList[i].focus();
        }
      }
      return clients.openWindow('/');
    })
  );
});
