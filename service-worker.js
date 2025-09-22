self.addEventListener("install", event => {
  event.waitUntil(
    caches.open("infinity-fiber-cache").then(cache => {
      return cache.addAll(["/", "/InfinityFiberApp/index.html"]);
    })
  );
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
