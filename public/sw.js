const CACHE='garden-care-v3';
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(['/','/index.html'])));self.skipWaiting()});
self.addEventListener('activate',e=>e.waitUntil(self.clients.claim()));
self.addEventListener('fetch',e=>{if(e.request.method==='GET')e.respondWith(caches.match(e.request).then(c=>c||fetch(e.request)))});
self.addEventListener('push',e=>{let d={};try{d=e.data?e.data.json():{}}catch{}e.waitUntil(self.registration.showNotification(d.title||'Garden Care 🌿',{body:d.body||"Check today's garden jobs.",tag:d.tag||'garden-care'}))});
self.addEventListener('notificationclick',e=>{e.notification.close();e.waitUntil(clients.matchAll({type:'window',includeUncontrolled:true}).then(list=>{for(const c of list){if('focus'in c)return c.focus()}if(clients.openWindow)return clients.openWindow('/')}))});
