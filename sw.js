const CACHE = 'fletes-launch-v2';
const ASSETS = ['./', './index.html', './manifest.json', './icon-192.png', './logo-app.png', './icon-512.png'];

self.addEventListener('install', e=>{
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)));
  self.skipWaiting();
});
self.addEventListener('activate', e=>{
  e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('fletes-') && k!==CACHE).map(k=>caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener('fetch', e=>{
  // Network-first: siempre trae la última versión si hay internet.
  // Si no hay conexión, usa lo último guardado.
  e.respondWith(
    fetch(e.request).then(res=>{
      if(e.request.method==='GET' && res.ok){
        const clone = res.clone();
        caches.open(CACHE).then(c=>c.put(e.request, clone));
      }
      return res;
    }).catch(()=> caches.match(e.request))
  );
});
