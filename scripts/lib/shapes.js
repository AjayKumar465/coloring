// Geometry primitives that return SVG path data strings, plus the Art builder
// that assembles fillable regions into a coloring page.

export const n = (v) => +(+v).toFixed(1);
const pt = (x, y) => `${n(x)} ${n(y)}`;
const rad = (deg) => (deg * Math.PI) / 180;

export function circle(cx, cy, r) {
  return `M${pt(cx - r, cy)}A${n(r)} ${n(r)} 0 1 0 ${pt(cx + r, cy)}A${n(r)} ${n(r)} 0 1 0 ${pt(cx - r, cy)}Z`;
}

export function ellipse(cx, cy, rx, ry, rot = 0) {
  const c = Math.cos(rad(rot));
  const s = Math.sin(rad(rot));
  const x1 = cx + rx * c, y1 = cy + rx * s;
  const x2 = cx - rx * c, y2 = cy - rx * s;
  return `M${pt(x1, y1)}A${n(rx)} ${n(ry)} ${n(rot)} 1 0 ${pt(x2, y2)}A${n(rx)} ${n(ry)} ${n(rot)} 1 0 ${pt(x1, y1)}Z`;
}

export function rect(x, y, w, h, r = 0) {
  r = Math.min(r, w / 2, h / 2);
  if (r <= 0) return `M${pt(x, y)}H${n(x + w)}V${n(y + h)}H${n(x)}Z`;
  const a = `A${n(r)} ${n(r)} 0 0 1`;
  return `M${pt(x + r, y)}H${n(x + w - r)}${a} ${pt(x + w, y + r)}V${n(y + h - r)}${a} ${pt(x + w - r, y + h)}H${n(x + r)}${a} ${pt(x, y + h - r)}V${n(y + r)}${a} ${pt(x + r, y)}Z`;
}

export function poly(pts) {
  return 'M' + pts.map((p) => pt(p[0], p[1])).join('L') + 'Z';
}

export function line(pts) {
  return 'M' + pts.map((p) => pt(p[0], p[1])).join('L');
}

export function regular(cx, cy, r, sides, rot = -90) {
  const pts = [];
  for (let i = 0; i < sides; i++) {
    const a = rad(rot + (360 / sides) * i);
    pts.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]);
  }
  return poly(pts);
}

export function starPts(cx, cy, ro, ri, points = 5, rot = -90) {
  const pts = [];
  for (let i = 0; i < points * 2; i++) {
    const r = i % 2 ? ri : ro;
    const a = rad(rot + (180 / points) * i);
    pts.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]);
  }
  return pts;
}

export function star(cx, cy, ro, ri, points = 5, rot = -90) {
  return poly(starPts(cx, cy, ro, ri, points, rot));
}

// Rounded star: smooth curve through star points.
export function softStar(cx, cy, ro, ri, points = 5, rot = -90) {
  return smooth(starPts(cx, cy, ro, ri, points, rot), true, 0.6);
}

// Catmull-Rom spline through points, converted to cubic Beziers.
export function smooth(pts, closed = true, t = 1) {
  const N = pts.length;
  const get = (i) => (closed ? pts[(i + N) % N] : pts[Math.max(0, Math.min(N - 1, i))]);
  let d = `M${pt(pts[0][0], pts[0][1])}`;
  const segs = closed ? N : N - 1;
  for (let i = 0; i < segs; i++) {
    const p0 = get(i - 1), p1 = get(i), p2 = get(i + 1), p3 = get(i + 2);
    const c1 = [p1[0] + ((p2[0] - p0[0]) / 6) * t, p1[1] + ((p2[1] - p0[1]) / 6) * t];
    const c2 = [p2[0] - ((p3[0] - p1[0]) / 6) * t, p2[1] - ((p3[1] - p1[1]) / 6) * t];
    d += `C${pt(c1[0], c1[1])} ${pt(c2[0], c2[1])} ${pt(p2[0], p2[1])}`;
  }
  return closed ? d + 'Z' : d;
}

