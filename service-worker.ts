/// <reference lib="webworker" />

const sw = self as unknown as ServiceWorkerGlobalScope;
const CACHE_NAME = 'babyfoot-lottery-v4';
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
  './dist/scripts/app.js',
  './dist/scripts/constants.js',
  './dist/scripts/data.js',
  './dist/scripts/dom.js',
  './dist/scripts/listeners.js',
  './dist/scripts/modals.js',
  './dist/scripts/probabilities.js',
  './dist/scripts/rarity.js',
  './dist/scripts/result.js',
  './dist/scripts/rules.js',
  './dist/scripts/state.js',
  './dist/scripts/utils.js',
  './dist/scripts/weights.js',
  './dist/scripts/wheel.js',
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

  const pathname = requestUrl.pathname;

  if (pathname === '/favicon.ico') {
    event.respondWith(
      caches.match('./icons/icon.svg').then((cached) => cached || fetch('./icons/icon.svg'))
    );
    return;
  }

  if (pathname.startsWith('/data/')) {
    requestUrl.pathname = pathname;
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
