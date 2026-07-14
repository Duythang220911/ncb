const CACHE_NAME = "ncb-demo-v1";

const APP_FILES = [
    "./",
    "./index.html",
    "./home.html",
    "./password.html",

    "./css/index.css",
    "./css/home.css",
    "./css/password.css",

    "./js/index.js",
    "./js/home.js",
    "./js/password.js",

    "./manifest.json",

    "./img/app-icon.png",
    "./img/app-icon-192.png",
    "./img/app-icon-512.png",
    "./img/app-icon-maskable-512.png"
];


/*
 * Cài đặt service worker và lưu các file cơ bản.
 */
self.addEventListener("install", function (event) {
    event.waitUntil(
        caches
            .open(CACHE_NAME)
            .then(function (cache) {
                return cache.addAll(APP_FILES);
            })
            .then(function () {
                return self.skipWaiting();
            })
    );
});


/*
 * Xóa cache cũ khi cập nhật phiên bản.
 */
self.addEventListener("activate", function (event) {
    event.waitUntil(
        caches
            .keys()
            .then(function (cacheNames) {
                return Promise.all(
                    cacheNames.map(function (cacheName) {
                        if (cacheName !== CACHE_NAME) {
                            return caches.delete(cacheName);
                        }

                        return null;
                    })
                );
            })
            .then(function () {
                return self.clients.claim();
            })
    );
});


/*
 * Ưu tiên mạng, nếu mất mạng thì sử dụng cache.
 */
self.addEventListener("fetch", function (event) {
    if (event.request.method !== "GET") {
        return;
    }

    event.respondWith(
        fetch(event.request)
            .then(function (networkResponse) {
                const responseClone =
                    networkResponse.clone();

                caches
                    .open(CACHE_NAME)
                    .then(function (cache) {
                        cache.put(
                            event.request,
                            responseClone
                        );
                    });

                return networkResponse;
            })
            .catch(function () {
                return caches.match(event.request);
            })
    );
});