// Scalloped ellipse (clouds, manes, bushes, flower centers).
export function scallop(cx, cy, rx, ry, count = 8, bulge = 0.62, rot = 0) {
  const pts = [];
  for (let i = 0; i < count; i++) {
    const a = rad(rot + (360 / count) * i);
    pts.push([cx + rx * Math.cos(a), cy + ry * Math.sin(a)]);
  }
  let d = `M${pt(pts[0][0], pts[0][1])}`;
  for (let i = 0; i < count; i++) {
    const p = pts[i], q = pts[(i + 1) % count];
    const r = Math.hypot(q[0] - p[0], q[1] - p[1]) * bulge;
    d += `A${n(r)} ${n(r)} 0 0 1 ${pt(q[0], q[1])}`;
  }
  return d + 'Z';
}

export function heart(cx, cy, s) {
  return `M${pt(cx, cy + 0.9 * s)}C${pt(cx - 1.35 * s, cy + 0.05 * s)} ${pt(cx - 0.65 * s, cy - 1.05 * s)} ${pt(cx, cy - 0.38 * s)}C${pt(cx + 0.65 * s, cy - 1.05 * s)} ${pt(cx + 1.35 * s, cy + 0.05 * s)} ${pt(cx, cy + 0.9 * s)}Z`;
}

// Leaf / petal from a base point toward an angle.
export function petal(x, y, len, w, angle, round = 1) {
  const a = rad(angle);
  const dx = Math.cos(a), dy = Math.sin(a);
  const px = -dy, py = dx;
  const tx = x + dx * len, ty = y + dy * len;
  const k = 0.25 * round;
  return `M${pt(x, y)}C${pt(x + px * w * 1.2 + dx * len * k, y + py * w * 1.2 + dy * len * k)} ${pt(tx + px * w * 0.9 * round, ty + py * w * 0.9 * round)} ${pt(tx, ty)}C${pt(tx - px * w * 0.9 * round, ty - py * w * 0.9 * round)} ${pt(x - px * w * 1.2 + dx * len * k, y - py * w * 1.2 + dy * len * k)} ${pt(x, y)}Z`;
}

// Pointed leaf (two quadratic curves).
export function leaf(x, y, len, w, angle) {
  const a = rad(angle);
  const dx = Math.cos(a), dy = Math.sin(a);
  const px = -dy, py = dx;
  const tx = x + dx * len, ty = y + dy * len;
  const mx = x + dx * len * 0.5, my = y + dy * len * 0.5;
  return `M${pt(x, y)}Q${pt(mx + px * w * 2, my + py * w * 2)} ${pt(tx, ty)}Q${pt(mx - px * w * 2, my - py * w * 2)} ${pt(x, y)}Z`;
}

export function arcPath(cx, cy, rx, ry, a1, a2) {
  const p1 = [cx + rx * Math.cos(rad(a1)), cy + ry * Math.sin(rad(a1))];
  const p2 = [cx + rx * Math.cos(rad(a2)), cy + ry * Math.sin(rad(a2))];
  const large = Math.abs(a2 - a1) % 360 > 180 ? 1 : 0;
  const sweep = a2 > a1 ? 1 : 0;
  return `M${pt(p1[0], p1[1])}A${n(rx)} ${n(ry)} 0 ${large} ${sweep} ${pt(p2[0], p2[1])}`;
}

export function wedge(cx, cy, r, a1, a2) {
  const p1 = [cx + r * Math.cos(rad(a1)), cy + r * Math.sin(rad(a1))];
  const p2 = [cx + r * Math.cos(rad(a2)), cy + r * Math.sin(rad(a2))];
  const large = a2 - a1 > 180 ? 1 : 0;
  return `M${pt(cx, cy)}L${pt(p1[0], p1[1])}A${n(r)} ${n(r)} 0 ${large} 1 ${pt(p2[0], p2[1])}Z`;
}

// Annular sector (rainbow bands, mandala rings).
export function annular(cx, cy, r1, r2, a1, a2) {
  const P = (r, a) => [cx + r * Math.cos(rad(a)), cy + r * Math.sin(rad(a))];
  const large = a2 - a1 > 180 ? 1 : 0;
  const [o1, o2, i2, i1] = [P(r2, a1), P(r2, a2), P(r1, a2), P(r1, a1)];
  return `M${pt(...o1)}A${n(r2)} ${n(r2)} 0 ${large} 1 ${pt(...o2)}L${pt(...i2)}A${n(r1)} ${n(r1)} 0 ${large} 0 ${pt(...i1)}Z`;
}

