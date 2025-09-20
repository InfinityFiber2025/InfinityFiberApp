
const CACHE='if-admin-v6';
self.addEventListener('install',e=>{
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll([
    './','./index.html','./assets/app.js','./assets/style.css','./manifest.json','./icons/logo.svg'
  ])));
});
self.addEventListener('fetch',e=>{
  e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request)));
});
