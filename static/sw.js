const CACHE_NAME = "talkwriter-v1";
const ASSETS_TO_CACHE = [
  "/",
  "/index.html",
  "/manifest.json",
  "/favicon.svg",
  "/icon-192.png",
  "/icon-512.png",
];

// Helper function to check if we're on localhost
const isLocalhost = () => {
  return (
    self.location.hostname === "localhost" ||
    self.location.hostname === "127.0.0.1"
  );
};

// Install event - cache static assets
self.addEventListener("install", (event) => {
  // Skip installation on localhost
  if (isLocalhost()) {
    return;
  }

  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS_TO_CACHE))
  );
});

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  // Skip cleanup on localhost
  if (isLocalhost()) {
    return;
  }

  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Fetch event - serve from cache, falling back to network
self.addEventListener("fetch", (event) => {
  // Bypass caching on localhost
  if (isLocalhost()) {
    event.respondWith(fetch(event.request));
    return;
  }

  event.respondWith(
    caches.match(event.request).then((response) => {
      // Return cached version if found
      if (response) {
        return response;
      }
      // Otherwise fetch from network
      return fetch(event.request).then((response) => {
        // Don't cache if not a success response
        if (!response || response.status !== 200 || response.type !== "basic") {
          return response;
        }
        // Clone the response as it can only be consumed once
        const responseToCache = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });
        return response;
      });
    })
  );
});
