const CACHE_NAME = 'survey-app-v1';
const urlsToCache = [
  '/',
  '/Index.html',
  '/Result.html',
  '/Script.js',
  '/style.css',
  '/Result.css',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png'
];

// Install event - cache resources
self.addEventListener('install', function(event) {
  console.log('Service Worker: Install event');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Service Worker: Caching files');
        return cache.addAll(urlsToCache);
      })
      .catch(function(error) {
        console.log('Service Worker: Cache failed', error);
      })
  );
});

// Fetch event - serve from cache when offline
self.addEventListener('fetch', function(event) {
  console.log('Service Worker: Fetch event for', event.request.url);
  
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Return cached version or fetch from network
        if (response) {
          console.log('Service Worker: Serving from cache', event.request.url);
          return response;
        }
        
        console.log('Service Worker: Fetching from network', event.request.url);
        return fetch(event.request).then(function(response) {
          // Check if we received a valid response
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          // Clone the response
          const responseToCache = response.clone();

          caches.open(CACHE_NAME)
            .then(function(cache) {
              cache.put(event.request, responseToCache);
            });

          return response;
        }).catch(function(error) {
          console.log('Service Worker: Fetch failed', error);
          // Return offline page for navigation requests
          if (event.request.destination === 'document') {
            return caches.match('/Index.html');
          }
        });
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', function(event) {
  console.log('Service Worker: Activate event');
  
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheName !== CACHE_NAME) {
            console.log('Service Worker: Deleting old cache', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Background sync for form submissions
self.addEventListener('sync', function(event) {
  console.log('Service Worker: Background sync', event.tag);
  
  if (event.tag === 'form-sync') {
    event.waitUntil(syncFormData());
  }
});

// Function to sync form data when online
async function syncFormData() {
  try {
    // Get pending form data from IndexedDB
    const db = await openIndexedDB();
    const transaction = db.transaction(['formData'], 'readonly');
    const store = transaction.objectStore('formData');
    const getAllRequest = store.getAll();
    
    return new Promise((resolve, reject) => {
      getAllRequest.onsuccess = function() {
        const formData = getAllRequest.result;
        console.log('Service Worker: Syncing form data', formData);
        // Here you would typically send data to your server
        // For now, we'll just log it
        resolve();
      };
      getAllRequest.onerror = function() {
        reject(getAllRequest.error);
      };
    });
  } catch (error) {
    console.log('Service Worker: Sync failed', error);
  }
}

// Helper function to open IndexedDB
function openIndexedDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("UserData", 1);
    request.onsuccess = function(event) {
      resolve(event.target.result);
    };
    request.onerror = function(event) {
      reject(event.target.error);
    };
  });
}

// Push notification handling
self.addEventListener('push', function(event) {
  console.log('Service Worker: Push event');
  
  const options = {
    body: event.data ? event.data.text() : 'New survey available!',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Take Survey',
        icon: '/icons/icon-96x96.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/icons/icon-96x96.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('Survey App', options)
  );
});

// Notification click handling
self.addEventListener('notificationclick', function(event) {
  console.log('Service Worker: Notification click');
  
  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  } else if (event.action === 'close') {
    // Just close the notification
  } else {
    // Default action - open the app
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});
