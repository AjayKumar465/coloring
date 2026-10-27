// Gallery: category / difficulty / search filters, favorites and recently colored.
import { h, speak } from './ui.js';
import { favorites, progress } from './storage.js';
import { play } from './audio.js';

const DIFF = { easy: '●', medium: '●●', hard: '●●●' };
const DIFF_LABEL = { easy: 'Easy', medium: 'Medium', hard: 'Hard' };

export async function renderGallery(catalog, params, setCleanup) {
  const state = {
    cat: params.get('cat') || 'all',
    diff: params.get('diff') || 'all',
    q: params.get('q') || '',
  };
  const prog = new Map((await progress.all()).map((p) => [p.id, p]));
  const grid = h('div', { class: 'grid', role: 'list' });
  const count = h('p', { class: 'sr-count', 'aria-live': 'polite', style: { margin: '0 0 8px', fontWeight: 800, color: 'var(--ink-soft)' } });

  const chips = [
    { id: 'all', name: 'All', icon: '🌈' },
    { id: 'favorites', name: 'Favorites', icon: '❤️' },
    { id: 'recent', name: 'Recently colored', icon: '🕘' },
    ...catalog.categories,
  ];
  const chipRow = h('div', { class: 'chip-row', role: 'toolbar', 'aria-label': 'Picture themes' },
    chips.map((c) => h('button', {
      class: 'chip bouncy', type: 'button', 'data-cat': c.id, 'aria-pressed': String(state.cat === c.id),
      onclick: () => { state.cat = c.id; speak(c.name); update(); },
    }, h('span', { 'aria-hidden': 'true' }, c.icon), c.name))
  );
  const seg = h('div', { class: 'seg', role: 'group', 'aria-label': 'Difficulty' },
    ['all', 'easy', 'medium', 'hard'].map((d) => h('button', {
      type: 'button', 'data-diff': d, 'aria-pressed': String(state.diff === d), 'aria-label': d === 'all' ? 'All levels' : DIFF_LABEL[d],
      onclick: () => { state.diff = d; update(); },
    }, d === 'all' ? 'All' : DIFF[d]))
  );
  const search = h('input', { class: 'search', type: 'search', placeholder: 'Search: cat, rocket, star…', 'aria-label': 'Search pictures', value: state.q });
  let t = 0;
  search.addEventListener('input', () => { clearTimeout(t); t = setTimeout(() => { state.q = search.value.trim(); update(); }, 180); });

  function matches(im) {
    if (state.cat === 'favorites' && !favorites.has(im.id)) return false;
    if (state.cat === 'recent' && !prog.has(im.id)) return false;
    if (!['all', 'favorites', 'recent'].includes(state.cat) && im.category !== state.cat) return false;
    if (state.diff !== 'all' && im.difficulty !== state.diff) return false;
    if (state.q) {
      const q = state.q.toLowerCase();
      const hay = (im.title + ' ' + im.tags.join(' ') + ' ' + (catalog.catById.get(im.category)?.name || '')).toLowerCase();
      if (!q.split(/\s+/).every((w) => hay.includes(w))) return false;
    }
    return true;
  }

  function card(im) {
    const p = prog.get(im.id);
    const fav = favorites.has(im.id);
    const favBtn = h('button', {
      class: 'fav-btn bouncy', type: 'button', 'aria-pressed': String(fav), 'aria-label': `${fav ? 'Remove from' : 'Add to'} favorites: ${im.title}`,
      onclick: (e) => {
        e.preventDefault();
        const on = favorites.toggle(im.id);
        favBtn.setAttribute('aria-pressed', String(on));
        favBtn.setAttribute('aria-label', `${on ? 'Remove from' : 'Add to'} favorites: ${im.title}`);
        favBtn.textContent = on ? '❤️' : '🤍';
        play(on ? 'pop' : 'click');
        if (state.cat === 'favorites') update();
      },
    }, fav ? '❤️' : '🤍');
    return h('div', { class: 'card-wrap', role: 'listitem', style: { position: 'relative' } },
      h('a', { class: 'card', href: `#/color/${im.id}`, 'aria-label': `Color ${im.title}, ${DIFF_LABEL[im.difficulty]}` },
        h('img', { src: p?.thumb || im.file, alt: '', loading: 'lazy', decoding: 'async', width: 200, height: 200 }),
        h('span', { class: 'title' }, im.title),
        h('span', { class: 'meta' }, h('span', {}, catalog.catById.get(im.category)?.icon || ''), h('span', { class: 'dots', 'aria-hidden': 'true' }, DIFF[im.difficulty])),
        p?.done ? h('span', { class: 'badge-done' }, '✓ Done') : null
      ),
      favBtn
    );
  }

  function update() {
    chipRow.querySelectorAll('[data-cat]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.cat === state.cat)));
    seg.querySelectorAll('[data-diff]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.diff === state.diff)));
    let list = catalog.images.filter(matches);
    if (state.cat === 'recent') list.sort((a, b) => prog.get(b.id).updated - prog.get(a.id).updated);
    count.textContent = `${list.length} picture${list.length === 1 ? '' : 's'}`;
    if (!list.length) {
      const msg = state.cat === 'favorites' ? 'Tap the 🤍 on a picture to save it here.' : state.cat === 'recent' ? 'Pictures you color will show up here.' : 'No pictures found. Try another word!';
      grid.replaceChildren(h('p', { class: 'empty' }, h('span', { class: 'big' }, '🔍'), msg));
    } else grid.replaceChildren(...list.map(card));
    const qs = new URLSearchParams();
    if (state.cat !== 'all') qs.set('cat', state.cat);
    if (state.diff !== 'all') qs.set('diff', state.diff);
    if (state.q) qs.set('q', state.q);
    history.replaceState(null, '', `#/gallery${qs.toString() ? '?' + qs : ''}`);
  }

  const node = h('section', { class: 'view' },
    h('h1', {}, 'Pick a picture'),
    h('div', { class: 'filters' }, chipRow, h('div', { class: 'search-row' }, search, seg)),
    count,
    grid
  );
  update();
  setCleanup(() => clearTimeout(t));
  requestAnimationFrame(() => chipRow.querySelector('[aria-pressed="true"]')?.scrollIntoView({ inline: 'center', block: 'nearest' }));
  return node;
}
