// My Art: saved artwork gallery with download and (parent-locked) delete.
import { h, toast, parentGate } from './ui.js';
import { art } from './storage.js';
import { play } from './audio.js';
import { isNative, shareImage } from './native.js';

export async function renderMyArt(catalog, setCleanup) {
  const urls = [];
  const items = (await art.all()).sort((a, b) => b.created - a.created);
  const grid = h('div', { class: 'grid', role: 'list' });

  function card(item) {
    const url = URL.createObjectURL(item.blob);
    urls.push(url);
    const date = new Date(item.created).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
    const el = h('div', { class: 'card art-card', role: 'listitem' },
      h('img', { src: url, alt: `${item.title}, saved ${date}`, loading: 'lazy', width: 200, height: 200 }),
      h('span', { class: 'title' }, item.title),
      h('span', { class: 'meta' }, h('span', {}, date)),
      h('div', { class: 'art-actions' },
        h('a', { class: 'icon-btn bouncy', href: url, download: `colorjoy-${item.imageId}-${item.id}.png`, 'aria-label': `Download ${item.title}`, title: 'Download',
          onclick: (e) => {
            play('chime');
            if (!isNative()) return;
            e.preventDefault();
            shareImage(item.blob, `colorjoy-${item.imageId}-${item.id}.png`, item.title).catch(() => toast('Could not save the picture.'));
          } },
          h('span', { 'aria-hidden': 'true' }, '💾'), h('small', {}, 'Save')),
        catalog.byId.has(item.imageId)
          ? h('a', { class: 'icon-btn bouncy', href: `#/color/${item.imageId}`, 'aria-label': `Color ${item.title} again`, title: 'Color again' }, h('span', { 'aria-hidden': 'true' }, '🖍️'), h('small', {}, 'Color'))
          : null,
        h('button', {
          class: 'icon-btn bouncy', type: 'button', 'aria-label': `Delete ${item.title}`, title: 'Delete',
          onclick: async () => {
            if (!(await parentGate('Deleting artwork needs a grown-up.'))) return;
            await art.remove(item.id);
            el.remove();
            play('whoosh');
            toast('Artwork deleted.');
            if (!grid.children.length) grid.replaceChildren(empty());
          },
        }, h('span', { 'aria-hidden': 'true' }, '🗑️'), h('small', {}, 'Delete'))
      )
    );
    return el;
  }

  const empty = () => h('div', { class: 'empty' }, h('span', { class: 'big' }, '🖼️'), 'No saved art yet. Color a picture and tap ⭐ Save!',
    h('p', {}, h('a', { class: 'btn btn-primary bouncy', href: '#/gallery' }, '🖍️ Start Coloring')));

  if (items.length) grid.replaceChildren(...items.map(card));
  else grid.replaceChildren(empty());
  setCleanup(() => urls.forEach((u) => URL.revokeObjectURL(u)));
  return h('section', { class: 'view' }, h('h1', {}, '⭐ My Art'), grid);
}
