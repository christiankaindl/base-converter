self.addEventListener("install", function(event) {
  console.info("install phase.");
  event.waitUntil(
    caches
      .open("v1")
      .then(function addCaches(cache) {
        return cache.addAll([
          "/base-converter/",
          "/index.html",
          "/manifest.json",
          "/favicon.png",
          "/src/core.js",
          "/src/main.js",
          "/src/styles.css",
          "/src/assets/brand/BaseConverterLogo.svg",
          "/src/assets/brand/favicon_192.png",
          "/src/assets/brand/favicon_512.png",
          "/src/assets/brand/favicon.png",
          "https://unpkg.com/hyperapp@1.0.1/dist/hyperapp.js"
        ]);
      })
      .catch(function(error) {
        console.error(`Caching failed with ${error}`);
      })
  );
});

self.addEventListener("fetch", function(event) {
  console.info("Fetching ", event.request.url);
  event.respondWith(
    caches
      .match(event.request)
      .then(function fetchResponse(response) {
        console.info(`Match response is ${response}`);
        return response || fetch(event.request);
      })
      .catch(function fetchError(error) {
        console.error(`Could not fetch ressource with ${error}`);

        return caches.match('/index.html');
      })
  );
});

self.addEventListener("activate", function(event) {
  console.info("activated.");
});
