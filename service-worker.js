const CACHE_NAME = 'babyfoot-lottery-v3';
const ASSETS = [
  './',
  './index.html',
  './assets/css/styles.css',
  './assets/scripts/app.js',
  './assets/scripts/constants.js',
  './assets/scripts/data.js',
  './assets/scripts/dom.js',
  './assets/scripts/listeners.js',
  './assets/scripts/modals.js',
  './assets/scripts/probabilities.js',
  './assets/scripts/rarity.js',
  './assets/scripts/result.js',
  './assets/scripts/rules.js',
  './assets/scripts/state.js',
  './assets/scripts/utils.js',
  './assets/scripts/weights.js',
  './assets/scripts/wheel.js',
  './assets/data/effects.json',
  './assets/data/rules.json',
  './assets/manifest.webmanifest',
  './assets/icons/icon.svg'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') {
    return;
  }

  const requestUrl = new URL(event.request.url);
  const pathname = requestUrl.pathname;

  if (pathname === '/favicon.ico') {
    event.respondWith(
      caches.match('./assets/icons/icon.svg').then((cached) => cached || fetch('./assets/icons/icon.svg'))
    );
    return;
  }

  if (pathname.startsWith('/data/')) {
    requestUrl.pathname = `/assets${pathname}`;
  }

  const normalizedRequest = requestUrl.toString() === event.request.url
    ? event.request
    : new Request(requestUrl.toString(), event.request);

  event.respondWith(
    caches.match(normalizedRequest).then((cached) => {
      if (cached) {
        return cached;
      }
      return fetch(normalizedRequest).then((response) => {
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }
        const responseClone = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(normalizedRequest, responseClone);
        });
        return response;
      });
    })
  );
});
