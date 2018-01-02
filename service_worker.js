self.addEventListener('install', function (event) {
  console.log("install phase.");
  event.waitUntil(
    caches.open('v1').then(function(cache) {
      return cache.addAll([
        '/',
        '/index.html',
        '/src/',
        '/src/core.js',
        '/src/main.js',
        '/src/styles.css',
        '/src/assets/brand/BaseConverterLogo.svg',
        '/src/assets/brand/favicon.png'
      ]);
    })
  );
});

self.addEventListener('fetch', function(event) {
  console.info("Fetching ", event.request.url);
  event.respondWith(
    caches.match(event.request)
    .then(function(response) {
      return response || fetch(event.request);
    })
  );
});

self.addEventListener('activate', function(event) {
  console.log("activated.");
});
