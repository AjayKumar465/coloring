import { glyphPath, glyphWidth } from '../lib/font.js';
import { frame } from '../lib/parts.js';
import { mini } from '../lib/minis.js';

const NAMES = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
const THINGS = [
  ['nest', 'empty nest'], ['sun', 'sun'], ['fish', 'fish'], ['apple', 'apples'], ['star', 'stars'],
  ['balloon', 'balloons'], ['heart', 'hearts'], ['flower', 'flowers'], ['ladybug', 'ladybugs'], ['strawberry', 'strawberries'],
];

// Grid of count objects within the right-hand area.
function layout(count) {
  if (count === 0) return [[570, 400, 0.5]];
  const cols = count <= 2 ? 1 : count <= 6 ? 2 : 3;
  const rows = Math.ceil(count / cols);
  const x0 = 365, x1 = 770, y0 = 50, y1 = 660;
  const cw = (x1 - x0) / cols, ch = (y1 - y0) / rows;
  const s = Math.min(cw, ch) / 800 * 0.92;
  const out = [];
  for (let i = 0; i < count; i++) {
    const r = Math.floor(i / cols), c = i % cols;
    const inRow = Math.min(cols, count - r * cols);
    const offset = ((cols - inRow) * cw) / 2;
    out.push([x0 + offset + cw * (c + 0.5), y0 + ch * (r + 0.5), s]);
  }
  return out;
}

export default NAMES.map((word, n) => ({
  name: `number-${n}`,
  title: `${n} - ${word[0].toUpperCase() + word.slice(1)}`,
  tags: ['number', 'counting', 'math', word, String(n), 'learning'],
  anim: 'float',
  difficulty: n < 6 ? 'easy' : 'medium',
  draw(a) {
    frame(a);
    const ch = String(n);
    const h = 320;
    const w = (glyphWidth(ch) / 14) * h;
    a.anim('wiggle', () => a.fe(glyphPath(ch, 190 - w / 2, 170, h, 1.7)));
    for (const [x, y, s] of layout(n)) mini(a, THINGS[n][0], x, y, s);
    a.text(400, 740, `${n} ${n === 1 ? 'sun' : THINGS[n][1]}`, 56);
  },
}));
