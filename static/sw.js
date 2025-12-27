// QuickType Pro - Secure Service Worker for PWA
// HTTPS/SSL desteği ile güvenli servis işleyici

const SW_VERSION = '2.0.0';

self.addEventListener('install', (e) => {
    console.log(`[Service Worker v${SW_VERSION}] Install`);

    // HTTPS kontrolü
    if (self.location.protocol === 'https:') {
        console.log('[Service Worker] ✅ Güvenli bağlantı (HTTPS)');
    } else {
        console.log('[Service Worker] ⚠️ Güvensiz bağlantı (HTTP) - Bazı özellikler kısıtlı olabilir');
    }

    self.skipWaiting();
});

self.addEventListener('activate', (e) => {
    console.log(`[Service Worker v${SW_VERSION}] Activate`);

    // Eski cache'leri temizle (gelecekte kullanılabilir)
    e.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.filter(cacheName => {
                    // Eski versiyonları temizle
                    return cacheName.startsWith('quicktype-') &&
                        cacheName !== `quicktype-v${SW_VERSION}`;
                }).map(cacheName => {
                    console.log(`[Service Worker] Cache siliniyor: ${cacheName}`);
                    return caches.delete(cacheName);
                })
            );
        })
    );

    // Tüm client'ları hemen kontrol altına al
    return self.clients.claim();
});

self.addEventListener('fetch', (e) => {
    const request = e.request;

    // WebSocket bağlantılarını geç (Socket.IO için)
    if (request.url.includes('/socket.io/')) {
        return;
    }

    // HTTPS yönlendirmesi kontrolü (sadece HTTP isteklerinde)
    // Not: Yerel geliştirme ortamında bu kontrolü atla
    const isLocalhost = request.url.includes('localhost') ||
        request.url.includes('127.0.0.1') ||
        request.url.includes('192.168.');

    // Fetch isteğini işle - Python backend'e yönlendir
    e.respondWith(
        fetch(request).catch(error => {
            console.error('[Service Worker] Fetch hatası:', error);

            // Offline durumunda basit bir yanıt döndür
            if (request.destination === 'document') {
                return new Response(
                    '<html><body><h1>Bağlantı Yok</h1><p>Lütfen internet bağlantınızı kontrol edin.</p></body></html>',
                    { headers: { 'Content-Type': 'text/html; charset=utf-8' } }
                );
            }

            throw error;
        })
    );
});

// Push notification desteği (gelecekte Face ID bildirimleri için)
self.addEventListener('push', (e) => {
    console.log('[Service Worker] Push alındı:', e.data?.text());
});

// Background sync desteği (gelecekte offline işlemler için)
self.addEventListener('sync', (e) => {
    console.log('[Service Worker] Sync:', e.tag);
});
