// Reusable scene pieces: backgrounds, faces, characters.
import { circle, ellipse, rect, poly, line, star, scallop, smooth, petal, leaf, arcPath, wavyLine, heart, polar } from './shapes.js';

export const mx = (x) => 800 - x;

export function frame(a) {
  a.f(rect(16, 16, 768, 768, 36));
}

// Rolling ground that fits the rounded frame.
export function ground(a, y = 620, amp = 35) {
  a.f(`M16 ${y}Q200 ${y - amp} 400 ${y}T784 ${y - 10}V748A36 36 0 0 1 748 784H52A36 36 0 0 1 16 748Z`);
}

// Hill whose base is hidden behind a later ground() call.
export function hill(a, cx, y, w, base = 700) {
  const x0 = Math.max(18, cx - w), x1 = Math.min(782, cx + w);
  a.f(`M${x0} ${base}Q${cx - w * 0.6} ${y} ${cx} ${y}Q${cx + w * 0.6} ${y} ${x1} ${base}Z`);
}

export function sea(a, y = 300, amp = 14, count = 5) {
  const pts = [];
  for (let i = 0; i <= 64; i++) {
    const x = 16 + (768 * i) / 64;
    pts.push(`${(+x.toFixed(1))} ${(+(y + amp * Math.sin((i / 64) * count * Math.PI * 2)).toFixed(1))}`);
  }
  a.f(`M${pts.join('L')}V748A36 36 0 0 1 748 784H52A36 36 0 0 1 16 748Z`);
}

export function sand(a, y = 690) {
  a.f(`M16 ${y}Q150 ${y - 30} 300 ${y}T600 ${y - 5}T784 ${y}V748A36 36 0 0 1 748 784H52A36 36 0 0 1 16 748Z`);
}

export function sun(a, x, y, r, withFace = false) {
  a.anim('spin', () => a.f(star(x, y, r * 1.55, r * 1.12, 12)));
  a.f(circle(x, y, r));
  if (withFace) {
    a.k(circle(x - r * 0.33, y - r * 0.12, r * 0.1));
    a.k(circle(x + r * 0.33, y - r * 0.12, r * 0.1));
    a.l(arcPath(x, y + r * 0.05, r * 0.45, r * 0.4, 20, 160));
  }
}

export function cloud(a, x, y, w, h) {
  a.anim('drift', () => a.f(scallop(x, y, w, h, 9, 0.62, 10)));
}

export function grass(a, y, xs) {
  for (const x of xs) a.l(`M${x - 14} ${y}l8 -26M${x} ${y}l0 -32M${x + 14} ${y}l-8 -26`, 4);
}

export function bubbles(a, list) {
  a.anim('float', () => {
    for (const [x, y, r] of list) {
      a.f(circle(x, y, r));
      a.l(arcPath(x, y, r * 0.6, r * 0.6, 200, 250), 3);
    }
  });
}

export function twinkleStars(a, list) {
  a.anim('twinkle', () => {
    for (const [x, y, r] of list) a.f(star(x, y, r, r * 0.45, 5));
  });
}

export function seaweed(a, x, y, h, lean = 1) {
  const pts = [];
  const N = 6;
  for (let i = 0; i <= N; i++) pts.push([x + Math.sin(i * 1.3) * 22 * lean, y - (h * i) / N]);
  const left = pts.map(([px, py], i) => [px - 16 * (1 - i / N) - 3, py]);
  const right = pts.map(([px, py], i) => [px + 16 * (1 - i / N) + 3, py]).reverse();
  a.anim('sway', () => a.f(smooth([...left, ...right], true, 0.8)));
}

export function flowerSmall(a, x, y, r = 22, petals = 6) {
  a.l(`M${x} ${y + r}V${y + r * 3.2}`, 4);
  for (let i = 0; i < petals; i++) {
    const [px, py] = polar(x, y, r * 0.9, (360 / petals) * i);
    a.f(circle(px, py, r * 0.62));
  }
  a.f(circle(x, y, r * 0.55));
}

export function tree(a, x, y, s = 1) {
  a.f(rect(x - 28 * s, y - 30 * s, 56 * s, 150 * s, 10 * s));
  a.f(scallop(x, y - 110 * s, 120 * s, 105 * s, 10, 0.6));
}

export function pineTree(a, x, y, s = 1) {
  a.f(rect(x - 18 * s, y - 20 * s, 36 * s, 60 * s));
  a.f(poly([[x, y - 260 * s], [x + 70 * s, y - 160 * s], [x - 70 * s, y - 160 * s]]));
  a.f(poly([[x, y - 200 * s], [x + 95 * s, y - 80 * s], [x - 95 * s, y - 80 * s]]));
  a.f(poly([[x, y - 130 * s], [x + 115 * s, y - 15 * s], [x - 115 * s, y - 15 * s]]));
}

