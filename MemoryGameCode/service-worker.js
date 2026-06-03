const CACHE_NAME = 'meu-pwa-cache';
const urlsToCache = [
  './',
  './index.html',
  './css/global/style.css',
  './js/pages/login.js'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
    .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
    .then(response => response || fetch(event.request))
  );
});