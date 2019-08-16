var cacheName = 'v1::static';
self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(cacheName).then(function (cache) {
    return cache.addAll([
      '/'
      ]).then(function () {
      return self.skipWaiting();
    });
  }));
});
self.addEventListener('fetch', function (event) {
  event.respondWith(caches.open(cacheName).then(function (cache) {
    return cache.match(event.request).then(function (res) {
      return res || fetch(event.request);
    });
  }));
});