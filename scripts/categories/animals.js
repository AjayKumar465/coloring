import { circle, ellipse, rect, poly, scallop, smooth, petal, leaf, arcPath, heart } from '../lib/shapes.js';
import { frame, ground, sun, cloud, grass, eyes, smile, cheeks, mx, flowerSmall, sea, twinkleStars } from '../lib/parts.js';

const M = (pts) => pts.map(([x, y]) => [mx(x), y]);

// Generic front-facing critter: head on top of a round body.
export function critter(a, o = {}) {
  const hy = o.headY ?? 338;
  const hr = o.headR ?? 140;
  if (o.tail) o.tail();
  // body
  a.f(ellipse(400, 580, o.bodyRx ?? 130, o.bodyRy ?? 120));
  if (o.belly !== false) a.f(ellipse(400, 600, 82, 78));
  // feet
  a.f(ellipse(325, 690, 55, 30));
  a.f(ellipse(475, 690, 55, 30));
  if (o.toes) for (const x of [305, 325, 345, 455, 475, 495]) a.l(`M${x} 700v-14`, 3);
  // arms
  a.f(ellipse(285, 565, 34, 66, 20));
  a.f(ellipse(515, 565, 34, 66, -20));
  // ears behind head
  if (o.ears) o.ears(hy, hr);
  if (o.mane) o.mane(hy, hr);
  a.f(ellipse(400, hy, hr, o.headRy ?? hr * 0.92));
  if (o.overHead) o.overHead(hy, hr);
  if (o.muzzle) o.muzzle(hy);
  eyes(a, 400, hy - 20, o.eyeGap ?? 52, o.eyeR ?? 18);
  if (o.nose) o.nose(hy);
  if (o.mouth !== false) smile(a, 400, hy + 62, 24, 0.5);
  if (o.whiskers) {
    a.l(`M340 ${hy + 40}l-80 -12M340 ${hy + 52}l-80 8M460 ${hy + 40}l80 -12M460 ${hy + 52}l80 8`, 3);
  }
  if (o.cheeks !== false) cheeks(a, 400, hy + 40, 92, 14);
  if (o.extra) o.extra(hy, hr);
}

const catEars = (a) => (hy) => {
  a.f(poly([[288, hy - 60], [292, hy - 175], [380, hy - 120]]));
  a.f(poly(M([[288, hy - 60], [292, hy - 175], [380, hy - 120]])));
  a.f(poly([[302, hy - 80], [305, hy - 145], [358, hy - 112]]));
  a.f(poly(M([[302, hy - 80], [305, hy - 145], [358, hy - 112]])));
};

const puffMuzzle = (a) => (hy) => {
  a.f(ellipse(372, hy + 45, 34, 26));
  a.f(ellipse(428, hy + 45, 34, 26));
};
const triNose = (a) => (hy) => a.f(`M385 ${hy + 18}h30l-15 18z`);

function bg(a, kind = 'meadow') {
  frame(a);
  if (kind === 'meadow') {
    sun(a, 660, 140, 55);
    cloud(a, 190, 130, 90, 45);
    ground(a, 640, 30);
    grass(a, 760, [80, 180, 620, 720]);
  }
}

