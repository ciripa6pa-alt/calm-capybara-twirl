// Firebase Messaging Service Worker
importScripts('https://www.gstatic.com/firebasejs/9.6.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.6.1/firebase-messaging-compat.js');

// Initialize Firebase in the service worker
firebase.initializeApp({
  apiKey: "AIzaSyCh8BXC3BDMBrdEjxkruOt7w4Gw1_Vsrkw",
  authDomain: "app-catatan-keuangan-15d94.firebaseapp.com",
  projectId: "app-catatan-keuangan-15d94",
  storageBucket: "app-catatan-keuangan-15d94.firebasestorage.app",
  messagingSenderId: "748111535242",
  appId: "1:748111535242:web:e4ffb3936347d7c3406173"
});

// Retrieve Firebase Messaging object
const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage(function(payload) {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  
  // Customize notification here
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/icon-192x192.png',
    badge: '/icon-96x96.png',
    tag: payload.data?.tag || 'default',
    data: payload.data,
    actions: [
      {
        action: 'open',
        title: 'Buka Aplikasi'
      }
    ]
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification click
self.addEventListener('notificationclick', function(event) {
  console.log('[firebase-messaging-sw.js] Notification click received.');
  
  event.notification.close();
  
  // This gets the URL for the app's main page
  event.waitUntil(
    clients.openWindow(event.notification.data?.url || '/')
  );
});
