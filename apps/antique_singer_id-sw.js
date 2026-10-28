// Offline cache for Antique Singer ID. Network first so updates show up; cache is the offline fallback.
// Only same-origin GETs are cached (site CSS, drawings, icons); fonts/analytics go straight to the network.
const CACHE = 'antique-singer-id-v1';
const A = '/assets/apps/antique_singer_id/';
const FILES = [
  '/apps/antique_singer_id.html', '/apps/antique_singer_id.webmanifest',
  '/css/layout_default.css', '/css/extra_css/apps/antique_singer_id.css',
  ...['singer-jump-gentle.svg', 'singer-jump-steep.svg', 'singer-jump-none.svg', 'singer-bed-fiddle.svg', 'singer-bed-straight.svg',
      'singer-slides-yes.svg', 'singer-slides-no.svg', 'icon.svg', 'icon-192.png', 'icon-512.png'].map(f => A + f),
];
self.addEventListener('install', e => e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES))));
self.addEventListener('activate', e => e.waitUntil(caches.keys().then(keys =>
  Promise.all(keys.filter(k => k.startsWith('antique-singer-id-') && k !== CACHE).map(k => caches.delete(k))))));
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET' || url.origin !== location.origin) return;
  e.respondWith(fetch(e.request)
    .then(r => { const copy = r.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); return r; })
    .catch(() => caches.match(e.request)));
});
