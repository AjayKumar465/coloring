// The coloring screen. Loaded on demand (code-split) when a picture is opened.
//
// Layer stack inside the stage (bottom to top):
//   1. fill layer  - the SVG; tap a region to fill it
//   2. paint layer - <canvas> for brushes
//   3. line layer  - a copy of the SVG blended with "multiply" so outlines always stay on top
//   4. sticker layer
import { h, toast, speak, modal, confirmKid } from './ui.js';
import { settings, progress, art, lsGet, lsSet, reducedMotion } from './storage.js';
import { play } from './audio.js';
import { mascotSVG, mascotReact } from './mascot.js';
import { PALETTE, PALETTE_CB, PATTERNS, paintFor, fillValue, isFilled, patternPreviewCSS, magicPalette, shade } from './tools.js';
import { BRUSHES, createStroke, drawPreview } from './brushes.js';
import { sketchFill, sparkleAt, confetti, createToolCursor } from './animations.js';
import { createStickerLayer } from './stickers.js';
import { isNative, shareImage } from './native.js';

const RES = 1600; // paint canvas resolution (2x the 800 viewBox)
const K = RES / 800;
const HISTORY_MAX = 40;
const MAX_ZOOM = 5;

const TOOLS = [
  ['fill', 'Fill', '🪣'],
  ['brush', 'Brush', '🖌️'],
  ['pattern', 'Pattern', '🎨'],
  ['sticker', 'Sticker', '🦄'],
  ['eraser', 'Eraser', '🧽'],
  ['pan', 'Move', '✋'],
];

