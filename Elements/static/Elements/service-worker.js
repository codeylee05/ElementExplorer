const CACHE_NAME = "element-explorer-v2";

const urlsToCache = [
    "/",  // homepage
    "/static/Elements/styles.css",
    "/static/Elements/icons/icon-192x192.png",
    "/static/Elements/icons/icon-512x512.png",

    "/static/data/elements.json",

    "https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css",
    "https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js",

    "https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css"
];

self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log("Caching app resources...");
            return cache.addAll(urlsToCache).catch((err) => {
                console.error("Caching failed:", err);
            });
        })
    );
});

self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames
                    .filter((name) => name !== CACHE_NAME)
                    .map((name) => caches.delete(name))
            );
        })
    );
});

self.addEventListener("fetch", (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return (
                response ||
                fetch(event.request).catch(() =>
                    caches.match("/static/data/elements.json")
                )
            );
        })
    );
});
