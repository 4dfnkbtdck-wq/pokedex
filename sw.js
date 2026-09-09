// Bump this whenever the app shell (any cached file below, or its
// content) changes — same discipline as the ?v= query strings the HTML
// page uses. A new name here makes install() re-fetch everything fresh
// and activate() drops the old cache instead of leaving it to grow.
const CACHE_VERSION = "v6";
const CACHE_NAME = `pokedex-tracker-${CACHE_VERSION}`;

const APP_SHELL = [
  "index.html",
  "manifest.webmanifest",
  "css/styles.css?v=6",
  "js/data.js?v=6",
  "js/app.js?v=6",
  "img/icon-180.png?v=6",
  "img/icon-192.png",
  "img/icon-512.png",
  "img/icon-192-maskable.png",
  "img/icon-512-maskable.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((names) => Promise.all(names.filter((name) => name !== CACHE_NAME).map((name) => caches.delete(name))))
      .then(() => self.clients.claim())
  );
});

// Cache-first for the app shell (same-origin GET only) so the tracker —
// including your saved caught list, which lives in localStorage — keeps
// working offline. Sprite images come from a third-party origin
// (PokeAPI's sprites repo) and are left to the network/browser HTTP
// cache untouched.
self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET" || new URL(request.url).origin !== self.location.origin) return;

  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;
      return fetch(request).then((response) => {
        if (response.ok) {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
        }
        return response;
      });
    })
  );
});
