const cacheName = 'cacheAssets-v3';

/**
 * On install event.
 * Trigger when the service worker is installed
 */
self.addEventListener('install', (event) => {
    // Activate immediately after installing
    self.skipWaiting();

    // Create the static cache
    event.waitUntil(
        caches.open(cacheName)
            .then((cache) => {
                console.log('Cache opened:', cache);
                return cache.addAll([
                    '/',
                    '/index.html',
                    '/java.js',
                    '/css/style.css',
                    '/contact/contact.html',
                    '/css/contact.css',
                    '/manifest.json',
                    '/images/download%20(1).jpeg',
                    '/images/image.jpeg',
                    '/images/download.png',
                    '/images/image2.jpeg',
                    '/images/image3.jpeg',
                    '/screenshot/screenshot2.png',
                    '/icons/favicon-196.png',
                    '/icons/manifest-icon-192.maskable.png'
                ]);
            })
            .catch((error) => console.log('Cache failed:', error))
    );
});

/**
 * On activate event.
 * Trigger when the service worker is activated
 */
self.addEventListener('activate', (event) => {
    console.log('[SW] Activating new service worker...');

    // Remove old caches
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((oldCacheName) => {
                    if (oldCacheName !== cacheName) {
                        console.log('Deleting old cache:', oldCacheName);
                        return caches.delete(oldCacheName);
                    }
                })
            );
        })
    );

    // Claim clients immediately, allowing the new service worker to control current pages
    event.waitUntil(clients.claim());
});

/**
 * On fetch event.
 * Implemett Stale-While-Revalidate Stragegy
 */

self.addEventListener('fetch', (event) => {
    
    if(event.request.method ==='GET'){
        event.respondWith(
            caches.open(cacheName)
            .then((cache)=>{
                return cache.match(event.request)
                .then((cacheResponse)=>{
                    const fetchedResponse = fetch(event.request)
                    .then((networkResponse)=>{
                        cache.put(event.request, networkResponse.clone());
                        return networkResponse;
                    });
                    return cacheResponse || fetchedResponse;
                })
            })
         )
    }
    
});
