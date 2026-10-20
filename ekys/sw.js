const CACHE='ekys-shell-202610202315';
const ASSETS=['./','./index.html','./manifest.webmanifest'];
self.addEventListener('install',e=>{ e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS.map(u=>new Request(u,{cache:'reload'})))).then(()=>self.skipWaiting())); });
self.addEventListener('activate',e=>{ e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())); });
self.addEventListener('fetch',e=>{ const req=e.request; let url; try{ url=new URL(req.url); }catch(_){ return; }
  if(url.origin!==location.origin || req.method!=='GET') return; // Supabase vb. -> ağdan
  const sayfa = req.mode==='navigate' || url.pathname.endsWith('/') || url.pathname.endsWith('.html');
  if(sayfa){ // HTML: önce ağ (her zaman güncel), çevrimdışıysa önbellek
    e.respondWith(fetch(req,{cache:'no-store'}).then(resp=>{ if(resp&&resp.ok){ const cp=resp.clone(); caches.open(CACHE).then(c=>c.put('./index.html',cp)); } return resp; })
      .catch(()=>caches.match(req).then(r=>r||caches.match('./index.html'))));
    return;
  }
  e.respondWith(caches.match(req).then(r=> r || fetch(req).then(resp=>{ if(resp&&resp.ok){ const cp=resp.clone(); caches.open(CACHE).then(c=>c.put(req,cp)); } return resp; })));
});
