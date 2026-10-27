// Original "bubble" letters and digits. Each glyph is a skeleton of strokes;
// we build a distance field around the skeleton and trace its outline with
// marching squares, giving smooth, rounded, closed outlines (with holes).

const L = (x1, y1, x2, y2) => ({ t: 'L', x1, y1, x2, y2 });
const A = (cx, cy, rx, ry, a1, a2) => ({ t: 'A', cx, cy, rx, ry, a1, a2 });

// Glyph box: width ~10, height 14 (y down). Optional w overrides width.
export const GLYPHS = {
  A: [L(1, 14, 5, 0), L(5, 0, 9, 14), L(2.8, 9.2, 7.2, 9.2)],
  B: [L(1, 0, 1, 14), L(1, 0, 5, 0), A(5, 3.5, 3.5, 3.5, -90, 90), L(1, 7, 5.5, 7), A(5.5, 10.5, 3.6, 3.5, -90, 90), L(1, 14, 5.5, 14)],
  C: [A(5.6, 7, 4.6, 6.6, 40, 320)],
  D: [L(1, 0, 1, 14), L(1, 0, 3.5, 0), L(1, 14, 3.5, 14), A(3.5, 7, 5.5, 7, -90, 90)],
  E: [L(1, 0, 1, 14), L(1, 0, 8.5, 0), L(1, 7, 7, 7), L(1, 14, 8.5, 14)],
  F: [L(1, 0, 1, 14), L(1, 0, 8.5, 0), L(1, 7, 7, 7)],
  G: [A(5.6, 7, 4.6, 6.6, 0, 320), L(6.2, 7, 10.2, 7)],
  H: [L(1, 0, 1, 14), L(9, 0, 9, 14), L(1, 7, 9, 7)],
  I: [L(5, 0, 5, 14), L(2, 0, 8, 0), L(2, 14, 8, 14)],
  J: [L(8, 0, 8, 9.5), A(4.6, 9.5, 3.4, 4.5, 0, 170), L(4, 0, 8, 0)],
  K: [L(1, 0, 1, 14), L(8.8, 0, 1, 8), L(4.2, 5, 9, 14)],
  L: [L(1, 0, 1, 14), L(1, 14, 8.5, 14)],
  M: [L(1, 14, 1, 0), L(1, 0, 5.5, 8), L(5.5, 8, 10, 0), L(10, 0, 10, 14)],
  N: [L(1, 14, 1, 0), L(1, 0, 9, 14), L(9, 14, 9, 0)],
  O: [A(5.5, 7, 4.8, 6.6, 0, 360)],
  P: [L(1, 0, 1, 14), L(1, 0, 4.8, 0), A(4.8, 4, 4.2, 4, -90, 90), L(1, 8, 4.8, 8)],
  Q: [A(5.5, 7, 4.8, 6.6, 0, 360), L(6.4, 10, 10, 14)],
  R: [L(1, 0, 1, 14), L(1, 0, 4.8, 0), A(4.8, 4, 4.2, 4, -90, 90), L(1, 8, 4.8, 8), L(4.8, 8, 9.2, 14)],
  S: [A(5, 3.6, 3.9, 3.5, 90, 335), A(5, 10.4, 4, 3.6, -90, 155)],
  T: [L(1, 0, 9, 0), L(5, 0, 5, 14)],
  U: [L(1, 0, 1, 9), A(5, 9, 4, 5, 0, 180), L(9, 0, 9, 9)],
  V: [L(1, 0, 5, 14), L(5, 14, 9, 0)],
  W: [L(0.6, 0, 3, 14), L(3, 14, 5.6, 4.5), L(5.6, 4.5, 8.2, 14), L(8.2, 14, 10.6, 0)],
  X: [L(1.2, 0, 8.8, 14), L(8.8, 0, 1.2, 14)],
  Y: [L(1, 0, 5, 7), L(9, 0, 5, 7), L(5, 7, 5, 14)],
  Z: [L(1, 0, 9, 0), L(9, 0, 1, 14), L(1, 14, 9, 14)],
  0: [A(5, 7, 4.2, 6.6, 0, 360)],
  1: [L(5.5, 0, 5.5, 14), L(5.5, 0, 2.5, 3), L(2.5, 14, 8.5, 14)],
  2: [A(5, 4.2, 4, 4, 180, 400), L(8.06, 6.77, 1.2, 14), L(1.2, 14, 9, 14)],
  3: [A(5, 3.6, 3.8, 3.6, 205, 450), A(5, 10.4, 4, 3.6, 270, 515)],
  4: [L(7, 0, 1, 10), L(1, 10, 9.6, 10), L(7, 0, 7, 14)],
  5: [L(8.6, 0, 2.2, 0), L(2.2, 0, 1.8, 6.4), A(5, 9.6, 4, 4.4, 225, 515)],
  6: [A(5, 9.8, 4, 4.2, 0, 360), A(6.6, 8, 5.6, 8, 180, 285)],
  7: [L(1, 0, 9, 0), L(9, 0, 3.6, 14)],
  8: [A(5, 3.6, 3.5, 3.4, 0, 360), A(5, 10.3, 4.2, 3.7, 0, 360)],
  9: [A(5, 4.2, 4, 4.2, 0, 360), A(3.4, 6, 5.6, 8, 0, 105)],
};

