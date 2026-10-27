// Visual delight: sketchy crayon fills, sparkles, confetti. All respect reduced motion.
import { reducedMotion } from './storage.js';

const NS = 'http://www.w3.org/2000/svg';
let clipCounter = 0;

// Crayon tip that follows the scribble while a space is being colored.
function crayonEl(color) {
  const el = document.createElement('div');
  el.className = 'crayon-tip';
  el.innerHTML = `<svg viewBox="0 0 40 120" width="30" height="90" aria-hidden="true"><path d="M8 34L20 2L32 34Z" fill="${color}" stroke="#2b2340" stroke-width="3" stroke-linejoin="round"/><rect x="8" y="34" width="24" height="80" rx="4" fill="${color}" stroke="#2b2340" stroke-width="3"/><rect x="8" y="50" width="24" height="44" fill="#fff" opacity=".55"/><path d="M12 62h16M12 80h16" stroke="#2b2340" stroke-width="2.5" opacity=".5"/></svg>`;
  document.body.append(el);
  return el;
}

// Hand-drawn zig-zag rows covering a box, starting at the tapped row and
// spreading up and down. Returns two continuous paths (down and up).
function scribblePaths(bb, tap, s) {
  const rowH = s * 1.7;
  const rows = [];
  for (let y = bb.y - rowH * 0.3; y < bb.y + bb.height + rowH * 0.5; y += rowH) rows.push(y);
  const startRow = Math.max(0, Math.min(rows.length - 1, Math.round((tap.y - rows[0]) / rowH)));
  const jit = () => (Math.random() - 0.5) * s * 0.5;
  const row = (y, leftToRight) => {
    const pts = [];
    const x0 = bb.x - s, x1 = bb.x + bb.width + s;
    const step = s * 0.85;
    const n = Math.max(2, Math.ceil((x1 - x0) / step));
    for (let i = 0; i <= n; i++) {
      const t = leftToRight ? i / n : 1 - i / n;
      pts.push([x0 + (x1 - x0) * t + jit(), y + (i % 2 ? rowH * 0.62 : -rowH * 0.62) + jit()]);
    }
    return pts;
  };
  const build = (indices) => {
    const pts = [];
    indices.forEach((ri, k) => pts.push(...row(rows[ri], k % 2 === 0)));
    return pts.length ? 'M' + pts.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join('L') : '';
  };
  const down = [], up = [];
  for (let i = startRow; i < rows.length; i++) down.push(i);
  for (let i = startRow - 1; i >= 0; i--) up.push(i);
  return [build(down), build(up)];
}

// Animate a space being colored in with crayon scribbles, then commit the fill.
// Returns the animation duration in ms (0 when it ran instantly).
export function sketchFill(path, paint, clientPt, done, { color = '#888', crayon = true, fast = false } = {}) {
  if (reducedMotion() || !path.getBBox) {
    done();
    return 0;
  }
  let local, bb;
  try {
    const p = path.ownerSVGElement.createSVGPoint();
    p.x = clientPt.x;
    p.y = clientPt.y;
    local = p.matrixTransform(path.getScreenCTM().inverse());
    bb = path.getBBox();
  } catch {
    done();
    return 0;
  }
  const parent = path.parentNode;
  const id = `cj-clip-${++clipCounter}`;
  const clip = document.createElementNS(NS, 'clipPath');
  clip.id = id;
  const use = document.createElementNS(NS, 'use');
  use.setAttribute('href', `#${path.id}`);
  clip.append(use);
  // Outer group is clipped in the parent's space; inner group shares the path's own transform.
  const outer = document.createElementNS(NS, 'g');
  outer.setAttribute('clip-path', `url(#${id})`);
  outer.setAttribute('class', 'cj-scribble');
  outer.style.pointerEvents = 'none';
  const inner = document.createElementNS(NS, 'g');
  if (path.getAttribute('transform')) inner.setAttribute('transform', path.getAttribute('transform'));
  outer.append(inner);
  const size = Math.max(bb.width, bb.height);
  const s = Math.max(9, Math.min(30, size / 11));
  const strokes = scribblePaths(bb, local, s).filter(Boolean).map((d) => {
    const el = document.createElementNS(NS, 'path');
    el.setAttribute('d', d);
    el.setAttribute('fill', 'none');
    el.setAttribute('stroke-linecap', 'round');
    el.setAttribute('stroke-linejoin', 'round');
    el.style.stroke = paint;
    el.style.strokeWidth = s * 1.45;
    inner.append(el);
    return el;
  });
  parent.insertBefore(clip, path.nextSibling);
  parent.insertBefore(outer, clip.nextSibling);
  const lens = strokes.map((el) => el.getTotalLength());
  strokes.forEach((el, i) => {
    el.style.strokeDasharray = `${lens[i]} ${lens[i]}`;
    el.style.strokeDashoffset = lens[i];
  });
  const longest = Math.max(1, ...lens);
  const dur = Math.round(Math.max(380, Math.min(fast ? 700 : 1300, longest / 3.2)));
  const leader = strokes[lens.indexOf(longest)];
  const tip = crayon ? crayonEl(color) : null;
  const start = performance.now();
  let finished = false;
  const finish = () => {
    if (finished) return;
    finished = true;
    done();
    tip?.remove();
    // Let the scribble fade into the solid color.
    outer.style.transition = 'opacity .25s';
    outer.style.opacity = '0';
    setTimeout(() => { outer.remove(); clip.remove(); }, 260);
  };
  const tick = (now) => {
    if (finished) return;
    const t = Math.max(0, Math.min(1, (now - start) / dur));
    const e = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
    strokes.forEach((el, i) => { el.style.strokeDashoffset = lens[i] - lens[i] * Math.min(1, (e * longest) / lens[i]); });
    if (tip && leader) {
      const pt = leader.getPointAtLength(Math.min(lens[strokes.indexOf(leader)], e * longest));
      const sp = path.ownerSVGElement.createSVGPoint();
      sp.x = pt.x;
      sp.y = pt.y;
      const c = sp.matrixTransform(inner.getScreenCTM());
      tip.style.transform = `translate(${c.x}px, ${c.y}px) rotate(${200 + Math.sin(now / 55) * 10}deg)`;
    }
    if (t < 1) requestAnimationFrame(tick);
    else finish();
  };
  requestAnimationFrame(tick);
  // Safety net if the tab is hidden and rAF pauses.
  setTimeout(finish, dur + 600);
  return dur;
}

