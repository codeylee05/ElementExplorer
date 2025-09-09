const CACHE_NAME = "element-explorer-v1";
const urlsToCache = [
    "/",  // homepage
    "/static/Elements/styles.css",
    "/static/Elements/icons/icon-192x192.png",
    "/static/Elements/icons/icon-512x512.png",

    // Bootstrap CSS & JS (CDN)
    "https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css",
    "https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js",

    // Bootstrap Icons (CDN)
    "https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css"
];


self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(urlsToCache).catch((err) => {
                console.error("Caching failed:", err);
            });
        })
    );
});

self.addEventListener("fetch", (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});
