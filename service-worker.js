/// <reference lib="webworker" />
const sw = self;
const CACHE_NAME = 'babyfoot-lottery-v6';
const ASSETS = [
  './',
  './index.html',
  './styles/styles.css',
  './styles/base.css',
  './styles/layout.css',
  './styles/wheel.css',
  './styles/result.css',
  './styles/modal.css',
  './styles/probabilities.css',
  './styles/responsive.css',
  './dist/app.js',
  './dist/constants.js',
  './dist/data.js',
  './dist/dom.js',
  './dist/listeners.js',
  './dist/modals.js',
  './dist/probabilities.js',
  './dist/rarity.js',
  './dist/result.js',
  './dist/rules.js',
  './dist/state.js',
  './dist/utils.js',
  './dist/weights.js',
  './dist/wheel.js',
  './data/effects.json',
  './data/rules.json',
  './manifest.webmanifest',
  './icons/icon.svg'
];

sw.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
  sw.skipWaiting();
});

sw.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );
  sw.clients.claim();
});

sw.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') {
    return;
  }

  const requestUrl = new URL(event.request.url);
  if (requestUrl.protocol !== 'http:' && requestUrl.protocol !== 'https:') {
    return;
  }

  if (requestUrl.origin !== sw.location.origin) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) {
        return cached;
      }
      return fetch(event.request).then((response) => {
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }
        const responseClone = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseClone);
        });
        return response;
      });
    })
  );
});