const WIDTH = { M: 11, W: 11.2, G: 10.6, Q: 10.4 };

function segments(strokes) {
  const segs = [];
  for (const s of strokes) {
    if (s.t === 'L') segs.push([s.x1, s.y1, s.x2, s.y2]);
    else {
      const steps = Math.max(8, Math.ceil(Math.abs(s.a2 - s.a1) / 8));
      let prev = null;
      for (let i = 0; i <= steps; i++) {
        const a = ((s.a1 + ((s.a2 - s.a1) * i) / steps) * Math.PI) / 180;
        const p = [s.cx + s.rx * Math.cos(a), s.cy + s.ry * Math.sin(a)];
        if (prev) segs.push([prev[0], prev[1], p[0], p[1]]);
        prev = p;
      }
    }
  }
  return segs;
}

function distSeg(px, py, [x1, y1, x2, y2]) {
  const dx = x2 - x1, dy = y2 - y1;
  const l2 = dx * dx + dy * dy || 1e-9;
  let t = ((px - x1) * dx + (py - y1) * dy) / l2;
  t = Math.max(0, Math.min(1, t));
  return Math.hypot(px - (x1 + t * dx), py - (y1 + t * dy));
}

function rdp(pts, eps) {
  if (pts.length < 3) return pts;
  let max = 0, idx = 0;
  const [a, b] = [pts[0], pts[pts.length - 1]];
  for (let i = 1; i < pts.length - 1; i++) {
    const d = distSeg(pts[i][0], pts[i][1], [a[0], a[1], b[0], b[1]]);
    if (d > max) { max = d; idx = i; }
  }
  if (max > eps) {
    const l = rdp(pts.slice(0, idx + 1), eps);
    const r = rdp(pts.slice(idx), eps);
    return l.slice(0, -1).concat(r);
  }
  return [a, b];
}

function simplifyLoop(loop, eps) {
  // Split the closed loop at the point farthest from the start so RDP keeps the shape.
  let far = 0, fd = 0;
  for (let i = 1; i < loop.length; i++) {
    const d = Math.hypot(loop[i][0] - loop[0][0], loop[i][1] - loop[0][1]);
    if (d > fd) { fd = d; far = i; }
  }
  const a = rdp(loop.slice(0, far + 1), eps);
  const b = rdp(loop.slice(far).concat([loop[0]]), eps);
  return a.slice(0, -1).concat(b.slice(0, -1));
}

const cache = new Map();

