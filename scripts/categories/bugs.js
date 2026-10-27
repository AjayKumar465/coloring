import { circle, ellipse, rect, poly, smooth, petal, scallop, arcPath, star, heart, leaf, polar, band, regular, wedge } from '../lib/shapes.js';
import { frame, ground, sun, cloud, eyes, smile, cheeks, grass, flowerSmall } from '../lib/parts.js';
import { flower } from './nature.js';

function meadow(a) {
  frame(a);
  sun(a, 660, 120, 42);
  cloud(a, 160, 120, 80, 36);
  ground(a, 660, 20);
  grass(a, 760, [90, 200, 600, 710]);
}

function antennae(a, x, y, spread = 60, len = 110) {
  a.l(`M${x - 15} ${y}Q${x - spread * 0.5} ${y - len * 0.7} ${x - spread} ${y - len}M${x + 15} ${y}Q${x + spread * 0.5} ${y - len * 0.7} ${x + spread} ${y - len}`, 5);
  a.anim('wiggle', () => {
    a.f(circle(x - spread, y - len, 14));
    a.f(circle(x + spread, y - len, 14));
  });
}

function bugFace(a, x, y, r = 80) {
  a.f(circle(x, y, r));
  eyes(a, x, y - r * 0.1, r * 0.38, r * 0.2);
  smile(a, x, y + r * 0.35, r * 0.28);
  cheeks(a, x, y + r * 0.25, r * 0.6, r * 0.13);
}

export function butterfly(a, x = 400, y = 400, s = 1, kind = 0) {
  a.anim('wiggle', () => {
    for (const d of [-1, 1]) {
      const X = (v) => x + d * v * s;
      if (kind === 0) {
        a.f(`M${X(10)} ${y - 40 * s}C${X(120)} ${y - 260 * s} ${X(330)} ${y - 220 * s} ${X(300)} ${y - 60 * s}C${X(280)} ${y + 10 * s} ${X(150)} ${y + 10 * s} ${X(10)} ${y}Z`);
        a.f(`M${X(10)} ${y + 10 * s}C${X(200)} ${y + 20 * s} ${X(270)} ${y + 120 * s} ${X(210)} ${y + 200 * s}C${X(150)} ${y + 260 * s} ${X(40)} ${y + 170 * s} ${X(10)} ${y + 60 * s}Z`);
        a.f(circle(X(190), y - 100 * s, 48 * s));
        a.f(circle(X(150), y + 110 * s, 34 * s));
        a.f(circle(X(250), y - 150 * s, 18 * s));
      } else {
        a.f(`M${X(10)} ${y - 30 * s}L${X(250)} ${y - 250 * s}Q${X(330)} ${y - 160 * s} ${X(290)} ${y - 20 * s}Q${X(200)} ${y + 20 * s} ${X(10)} ${y}Z`);
        a.f(`M${X(10)} ${y + 10 * s}Q${X(220)} ${y + 10 * s} ${X(230)} ${y + 120 * s}L${X(170)} ${y + 300 * s}L${X(120)} ${y + 160 * s}Q${X(40)} ${y + 140 * s} ${X(10)} ${y + 60 * s}Z`);
        a.f(petal(X(30), y - 30 * s, 180 * s, 30 * s, d > 0 ? -40 : -140, 0.6));
        a.f(circle(X(150), y + 70 * s, 26 * s));
      }
    }
  });
  a.f(ellipse(x, y + 40 * s, 22 * s, 140 * s));
  a.f(circle(x, y - 110 * s, 40 * s));
  a.anim('blink', () => {
    a.k(circle(x - 14 * s, y - 115 * s, 7 * s));
    a.k(circle(x + 14 * s, y - 115 * s, 7 * s));
  });
  a.l(`M${x - 14 * s} ${y - 146 * s}Q${x - 30 * s} ${y - 200 * s} ${x - 60 * s} ${y - 210 * s}M${x + 14 * s} ${y - 146 * s}Q${x + 30 * s} ${y - 200 * s} ${x + 60 * s} ${y - 210 * s}`, 4);
}

