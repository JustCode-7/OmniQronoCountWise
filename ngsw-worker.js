// This is a basic service worker for PWA support
// It handles caching and offline support

'use strict';

// Skip waiting so that the service worker activates immediately
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

// Claim clients so that the service worker takes control immediately
self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

// Cache assets for offline use
const CACHE_NAME = 'omni-qrono-count-wise-cache-v1';
const urlsToCache = [
  '/OmniQronoCountWise/',
  '/OmniQronoCountWise/index.html',
  '/OmniQronoCountWise/manifest.webmanifest',
  '/OmniQronoCountWise/favicon.ico',
  '/OmniQronoCountWise/main-PHKJCMQP.js',
  '/OmniQronoCountWise/polyfills-FFHMD2TL.js',
  '/OmniQronoCountWise/scripts-EEEIPNC3.js',
  '/OmniQronoCountWise/styles-7M4BUJ7L.css',
  '/OmniQronoCountWise/chunk-EQDQRRRY.js',
  '/OmniQronoCountWise/chunk-FK7UXCNS.js',
  '/OmniQronoCountWise/assets/icons/README.txt',
  '/OmniQronoCountWise/assets/icons/OmniQronoCountWise.jpg'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache);
      })
  );
});

// Serve cached content when offline
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - return response
        if (response) {
          return response;
        }

        // Clone the request because it's a one-time use stream
        const fetchRequest = event.request.clone();

        return fetch(fetchRequest).then(
          (response) => {
            // Check if we received a valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clone the response because it's a one-time use stream
            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });

            return response;
          }
        ).catch(() => {
          // If the network is unavailable, try to return the offline page
          if (event.request.mode === 'navigate') {
            return caches.match('/OmniQronoCountWise/index.html');
          }
          return null;
        });
      })
  );
});

// Clean up old caches
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];

  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