export default [
  {
    name: 'kitty', title: 'Happy Kitty', tags: ['cat', 'kitten', 'pet'], anim: 'wiggle',
    draw(a) {
      critter(a, {
        tail: () => a.anim('wiggle', () => a.f(smooth([[515, 640], [620, 640], [690, 560], [690, 450], [660, 430], [645, 470], [650, 550], [600, 600], [520, 600]], true, 0.9))),
        ears: catEars(a),
        muzzle: puffMuzzle(a),
        nose: triNose(a),
        whiskers: true,
        extra: (hy) => a.l(`M400 ${hy - 125}v35M370 ${hy - 120}l8 30M430 ${hy - 120}l-8 30`, 4),
      });
    },
  },
  {
    name: 'puppy', title: 'Playful Puppy', tags: ['dog', 'puppy', 'pet'], anim: 'float',
    draw(a) {
      bg(a);
      critter(a, {
        tail: () => a.anim('wiggle', () => a.f(petal(510, 560, 120, 28, -40))),
        overHead: (hy) => {
          a.f(ellipse(450, hy - 25, 48, 44));
          a.f(ellipse(268, hy + 10, 46, 100, 18));
          a.f(ellipse(532, hy + 10, 46, 100, -18));
        },
        muzzle: (hy) => a.f(ellipse(400, hy + 50, 70, 50)),
        nose: (hy) => a.f(ellipse(400, hy + 28, 26, 18)),
        extra: (hy) => a.f(`M385 ${hy + 70}h30v22a15 15 0 0 1 -30 0z`),
        mouth: false,
      });
      a.f(rect(330, 470, 140, 28, 12));
      a.f(circle(400, 512, 20));
    },
  },
  {
    name: 'bunny', title: 'Fluffy Bunny', tags: ['rabbit', 'bunny', 'easter'], anim: 'float',
    draw(a) {
      bg(a);
      critter(a, {
        headY: 340, headR: 125,
        tail: () => a.f(scallop(530, 650, 42, 42, 8)),
        ears: () => {
          a.f(ellipse(345, 160, 40, 115, -8));
          a.f(ellipse(455, 160, 40, 115, 8));
          a.f(ellipse(345, 170, 20, 80, -8));
          a.f(ellipse(455, 170, 20, 80, 8));
        },
        muzzle: puffMuzzle(a),
        nose: (hy) => a.f(ellipse(400, hy + 22, 16, 11)),
        whiskers: true,
        extra: (hy) => a.f(rect(388, hy + 70, 24, 26, 4)),
        mouth: false,
      });
      flowerSmall(a, 110, 640, 24);
      flowerSmall(a, 690, 650, 20);
    },
  },
  {
    name: 'teddy-bear', title: 'Teddy Bear', tags: ['bear', 'teddy', 'toy'], anim: 'float',
    draw(a) {
      critter(a, {
        ears: (hy) => {
          a.f(circle(290, hy - 110, 55));
          a.f(circle(510, hy - 110, 55));
          a.f(circle(295, hy - 105, 30));
          a.f(circle(505, hy - 105, 30));
        },
        muzzle: (hy) => a.f(ellipse(400, hy + 50, 66, 50)),
        nose: (hy) => a.f(ellipse(400, hy + 30, 24, 16)),
        toes: true,
        extra: () => {
          a.f(heart(400, 600, 40));
        },
      });
    },
  },
  {
    name: 'mouse', title: 'Little Mouse', tags: ['mouse', 'cheese'], anim: 'wiggle',
    draw(a) {
      critter(a, {
        headR: 125, headY: 330,
        tail: () => a.l('M520 640C640 660 700 600 660 540S560 480 600 420', 7),
        ears: (hy) => {
          a.f(circle(272, hy - 100, 82));
          a.f(circle(528, hy - 100, 82));
          a.f(circle(278, hy - 95, 50));
          a.f(circle(522, hy - 95, 50));
        },
        nose: (hy) => a.f(circle(400, hy + 32, 16)),
        whiskers: true,
        eyeGap: 45,
      });
      a.f(poly([[600, 760], [740, 760], [740, 690], [600, 730]]));
      a.f(poly([[600, 730], [740, 690], [700, 660]]));
      a.f(circle(660, 735, 12));
      a.f(circle(710, 720, 9));
    },
  },
  {
    name: 'lion', title: 'Lion King of the Meadow', tags: ['lion', 'safari', 'wild'], anim: 'wiggle',
    draw(a) {
      bg(a);
      critter(a, {
        headR: 120,
        tail: () => {
          a.l('M520 640Q640 650 650 540', 7);
          a.f(scallop(655, 520, 28, 34, 7));
        },
        mane: (hy) => a.anim('wiggle', () => a.f(scallop(400, hy + 5, 185, 175, 16, 0.62))),
        ears: (hy) => {
          a.f(circle(305, hy - 95, 36));
          a.f(circle(495, hy - 95, 36));
        },
        muzzle: puffMuzzle(a),
        nose: triNose(a),
        whiskers: true,
      });
    },
  },
  {
    name: 'panda', title: 'Panda with Bamboo', tags: ['panda', 'bear', 'bamboo'], anim: 'float',
    draw(a) {
      frame(a);
      for (const x of [90, 700]) {
        a.f(rect(x - 20, 40, 40, 720, 14));
        for (const y of [200, 400, 600]) a.l(`M${x - 20} ${y}h40`);
        a.f(leaf(x + 18, 200, 90, 18, -30));
        a.f(leaf(x - 18, 420, 90, 18, 210));
      }
      ground(a, 660, 20);
      critter(a, {
        ears: (hy) => {
          a.f(circle(292, hy - 105, 50));
          a.f(circle(508, hy - 105, 50));
        },
        overHead: (hy) => {
          a.f(ellipse(348, hy - 18, 42, 54, -30));
          a.f(ellipse(452, hy - 18, 42, 54, 30));
        },
        nose: (hy) => a.f(ellipse(400, hy + 28, 22, 14)),
      });
    },
  },
  {
    name: 'koala', title: 'Cuddly Koala', tags: ['koala', 'australia'], anim: 'float',
    draw(a) {
      critter(a, {
        headR: 135, headY: 330,
        ears: (hy) => {
          a.f(scallop(270, hy - 70, 78, 78, 10));
          a.f(scallop(530, hy - 70, 78, 78, 10));
          a.f(circle(275, hy - 65, 44));
          a.f(circle(525, hy - 65, 44));
        },
        nose: (hy) => a.f(ellipse(400, hy + 30, 34, 48)),
        mouth: false,
        eyeGap: 62,
        extra: (hy) => smile(a, 400, hy + 92, 18, 0.5),
      });
    },
  },
  {
    name: 'fox', title: 'Clever Fox', tags: ['fox', 'forest', 'wild'], anim: 'wiggle',
    draw(a) {
      bg(a);
      critter(a, {
        tail: () => a.anim('wiggle', () => {
          a.f(smooth([[510, 650], [640, 660], [730, 560], [720, 420], [650, 470], [620, 580], [520, 600]], true, 0.9));
          a.f(smooth([[730, 560], [720, 420], [665, 460], [690, 540]], true, 0.9));
        }),
        ears: (hy) => {
          a.f(poly([[285, hy - 40], [270, hy - 200], [385, hy - 115]]));
          a.f(poly(M([[285, hy - 40], [270, hy - 200], [385, hy - 115]])));
          a.f(poly([[300, hy - 70], [290, hy - 165], [360, hy - 112]]));
          a.f(poly(M([[300, hy - 70], [290, hy - 165], [360, hy - 112]])));
        },
        overHead: (hy) => {
          a.f(`M262 ${hy + 10}Q330 ${hy + 10} 400 ${hy + 30}Q470 ${hy + 10} 538 ${hy + 10}Q500 ${hy + 120} 400 ${hy + 128}Q300 ${hy + 120} 262 ${hy + 10}Z`);
        },
        nose: (hy) => a.f(ellipse(400, hy + 40, 20, 14)),
        cheeks: false,
      });
    },
  },
  {
    name: 'monkey', title: 'Silly Monkey', tags: ['monkey', 'jungle', 'banana'], anim: 'wiggle',
    draw(a) {
      critter(a, {
        tail: () => a.l('M500 640C640 680 720 600 680 520C650 460 590 500 620 540', 9),
        ears: (hy) => {
          a.f(circle(262, hy, 48));
          a.f(circle(538, hy, 48));
          a.f(circle(266, hy, 26));
          a.f(circle(534, hy, 26));
        },
        overHead: (hy) => {
          a.f(`M400 ${hy - 40}C350 ${hy - 110} 280 ${hy - 50} 310 ${hy}C270 ${hy + 60} 320 ${hy + 115} 400 ${hy + 115}C480 ${hy + 115} 530 ${hy + 60} 490 ${hy}C520 ${hy - 50} 450 ${hy - 110} 400 ${hy - 40}Z`);
        },
        nose: (hy) => {
          a.k(ellipse(390, hy + 30, 5, 7));
          a.k(ellipse(410, hy + 30, 5, 7));
        },
        eyeGap: 42,
        cheeks: false,
      });
      // banana
      a.f('M545 520C600 520 640 470 640 420C650 470 620 560 550 560Z');
    },
  },
  {
    name: 'owl', title: 'Wise Owl', tags: ['owl', 'bird', 'night'], anim: 'float',
    draw(a) {
      frame(a);
      a.f(circle(640, 140, 60));
      a.f(circle(665, 125, 50));
      a.f(rect(16, 690, 768, 46, 20));
      // ear tufts
      a.f(poly([[250, 240], [260, 110], [340, 190]]));
      a.f(poly(M([[250, 240], [260, 110], [340, 190]])));
      a.f(ellipse(400, 430, 190, 260));
      a.f(ellipse(225, 470, 60, 150, 12));
      a.f(ellipse(575, 470, 60, 150, -12));
      a.f(ellipse(400, 530, 120, 150));
      for (const [x, y] of [[350, 470], [450, 470], [400, 520], [350, 570], [450, 570], [400, 620]]) a.l(arcPath(x, y, 26, 18, 20, 160));
      a.f(circle(325, 345, 72));
      a.f(circle(475, 345, 72));
      eyes(a, 400, 345, 75, 36);
      a.f(poly([[380, 395], [420, 395], [400, 440]]));
      for (const x of [340, 460]) {
        a.f(ellipse(x - 22, 690, 14, 24));
        a.f(ellipse(x, 692, 14, 26));
        a.f(ellipse(x + 22, 690, 14, 24));
      }
    },
  },
  {
    name: 'penguin', title: 'Penguin on the Ice', tags: ['penguin', 'bird', 'snow', 'winter'], anim: 'wiggle',
    draw(a) {
      frame(a);
      a.f('M16 600L260 560L520 590L784 550V748A36 36 0 0 1 748 784H52A36 36 0 0 1 16 748Z');
      twinkleStars(a, [[120, 120, 24], [680, 160, 20], [600, 80, 14]]);
      a.f(ellipse(250, 470, 50, 130, 25));
      a.f(ellipse(550, 470, 50, 130, -25));
      a.f(ellipse(400, 430, 165, 250));
      a.f(ellipse(400, 520, 112, 170));
      a.f(circle(362, 300, 52));
      a.f(circle(438, 300, 52));
      eyes(a, 400, 300, 38, 17);
      a.f(poly([[372, 335], [428, 335], [400, 372]]));
      cheeks(a, 400, 345, 72, 11);
      a.f(ellipse(345, 680, 60, 26));
      a.f(ellipse(455, 680, 60, 26));
      a.f('M300 380Q400 420 500 380L510 410Q400 455 290 410Z');
      a.f(rect(450, 400, 34, 90, 10));
    },
  },
  {
    name: 'elephant', title: 'Gentle Elephant', tags: ['elephant', 'safari', 'jungle'], anim: 'float',
    draw(a) {
      bg(a);
      a.f(ellipse(400, 580, 150, 120));
      a.f(rect(300, 610, 70, 110, 24));
      a.f(rect(430, 610, 70, 110, 24));
      a.f(ellipse(240, 330, 115, 140, -10));
      a.f(ellipse(560, 330, 115, 140, 10));
      a.f(ellipse(250, 330, 75, 100, -10));
      a.f(ellipse(550, 330, 75, 100, 10));
      a.f(ellipse(400, 320, 130, 125));
      a.anim('wiggle', () => a.f('M360 380C350 470 340 540 300 560C290 590 330 600 350 575C400 520 420 470 440 380Z'));
      a.f('M350 400Q320 440 330 470Q355 440 370 410Z');
      a.f('M450 400Q480 440 470 470Q445 440 430 410Z');
      eyes(a, 400, 300, 50, 16);
      cheeks(a, 400, 350, 80, 14);
      for (const x of [315, 335, 355, 445, 465, 485]) a.l(`M${x} 720v-14`, 3);
    },
  },
  {
    name: 'frog', title: 'Froggy on a Lily Pad', tags: ['frog', 'pond', 'water'], anim: 'float',
    draw(a) {
      frame(a);
      sea(a, 520, 8, 4);
      a.f('M150 680A250 80 0 1 0 650 680A250 80 0 1 0 150 680Z');
      a.l('M400 680L560 640', 4);
      a.f(ellipse(270, 610, 80, 40, -15));
      a.f(ellipse(530, 610, 80, 40, 15));
      a.f(ellipse(400, 540, 175, 120));
      a.f(ellipse(400, 580, 110, 70));
      a.f(circle(305, 330, 62));
      a.f(circle(495, 330, 62));
      a.f(ellipse(400, 410, 180, 110));
      a.anim('blink', () => {
        for (const x of [305, 495]) {
          a.f(circle(x, 330, 40));
          a.k(circle(x + 6, 336, 20));
          a.f(circle(x + 12, 326, 7));
        }
      });
      a.l(arcPath(400, 400, 110, 60, 20, 160));
      cheeks(a, 400, 430, 120, 16);
      a.f(ellipse(330, 640, 40, 18));
      a.f(ellipse(470, 640, 40, 18));
      flowerSmall(a, 660, 600, 20);
    },
  },
  {
    name: 'hedgehog', title: 'Hedgehog Hug', tags: ['hedgehog', 'forest'], anim: 'wiggle',
    draw(a) {
      bg(a);
      const sp = [];
      for (let i = 0; i <= 22; i++) {
        const ang = 180 + (i / 22) * 190;
        const r = i % 2 ? 230 : 180;
        sp.push([430 + r * Math.cos((ang * Math.PI) / 180), 600 + r * 0.9 * Math.sin((ang * Math.PI) / 180)]);
      }
      a.f(poly([[200, 600], ...sp, [640, 640], [220, 650]]));
      a.f('M240 640C230 560 300 470 380 480C470 490 520 560 510 640Z');
      a.f(`M270 560C200 560 150 600 140 620C200 640 250 640 290 630Z`);
      a.k(circle(140, 616, 12));
      a.anim('blink', () => { a.f(ellipse(225, 565, 13, 16)); a.k(circle(222, 568, 7)); });
      a.l('M180 600q20 10 40 0', 4);
      a.f(ellipse(300, 650, 30, 16));
      a.f(ellipse(460, 650, 30, 16));
      // apple on its back
      a.f(circle(470, 400, 45));
      a.l('M470 356q4 -20 12 -26', 5);
      a.f(leaf(480, 345, 40, 10, -30));
    },
  },
  {
    name: 'giraffe', title: 'Tall Giraffe', tags: ['giraffe', 'safari'], anim: 'wiggle',
    draw(a) {
      bg(a);
      a.f(rect(380, 300, 80, 320, 30));
      a.f(ellipse(470, 600, 170, 95));
      for (const x of [340, 400, 540, 600]) a.f(rect(x - 20, 640, 40, 120, 12));
      a.f(ellipse(420, 230, 85, 65, -15));
      a.f(ellipse(370, 270, 55, 40, -15));
      a.f(rect(395, 130, 12, 50, 6));
      a.f(rect(440, 125, 12, 50, 6));
      a.f(circle(401, 128, 14));
      a.f(circle(446, 123, 14));
      a.f(ellipse(485, 190, 30, 14, -30));
      eyes(a, 430, 215, 25, 11);
      a.k(circle(352, 262, 5));
      for (const [x, y, r] of [[420, 360, 20], [405, 430, 18], [430, 500, 22], [420, 570, 16], [500, 570, 24], [570, 610, 22], [460, 640, 18], [560, 545, 16]]) a.f(scallop(x, y, r, r * 0.85, 6, 0.6));
      a.l('M635 590Q690 600 690 660', 6);
    },
  },
];
