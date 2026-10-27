// ColorJoy service worker: precaches the app shell, caches pictures as they are used,
// and (when asked by the page) warms the cache with every picture for full offline use.
const VERSION = 'colorjoy-v2';
const SHELL = `${VERSION}-shell`;
const ART = `${VERSION}-art`;

const SHELL_FILES = [
  './',
  'index.html',
  'manifest.json',
  'css/styles.css',
  'js/app.js',
  'js/ui.js',
  'js/storage.js',
  'js/audio.js',
  'js/mascot.js',
  'js/gallery.js',
  'js/canvas.js',
  'js/tools.js',
  'js/brushes.js',
  'js/animations.js',
  'js/stickers.js',
  'js/myart.js',
  'data/catalog.json',
  'stickers/stickers.json',
  'icons/icon.svg',
  'icons/icon-192.png',
  'icons/icon-512.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(SHELL).then((c) => c.addAll(SHELL_FILES)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => !k.startsWith(VERSION)).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

async function warmArt() {
  try {
    const res = await fetch('data/catalog.json');
    const catalog = await res.json();
    const stickers = await (await fetch('stickers/stickers.json')).json();
    const cache = await caches.open(ART);
    const urls = [...catalog.images.map((i) => i.file), ...stickers.map((s) => s.file)];
    for (let i = 0; i < urls.length; i += 12) {
      await Promise.all(urls.slice(i, i + 12).map(async (u) => {
        if (!(await cache.match(u))) {
          const r = await fetch(u);
          if (r.ok) await cache.put(u, r);
        }
      }).map((p) => p.catch(() => {})));
    }
  } catch {
    /* offline or partial; try again next time */
  }
}

self.addEventListener('message', (event) => {
  if (event.data?.type === 'warm') event.waitUntil(warmArt());
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== location.origin) return;
  const isArt = /\/(images|stickers)\/.+\.svg$/.test(url.pathname);

  if (isArt) {
    // Cache first: pictures never change for a given version.
    event.respondWith(
      caches.match(req).then((hit) => hit || fetch(req).then((res) => {
        if (res.ok) {
          const copy = res.clone();
          caches.open(ART).then((c) => c.put(req, copy));
        }
        return res;
      }))
    );
    return;
  }

  if (req.mode === 'navigate') {
    // Network first for the page so updates arrive; fall back to the cached shell offline.
    event.respondWith(fetch(req).catch(() => caches.match('index.html')));
    return;
  }

  // App shell: stale-while-revalidate.
  event.respondWith(
    caches.match(req).then((hit) => {
      const network = fetch(req).then((res) => {
        if (res.ok) {
          const copy = res.clone();
          caches.open(SHELL).then((c) => c.put(req, copy));
        }
        return res;
      }).catch(() => hit);
      return hit || network;
    })
  );
});