// Two eyes (fillable whites + pupils) that blink in Bring to Life mode.
export function eyes(a, x, y, gap = 30, r = 16, { white = true, look = 0 } = {}) {
  a.anim('blink', () => {
    for (const ex of [x - gap, x + gap]) {
      if (white) {
        a.f(ellipse(ex, y, r, r * 1.2));
        a.k(circle(ex + look + r * 0.15, y + r * 0.15, r * 0.55));
        a.f(circle(ex + look + r * 0.32, y - r * 0.12, r * 0.18));
      } else {
        a.k(ellipse(ex, y, r * 0.6, r * 0.75));
      }
    }
  });
}

export function smile(a, x, y, w = 30, depth = 0.6) {
  a.l(`M${x - w} ${y}Q${x} ${y + w * depth * 1.6} ${x + w} ${y}`);
}

export function openSmile(a, x, y, w = 30) {
  a.f(`M${x - w} ${y}Q${x} ${y + w * 1.4} ${x + w} ${y}Z`);
}

export function cheeks(a, x, y, gap = 60, r = 14) {
  a.f(ellipse(x - gap, y, r * 1.3, r));
  a.f(ellipse(x + gap, y, r * 1.3, r));
}

export function wheel(a, x, y, r) {
  a.anim('spin', () => {
    a.f(circle(x, y, r));
    a.f(circle(x, y, r * 0.5));
    a.l(`M${x - r * 0.5} ${y}H${x + r * 0.5}M${x} ${y - r * 0.5}V${y + r * 0.5}`, 3);
  });
}

// A friendly kid-like person. opts.hat draws headwear; opts.prop draws a held item.
export function person(a, o = {}) {
  const shirtTop = 360;
  // legs and shoes
  a.f(rect(340, 560, 50, 140, 12));
  a.f(rect(410, 560, 50, 140, 12));
  a.f(ellipse(355, 705, 45, 22));
  a.f(ellipse(445, 705, 45, 22));
  // pants / skirt
  if (o.dress) a.f(poly([[330, 470], [470, 470], [520, 610], [280, 610]]));
  else a.f(rect(332, 470, 136, 120, 18));
  // arms
  a.f(rect(260, shirtTop + 10, 52, 170, 24), ' transform="rotate(12 286 380)"');
  a.f(rect(488, shirtTop + 10, 52, 170, 24), ' transform="rotate(-12 514 380)"');
  a.f(circle(258, 545, 26));
  a.f(circle(542, 545, 26));
  // shirt / coat
  a.f(`M320 ${shirtTop}Q400 ${shirtTop - 20} 480 ${shirtTop}L500 520Q400 540 300 520Z`);
  if (o.coat) {
    a.l(`M400 ${shirtTop - 8}V528`);
    a.f(poly([[400, shirtTop - 8], [360, shirtTop - 4], [400, 420]]));
    a.f(poly([[400, shirtTop - 8], [440, shirtTop - 4], [400, 420]]));
  }
  if (o.belt) a.f(rect(305, 490, 190, 26, 6));
  if (o.badge) a.f(star(445, 410, 22, 10, 5));
  if (o.pocket) a.f(rect(420, 400, 44, 40, 6));
  if (o.wings) {
    a.anim('wiggle', () => {
      a.f(petal(330, 400, 170, 55, 205));
      a.f(petal(470, 400, 170, 55, -25));
    });
  }
  // neck and head
  a.f(rect(375, 325, 50, 40, 10));
  if (o.hairBack) o.hairBack();
  else a.f(ellipse(400, 230, 100, 105));
  a.f(circle(400, 250, 88));
  a.f(ellipse(312, 255, 14, 20));
  a.f(ellipse(488, 255, 14, 20));
  if (!o.noFringe) a.f(`M318 230Q330 150 400 150Q470 150 482 230Q440 200 400 205Q350 205 318 230Z`);
  eyes(a, 400, 255, 32, 13);
  if (o.glasses) {
    a.l(circle(368, 255, 24) + circle(432, 255, 24) + 'M392 255H408', 4);
  }
  a.l('M400 268q-6 14 4 16', 4);
  smile(a, 400, 298, 22);
  cheeks(a, 400, 285, 52, 11);
  if (o.hat) o.hat();
  if (o.prop) o.prop();
}

export { heart, leaf, petal, wavyLine, line };