// Full ring (donut) as a single region using even-odd fill.
export function ring(cx, cy, r1, r2) {
  return circle(cx, cy, r2) + circle(cx, cy, r1);
}

// Region of an ellipse between two horizontal (or vertical) cut lines.
// Optional edge functions offset each cut line (for wavy / zigzag bands).
export function band(cx, cy, rx, ry, from, to, { vertical = false, edgeA = () => 0, edgeB = () => 0, steps = 48 } = {}) {
  const top = [], bot = [];
  for (let i = 0; i <= steps; i++) {
    if (!vertical) {
      const x = cx - rx + (2 * rx * i) / steps;
      const h = ry * Math.sqrt(Math.max(0, 1 - ((x - cx) / rx) ** 2));
      const y1 = Math.max(cy - h, from + edgeA(x));
      const y2 = Math.min(cy + h, to + edgeB(x));
      if (y2 - y1 > 0.5) { top.push([x, y1]); bot.push([x, y2]); }
    } else {
      const y = cy - ry + (2 * ry * i) / steps;
      const w = rx * Math.sqrt(Math.max(0, 1 - ((y - cy) / ry) ** 2));
      const x1 = Math.max(cx - w, from + edgeA(y));
      const x2 = Math.min(cx + w, to + edgeB(y));
      if (x2 - x1 > 0.5) { top.push([x1, y]); bot.push([x2, y]); }
    }
  }
  if (top.length < 2) return '';
  return poly([...top, ...bot.reverse()]);
}

export const zig = (amp, period, phase = 0) => (x) => {
  const t = (((x + phase) % period) + period) % period / period;
  return amp * (t < 0.5 ? t * 4 - 1 : 3 - t * 4);
};
export const wave = (amp, period, phase = 0) => (x) => amp * Math.sin(((x + phase) / period) * Math.PI * 2);

export function wavyLine(x1, x2, y, amp = 10, count = 6) {
  const pts = [];
  const steps = count * 8;
  for (let i = 0; i <= steps; i++) {
    const x = x1 + ((x2 - x1) * i) / steps;
    pts.push([x, y + amp * Math.sin((i / steps) * count * Math.PI * 2)]);
  }
  return line(pts);
}

export function mirrorPts(pts, axis = 400) {
  return pts.map(([x, y]) => [2 * axis - x, y]);
}

export function rotatePts(pts, cx, cy, deg) {
  const c = Math.cos(rad(deg)), s = Math.sin(rad(deg));
  return pts.map(([x, y]) => [cx + (x - cx) * c - (y - cy) * s, cy + (x - cx) * s + (y - cy) * c]);
}

export function polar(cx, cy, r, deg) {
  return [cx + r * Math.cos(rad(deg)), cy + r * Math.sin(rad(deg))];
}

export function rng(seed) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');

// Builder for one coloring page.
export class Art {
  constructor() {
    this.out = [];
    this.id = 0;
    this.strokeScale = [1];
  }
  // Fillable, closed region.
  f(d, extra = '') {
    if (!d) return this;
    this.out.push(`<path id="r${++this.id}" class="fillable" d="${d}"${extra}/>`);
    return this;
  }
  // Even-odd fillable (regions with holes such as letters and rings).
  fe(d) {
    return this.f(d, ' fill-rule="evenodd"');
  }
  // Decorative outline that is not fillable.
  l(d, w) {
    if (!d) return this;
    this.out.push(`<path class="line" d="${d}"${w ? ` stroke-width="${n(w / this.scale())}"` : ''}/>`);
    return this;
  }
  // Solid ink (pupils, nostrils, small dots).
  k(d) {
    if (!d) return this;
    this.out.push(`<path class="ink" d="${d}"/>`);
    return this;
  }
  scale() {
    return this.strokeScale.reduce((a, b) => a * b, 1);
  }
  g(attrs, fn) {
    this.out.push(`<g${attrs}>`);
    fn();
    this.out.push('</g>');
    return this;
  }
  anim(name, fn) {
    return this.g(` data-anim="${name}"`, fn);
  }
  rot(deg, cx, cy, fn) {
    return this.g(` transform="rotate(${n(deg)} ${n(cx)} ${n(cy)})"`, fn);
  }
  // Draw a subject (authored around 400,400 in an 800 box) at a new center and scale.
  place(cx, cy, s, fn, rot = 0) {
    this.strokeScale.push(s);
    const r = rot ? ` rotate(${n(rot)} 400 400)` : '';
    this.g(` transform="translate(${n(cx - 400 * s)} ${n(cy - 400 * s)}) scale(${n(s * 1000) / 1000})${r}" stroke-width="${n(5 / this.scale())}"`, fn);
    this.strokeScale.pop();
    return this;
  }
  text(x, y, str, size = 56) {
    this.out.push(`<text x="${n(x)}" y="${n(y)}" font-size="${size}" text-anchor="middle" class="label">${esc(str)}</text>`);
    return this;
  }
  toSVG({ title = '', anim = 'float' } = {}) {
    return (
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" data-anim="${anim}">` +
      `<title>${esc(title)}</title>` +
      `<style>.fillable{fill:#fff;stroke:#222}.line{fill:none;stroke:#222}.ink{fill:#222}.label{fill:#222;font-family:'Comic Sans MS','Chalkboard SE',Arial,sans-serif;font-weight:700}</style>` +
      `<g stroke-width="5" stroke-linejoin="round" stroke-linecap="round">` +
      this.out.join('') +
      `</g></svg>`
    );
  }
}

