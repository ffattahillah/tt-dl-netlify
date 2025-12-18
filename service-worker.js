const CACHE_NAME = 'tiktok-downloader-v2';

const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/styles.css',
    '/app.js',
    '/pwa.js',
    '/manifest.json'
];

// INSTALL
self.addEventListener('install', event => {
    self.skipWaiting();
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => cache.addAll(STATIC_ASSETS))
    );
});

// ACTIVATE
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys =>
            Promise.all(
                keys.map(key => key !== CACHE_NAME && caches.delete(key))
            )
        ).then(() => self.clients.claim())
    );
});

// FETCH
self.addEventListener('fetch', event => {
    const req = event.request;

    // BYPASS API & MEDIA
    if (
        req.url.includes('tikwm.com') ||
        req.url.includes('tikmate.app') ||
        req.destination === 'video' ||
        req.destination === 'audio'
    ) {
        return;
    }

    // HTML → NETWORK FIRST
    if (req.headers.get('accept')?.includes('text/html')) {
        event.respondWith(
            fetch(req)
                .then(res => {
                    const clone = res.clone();
                    caches.open(CACHE_NAME).then(c => c.put(req, clone));
                    return res;
                })
                .catch(() => caches.match('/index.html'))
        );
        return;
    }

    // STATIC → CACHE FIRST
    event.respondWith(
        caches.match(req).then(res => res || fetch(req))
    );
});
