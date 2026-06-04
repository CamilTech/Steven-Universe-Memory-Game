const CACHE_NAME = 'meu-pwa-cache-v3';
const urlsToCache = [
  '/assets/',
  '/assets/index.html',

  '/assets/manifest.json',
  '/assets/js/pages/login.js',
  '/assets/js/pages/game.js',

  '/assets/css/pages/home/index.css',
  '/assets/css/pages/game/game.css',

  '/assets/Elementos/imagens/logo/fav-icon.png',
  '/assets/Elementos/song/Love_like_you.mp3',
  '/assets/Elementos/song/soundtrack.mp3'
];

self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME)
    .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
    )).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request)
      .then(response => {
        if (event.request.method === 'GET' && response.ok && response.status === 200) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, responseClone));
        }
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});