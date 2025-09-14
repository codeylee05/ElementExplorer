const CACHE_NAME = "element-explorer-v2.0";

const urlsToCache = [
    "/",  // homepage
    "/static/Elements/styles.css",
    "/static/Elements/icons/icon-192x192.png",
    "/static/Elements/icons/icon-512x512.png",
];

// Install: cache core app shell
self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log("Caching core resources...");
            return cache.addAll(urlsToCache);
        }).catch(err => console.error("Caching failed:", err))
    );
});

// Activate: remove old caches
self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys().then(keys =>
            Promise.all(
                keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
            )
        )
    );
});

// Fetch: special handling for elements.json
self.addEventListener("fetch", (event) => {
    const { request } = event;

    if (request.url.includes("elements.json")) {
        // Network-first for JSON
        event.respondWith(
            fetch(request)
                .then((resp) => {
                    const clone = resp.clone();
                    caches.open(CACHE_NAME).then(cache => cache.put(request, clone));
                    return resp;
                })
                .catch(() => caches.match(request))
        );
        return;
    }

    // Default: cache-first, fallback to network
    event.respondWith(
        caches.match(request).then((resp) => {
            return resp || fetch(request);
        })
    );
});
