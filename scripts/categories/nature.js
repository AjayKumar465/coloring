import { circle, ellipse, rect, poly, smooth, petal, scallop, arcPath, star, heart, leaf, polar, annular, softStar } from '../lib/shapes.js';
import { frame, ground, sun, cloud, eyes, smile, cheeks, grass, tree, pineTree, flowerSmall, hill, sea } from '../lib/parts.js';

function garden(a) {
  frame(a);
  sun(a, 660, 120, 45);
  cloud(a, 170, 120, 90, 40);
  ground(a, 650, 25);
}

export function flower(a, x, y, petals, r, petalLen, petalW, kind = 'round') {
  for (let i = 0; i < petals; i++) {
    const ang = (360 / petals) * i - 90;
    if (kind === 'round') {
      const [px, py] = polar(x, y, r + petalLen * 0.45, ang);
      a.f(ellipse(px, py, petalLen * 0.55, petalW, ang));
    } else a.f(petal(...polar(x, y, r * 0.6, ang), petalLen, petalW, ang, kind === 'pointy' ? 0.5 : 1));
  }
  a.f(circle(x, y, r));
}

export default [
  {
    name: 'daisy', title: 'Happy Daisy', tags: ['daisy', 'flower'], anim: 'wiggle',
    draw(a) {
      garden(a);
      a.f(rect(388, 400, 24, 280, 10));
      a.f(leaf(400, 560, 140, 30, -30));
      a.f(leaf(400, 600, 140, 30, 210));
      a.anim('spin', () => flower(a, 400, 320, 12, 70, 140, 30));
      eyes(a, 400, 310, 26, 11);
      smile(a, 400, 340, 18);
    },
  },
  {
    name: 'tulips', title: 'Tulip Trio', tags: ['tulip', 'flower', 'spring'], anim: 'wiggle',
    draw(a) {
      garden(a);
      for (const [x, y, lean] of [[230, 340, -10], [400, 270, 0], [570, 340, 10]]) {
        a.l(`M${x} ${y + 80}Q${x - lean * 3} ${y + 220} ${x - lean * 6} 680`, 8);
        a.f(leaf(x - lean * 4, 620, 150, 26, -60 - lean * 2));
        a.anim('wiggle', () => {
          a.f(`M${x - 70} ${y - 40}Q${x - 80} ${y + 90} ${x} ${y + 90}Q${x + 80} ${y + 90} ${x + 70} ${y - 40}L${x + 35} ${y}L${x} ${y - 60}L${x - 35} ${y}Z`);
          a.f(`M${x - 35} ${y}L${x} ${y - 60}L${x + 35} ${y}Q${x} ${y + 60} ${x - 35} ${y}Z`);
        });
      }
    },
  },
  {
    name: 'sunflower', title: 'Tall Sunflower', tags: ['sunflower', 'flower', 'summer'], anim: 'wiggle',
    draw(a) {
      garden(a);
      a.f(rect(385, 380, 30, 300, 12));
      a.f(leaf(400, 520, 170, 36, -20));
      a.f(leaf(400, 580, 170, 36, 200));
      a.anim('spin', () => {
        flower(a, 400, 290, 16, 95, 110, 24, 'pointy');
      });
      a.f(circle(400, 290, 70));
      for (let i = 0; i < 12; i++) a.k(circle(...polar(400, 290, i % 2 ? 50 : 30, i * 30), 5));
    },
  },
  {
    name: 'rose', title: 'Pretty Rose', tags: ['rose', 'flower', 'love'], anim: 'wiggle',
    draw(a) {
      frame(a);
      a.l('M400 480Q380 600 400 740', 9);
      a.f(leaf(395, 600, 150, 32, -35));
      a.f(leaf(395, 650, 140, 30, 210));
      a.f(scallop(400, 340, 190, 160, 7, 0.6, -90));
      a.f(scallop(400, 330, 140, 120, 6, 0.62, -60));
      a.f(scallop(400, 320, 95, 82, 5, 0.65, -90));
      a.f('M400 290C340 290 340 360 400 360C440 360 450 320 420 305C410 330 370 330 375 310Z');
      for (const [x, y] of [[150, 160], [650, 180], [130, 600], [660, 620]]) a.f(heart(x, y, 32));
    },
  },
  {
    name: 'flower-pot', title: 'Flower Pot', tags: ['flower', 'pot', 'garden'], anim: 'wiggle',
    draw(a) {
      frame(a);
      a.f(rect(16, 660, 768, 40));
      for (const [x, y, n, kind] of [[260, 270, 6, 'round'], [400, 200, 8, 'pointy'], [540, 280, 5, 'round']]) {
        a.l(`M${x} ${y}Q${(x + 400) / 2} ${y + 150} 400 470`, 7);
        a.anim('wiggle', () => flower(a, x, y, n, 34, 70, 22, kind));
      }
      a.f(leaf(400, 450, 120, 26, -40));
      a.f(leaf(400, 450, 120, 26, 220));
      a.f('M240 470H560L520 660H280Z');
      a.f(rect(220, 450, 360, 60, 12));
      a.f(heart(400, 580, 34));
    },
  },
  {
    name: 'apple-tree', title: 'Apple Tree', tags: ['tree', 'apple', 'garden'], anim: 'wiggle',
    draw(a) {
      garden(a);
      a.f('M350 680L370 420H430L450 680Z');
      a.l('M400 500L330 440M400 470L470 410', 8);
      a.anim('sway', () => {
        a.f(scallop(400, 300, 250, 200, 14, 0.62));
        for (const [x, y] of [[280, 260], [400, 200], [520, 260], [330, 360], [470, 360], [400, 300], [230, 340], [570, 340]]) a.f(circle(x, y, 26));
      });
      a.f(circle(250, 690, 24));
      a.f(circle(560, 700, 24));
    },
  },
  {
    name: 'mushrooms', title: 'Forest Mushrooms', tags: ['mushroom', 'forest'], anim: 'wiggle',
    draw(a) {
      garden(a);
      for (const [x, y, s] of [[260, 500, 1.1], [520, 540, 0.8], [640, 640, 0.5]]) {
        a.f(`M${x - 50 * s} ${y + 160 * s}Q${x - 40 * s} ${y} ${x} ${y}Q${x + 40 * s} ${y} ${x + 50 * s} ${y + 160 * s}Z`);
        a.f(`M${x - 160 * s} ${y + 10 * s}C${x - 160 * s} ${y - 170 * s} ${x + 160 * s} ${y - 170 * s} ${x + 160 * s} ${y + 10 * s}Q${x} ${y + 50 * s} ${x - 160 * s} ${y + 10 * s}Z`);
        for (const [dx, dy, r] of [[-80, -50, 22], [0, -100, 26], [80, -50, 22], [20, -20, 14]]) a.f(circle(x + dx * s, y + dy * s, r * s));
      }
      a.f(leaf(120, 700, 90, 18, -60));
    },
  },
  {
    name: 'leaves', title: 'Leaf Collection', tags: ['leaf', 'autumn', 'tree'], anim: 'float',
    draw(a) {
      frame(a);
      const leafWithVeins = (x, y, len, w, ang) => {
        a.f(leaf(x, y, len, w, ang));
        const r = (ang * Math.PI) / 180;
        a.l(`M${x} ${y}L${(x + Math.cos(r) * len * 0.92).toFixed(1)} ${(y + Math.sin(r) * len * 0.92).toFixed(1)}`, 3);
      };
      leafWithVeins(140, 300, 230, 50, -30);
      leafWithVeins(420, 380, 260, 56, -70);
      leafWithVeins(470, 720, 240, 50, -40);
      leafWithVeins(160, 720, 210, 48, -80);
      a.f(softStar(620, 240, 140, 60, 5));
      a.f(softStar(250, 520, 100, 46, 7));
      a.f(circle(650, 560, 50));
      a.f(scallop(650, 515, 55, 22, 8));
      a.l('M650 495q5 -30 25 -40', 5);
    },
  },
  {
    name: 'cactus', title: 'Desert Cactus', tags: ['cactus', 'desert', 'plant'], anim: 'wiggle',
    draw(a) {
      frame(a);
      sun(a, 640, 130, 55, true);
      a.f('M16 600Q200 570 400 600T784 590V748A36 36 0 0 1 748 784H52A36 36 0 0 1 16 748Z');
      a.f('M210 480V360Q210 320 245 320Q280 320 280 360V430H340V440H280V480Q280 520 245 520Q210 520 210 480Z');
      a.f('M590 420V320Q590 280 555 280Q520 280 520 320V380H460V390H520V420Q520 460 555 460Q590 460 590 420Z');
      a.f('M330 620V240Q330 180 400 180Q470 180 470 240V620Z');
      a.l('M375 230V600M425 230V600', 3);
      a.f(scallop(400, 175, 40, 30, 6));
      eyes(a, 400, 330, 28, 12);
      smile(a, 400, 370, 20);
      a.f('M300 600H500L480 700H320Z');
    },
  },
  {
    name: 'rainbow', title: 'Rainbow and Clouds', tags: ['rainbow', 'weather', 'sky'], anim: 'float',
    draw(a) {
      frame(a);
      for (let i = 0; i < 6; i++) a.f(annular(400, 560, 120 + i * 40, 160 + i * 40, 180, 360));
      a.f(scallop(170, 560, 120, 70, 9));
      a.f(scallop(630, 560, 120, 70, 9));
      sun(a, 680, 130, 45);
      for (const [x, y] of [[300, 690], [400, 720], [500, 690]]) a.f(`M${x} ${y - 30}Q${x - 18} ${y} ${x} ${y + 10}Q${x + 18} ${y} ${x} ${y - 30}Z`);
    },
  },
  {
    name: 'mountains', title: 'Mountain Adventure', tags: ['mountain', 'landscape'], anim: 'float',
    draw(a) {
      frame(a);
      sun(a, 640, 140, 50);
      cloud(a, 200, 130, 80, 36);
      a.f('M16 560L200 300L380 560Z');
      a.f('M200 300L250 370L220 360L190 390L160 356Z');
      a.f('M240 600L470 230L720 600Z');
      a.f('M470 230L530 330L500 315L470 345L440 315L410 330Z');
      hill(a, 200, 500, 260);
      hill(a, 600, 540, 260);
      ground(a, 660, 20);
      pineTree(a, 130, 700, 0.45);
      pineTree(a, 640, 720, 0.4);
      pineTree(a, 720, 730, 0.3);
      a.f('M360 784Q400 690 480 640Q430 700 450 784Z');
    },
  },
  {
    name: 'bouquet', title: 'Flower Bouquet', tags: ['flower', 'bouquet', 'gift'], anim: 'wiggle',
    draw(a) {
      frame(a);
      for (const [x, y, n, kind] of [[400, 200, 7, 'round'], [270, 260, 5, 'pointy'], [530, 260, 6, 'round'], [330, 380, 8, 'round'], [470, 380, 5, 'pointy']]) {
        a.anim('wiggle', () => flower(a, x, y, n, 34, 70, 22, kind));
      }
      a.f(leaf(250, 420, 120, 26, 200));
      a.f(leaf(550, 420, 120, 26, -20));
      a.f('M260 440H540L430 720H370Z');
      a.f('M330 560Q400 600 470 560L460 620Q400 650 340 620Z');
      a.f(heart(330, 620, 30));
      a.f(heart(470, 620, 30));
    },
  },
  {
    name: 'lily-pond', title: 'Lily Pond', tags: ['pond', 'lily', 'water'], anim: 'float',
    draw(a) {
      frame(a);
      sun(a, 650, 120, 45);
      sea(a, 300, 6, 3);
      for (const [x, y, rx, ry] of [[220, 500, 140, 50], [560, 430, 120, 44], [480, 660, 150, 56]]) {
        const p1 = polar(x, y, 1, -14), p2 = polar(x, y, 1, 14);
        a.f(`M${x} ${y}L${(x + (p1[0] - x) * rx).toFixed(1)} ${(y + (p1[1] - y) * ry).toFixed(1)}A${rx} ${ry} 0 1 0 ${(x + (p2[0] - x) * rx).toFixed(1)} ${(y + (p2[1] - y) * ry).toFixed(1)}Z`);
      }
      for (const [x, y] of [[220, 470], [560, 405]]) {
        for (const ang of [-150, -120, -90, -60, -30]) a.f(petal(x, y, 60, 18, ang, 0.5));
        a.f(ellipse(x, y, 30, 12));
      }
      a.f(rect(120, 320, 14, 160, 6));
      a.f(ellipse(127, 320, 16, 40));
      a.f(rect(680, 340, 14, 180, 6));
      a.f(ellipse(687, 340, 16, 40));
    },
  },
];
