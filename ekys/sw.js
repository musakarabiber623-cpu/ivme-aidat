const CACHE='ekys-shell-2026101802';
const ASSETS=['./','./index.html','./manifest.webmanifest'];
self.addEventListener('install',e=>{ e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting())); });
self.addEventListener('activate',e=>{ e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())); });
self.addEventListener('fetch',e=>{ const req=e.request; let url; try{ url=new URL(req.url); }catch(_){ return; }
  if(url.origin!==location.origin) return; // Supabase vb. -> ağdan
  if(req.method!=='GET') return;
  e.respondWith(caches.match(req).then(r=> r || fetch(req).then(resp=>{ if(resp&&resp.ok){ const cp=resp.clone(); caches.open(CACHE).then(c=>c.put(req,cp)); } return resp; }).catch(()=>caches.match('./index.html'))));
});
