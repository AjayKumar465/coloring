// Sticker layer: place, drag, resize and rotate stamps over the picture.
// Sticker positions are stored in picture units (0-800) so they survive resizes and zoom.

let uidCounter = 0;
const clone = (list) => list.map((s) => ({ ...s }));

export function createStickerLayer(layer, { toArt, onChange, onSelect }) {
  let list = [];
  let selected = null;
  const els = new Map();

  function place(el, s) {
    el.style.left = `${(s.x / 800) * 100}%`;
    el.style.top = `${(s.y / 800) * 100}%`;
    el.style.width = el.style.height = `${(s.size / 800) * 100}%`;
    el.style.setProperty('--rot', `${s.rot}deg`);
  }

  function render() {
    const keep = new Set(list.map((s) => s.uid));
    for (const [uid, el] of els) if (!keep.has(uid)) { el.remove(); els.delete(uid); }
    for (const s of list) {
      let el = els.get(s.uid);
      if (!el) {
        el = build(s.uid);
        els.set(s.uid, el);
        layer.append(el);
      }
      const img = el.querySelector('img');
      if (img.dataset.src !== s.src) {
        img.dataset.src = s.src;
        img.src = `stickers/${s.src}.svg`;
      }
      place(el, s);
      el.classList.toggle('selected', s.uid === selected);
    }
  }

  function find(uid) {
    return list.find((s) => s.uid === uid);
  }

  function build(uid) {
    const el = document.createElement('div');
    el.className = 'sticker';
    el.innerHTML = '<img alt="" draggable="false"><button class="del" type="button" aria-label="Remove sticker">✕</button><button class="handle" type="button" aria-label="Resize or turn sticker">↻</button>';
    el.dataset.uid = uid;
    el.tabIndex = 0;
    el.setAttribute('role', 'img');
    el.setAttribute('aria-label', 'Sticker. Use arrow keys to move, plus and minus to resize, R to turn, Delete to remove.');

    el.querySelector('.del').addEventListener('pointerdown', (e) => e.stopPropagation());
    el.querySelector('.del').addEventListener('click', (e) => {
      e.stopPropagation();
      remove(uid);
    });

    // Drag to move
    el.addEventListener('pointerdown', (e) => {
      if (e.target.closest('.handle, .del')) return;
      e.stopPropagation();
      select(uid);
      const s = find(uid);
      const before = clone(list);
      const p0 = toArt(e.clientX, e.clientY);
      const start = { x: s.x, y: s.y };
      el.setPointerCapture(e.pointerId);
      let moved = false;
      const move = (ev) => {
        const p = toArt(ev.clientX, ev.clientY);
        s.x = Math.max(0, Math.min(800, start.x + p.x - p0.x));
        s.y = Math.max(0, Math.min(800, start.y + p.y - p0.y));
        moved = true;
        place(el, s);
      };
      const up = () => {
        el.removeEventListener('pointermove', move);
        el.removeEventListener('pointerup', up);
        el.removeEventListener('pointercancel', up);
        if (moved) onChange(before);
      };
      el.addEventListener('pointermove', move);
      el.addEventListener('pointerup', up);
      el.addEventListener('pointercancel', up);
    });

    // Corner handle: resize + rotate around the sticker center
    const handle = el.querySelector('.handle');
    handle.addEventListener('pointerdown', (e) => {
      e.stopPropagation();
      const s = find(uid);
      const before = clone(list);
      const p0 = toArt(e.clientX, e.clientY);
      const d0 = Math.hypot(p0.x - s.x, p0.y - s.y) || 1;
      const a0 = Math.atan2(p0.y - s.y, p0.x - s.x);
      const start = { size: s.size, rot: s.rot };
      handle.setPointerCapture(e.pointerId);
      const move = (ev) => {
        const p = toArt(ev.clientX, ev.clientY);
        const d = Math.hypot(p.x - s.x, p.y - s.y);
        const a = Math.atan2(p.y - s.y, p.x - s.x);
        s.size = Math.max(30, Math.min(600, (start.size * d) / d0));
        s.rot = start.rot + ((a - a0) * 180) / Math.PI;
        place(el, s);
      };
      const up = () => {
        handle.removeEventListener('pointermove', move);
        handle.removeEventListener('pointerup', up);
        handle.removeEventListener('pointercancel', up);
        onChange(before);
      };
      handle.addEventListener('pointermove', move);
      handle.addEventListener('pointerup', up);
      handle.addEventListener('pointercancel', up);
    });

    el.addEventListener('keydown', (e) => {
      const s = find(uid);
      if (!s) return;
      const before = clone(list);
      const step = e.shiftKey ? 40 : 10;
      const keys = {
        ArrowLeft: () => (s.x -= step), ArrowRight: () => (s.x += step), ArrowUp: () => (s.y -= step), ArrowDown: () => (s.y += step),
        '+': () => (s.size = Math.min(600, s.size * 1.1)), '=': () => (s.size = Math.min(600, s.size * 1.1)),
        '-': () => (s.size = Math.max(30, s.size / 1.1)), r: () => (s.rot += 15), R: () => (s.rot -= 15),
      };
      if (e.key === 'Delete' || e.key === 'Backspace') { e.preventDefault(); remove(uid); return; }
      if (keys[e.key]) {
        e.preventDefault();
        keys[e.key]();
        place(el, s);
        onChange(before);
      }
    });
    el.addEventListener('focus', () => select(uid));
    return el;
  }

  function select(uid) {
    selected = uid;
    for (const [id, el] of els) el.classList.toggle('selected', id === uid);
    onSelect && onSelect(uid);
  }

  function add(src, x, y, size = 130) {
    const before = clone(list);
    const s = { uid: `s${Date.now().toString(36)}${++uidCounter}`, src, x, y, size, rot: Math.round((Math.random() - 0.5) * 24) };
    list.push(s);
    selected = s.uid;
    render();
    onChange(before);
    return s;
  }

  function remove(uid) {
    const before = clone(list);
    list = list.filter((s) => s.uid !== uid);
    if (selected === uid) selected = null;
    render();
    onChange(before);
  }

  return {
    add,
    remove,
    select,
    get: () => clone(list),
    set(next) {
      list = clone(next || []);
      if (!list.some((s) => s.uid === selected)) selected = null;
      render();
    },
    setEditable(on) {
      layer.classList.toggle('editable', on);
      if (!on) select(null);
    },
  };
}
