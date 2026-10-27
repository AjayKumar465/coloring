import { circle, ellipse, rect, poly, petal, scallop, star, heart, polar, regular, annular, leaf, softStar, rng, ring } from '../lib/shapes.js';
import { frame, eyes, smile, cheeks } from '../lib/parts.js';

const RING_TYPES = ['petals', 'circles', 'leaves', 'scallop', 'stars', 'teardrops', 'band'];

// Radial mandala built from the outside in, so inner rings sit on top.
export function mandala(a, seed, layers = 6) {
  const r = rng(seed);
  const sym = [8, 10, 12, 16][Math.floor(r() * 4)];
  let radius = 370;
  a.f(scallop(400, 400, radius - 18, radius - 18, sym * 2, 0.6));
  radius -= 30;
  for (let i = 0; i < layers && radius > 60; i++) {
    const type = RING_TYPES[Math.floor(r() * RING_TYPES.length)];
    const step = 360 / sym;
    const off = i % 2 ? step / 2 : 0;
    const depth = 40 + Math.floor(r() * 25);
    if (type !== 'band') a.f(circle(400, 400, radius - depth * 0.55));
    for (let k = 0; k < sym; k++) {
      const ang = k * step + off - 90;
      if (type === 'petals') a.f(petal(...polar(400, 400, radius - depth, ang), depth, Math.min(30, radius * 0.12), ang, 0.9));
      else if (type === 'leaves') a.f(leaf(...polar(400, 400, radius - depth, ang), depth, Math.min(16, radius * 0.07), ang));
      else if (type === 'circles') a.f(circle(...polar(400, 400, radius - depth / 2, ang), Math.min(depth / 2, (Math.PI * radius) / sym * 0.42)));
      else if (type === 'scallop') { /* drawn once below */ }
      else if (type === 'stars') a.f(star(...polar(400, 400, radius - depth / 2, ang), Math.min(depth / 2, (Math.PI * radius) / sym * 0.45), Math.min(depth / 4.5, 12), 5, ang));
      else if (type === 'teardrops') a.f(petal(...polar(400, 400, radius - 4, ang), depth, Math.min(20, radius * 0.09), ang + 180, 0.7));
      else if (type === 'band') a.f(annular(400, 400, radius - depth, radius, ang - step / 2, ang + step / 2));
    }
    if (type === 'scallop') a.f(scallop(400, 400, radius - depth / 2, radius - depth / 2, sym, 0.6, off - 90));
    radius -= depth;
  }
  a.f(circle(400, 400, Math.max(30, radius - 10)));
  a.f(softStar(400, 400, Math.max(22, radius - 22), Math.max(10, radius * 0.4), Math.min(8, sym / 2)));
}

const mandalas = [
  ['sun', 'Sunny Mandala', 11],
  ['flower', 'Flower Mandala', 23],
  ['star', 'Star Mandala', 37],
  ['ocean', 'Ocean Mandala', 42],
  ['garden', 'Garden Mandala', 58],
  ['rainbow', 'Rainbow Mandala', 71],
  ['snow', 'Snowflake Mandala', 88],
  ['butterfly', 'Butterfly Mandala', 97],
  ['magic', 'Magic Mandala', 105],
  ['dream', 'Dreamy Mandala', 131],
].map(([name, title, seed], i) => ({
  name: `mandala-${name}`, title, tags: ['mandala', 'pattern', 'relax'], anim: 'spin',
  draw(a) {
    a.anim('spin', () => mandala(a, seed, 4 + (i % 4)));
  },
}));

function grid(a, cols, rows, cell) {
  const x0 = 400 - (cols * cell) / 2, y0 = 400 - (rows * cell) / 2;
  for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) cell === 0 || a.f(rect(x0 + i * cell, y0 + j * cell, cell, cell));
}

export default [
  ...mandalas,
  {
    name: 'checkerboard', title: 'Checkerboard', tags: ['checkers', 'pattern', 'squares'], anim: 'float',
    draw(a) {
      frame(a);
      grid(a, 7, 7, 96);
    },
  },
  {
    name: 'honeycomb', title: 'Honeycomb Hexagons', tags: ['hexagon', 'pattern', 'bee'], anim: 'float',
    draw(a) {
      frame(a);
      const r = 62, w = Math.sqrt(3) * r;
      for (let j = 0; j < 7; j++) for (let i = 0; i < 6; i++) {
        const x = 90 + i * w + (j % 2) * (w / 2), y = 90 + j * r * 1.5;
        if (x < 740 && y < 740) a.f(regular(x, y, r - 6, 6, -90));
      }
    },
  },
  {
    name: 'triangles', title: 'Triangle Party', tags: ['triangle', 'pattern', 'shapes'], anim: 'float',
    draw(a) {
      frame(a);
      const s = 125, h = (s * Math.sqrt(3)) / 2;
      for (let j = 0; j < 6; j++) for (let i = 0; i < 11; i++) {
        const x = 30 + (i * s) / 2, y = 40 + j * h;
        if (x + s > 775) continue;
        const up = (i + j) % 2 === 0;
        a.f(poly(up ? [[x, y + h], [x + s / 2, y], [x + s, y + h]] : [[x, y], [x + s, y], [x + s / 2, y + h]]));
      }
    },
  },
  {
    name: 'hearts-pattern', title: 'Hearts Everywhere', tags: ['hearts', 'pattern', 'love'], anim: 'float',
    draw(a) {
      frame(a);
      for (let j = 0; j < 5; j++) for (let i = 0; i < 5; i++) a.f(heart(110 + i * 145, 105 + j * 145, (j + i) % 2 ? 48 : 60));
    },
  },
  {
    name: 'stars-pattern', title: 'Starry Pattern', tags: ['stars', 'pattern'], anim: 'twinkle',
    draw(a) {
      frame(a);
      for (let j = 0; j < 5; j++) for (let i = 0; i < 5; i++) a.f(star(110 + i * 145, 110 + j * 145, (i + j) % 2 ? 48 : 64, (i + j) % 2 ? 20 : 27, (i + j) % 3 + 5));
    },
  },
  {
    name: 'rainbow-rings', title: 'Rainbow Rings', tags: ['circles', 'pattern', 'target'], anim: 'spin',
    draw(a) {
      frame(a);
      for (let i = 0; i < 9; i++) a.f(circle(400, 400, 360 - i * 38));
      for (const [x, y] of [[60, 60], [740, 60], [60, 740], [740, 740]]) a.f(circle(x, y, 26));
    },
  },
  {
    name: 'shape-friends', title: 'Shape Friends', tags: ['shapes', 'circle', 'square', 'triangle', 'learning'], anim: 'wiggle',
    draw(a) {
      frame(a);
      const shapes = [
        [200, 200, (x, y) => circle(x, y, 120)],
        [600, 200, (x, y) => rect(x - 110, y - 110, 220, 220, 16)],
        [200, 590, (x, y) => poly([[x, y - 140], [x + 140, y + 100], [x - 140, y + 100]])],
        [600, 590, (x, y) => star(x, y, 150, 65)],
      ];
      for (const [x, y, fn] of shapes) {
        a.f(fn(x, y));
        eyes(a, x, y - 10, 34, 13);
        smile(a, x, y + 30, 22);
        cheeks(a, x, y + 18, 60, 10);
      }
      a.f(heart(400, 400, 48));
    },
  },
];
