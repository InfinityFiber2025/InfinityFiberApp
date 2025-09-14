self.addEventListener('install', event => {
  event.waitUntil(
    caches.open('infinity-fiber-cache-v1').then(cache => {
      return cache.addAll([
        '/',
        '/index.html',
        '/dashboard.html',
        '/geral.html',
        '/repasse.html',
        '/reemb.html',
        '/gateway.html',
        '/contrato.html',
        '/restrito.html',
        '/manifest.json'
      ]);
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});