export async function renderCanvas(catalog, image, setCleanup) {
  const [svgText, saved, stickerList] = await Promise.all([
    fetch(image.file).then((r) => {
      if (!r.ok) throw new Error('missing picture');
      return r.text();
    }),
    progress.get(image.id),
    fetch('stickers/stickers.json').then((r) => r.json()).catch(() => []),
  ]);

  const prefs = settings.get();
  const palette = prefs.colorblind ? PALETTE_CB : PALETTE;
  const state = {
    tool: 'fill',
    brush: lsGet('brush', 'crayon'),
    pattern: lsGet('pattern', 'stripes'),
    color: lsGet('color', palette[0][0]),
    size: lsGet('size', 22),
    sticker: stickerList[0]?.id || 'star',
    fills: {},
    hasPaint: false,
    celebrated: !!saved?.done,
    milestones: new Set(),
    alive: false,
    zoom: { s: 1, tx: 0, ty: 0 },
  };
  const undoStack = [];
  const redoStack = [];

  // ---------- Build the SVG layers ----------
  const doc = new DOMParser().parseFromString(svgText, 'image/svg+xml');
  const src = doc.documentElement;
  src.querySelectorAll('style, title').forEach((n) => n.remove());
  src.classList.add('art');
  src.removeAttribute('width');
  src.removeAttribute('height');
  const fillSvg = document.importNode(src, true);
  fillSvg.setAttribute('role', 'group');
  fillSvg.setAttribute('aria-label', `${image.title}. Tab to each space and press Enter to fill it.`);
  const lineSvg = document.importNode(src, true);
  lineSvg.setAttribute('aria-hidden', 'true');
  lineSvg.querySelectorAll('[id]').forEach((n) => n.removeAttribute('id'));
  const regions = [...fillSvg.querySelectorAll('.fillable')];
  regions.forEach((p, i) => {
    p.setAttribute('tabindex', '0');
    p.setAttribute('role', 'button');
    p.setAttribute('aria-label', `Space ${i + 1} of ${regions.length}`);
  });

  // ---------- DOM ----------
  const paint = h('canvas', { class: 'layer paint-layer', width: RES, height: RES, 'aria-hidden': 'true' });
  const ctx = paint.getContext('2d', { willReadFrequently: true });
  const stickerLayerEl = h('div', { class: 'layer sticker-layer' });
  const life = h('div', { class: 'life' },
    h('div', { class: 'layer fill-layer' }, fillSvg),
    paint,
    h('div', { class: 'layer line-layer' }, lineSvg),
    stickerLayerEl
  );
  const stage = h('div', { class: 'stage', 'data-life': image.anim || 'float' }, life);
  const zoomBadge = h('div', { class: 'zoom-badge', hidden: true });
  const wrap = h('div', { class: 'stage-wrap tool-fill' }, stage, zoomBadge);

  const btn = (icon, label, onclick, extra = {}) =>
    h('button', { class: `icon-btn bouncy ${extra.cls || ''}`, type: 'button', 'aria-label': label, title: label, onclick, ...extra.attrs }, h('span', { 'aria-hidden': 'true' }, icon), h('small', {}, extra.short || label));

  const undoBtn = btn('↩️', 'Undo', () => undo(), { attrs: { disabled: true } });
  const redoBtn = btn('↪️', 'Redo', () => redo(), { attrs: { disabled: true } });
  const lifeBtn = btn('🪄', 'Bring to Life', () => toggleLife(), { short: 'Alive', attrs: { 'aria-pressed': 'false' } });
  const saveBtn = btn('⭐', 'Save to My Art', () => saveToArt(), { short: 'Save' });
  const miniMascot = h('div', { class: 'mascot-wrap mini', html: mascotSVG('mascot-mini') });

  const topbar = h('div', { class: 'topbar', role: 'toolbar', 'aria-label': 'Picture actions' },
    h('a', { class: 'icon-btn bouncy', href: `#/gallery?cat=${image.category}`, 'aria-label': 'Back to pictures', title: 'Back' }, h('span', { 'aria-hidden': 'true' }, '⬅️'), h('small', {}, 'Back')),
    h('h1', { class: 'title' }, image.title),
    undoBtn, redoBtn,
    btn('➖', 'Zoom out', () => zoomBy(1 / 1.4), { short: 'Zoom' }),
    btn('➕', 'Zoom in', () => zoomBy(1.4), { short: 'Zoom' }),
    btn('🔍', 'Fit picture', () => setZoom(1, 0, 0), { short: 'Fit' }),
    btn('✨', 'Magic Color', () => magicColor(), { cls: 'magic', short: 'Magic' }),
    lifeBtn,
    saveBtn,
    btn('💾', 'Download picture', () => download(), { short: 'Download' }),
    isNative() ? null : btn('🖨️', 'Print', () => printDialog(), { short: 'Print' }),
    btn('🗑️', 'Start over', () => clearAll(), { short: 'Clear' }),
    miniMascot
  );

  const toolButtons = TOOLS.map(([id, label, icon]) =>
    h('button', { class: 'icon-btn bouncy', type: 'button', 'data-tool': id, 'aria-pressed': String(id === state.tool), 'aria-label': label, title: label, onclick: () => setTool(id) },
      h('span', { 'aria-hidden': 'true' }, icon), h('small', {}, label)));
  const toolcol = h('div', { class: 'toolcol', role: 'toolbar', 'aria-label': 'Tools', 'aria-orientation': 'vertical' }, toolButtons);

  const options = h('div', { class: 'options', role: 'group', 'aria-label': 'Tool options' });
  const paletteRow = h('div', { class: 'palette-row', role: 'group', 'aria-label': 'Colors' });
  const previewCanvas = h('canvas', { class: 'size-preview', width: 128, height: 128, 'aria-hidden': 'true' });
  const sizeInput = h('input', { type: 'range', min: 2, max: 70, value: state.size, 'aria-label': 'Brush size' });
  const sizeRow = h('div', { class: 'size-row' }, h('span', { 'aria-hidden': 'true' }, '•'), sizeInput, h('span', { 'aria-hidden': 'true', style: { fontSize: '30px' } }, '●'), previewCanvas);
  const dock = h('div', { class: 'dock' }, options, sizeRow, paletteRow);

  const root = h('section', { class: 'color-screen', 'aria-label': `Coloring ${image.title}` }, topbar, h('div', { class: 'workspace' }, toolcol, wrap), dock);

  // ---------- Stickers ----------
  const stickers = createStickerLayer(stickerLayerEl, {
    toArt,
    onChange: (before) => {
      push({ type: 'stickers', before, after: stickers.get() });
      play('stamp');
    },
  });

  // ---------- Helpers ----------
  function toArt(clientX, clientY) {
    const r = stage.getBoundingClientRect();
    return { x: ((clientX - r.left) / r.width) * 800, y: ((clientY - r.top) / r.height) * 800 };
  }
  function toClient(artX, artY) {
    const r = stage.getBoundingClientRect();
    return { x: r.left + (artX / 800) * r.width, y: r.top + (artY / 800) * r.height };
  }

  function rememberColor(c) {
    const recent = lsGet('recentColors', []).filter((x) => x !== c);
    recent.unshift(c);
    lsSet('recentColors', recent.slice(0, 8));
  }

  // ---------- Palette ----------
  function renderPalette() {
    const swatch = (c, name) => h('button', {
      class: 'swatch bouncy', type: 'button', style: { '--sw': c }, 'aria-label': name, title: name,
      'aria-pressed': String(c.toLowerCase() === state.color.toLowerCase()),
      onclick: () => setColor(c, name),
    });
    const custom = h('input', { type: 'color', value: state.color, 'aria-label': 'Pick any color' });
    custom.addEventListener('input', () => setColor(custom.value, 'Your color', true));
    custom.addEventListener('change', () => rememberColor(custom.value));
    const recent = lsGet('recentColors', []).filter((c) => !palette.some(([p]) => p === c));
    paletteRow.replaceChildren(
      ...palette.map(([c, name]) => swatch(c, name)),
      h('label', { class: 'swatch custom-color bouncy', title: 'Pick any color' }, custom),
      ...(recent.length ? [h('span', { class: 'recent-label' }, 'Recent'), ...recent.map((c) => swatch(c, `Recent color ${c}`))] : [])
    );
  }

  function setColor(c, name, quiet) {
    state.color = c;
    lsSet('color', c);
    paletteRow.querySelectorAll('.swatch[style]').forEach((b) => b.setAttribute('aria-pressed', String(b.style.getPropertyValue('--sw').trim().toLowerCase() === c.toLowerCase())));
    if (!quiet) {
      play('click');
      if (name) speak(name);
    }
    if (state.tool === 'pattern') renderOptions();
    updatePreview();
  }

  // ---------- Tools ----------
  function setTool(id) {
    state.tool = id;
    toolCursor?.hide();
    toolButtons.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.tool === id)));
    wrap.className = `stage-wrap tool-${id}`;
    stickers.setEditable(id === 'sticker');
    sizeRow.hidden = !(id === 'brush' || id === 'eraser');
    speak(TOOLS.find((t) => t[0] === id)[1]);
    renderOptions();
    updatePreview();
  }

  function renderOptions() {
    const opt = (pressed, label, content, onclick) =>
      h('button', { class: 'opt bouncy', type: 'button', 'aria-pressed': String(pressed), 'aria-label': label, title: label, onclick }, content);
    const hint = (t) => h('p', { style: { margin: '0 8px', fontWeight: 800, color: 'var(--ink-soft)' } }, t);
    let items = [];
    if (state.tool === 'brush') {
      items = BRUSHES.map(([id, label, icon]) => opt(state.brush === id, label, [h('span', { 'aria-hidden': 'true' }, icon), h('small', {}, label)], () => {
        state.brush = id;
        lsSet('brush', id);
        speak(label);
        renderOptions();
        updatePreview();
      }));
    } else if (state.tool === 'pattern') {
      items = PATTERNS.map(([id, label]) => opt(state.pattern === id, label, [h('span', { class: 'pat', style: { background: patternPreviewCSS(id, state.color) } }), h('small', {}, label)], () => {
        state.pattern = id;
        lsSet('pattern', id);
        speak(label);
        renderOptions();
      }));
    } else if (state.tool === 'sticker') {
      items = stickerList.map((s) => opt(state.sticker === s.id, s.title, h('img', { src: s.file, alt: '', loading: 'lazy', width: 40, height: 40 }), () => {
        state.sticker = s.id;
        speak(s.title);
        renderOptions();
      }));
      items.unshift(hint('Tap the picture to stamp!'));
    } else if (state.tool === 'fill') items = [hint('👆 Tap a space to fill it with color!')];
    else if (state.tool === 'eraser') items = [hint('Rub out colors, brush marks and stickers. Lines never get erased.')];
    else items = [hint('Drag to move around. Pinch or use ➕ ➖ to zoom.')];
    options.replaceChildren(...items);
  }

  function updatePreview() {
    if (sizeRow.hidden) return;
    const type = state.tool === 'eraser' ? 'marker' : state.brush;
    drawPreview(previewCanvas, type, state.tool === 'eraser' ? '#dee2e6' : state.color, state.size * K * (128 / 200));
  }
  sizeInput.addEventListener('input', () => {
    state.size = Number(sizeInput.value);
    lsSet('size', state.size);
    updatePreview();
  });

  // ---------- Fill ----------
  function applyFill(id, value, animate = false, clientPt = null, anim = {}) {
    const el = fillSvg.getElementById(id);
    if (!el) return;
    if (!value) {
      delete state.fills[id];
      el.style.fill = '';
      return;
    }
    state.fills[id] = value;
    const p = paintFor(fillSvg, value);
    if (animate && clientPt) {
      const color = value.startsWith('pat:') ? value.split(':')[2] : value;
      return sketchFill(el, p, clientPt, () => { el.style.fill = p; }, { color, ...anim });
    }
    el.style.fill = p;
    return 0;
  }

  function fillRegion(el, clientPt) {
    const value = state.tool === 'pattern' ? fillValue(state.pattern, state.color) : state.color;
    const from = state.fills[el.id] || null;
    if (from === value) return;
    const dur = applyFill(el.id, value, true, clientPt);
    push({ type: 'fill', changes: [{ id: el.id, from, to: value }] });
    rememberColor(state.color);
    if (dur) play('scribble', { dur });
    else play('pop');
    checkProgress();
  }

  function regionCenter(el) {
    const r = el.getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
  }

  fillSvg.addEventListener('keydown', (e) => {
    const el = e.target.closest?.('.fillable');
    if (!el || (e.key !== 'Enter' && e.key !== ' ')) return;
    e.preventDefault();
    if (state.tool !== 'fill' && state.tool !== 'pattern') setTool('fill');
    fillRegion(el, regionCenter(el));
  });

  // ---------- Progress & celebration ----------
  function filledRatio() {
    const n = regions.reduce((acc, r) => acc + (isFilled(state.fills[r.id]) ? 1 : 0), 0);
    return n / regions.length;
  }

  function checkProgress() {
    const ratio = filledRatio();
    for (const m of [0.25, 0.5, 0.75]) {
      if (ratio >= m && !state.milestones.has(m) && !state.celebrated) {
        state.milestones.add(m);
        const msg = m === 0.25 ? 'Great start!' : m === 0.5 ? 'Halfway there!' : 'Almost done!';
        mascotReact(miniMascot, 'clap', msg);
        speak(msg);
      }
    }
    if (ratio >= 0.9 && !state.celebrated) celebrate();
    scheduleSave();
  }

  function celebrate() {
    state.celebrated = true;
    confetti();
    play('fanfare');
    mascotReact(miniMascot, 'cheer', 'You did it!');
    speak('You did it! Tap the magic wand to bring your picture to life!');
    toast('🎉 Picture complete! Tap 🪄 to bring it to life!', 3500);
    lifeBtn.classList.add('glow');
    scheduleSave();
  }

  function toggleLife(force) {
    state.alive = force ?? !state.alive;
    stage.classList.toggle('alive', state.alive && !reducedMotion());
    lifeBtn.setAttribute('aria-pressed', String(state.alive));
    lifeBtn.classList.remove('glow');
    if (state.alive) {
      if (reducedMotion()) toast('Motion is turned off in settings.');
      play('magic');
      mascotReact(miniMascot, 'cheer', 'It’s alive!');
      speak('It is alive!');
      const r = wrap.getBoundingClientRect();
      sparkleAt(r.left + r.width / 2, r.top + r.height / 2, 14);
    }
  }

  // ---------- Magic Color ----------
  function magicColor() {
    const pal = magicPalette();
    const changes = [];
    regions.forEach((el, i) => {
      let c = pal[(i * 3 + Math.floor(i / 5)) % pal.length];
      if (i === 0) c = shade(pal[0], 28);
      changes.push({ id: el.id, from: state.fills[el.id] || null, to: c });
    });
    const fast = reducedMotion();
    changes.forEach((ch, i) => {
      const el = fillSvg.getElementById(ch.id);
      if (fast) applyFill(ch.id, ch.to);
      else setTimeout(() => applyFill(ch.id, ch.to, true, regionCenter(el), { crayon: false, fast: true }), Math.min(1200, i * 18));
    });
    push({ type: 'fill', changes });
    play('magic');
    mascotReact(miniMascot, 'cheer', 'Magic!');
    speak('Magic colors!');
    setTimeout(checkProgress, fast ? 0 : Math.min(1300, changes.length * 18 + 400));
  }

  // ---------- History ----------
  function push(action) {
    undoStack.push(action);
    if (undoStack.length > HISTORY_MAX) undoStack.shift();
    redoStack.length = 0;
    updateHistoryButtons();
    scheduleSave();
  }
  function updateHistoryButtons() {
    undoBtn.disabled = !undoStack.length;
    redoBtn.disabled = !redoStack.length;
  }
  function applyAction(a, dir) {
    const key = dir === 'undo' ? 'before' : 'after';
    if (a.type === 'fill') for (const c of a.changes) applyFill(c.id, dir === 'undo' ? c.from : c.to);
    else if (a.type === 'paint') {
      ctx.putImageData(a[key], a.x, a.y);
      state.hasPaint = true;
    } else if (a.type === 'stickers') stickers.set(a[key]);
    else if (a.type === 'group') (dir === 'undo' ? [...a.actions].reverse() : a.actions).forEach((x) => applyAction(x, dir));
    else if (a.type === 'clear') {
      if (dir === 'undo') {
        for (const [id, v] of Object.entries(a.fills)) applyFill(id, v);
        ctx.putImageData(a.paint, 0, 0);
        stickers.set(a.stickers);
        state.hasPaint = true;
      } else wipe();
    }
  }
  function undo() {
    const a = undoStack.pop();
    if (!a) return;
    applyAction(a, 'undo');
    redoStack.push(a);
    play('undo');
    updateHistoryButtons();
    scheduleSave();
  }
  function redo() {
    const a = redoStack.pop();
    if (!a) return;
    applyAction(a, 'redo');
    undoStack.push(a);
    play('click');
    updateHistoryButtons();
    scheduleSave();
  }

  function wipe() {
    for (const id of Object.keys(state.fills)) applyFill(id, null);
    ctx.clearRect(0, 0, RES, RES);
    stickers.set([]);
    state.hasPaint = false;
  }

  async function clearAll() {
    if (!(await confirmKid('Start over?', 'This clears all your colors. You can tap Undo to bring them back.', '🗑️ Clear', 'Keep it'))) return;
    const a = { type: 'clear', fills: { ...state.fills }, paint: ctx.getImageData(0, 0, RES, RES), stickers: stickers.get() };
    wipe();
    state.celebrated = false;
    state.milestones.clear();
    push(a);
    play('whoosh');
  }

  // ---------- Zoom & pan ----------
  let stageSize = 600;
  function origin() {
    const r = wrap.getBoundingClientRect();
    return { x: r.left + (r.width - stageSize) / 2, y: r.top + (r.height - stageSize) / 2 };
  }
  function setZoom(s, tx, ty) {
    s = Math.max(1, Math.min(MAX_ZOOM, s));
    const min = stageSize * (1 - s) - stageSize * 0.25, max = stageSize * 0.25;
    if (s === 1) { tx = 0; ty = 0; }
    state.zoom = { s, tx: Math.max(min, Math.min(max, tx)), ty: Math.max(min, Math.min(max, ty)) };
    stage.style.transform = `translate(${state.zoom.tx}px, ${state.zoom.ty}px) scale(${s})`;
    zoomBadge.hidden = s === 1;
    zoomBadge.textContent = `${Math.round(s * 100)}%`;
  }
  function zoomAt(factor, clientX, clientY) {
    const o = origin();
    const { s, tx, ty } = state.zoom;
    const ns = Math.max(1, Math.min(MAX_ZOOM, s * factor));
    const px = clientX - o.x, py = clientY - o.y;
    setZoom(ns, px - (px - tx) * (ns / s), py - (py - ty) * (ns / s));
  }
  function zoomBy(factor) {
    const r = wrap.getBoundingClientRect();
    zoomAt(factor, r.left + r.width / 2, r.top + r.height / 2);
  }
  const ro = new ResizeObserver(() => {
    const r = wrap.getBoundingClientRect();
    stageSize = Math.max(200, Math.floor(Math.min(r.width, r.height) - 12));
    stage.style.setProperty('--stage', `${stageSize}px`);
    setZoom(state.zoom.s, state.zoom.tx, state.zoom.ty);
  });
  ro.observe(wrap);
  wrap.addEventListener('wheel', (e) => {
    e.preventDefault();
    zoomAt(Math.exp(-e.deltaY * 0.0015), e.clientX, e.clientY);
  }, { passive: false });

  // ---------- Pointer input ----------
  const pointers = new Map();
  let gesture = null;
  const toolCursor = createToolCursor();
  const drawTool = () => state.tool === 'brush' || state.tool === 'eraser';
  const cursorType = () => (state.tool === 'eraser' ? 'eraser' : state.brush);

  function beginStroke(e) {
    const type = state.tool === 'eraser' ? 'eraser' : state.brush;
    const snapshot = document.createElement('canvas');
    snapshot.width = snapshot.height = RES;
    snapshot.getContext('2d').drawImage(paint, 0, 0);
    const p = toArt(e.clientX, e.clientY);
    const pt = { x: p.x * K, y: p.y * K };
    const size = state.size * K;
    const stroke = createStroke(type, state.color, size);
    gesture = { kind: 'stroke', stroke, last: pt, snapshot, box: { x0: pt.x, y0: pt.y, x1: pt.x, y1: pt.y }, pad: size * 1.2 + 4, type };
    toolCursor.show(type, state.color, e.clientX, e.clientY);
    toolCursor.press(true);
    if (type === 'eraser') {
      gesture.fillChanges = new Map();
      gesture.stickersBefore = null;
      eraseUnder(e.clientX, e.clientY);
    }
    stroke.paint(ctx, pt, pt);
    if (type !== 'eraser') rememberColor(state.color);
  }

  function continueStroke(e) {
    const events = e.getCoalescedEvents ? e.getCoalescedEvents() : [e];
    for (const ev of events.length ? events : [e]) {
      const p = toArt(ev.clientX, ev.clientY);
      const pt = { x: p.x * K, y: p.y * K };
      if (gesture.type === 'eraser') eraseUnder(ev.clientX, ev.clientY);
      const sparks = gesture.stroke.paint(ctx, gesture.last, pt);
      gesture.last = pt;
      const b = gesture.box;
      b.x0 = Math.min(b.x0, pt.x); b.y0 = Math.min(b.y0, pt.y); b.x1 = Math.max(b.x1, pt.x); b.y1 = Math.max(b.y1, pt.y);
      if (sparks) {
        const c = toClient(pt.x / K, pt.y / K);
        sparkleAt(c.x, c.y, 2);
      }
    }
  }

  // The eraser also clears bucket/pattern fills and stickers it touches.
  function eraseUnder(clientX, clientY) {
    const g = gesture;
    const r = stage.getBoundingClientRect();
    const rad = ((state.size / 2) * r.width) / 800;
    const probes = [[0, 0], [rad * 0.7, 0], [-rad * 0.7, 0], [0, rad * 0.7], [0, -rad * 0.7]];
    for (const [dx, dy] of probes) {
      const el = document.elementFromPoint(clientX + dx, clientY + dy)?.closest('.fillable');
      if (!el || !fillSvg.contains(el) || !state.fills[el.id]) continue;
      if (!g.fillChanges.has(el.id)) g.fillChanges.set(el.id, state.fills[el.id]);
      applyFill(el.id, null);
    }
    const p = toArt(clientX, clientY);
    const current = stickers.get();
    const keep = current.filter((st) => Math.hypot(st.x - p.x, st.y - p.y) > st.size * 0.42 + state.size / 2);
    if (keep.length !== current.length) {
      if (!g.stickersBefore) g.stickersBefore = current;
      stickers.set(keep);
    }
  }

  function endStroke() {
    const g = gesture;
    gesture = null;
    const actions = [];
    const x = Math.max(0, Math.floor(g.box.x0 - g.pad)), y = Math.max(0, Math.floor(g.box.y0 - g.pad));
    const w = Math.min(RES, Math.ceil(g.box.x1 + g.pad)) - x, hgt = Math.min(RES, Math.ceil(g.box.y1 + g.pad)) - y;
    if (w > 0 && hgt > 0) {
      const before = g.snapshot.getContext('2d').getImageData(x, y, w, hgt);
      const after = ctx.getImageData(x, y, w, hgt);
      state.hasPaint = true;
      actions.push({ type: 'paint', x, y, before, after });
    }
    if (g.fillChanges?.size) actions.push({ type: 'fill', changes: [...g.fillChanges].map(([id, from]) => ({ id, from, to: null })) });
    if (g.stickersBefore) actions.push({ type: 'stickers', before: g.stickersBefore, after: stickers.get() });
    if (actions.length === 1) push(actions[0]);
    else if (actions.length) push({ type: 'group', actions });
    if (g.type === 'eraser') play('erase');
  }

  wrap.addEventListener('pointerdown', (e) => {
    if (e.pointerType === 'mouse' && e.button !== 0 && e.button !== 1) return;
    wrap.setPointerCapture(e.pointerId);
    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.size === 2) {
      if (gesture?.kind === 'stroke') endStroke();
      const [a, b] = [...pointers.values()];
      const mid = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
      const o = origin();
      const { s, tx, ty } = state.zoom;
      toolCursor.hide();
      gesture = { kind: 'pinch', d0: Math.hypot(a.x - b.x, a.y - b.y) || 1, s0: s, u: { x: (mid.x - o.x - tx) / s, y: (mid.y - o.y - ty) / s } };
      return;
    }
    if (pointers.size > 2) return;
    if (state.tool === 'pan' || e.button === 1) gesture = { kind: 'pan', x: e.clientX, y: e.clientY, tx: state.zoom.tx, ty: state.zoom.ty };
    else if (state.tool === 'brush' || state.tool === 'eraser') beginStroke(e);
    else gesture = { kind: 'tap', x: e.clientX, y: e.clientY, target: e.target };
  });

  wrap.addEventListener('pointermove', (e) => {
    // With a mouse, show the drawing tool while hovering so you can see where it will draw.
    if (!pointers.size && e.pointerType === 'mouse' && drawTool()) toolCursor.show(cursorType(), state.color, e.clientX, e.clientY);
    if (!pointers.has(e.pointerId)) return;
    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (!gesture) return;
    if (gesture.kind === 'pinch' && pointers.size >= 2) {
      const [a, b] = [...pointers.values()];
      const mid = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
      const ns = Math.max(1, Math.min(MAX_ZOOM, gesture.s0 * (Math.hypot(a.x - b.x, a.y - b.y) / gesture.d0)));
      const o = origin();
      setZoom(ns, mid.x - o.x - gesture.u.x * ns, mid.y - o.y - gesture.u.y * ns);
    } else if (gesture.kind === 'pan') {
      setZoom(state.zoom.s, gesture.tx + e.clientX - gesture.x, gesture.ty + e.clientY - gesture.y);
    } else if (gesture.kind === 'stroke') {
      toolCursor.move(e.clientX, e.clientY);
      continueStroke(e);
    }
    else if (gesture.kind === 'tap' && Math.hypot(e.clientX - gesture.x, e.clientY - gesture.y) > 14 && state.zoom.s > 1) {
      // Dragging with the fill tool while zoomed pans the picture.
      gesture = { kind: 'pan', x: e.clientX, y: e.clientY, tx: state.zoom.tx, ty: state.zoom.ty };
    }
  });

  function pointerEnd(e) {
    if (!pointers.has(e.pointerId)) return;
    pointers.delete(e.pointerId);
    if (!gesture) return;
    if (gesture.kind === 'pinch') {
      if (pointers.size < 2) gesture = null;
      return;
    }
    if (gesture.kind === 'stroke') {
      endStroke();
      toolCursor.press(false);
      if (e.pointerType !== 'mouse') toolCursor.hide();
    } else if (gesture.kind === 'tap' && e.type === 'pointerup') {
      if (state.tool === 'fill' || state.tool === 'pattern') {
        const el = document.elementFromPoint(e.clientX, e.clientY)?.closest('.fillable');
        if (el && fillSvg.contains(el)) fillRegion(el, { x: e.clientX, y: e.clientY });
      } else if (state.tool === 'sticker' && !e.target.closest?.('.sticker')) {
        const p = toArt(e.clientX, e.clientY);
        stickers.add(state.sticker, p.x, p.y, 130);
        sparkleAt(e.clientX, e.clientY, 5);
      }
    }
    gesture = null;
  }
  wrap.addEventListener('pointerup', pointerEnd);
  wrap.addEventListener('pointerleave', () => { if (!gesture) toolCursor.hide(); });
  wrap.addEventListener('pointercancel', pointerEnd);

  function onKey(e) {
    if (e.target.closest?.('input, textarea, dialog')) return;
    const mod = e.ctrlKey || e.metaKey;
    if (mod && e.key.toLowerCase() === 'z') { e.preventDefault(); e.shiftKey ? redo() : undo(); }
    else if (mod && e.key.toLowerCase() === 'y') { e.preventDefault(); redo(); }
    else if (!mod && !e.target.closest?.('.sticker') && (e.key === '+' || e.key === '=')) zoomBy(1.25);
    else if (!mod && !e.target.closest?.('.sticker') && e.key === '-') zoomBy(0.8);
  }
  document.addEventListener('keydown', onKey);

  // ---------- Export / save / print ----------
  const SVG_STYLE = `.fillable{fill:#fff;stroke:#222}.line{fill:none;stroke:#222}.ink{fill:#222}.label{fill:#222;font-family:'Comic Sans MS','Chalkboard SE',Arial,sans-serif;font-weight:700}`;

  function svgDataURL(svgEl, size, linesOnly) {
    const c = svgEl.cloneNode(true);
    c.querySelectorAll('clipPath[id^="cj-clip"], g.cj-scribble').forEach((n) => n.remove());
    c.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    c.setAttribute('width', size);
    c.setAttribute('height', size);
    c.removeAttribute('class');
    const style = document.createElementNS('http://www.w3.org/2000/svg', 'style');
    style.textContent = SVG_STYLE + (linesOnly ? '.fillable{fill:#fff!important}' : '');
    c.prepend(style);
    return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(new XMLSerializer().serializeToString(c));
  }

  function loadImage(src) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
  }

  async function exportCanvas(size = 1600) {
    const c = document.createElement('canvas');
    c.width = c.height = size;
    const x = c.getContext('2d');
    x.fillStyle = '#fff';
    x.fillRect(0, 0, size, size);
    x.drawImage(await loadImage(svgDataURL(fillSvg, size, false)), 0, 0, size, size);
    x.drawImage(paint, 0, 0, size, size);
    x.globalCompositeOperation = 'multiply';
    x.drawImage(await loadImage(svgDataURL(lineSvg, size, true)), 0, 0, size, size);
    x.globalCompositeOperation = 'source-over';
    for (const s of stickers.get()) {
      try {
        const img = await loadImage(`stickers/${s.src}.svg`);
        const w = (s.size / 800) * size;
        x.save();
        x.translate((s.x / 800) * size, (s.y / 800) * size);
        x.rotate((s.rot * Math.PI) / 180);
        x.drawImage(img, -w / 2, -w / 2, w, w);
        x.restore();
      } catch { /* skip missing sticker */ }
    }
    return c;
  }
  const toBlob = (c, type = 'image/png', q) => new Promise((r) => c.toBlob(r, type, q));

  async function saveToArt() {
    try {
      const blob = await toBlob(await exportCanvas(1200));
      await art.add({ imageId: image.id, title: image.title, blob, created: Date.now() });
      const r = saveBtn.getBoundingClientRect();
      sparkleAt(r.left + r.width / 2, r.top + r.height / 2, 12);
      play('chime');
      mascotReact(miniMascot, 'cheer', 'Saved!');
      speak('Saved to My Art!');
      toast('⭐ Saved to My Art!');
    } catch (e) {
      console.error(e);
      toast('Oops, could not save. Try again.');
    }
  }

  async function download() {
    try {
      const blob = await toBlob(await exportCanvas(1600));
      if (isNative()) {
        await shareImage(blob, `colorjoy-${image.id}.png`, image.title);
        play('chime');
        return;
      }
      const url = URL.createObjectURL(blob);
      const a = h('a', { href: url, download: `colorjoy-${image.id}.png` });
      document.body.append(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 4000);
      play('chime');
      toast('💾 Picture downloaded!');
    } catch (e) {
      console.error(e);
      toast('Oops, could not make the picture.');
    }
  }

  async function printDialog() {
    const choice = await modal((dlg, close) => {
      dlg.append(
        h('h2', {}, '🖨️ Print'),
        h('p', {}, 'What would you like to print?'),
        h('div', { class: 'row', style: { justifyContent: 'center' } },
          h('button', { class: 'btn', type: 'button', onclick: () => close('blank') }, '📄 Blank page'),
          h('button', { class: 'btn btn-primary', type: 'button', onclick: () => close('colored') }, '🌈 My colors'),
          h('button', { class: 'btn btn-ghost', type: 'button', onclick: () => close(null) }, 'Cancel'))
      );
    });
    if (!choice) return;
    const srcUrl = choice === 'blank' ? image.file : (await exportCanvas(1600)).toDataURL('image/png');
    const area = document.getElementById('print-area');
    const img = h('img', { src: srcUrl, alt: image.title });
    area.replaceChildren(img);
    await new Promise((r) => (img.complete ? r() : (img.onload = img.onerror = r)));
    window.print();
    setTimeout(() => area.replaceChildren(), 1000);
  }

  // ---------- Autosave ----------
  let saveTimer = 0;
  let saving = Promise.resolve();
  function scheduleSave() {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => { saving = saving.then(saveProgress); }, 900);
  }
  async function saveProgress() {
    const hasFills = Object.values(state.fills).some(isFilled);
    const stickerData = stickers.get();
    if (!hasFills && !state.hasPaint && !stickerData.length) {
      await progress.remove(image.id);
      return;
    }
    try {
      const rec = { id: image.id, fills: { ...state.fills }, stickers: stickerData, updated: Date.now(), done: state.celebrated };
      if (state.hasPaint) rec.paint = await toBlob(paint);
      rec.thumb = (await exportCanvas(240)).toDataURL('image/jpeg', 0.82);
      await progress.put(rec);
    } catch (e) {
      console.warn('autosave failed', e);
    }
  }
  const onHide = () => {
    if (document.visibilityState === 'hidden') {
      clearTimeout(saveTimer);
      saving = saving.then(saveProgress);
    }
  };
  document.addEventListener('visibilitychange', onHide);

  // ---------- Restore saved progress ----------
  if (saved) {
    for (const [id, v] of Object.entries(saved.fills || {})) applyFill(id, v);
    stickers.set(saved.stickers || []);
    if (saved.paint) {
      try {
        const bmp = await createImageBitmap(saved.paint);
        ctx.drawImage(bmp, 0, 0, RES, RES);
        state.hasPaint = true;
      } catch (e) {
        console.warn('could not restore brush layer', e);
      }
    }
    const r = filledRatio();
    for (const m of [0.25, 0.5, 0.75]) if (r >= m) state.milestones.add(m);
  }

  renderPalette();
  setTool('fill');
  setZoom(1, 0, 0);
  setTimeout(() => {
    speak(`Let's color ${image.title}!`);
    mascotReact(miniMascot, 'clap', saved ? 'Welcome back!' : 'Let’s color!');
  }, 400);

  setCleanup(() => {
    ro.disconnect();
    toolCursor.destroy();
    document.removeEventListener('keydown', onKey);
    document.removeEventListener('visibilitychange', onHide);
    if (saveTimer) {
      clearTimeout(saveTimer);
      saving = saving.then(saveProgress);
    }
  });
  return root;
}
