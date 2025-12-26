// Minimal Service Worker for PWA installability
self.addEventListener('install', (e) => {
    console.log('[Service Worker] Install');
    self.skipWaiting();
});

self.addEventListener('activate', (e) => {
    console.log('[Service Worker] Activate');
});

self.addEventListener('fetch', (e) => {
    // Just pass through requests. We rely on the python server.
    e.respondWith(fetch(e.request));
});