const SPARKS = ['✨', '⭐', '💫', '🌟'];
export function sparkleAt(x, y, count = 6) {
  if (reducedMotion()) return;
  for (let i = 0; i < count; i++) {
    const s = document.createElement('span');
    s.className = 'sparkle-dot';
    s.textContent = SPARKS[i % SPARKS.length];
    const ang = Math.random() * Math.PI * 2, d = 30 + Math.random() * 60;
    s.style.left = `${x - 9}px`;
    s.style.top = `${y - 9}px`;
    s.style.setProperty('--dx', `${Math.cos(ang) * d}px`);
    s.style.setProperty('--dy', `${Math.sin(ang) * d}px`);
    document.body.append(s);
    setTimeout(() => s.remove(), 900);
  }
}

export function confetti(duration = 3200) {
  if (reducedMotion()) return;
  const c = document.createElement('canvas');
  c.className = 'fx-canvas';
  const dpr = Math.min(2, devicePixelRatio || 1);
  c.width = innerWidth * dpr;
  c.height = innerHeight * dpr;
  document.body.append(c);
  const ctx = c.getContext('2d');
  ctx.scale(dpr, dpr);
  const colors = ['#ff6b6b', '#ffd43b', '#69db7c', '#4dabf7', '#b197fc', '#f783ac', '#ff922b'];
  const parts = Array.from({ length: 160 }, () => ({
    x: innerWidth / 2 + (Math.random() - 0.5) * innerWidth * 0.3,
    y: innerHeight * 0.35,
    vx: (Math.random() - 0.5) * 14,
    vy: -6 - Math.random() * 12,
    r: 5 + Math.random() * 7,
    rot: Math.random() * 6,
    vr: (Math.random() - 0.5) * 0.4,
    color: colors[Math.floor(Math.random() * colors.length)],
    shape: Math.floor(Math.random() * 3),
  }));
  const start = performance.now();
  const frame = (now) => {
    const t = now - start;
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    ctx.globalAlpha = Math.max(0, 1 - Math.max(0, t - duration + 800) / 800);
    for (const p of parts) {
      p.vy += 0.32;
      p.vx *= 0.99;
      p.x += p.vx;
      p.y += p.vy;
      p.rot += p.vr;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = p.color;
      if (p.shape === 0) ctx.fillRect(-p.r, -p.r / 2, p.r * 2, p.r);
      else if (p.shape === 1) { ctx.beginPath(); ctx.arc(0, 0, p.r * 0.7, 0, Math.PI * 2); ctx.fill(); }
      else { ctx.beginPath(); for (let i = 0; i < 10; i++) { const rr = i % 2 ? p.r * 0.45 : p.r; ctx.lineTo(Math.cos((i * Math.PI) / 5) * rr, Math.sin((i * Math.PI) / 5) * rr); } ctx.fill(); }
      ctx.restore();
    }
    if (t < duration) requestAnimationFrame(frame);
    else c.remove();
  };
  requestAnimationFrame(frame);
}
