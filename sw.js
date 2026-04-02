// Service Worker — ECMO-RCP Dr. Negrín
// Permite uso offline una vez instalada la app

var CACHE_NAME = 'ecmo-rcp-v5';
var FILES = [
  './ECMO-RCP_DrNegrin_v4.html',
  './manifest.json',
  './icon.png'
];

// Instalar: guarda los archivos en caché
self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(FILES);
    })
  );
  self.skipWaiting();
});

// Activar: borra cachés antiguas
self.addEventListener('activate', function(e) {
  e.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(
        keys.filter(function(k) { return k !== CACHE_NAME; })
            .map(function(k) { return caches.delete(k); })
      );
    })
  );
  self.clients.claim();
});

// Fetch: sirve desde caché si no hay red
self.addEventListener('fetch', function(e) {
  e.respondWith(
    caches.match(e.request).then(function(cached) {
      return cached || fetch(e.request).catch(function() { return cached; });
    })
  );
});