export default [
  {
    name: 'ladybug', title: 'Lucky Ladybug', tags: ['ladybug', 'bug'], anim: 'wiggle',
    draw(a) {
      meadow(a);
      a.f(leaf(160, 640, 560, 120, -12));
      for (const d of [-1, 1]) for (const i of [0, 1, 2]) a.l(`M${400 + d * 150} ${400 + i * 70}l${d * 70} ${10 + i * 20}`, 6);
      antennae(a, 400, 210, 70, 120);
      a.f(circle(400, 250, 80));
      a.f(circle(400, 440, 200));
      a.f(wedge(400, 440, 200, 270, 450).replace('L', 'L'));
      a.f(wedge(400, 440, 200, 90, 270));
      a.l('M400 240V640', 6);
      for (const [x, y, r] of [[300, 380, 36], [500, 380, 36], [290, 500, 30], [510, 500, 30], [360, 590, 24], [440, 590, 24]]) a.f(circle(x, y, r));
      eyes(a, 400, 240, 30, 14);
      smile(a, 400, 280, 20);
    },
  },
  {
    name: 'butterfly', title: 'Beautiful Butterfly', tags: ['butterfly', 'bug', 'wings'], anim: 'float',
    draw(a) {
      frame(a);
      for (const [x, y] of [[120, 650], [680, 660]]) flowerSmall(a, x, y, 30);
      butterfly(a, 400, 400, 1, 0);
    },
  },
  {
    name: 'swallowtail', title: 'Swallowtail Butterfly', tags: ['butterfly', 'bug', 'wings'], anim: 'float',
    draw(a) {
      meadow(a);
      butterfly(a, 400, 380, 0.95, 1);
    },
  },
  {
    name: 'busy-bee', title: 'Busy Bee', tags: ['bee', 'honey', 'bug'], anim: 'float',
    draw(a) {
      meadow(a);
      a.anim('wiggle', () => {
        a.f(ellipse(320, 260, 80, 120, -30));
        a.f(ellipse(480, 260, 80, 120, 30));
      });
      a.f(poly([[600, 440], [680, 420], [600, 400]]));
      a.f(ellipse(420, 420, 190, 140));
      for (const x of [380, 470, 560]) a.f(band(420, 420, 190, 140, x - 25, x + 15, { vertical: true }));
      antennae(a, 240, 330, 50, 100);
      bugFace(a, 240, 420, 100);
      flowerSmall(a, 640, 640, 26);
    },
  },
  {
    name: 'beehive', title: 'Honey Beehive', tags: ['bee', 'honey', 'hive'], anim: 'float',
    draw(a) {
      frame(a);
      a.f(rect(16, 100, 768, 30));
      a.l('M400 130V170', 6);
      for (let i = 0; i < 6; i++) {
        const w = [120, 220, 280, 300, 280, 220][i];
        a.f(rect(400 - w / 2, 170 + i * 80, w, 82, 40));
      }
      a.f(ellipse(400, 520, 50, 40));
      a.f(poly([[220, 720], [580, 720], [560, 660], [240, 660]]));
      for (const [x, y] of [[150, 400], [650, 360], [620, 600]]) {
        a.anim('float', () => {
          a.f(ellipse(x - 14, y - 26, 16, 22, -20));
          a.f(ellipse(x + 14, y - 26, 16, 22, 20));
          a.f(ellipse(x, y, 40, 28));
          a.f(band(x, y, 40, 28, x - 8, x + 8, { vertical: true }));
        });
      }
      for (const [x, y] of [[300, 750], [500, 750]]) a.f(regular(x, y, 22, 6, 0));
    },
  },
  {
    name: 'caterpillar', title: 'Hungry Caterpillar', tags: ['caterpillar', 'bug'], anim: 'wiggle',
    draw(a) {
      meadow(a);
      a.f(leaf(100, 640, 600, 70, -5));
      const seg = [[600, 520, 70], [520, 480, 72], [440, 510, 74], [360, 480, 76], [280, 510, 78]];
      for (const [x, y, r] of seg) {
        a.f(ellipse(x - 10, y + r - 4, 16, 12));
        a.f(ellipse(x + 20, y + r - 4, 16, 12));
      }
      a.anim('wiggle', () => {
        for (const [x, y, r] of seg) a.f(circle(x, y, r));
      });
      antennae(a, 200, 360, 50, 90);
      bugFace(a, 200, 420, 90);
    },
  },
  {
    name: 'snail', title: 'Slow Snail', tags: ['snail', 'bug', 'garden'], anim: 'wiggle',
    draw(a) {
      meadow(a);
      a.f('M120 640Q120 580 220 580H600Q700 580 720 640Z');
      a.f(circle(440, 430, 170));
      a.l('M440 430m-20 0a20 20 0 1 1 40 0a50 50 0 1 1 -100 0a80 80 0 1 1 160 0a110 110 0 1 1 -220 0', 5);
      a.f('M180 600Q160 450 220 420Q280 420 290 580Z');
      a.l('M215 430L180 340M250 425L270 335', 5);
      a.anim('wiggle', () => {
        a.f(circle(180, 335, 16));
        a.f(circle(270, 330, 16));
      });
      eyes(a, 235, 480, 22, 11, { white: false });
      smile(a, 235, 520, 18);
    },
  },
  {
    name: 'ant', title: 'Strong Little Ant', tags: ['ant', 'bug'], anim: 'wiggle',
    draw(a) {
      meadow(a);
      for (const [x1, x2] of [[300, 260], [400, 400], [480, 540]]) {
        a.l(`M${x1} 520L${x2 - 40} 650`, 6);
        a.l(`M${x1} 520L${x2 + 40} 650`, 6);
      }
      a.f(ellipse(560, 500, 110, 90));
      a.f(ellipse(400, 500, 60, 50));
      antennae(a, 250, 370, 50, 100);
      bugFace(a, 250, 450, 90);
      a.f(circle(420, 330, 60));
      a.f(leaf(420, 290, 60, 14, -60));
    },
  },
  {
    name: 'dragonfly', title: 'Darting Dragonfly', tags: ['dragonfly', 'bug', 'pond'], anim: 'float',
    draw(a) {
      frame(a);
      a.f('M16 600Q400 560 784 600V748A36 36 0 0 1 748 784H52A36 36 0 0 1 16 748Z');
      a.anim('wiggle', () => {
        a.f(ellipse(270, 250, 170, 50, -20));
        a.f(ellipse(530, 250, 170, 50, 20));
        a.f(ellipse(280, 340, 150, 44, 15));
        a.f(ellipse(520, 340, 150, 44, -15));
      });
      for (let i = 0; i < 6; i++) a.f(ellipse(400, 360 + i * 50, 20, 28));
      a.f(ellipse(400, 290, 34, 50));
      a.f(circle(400, 210, 50));
      eyes(a, 400, 205, 26, 14);
      a.f(rect(150, 640, 12, 120));
      a.f(ellipse(156, 640, 16, 40));
    },
  },
  {
    name: 'friendly-spider', title: 'Friendly Spider', tags: ['spider', 'web', 'bug'], anim: 'wiggle',
    draw(a) {
      frame(a);
      for (let i = 0; i < 8; i++) a.l(`M400 300L${polar(400, 300, 400, i * 45).map((v) => Math.max(20, Math.min(780, v)).toFixed(1)).join(' ')}`, 3);
      for (const r of [80, 150, 220, 290]) {
        const pts = [];
        for (let i = 0; i <= 8; i++) pts.push(polar(400, 300, r, i * 45));
        a.l('M' + pts.map((p) => p.map((v) => Math.max(20, Math.min(780, v)).toFixed(1)).join(' ')).join('L'), 3);
      }
      a.l('M400 20V420', 4);
      for (const d of [-1, 1]) for (const i of [0, 1, 2, 3]) a.l(`M${400 + d * 60} ${470 + i * 30}Q${400 + d * 150} ${400 + i * 40} ${400 + d * 200} ${520 + i * 50}`, 6);
      a.f(circle(400, 520, 110));
      eyes(a, 400, 500, 38, 20);
      smile(a, 400, 560, 30);
      cheeks(a, 400, 550, 70, 12);
    },
  },
  {
    name: 'beetle', title: 'Shiny Beetle', tags: ['beetle', 'bug'], anim: 'wiggle',
    draw(a) {
      meadow(a);
      for (const d of [-1, 1]) for (const i of [0, 1, 2]) a.l(`M${400 + d * 100} ${380 + i * 90}l${d * 110} ${-20 + i * 30}l${d * 30} 40`, 6);
      a.f(ellipse(400, 470, 150, 200));
      a.f(band(400, 470, 150, 200, 250, 400, { vertical: true }));
      a.f(band(400, 470, 150, 200, 400, 550, { vertical: true }));
      a.f(ellipse(400, 290, 100, 60));
      a.f(circle(400, 230, 60));
      a.f(poly([[370, 180], [400, 100], [430, 180]]));
      eyes(a, 400, 230, 25, 12);
      for (const [x, y] of [[330, 420], [470, 420], [340, 520], [460, 520]]) a.f(circle(x, y, 22));
    },
  },
  {
    name: 'firefly', title: 'Glowing Firefly', tags: ['firefly', 'night', 'bug'], anim: 'twinkle',
    draw(a) {
      frame(a);
      a.f(circle(140, 140, 60));
      a.anim('pulse', () => {
        a.f(circle(480, 500, 140));
        a.f(circle(480, 500, 100));
      });
      a.anim('wiggle', () => {
        a.f(ellipse(350, 300, 70, 120, -30));
        a.f(ellipse(470, 300, 70, 120, 30));
      });
      a.f(ellipse(430, 460, 110, 80, 30));
      a.f(ellipse(480, 520, 70, 60, 30));
      antennae(a, 300, 300, 40, 80);
      bugFace(a, 300, 380, 80);
      a.anim('twinkle', () => {
        for (const [x, y] of [[640, 160], [700, 300], [140, 600], [660, 700], [250, 680]]) a.f(circle(x, y, 14));
      });
    },
  },
  {
    name: 'wiggly-worm', title: 'Wiggly Worm', tags: ['worm', 'garden', 'bug'], anim: 'wiggle',
    draw(a) {
      frame(a);
      sun(a, 660, 120, 42);
      a.f('M16 420Q400 380 784 420V748A36 36 0 0 1 748 784H52A36 36 0 0 1 16 748Z');
      for (const [x, y, r] of [[150, 520, 12], [650, 520, 16], [600, 680, 10], [300, 700, 14], [420, 560, 8]]) a.f(circle(x, y, r));
      a.anim('wiggle', () => a.f('M230 380C230 250 400 250 400 360C400 460 560 460 560 360V320H620V360C620 520 340 520 340 360C340 300 290 300 290 380V600H230Z'));
      for (const y of [420, 470, 520, 570]) a.l(`M230 ${y}H290`, 3);
      a.f(circle(260, 300, 60));
      eyes(a, 260, 290, 22, 11);
      smile(a, 260, 320, 18);
      a.anim('wiggle', () => a.f(rect(250, 230, 20, 20)));
    },
  },
  {
    name: 'moth', title: 'Fuzzy Moth', tags: ['moth', 'night', 'bug'], anim: 'float',
    draw(a) {
      frame(a);
      a.f(circle(660, 140, 60));
      a.anim('wiggle', () => {
        for (const d of [-1, 1]) {
          a.f(`M${400 + d * 20} 360Q${400 + d * 300} 200 ${400 + d * 330} 380Q${400 + d * 260} 440 ${400 + d * 20} 420Z`);
          a.f(`M${400 + d * 20} 430Q${400 + d * 240} 450 ${400 + d * 240} 580Q${400 + d * 120} 600 ${400 + d * 20} 480Z`);
          a.f(circle(400 + d * 220, 360, 40));
          a.f(circle(400 + d * 150, 520, 26));
        }
      });
      a.f(scallop(400, 440, 40, 120, 10));
      a.f(circle(400, 300, 46));
      eyes(a, 400, 300, 18, 10);
      a.l('M385 260Q340 180 300 190M415 260Q460 180 500 190', 5);
    },
  },
];
