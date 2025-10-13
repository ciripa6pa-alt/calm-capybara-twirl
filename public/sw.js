const CACHE_NAME = 'kasir-saku-plus-v1'
const urlsToCache = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json',
  '/icon-192x192.png',
  '/icon-512x512.png'
]

// Install event - cache resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache')
        return cache.addAll(urlsToCache)
      })
      .catch((error) => {
        console.error('Failed to cache resources:', error)
      })
  )
})

// Fetch event - serve from cache when offline
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - return response
        if (response) {
          return response
        }

        // Clone the request
        const fetchRequest = event.request.clone()

        return fetch(fetchRequest).then((response) => {
          // Check if valid response
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response
          }

          // Clone the response
          const responseToCache = response.clone()

          caches.open(CACHE_NAME)
            .then((cache) => {
              cache.put(event.request, responseToCache)
            })

          return response
        }).catch(() => {
          // If fetch fails (offline), try to serve from cache
          return caches.match(event.request)
        })
      })
  )
})

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName)
            return caches.delete(cacheName)
          }
        })
      )
    })
  )
})

// Push notification event
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'Notifikasi baru dari Kasir Saku Plus',
    icon: '/icon-192x192.png',
    badge: '/icon-96x96.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Buka Aplikasi',
        icon: '/icon-96x96.png'
      },
      {
        action: 'close',
        title: 'Tutup',
        icon: '/icon-96x96.png'
      }
    ]
  }

  event.waitUntil(
    self.registration.showNotification('Kasir Saku Plus', options)
  )
})

// Notification click event
self.addEventListener('notificationclick', (event) => {
  event.notification.close()

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    )
  } else if (event.action === 'close') {
    // Just close the notification
  } else {
    // Default action - open the app
    event.waitUntil(
      clients.openWindow('/')
    )
  }
})

// Background sync for offline transactions
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync-transactions') {
    event.waitUntil(syncTransactions())
  }
})

// Function to sync offline transactions
async function syncTransactions() {
  try {
    // Get offline transactions from IndexedDB
    const offlineTransactions = await getOfflineTransactions()
    
    // Sync each transaction to the server
    for (const transaction of offlineTransactions) {
      try {
        await fetch('/api/transactions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(transaction)
        })
        
        // Remove synced transaction from IndexedDB
        await removeOfflineTransaction(transaction.id)
      } catch (error) {
        console.error('Failed to sync transaction:', error)
      }
    }
  } catch (error) {
    console.error('Background sync failed:', error)
  }
}

// Helper functions for IndexedDB (simplified)
async function getOfflineTransactions() {
  // In a real implementation, this would interact with IndexedDB
  return []
}

async function removeOfflineTransaction(id) {
  // In a real implementation, this would remove from IndexedDB
  console.log('Removing offline transaction:', id)
}