// Returns outline loops for a glyph in glyph units.
export function glyphLoops(ch, thick = 1.55) {
  const key = ch + thick;
  if (cache.has(key)) return cache.get(key);
  const segs = segments(GLYPHS[ch]);
  const w = WIDTH[ch] || 10;
  const step = 0.12, pad = thick + 0.6;
  const x0 = -pad, y0 = -pad;
  const cols = Math.ceil((w + 2 * pad) / step) + 1;
  const rows = Math.ceil((14 + 2 * pad) / step) + 1;
  const F = new Float64Array(cols * rows);
  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < cols; i++) {
      const px = x0 + i * step, py = y0 + j * step;
      let d = Infinity;
      for (const s of segs) d = Math.min(d, distSeg(px, py, s));
      F[j * cols + i] = thick - d;
    }
  }
  const v = (i, j) => F[j * cols + i];
  const P = (i, j) => [x0 + i * step, y0 + j * step];
  // Edge crossing points keyed by edge id.
  const pts = new Map();
  const edgePoint = (key, i1, j1, i2, j2) => {
    if (!pts.has(key)) {
      const a = v(i1, j1), b = v(i2, j2);
      const t = a / (a - b);
      const p1 = P(i1, j1), p2 = P(i2, j2);
      pts.set(key, [p1[0] + (p2[0] - p1[0]) * t, p1[1] + (p2[1] - p1[1]) * t]);
    }
    return key;
  };
  const next = new Map();
  for (let j = 0; j < rows - 1; j++) {
    for (let i = 0; i < cols - 1; i++) {
      const tl = v(i, j) > 0, tr = v(i + 1, j) > 0, br = v(i + 1, j + 1) > 0, bl = v(i, j + 1) > 0;
      const code = (tl ? 8 : 0) | (tr ? 4 : 0) | (br ? 2 : 0) | (bl ? 1 : 0);
      if (code === 0 || code === 15) continue;
      const T = () => edgePoint(`h${i},${j}`, i, j, i + 1, j);
      const B = () => edgePoint(`h${i},${j + 1}`, i, j + 1, i + 1, j + 1);
      const Lf = () => edgePoint(`v${i},${j}`, i, j, i, j + 1);
      const R = () => edgePoint(`v${i + 1},${j}`, i + 1, j, i + 1, j + 1);
      const add = (a, b) => next.set(a, b);
      const center = (v(i, j) + v(i + 1, j) + v(i + 1, j + 1) + v(i, j + 1)) / 4 > 0;
      switch (code) {
        case 1: add(B(), Lf()); break;
        case 2: add(R(), B()); break;
        case 3: add(R(), Lf()); break;
        case 4: add(T(), R()); break;
        case 5: if (center) { add(T(), Lf()); add(B(), R()); } else { add(T(), R()); add(B(), Lf()); } break;
        case 6: add(T(), B()); break;
        case 7: add(T(), Lf()); break;
        case 8: add(Lf(), T()); break;
        case 9: add(B(), T()); break;
        case 10: if (center) { add(R(), T()); add(Lf(), B()); } else { add(Lf(), T()); add(R(), B()); } break;
        case 11: add(R(), T()); break;
        case 12: add(Lf(), R()); break;
        case 13: add(B(), R()); break;
        case 14: add(Lf(), B()); break;
      }
    }
  }
  const loops = [];
  const seen = new Set();
  for (const start of next.keys()) {
    if (seen.has(start)) continue;
    const loop = [];
    let k = start;
    while (k && !seen.has(k)) {
      seen.add(k);
      loop.push(pts.get(k));
      k = next.get(k);
    }
    if (loop.length > 4) loops.push(simplifyLoop(loop, 0.035));
  }
  const res = { loops, w };
  cache.set(key, res);
  return res;
}

// Path data for a glyph drawn with its box at (x, y) and the given height.
export function glyphPath(ch, x, y, height, thick) {
  const { loops, w } = glyphLoops(ch, thick);
  const s = height / 14;
  const f = (v) => +v.toFixed(1);
  return loops
    .map((loop) => 'M' + loop.map(([px, py]) => `${f(x + px * s)} ${f(y + py * s)}`).join('L') + 'Z')
    .join('');
}

export function glyphWidth(ch) {
  return WIDTH[ch] || 10;
}