export function ellipsePts(cx, cy, rx, ry, count = 48) {
  const pts = [];
  for (let i = 0; i < count; i++) {
    const a = (i / count) * Math.PI * 2;
    pts.push([cx + rx * Math.cos(a), cy + ry * Math.sin(a)]);
  }
  return pts;
}

// Clip segment p1-p2 to a convex polygon (Cyrus-Beck). Returns null if outside.
export function clipSegConvex(p1, p2, pts) {
  const cx = pts.reduce((s, p) => s + p[0], 0) / pts.length;
  const cy = pts.reduce((s, p) => s + p[1], 0) / pts.length;
  let t0 = 0, t1 = 1;
  const dx = p2[0] - p1[0], dy = p2[1] - p1[1];
  for (let i = 0; i < pts.length; i++) {
    const a = pts[i], b = pts[(i + 1) % pts.length];
    let nx = -(b[1] - a[1]), ny = b[0] - a[0];
    if (nx * (cx - a[0]) + ny * (cy - a[1]) < 0) { nx = -nx; ny = -ny; }
    const num = nx * (p1[0] - a[0]) + ny * (p1[1] - a[1]);
    const den = nx * dx + ny * dy;
    if (Math.abs(den) < 1e-9) { if (num < 0) return null; continue; }
    const t = -num / den;
    if (den > 0) t0 = Math.max(t0, t); else t1 = Math.min(t1, t);
    if (t0 > t1) return null;
  }
  return [[p1[0] + dx * t0, p1[1] + dy * t0], [p1[0] + dx * t1, p1[1] + dy * t1]];
}

// Parallel hatch lines clipped to a convex polygon (waffle cones, baskets, pineapples).
export function hatch(pts, spacing, angle, inset = 0) {
  const r = rad(angle);
  const d = [Math.cos(r), Math.sin(r)], nrm = [-Math.sin(r), Math.cos(r)];
  const cx = pts.reduce((s, p) => s + p[0], 0) / pts.length;
  const cy = pts.reduce((s, p) => s + p[1], 0) / pts.length;
  const proj = pts.map((p) => (p[0] - cx) * nrm[0] + (p[1] - cy) * nrm[1]);
  const lo = Math.min(...proj), hi = Math.max(...proj);
  let out = '';
  for (let o = lo + spacing / 2; o < hi; o += spacing) {
    const px = cx + nrm[0] * o, py = cy + nrm[1] * o;
    const seg = clipSegConvex([px - d[0] * 2000, py - d[1] * 2000], [px + d[0] * 2000, py + d[1] * 2000], pts);
    if (!seg) continue;
    const [[x1, y1], [x2, y2]] = seg;
    const len = Math.hypot(x2 - x1, y2 - y1);
    if (len <= inset * 2 + 4) continue;
    const k = inset / len;
    out += `M${pt(x1 + (x2 - x1) * k, y1 + (y2 - y1) * k)}L${pt(x2 - (x2 - x1) * k, y2 - (y2 - y1) * k)}`;
  }
  return out;
}
