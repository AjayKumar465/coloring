// ColorJoy entry point: catalog loading, hash router, home screen, settings.
import { h, toast, speak, modal, parentGate, clickSound } from './ui.js';
import { settings, clearAll, progress } from './storage.js';
import { play, unlockOnGesture } from './audio.js';
import { mascotSVG, mascotReact } from './mascot.js';
import { renderGallery } from './gallery.js';

const view = document.getElementById('view');
let catalogPromise = null;
let cleanup = null;

export function loadCatalog() {
  if (!catalogPromise) {
    catalogPromise = fetch('data/catalog.json')
      .then((r) => {
        if (!r.ok) throw new Error(`catalog ${r.status}`);
        return r.json();
      })
      .then((c) => {
        c.byId = new Map(c.images.map((im) => [im.id, im]));
        c.catById = new Map(c.categories.map((cat) => [cat.id, cat]));
        return c;
      });
    catalogPromise.catch(() => { catalogPromise = null; });
  }
  return catalogPromise;
}

function parseHash() {
  const raw = location.hash.replace(/^#\/?/, '');
  const [path, query = ''] = raw.split('?');
  const parts = path.split('/').filter(Boolean);
  return { name: parts[0] || 'home', arg: decodeURIComponent(parts[1] || ''), params: new URLSearchParams(query) };
}

async function route() {
  const r = parseHash();
  if (cleanup) {
    try { cleanup(); } catch (e) { console.warn(e); }
    cleanup = null;
  }
  document.querySelectorAll('[data-nav]').forEach((a) => a.toggleAttribute('aria-current', a.dataset.nav === (r.name === 'color' ? 'gallery' : r.name)));
  document.querySelectorAll('[data-nav][aria-current]').forEach((a) => a.setAttribute('aria-current', 'page'));
  view.replaceChildren(h('div', { class: 'view' }, h('p', { class: 'empty' }, h('span', { class: 'big' }, '🎨'), 'Loading…')));
  let catalog;
  try {
    catalog = await loadCatalog();
  } catch (e) {
    view.replaceChildren(h('div', { class: 'view' }, h('p', { class: 'empty' }, h('span', { class: 'big' }, '😢'), 'Could not load the pictures. Check your connection and try again.')));
    return;
  }
  let node;
  if (r.name === 'gallery') node = await renderGallery(catalog, r.params, setCleanup);
  else if (r.name === 'color' && catalog.byId.has(r.arg)) {
    const { renderCanvas } = await import('./canvas.js');
    node = await renderCanvas(catalog, catalog.byId.get(r.arg), setCleanup);
  } else if (r.name === 'art') {
    const { renderMyArt } = await import('./myart.js');
    node = await renderMyArt(catalog, setCleanup);
  } else node = await renderHome(catalog);
  if (parseHash().name !== r.name || parseHash().arg !== r.arg) return; // navigated away meanwhile
  node.classList.add('view-enter');
  view.replaceChildren(node);
  if (r.name !== 'color') window.scrollTo(0, 0);
  view.focus({ preventScroll: true });
}

function setCleanup(fn) {
  cleanup = fn;
}

async function renderHome(catalog) {
  const counts = {};
  for (const im of catalog.images) counts[im.category] = (counts[im.category] || 0) + 1;
  const recent = (await progress.all()).sort((a, b) => b.updated - a.updated).slice(0, 6);
  const mascotWrap = h('div', { class: 'mascot-wrap', html: mascotSVG() });
  mascotWrap.addEventListener('click', () => {
    play('pop');
    speak(mascotReact(mascotWrap, 'cheer', 'Hi! I am Dabby!'));
  });
  const today = catalog.images[Math.floor(Date.now() / 86400000) % catalog.images.length];
  const node = h('section', { class: 'view' },
    h('div', { class: 'hero' },
      mascotWrap,
      h('div', {},
        h('h1', {}, 'Let’s color!'),
        h('p', {}, `${catalog.images.length} pictures, magic brushes, stickers and surprises.`),
        h('a', { class: 'btn btn-primary btn-big bouncy', href: '#/gallery', onclick: () => speak('Pick a picture!') }, '🖍️ Start Coloring'),
        ' ',
        h('a', { class: 'btn bouncy', href: `#/color/${today.id}`, style: { marginTop: '12px' } }, '🌟 Picture of the day')
      )
    ),
    recent.length ? h('div', {},
      h('div', { class: 'section-title' }, h('h2', {}, '🕘 Keep coloring')),
      h('div', { class: 'grid' }, recent.filter((p) => catalog.byId.has(p.id)).map((p) => {
        const im = catalog.byId.get(p.id);
        return h('a', { class: 'card bouncy', href: `#/color/${im.id}`, 'aria-label': `Keep coloring ${im.title}` },
          h('img', { src: p.thumb || im.file, alt: '', loading: 'lazy', width: 200, height: 200 }),
          h('span', { class: 'title' }, im.title));
      }))
    ) : null,
    h('div', { class: 'section-title' }, h('h2', {}, '📚 Pick a theme')),
    h('div', { class: 'cat-grid' }, catalog.categories.map((c) =>
      h('a', { class: 'cat-tile bouncy', href: `#/gallery?cat=${c.id}`, style: { '--c': c.color }, onclick: () => speak(c.name) },
        h('span', { class: 'emoji', 'aria-hidden': 'true' }, c.icon),
        h('span', {}, c.name),
        h('small', {}, `${counts[c.id] || 0} pictures`))
    ))
  );
  return node;
}

// ---------- Settings ----------
function applySettings(s) {
  document.body.classList.toggle('hc', s.contrast);
  document.body.classList.toggle('reduce-motion', s.reduceMotion);
  const btn = document.getElementById('sound-toggle');
  btn.setAttribute('aria-pressed', String(s.sound));
  btn.setAttribute('aria-label', s.sound ? 'Sound on' : 'Sound off');
  btn.firstElementChild.textContent = s.sound ? '🔊' : '🔇';
}

async function openSettings() {
  if (!(await parentGate('Settings are for grown-ups.'))) return;
  const s = settings.get();
  const toggle = (key, label) => {
    const input = h('input', { type: 'checkbox', checked: s[key], onchange: (e) => settings.set({ [key]: e.target.checked }) });
    return h('label', { class: 'toggle' }, h('span', {}, label), input);
  };
  await modal((dlg, close) => {
    dlg.append(
      h('h2', {}, '⚙️ Grown-up settings'),
      toggle('sound', '🔊 Sound effects'),
      toggle('voice', '🗣️ Voice prompts'),
      toggle('contrast', '🌓 High contrast'),
      toggle('colorblind', '👁️ Colorblind-friendly colors'),
      toggle('reduceMotion', '🐢 Less motion'),
      h('p', { style: { fontSize: '15px', color: 'var(--ink-soft)' } }, 'ColorJoy has no ads, no accounts and no tracking. Artwork is saved only on this device.'),
      h('div', { class: 'row' },
        h('button', {
          class: 'btn btn-ghost', type: 'button',
          onclick: async () => {
            if (confirm('Delete ALL saved artwork and coloring progress on this device?')) {
              await clearAll();
              toast('Everything was cleared.');
              close();
              route();
            }
          },
        }, '🗑️ Delete all art'),
        h('button', { class: 'btn btn-primary', type: 'button', onclick: () => close() }, 'Done')
      )
    );
  });
}

function init() {
  applySettings(settings.get());
  settings.onChange(applySettings);
  unlockOnGesture();
  clickSound(document.body);
  document.getElementById('sound-toggle').addEventListener('click', () => {
    const s = settings.set({ sound: !settings.get().sound });
    if (s.sound) play('pop');
    toast(s.sound ? 'Sound on' : 'Sound off', 1200);
  });
  document.getElementById('settings-btn').addEventListener('click', openSettings);
  addEventListener('hashchange', route);
  route();
  if ('serviceWorker' in navigator && location.protocol !== 'file:') {
    addEventListener('load', () => {
      navigator.serviceWorker.register('sw.js').then((reg) => {
        // Warm the cache with every picture so the whole gallery works offline.
        const warm = () => (reg.active || navigator.serviceWorker.controller)?.postMessage({ type: 'warm' });
        if (reg.active) setTimeout(warm, 3000);
        else navigator.serviceWorker.ready.then(() => setTimeout(warm, 3000));
      }).catch((e) => console.warn('SW registration failed', e));
    });
  }
}

init();
