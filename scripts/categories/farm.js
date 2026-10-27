import { circle, ellipse, rect, poly, smooth, petal, scallop, arcPath, star, heart, leaf, polar, band, hatch } from '../lib/shapes.js';
import { frame, ground, sun, cloud, eyes, smile, cheeks, grass, tree, wheel, mx } from '../lib/parts.js';
import { critter } from './animals.js';

function farmBg(a) {
  frame(a);
  sun(a, 660, 120, 45);
  cloud(a, 170, 120, 90, 40);
  ground(a, 640, 25);
  // fence
  for (let x = 50; x < 760; x += 90) a.f(`M${x} 650V560L${x + 15} 540L${x + 30} 560V650Z`);
  a.f(rect(30, 575, 740, 18, 4));
}

export default [
  {
    name: 'cow', title: 'Happy Cow', tags: ['cow', 'farm', 'milk'], anim: 'wiggle',
    draw(a) {
      farmBg(a);
      critter(a, {
        headR: 130, headY: 330,
        tail: () => a.l('M520 600Q620 600 610 500', 6),
        ears: (hy) => {
          a.f(poly([[300, hy - 100], [270, hy - 180], [340, hy - 120]]));
          a.f(poly([[500, hy - 100], [530, hy - 180], [460, hy - 120]]));
          a.f(ellipse(250, hy - 50, 60, 28, -20));
          a.f(ellipse(550, hy - 50, 60, 28, 20));
        },
        overHead: (hy) => a.f(scallop(460, hy - 50, 50, 40, 7)),
        muzzle: (hy) => {
          a.f(ellipse(400, hy + 60, 95, 60));
          a.k(ellipse(365, hy + 55, 9, 13));
          a.k(ellipse(435, hy + 55, 9, 13));
        },
        mouth: false,
        extra: () => {
          a.f(scallop(330, 560, 36, 30, 6));
          a.f(rect(380, 470, 40, 40, 8));
          a.f(circle(400, 520, 22));
        },
      });
    },
  },
  {
    name: 'piglet', title: 'Pink Piglet', tags: ['pig', 'farm'], anim: 'wiggle',
    draw(a) {
      farmBg(a);
      a.f(ellipse(250, 720, 160, 40));
      critter(a, {
        tail: () => a.l('M520 600c40 -10 40 -50 15 -50s-20 40 20 30', 6),
        ears: (hy) => {
          a.f(poly([[300, hy - 90], [290, hy - 180], [370, hy - 130]]));
          a.f(poly(mx2([[300, hy - 90], [290, hy - 180], [370, hy - 130]])));
        },
        muzzle: (hy) => {
          a.f(ellipse(400, hy + 40, 55, 38));
          a.k(ellipse(385, hy + 40, 8, 13));
          a.k(ellipse(415, hy + 40, 8, 13));
        },
        mouth: false,
        extra: (hy) => smile(a, 400, hy + 92, 20, 0.5),
      });
    },
  },
  {
    name: 'sheep', title: 'Woolly Sheep', tags: ['sheep', 'lamb', 'farm', 'wool'], anim: 'float',
    draw(a) {
      farmBg(a);
      for (const x of [300, 360, 450, 510]) a.f(rect(x - 18, 540, 36, 130, 12));
      a.f(scallop(410, 470, 220, 140, 18, 0.62));
      a.f(ellipse(230, 380, 60, 26, -30));
      a.f(ellipse(370, 380, 60, 26, 30));
      a.f(ellipse(300, 410, 80, 95));
      a.f(scallop(300, 330, 70, 40, 8));
      eyes(a, 300, 400, 30, 12);
      smile(a, 300, 450, 18);
      cheeks(a, 300, 440, 50, 10);
    },
  },
  {
    name: 'hen', title: 'Mother Hen', tags: ['chicken', 'hen', 'farm', 'egg'], anim: 'wiggle',
    draw(a) {
      farmBg(a);
      a.f(poly([[560, 380], [660, 300], [680, 380], [650, 450], [570, 480]]));
      a.l('M380 620V680l-30 20M380 680l30 20M460 620V680l-30 20M460 680l30 20', 6);
      a.f(ellipse(420, 500, 180, 140));
      a.f(petal(430, 470, 160, 50, 10));
      a.f(circle(290, 340, 95));
      a.f(scallop(280, 240, 50, 26, 6, 0.65, 180));
      a.f(poly([[200, 340], [150, 360], [200, 380]]));
      a.f(ellipse(205, 410, 16, 26));
      eyes(a, 290, 330, 34, 13);
      a.f(ellipse(590, 690, 34, 44));
      a.f(ellipse(660, 700, 30, 40));
    },
  },
  {
    name: 'baby-chick', title: 'Fluffy Chick', tags: ['chick', 'chicken', 'farm', 'easter'], anim: 'wiggle',
    draw(a) {
      farmBg(a);
      a.f(ellipse(400, 520, 160, 150));
      a.f(petal(260, 500, 100, 34, 160));
      a.f(petal(540, 500, 100, 34, 20));
      a.f(scallop(400, 300, 42, 24, 5, 0.65, 180));
      a.f(circle(400, 360, 110));
      eyes(a, 400, 350, 42, 16);
      a.f(poly([[370, 390], [430, 390], [400, 425]]));
      cheeks(a, 400, 400, 75, 12);
      a.l('M360 670v30l-20 10M360 700l20 10M440 670v30l-20 10M440 700l20 10', 5);
      a.f('M220 720C220 640 580 640 580 720Q400 660 220 720Z');
    },
  },
  {
    name: 'duck', title: 'Duck in the Pond', tags: ['duck', 'farm', 'pond'], anim: 'swim',
    draw(a) {
      frame(a);
      sun(a, 660, 120, 45);
      cloud(a, 170, 120, 90, 40);
      a.f('M16 540Q400 520 784 540V748A36 36 0 0 1 748 784H52A36 36 0 0 1 16 748Z');
      a.f('M180 520C180 420 300 420 400 450C440 430 520 400 600 400C620 460 640 520 600 580Q400 640 230 590C200 570 180 550 180 520Z');
      a.f(petal(330, 510, 170, 40, -10, 0.8));
      a.f(circle(260, 340, 90));
      a.f('M180 350Q110 350 100 375Q130 400 180 390Z');
      eyes(a, 260, 320, 30, 12);
      for (const x of [150, 650]) a.l(`M${x - 60} 650q30 -16 60 0t60 0`, 4);
    },
  },
  {
    name: 'pony', title: 'Farm Pony', tags: ['horse', 'pony', 'farm'], anim: 'wiggle',
    draw(a) {
      farmBg(a);
      for (const x of [300, 360, 520, 580]) {
        a.f(rect(x - 20, 520, 40, 160, 14));
        a.f(rect(x - 24, 660, 48, 30, 8));
      }
      a.anim('wiggle', () => a.f(smooth([[610, 440], [690, 470], [700, 580], [660, 560], [630, 500]], true, 0.8)));
      a.f(ellipse(440, 480, 190, 100));
      a.f(smooth([[240, 470], [220, 360], [210, 260], [260, 220], [330, 250], [340, 360], [360, 440]], true, 0.9));
      a.f(smooth([[200, 230], [140, 250], [110, 300], [140, 330], [200, 330], [240, 300]], true, 0.9));
      a.anim('wiggle', () => {
        for (const [x, y, ang] of [[300, 240, 40], [320, 300, 30], [335, 360, 20], [345, 420, 10]]) a.f(petal(x, y, 80, 22, ang));
      });
      a.f(poly([[250, 220], [265, 170], [285, 230]]));
      eyes(a, 220, 260, 0, 12);
      a.k(ellipse(130, 300, 6, 9));
    },
  },
  {
    name: 'red-barn', title: 'Big Red Barn', tags: ['barn', 'farm'], anim: 'float',
    draw(a) {
      frame(a);
      sun(a, 660, 110, 40);
      cloud(a, 160, 110, 80, 36);
      ground(a, 640, 20);
      a.f('M180 660V340L400 200L620 340V660Z');
      a.f('M150 360L400 180L650 360L620 380L400 225L180 380Z');
      a.f(rect(310, 460, 180, 200));
      a.l('M310 460L490 660M490 460L310 660', 5);
      a.f(rect(360, 290, 80, 80, 6));
      a.l('M400 290V370M360 330H440', 4);
      a.f(rect(660, 400, 90, 260, 45));
      a.f(rect(210, 420, 70, 60));
      a.f(rect(520, 420, 70, 60));
    },
  },
  {
    name: 'tractor', title: 'Farm Tractor', tags: ['tractor', 'farm', 'vehicle'], anim: 'wiggle',
    draw(a) {
      frame(a);
      sun(a, 660, 120, 45);
      ground(a, 620, 20);
      a.f(rect(160, 420, 300, 140, 16));
      a.f(rect(160, 380, 60, 40, 8));
      a.f(rect(175, 300, 20, 80, 6));
      a.f('M440 260H620V560H440Z');
      a.f(rect(470, 290, 120, 110, 10));
      a.f(rect(430, 240, 210, 30, 10));
      wheel(a, 230, 600, 70);
      wheel(a, 540, 580, 110);
    },
  },
  {
    name: 'scarecrow', title: 'Silly Scarecrow', tags: ['scarecrow', 'farm', 'autumn'], anim: 'wiggle',
    draw(a) {
      frame(a);
      ground(a, 660, 20);
      a.f(rect(388, 300, 24, 450));
      a.f(rect(160, 380, 480, 24));
      a.f('M300 360H500L520 600H280Z');
      a.f(rect(420, 430, 50, 50, 4));
      a.l('M420 455H470M445 430V480', 3);
      for (const x of [170, 630]) for (const dy of [-20, 0, 20]) a.l(`M${x} 392l${x < 400 ? -40 : 40} ${dy}`, 4);
      a.f(circle(400, 260, 85));
      eyes(a, 400, 250, 32, 10, { white: false });
      a.l('M350 290Q400 320 450 290M370 290l-6 12M400 300v12M430 290l6 12', 4);
      a.f(ellipse(400, 190, 170, 30));
      a.f('M320 190Q320 90 400 90Q480 90 480 190Z');
      a.f(rect(320, 160, 160, 26));
      a.f(scallop(560, 160, 50, 30, 7));
    },
  },
  {
    name: 'corn', title: 'Sweet Corn', tags: ['corn', 'farm', 'vegetable'], anim: 'wiggle',
    draw(a) {
      frame(a);
      a.f(ellipse(400, 380, 110, 280));
      const cob = [];
      for (let i = 0; i < 6; i++) for (let j = 0; j < 9; j++) {
        const x = 330 + i * 28 + (j % 2) * 14, y = 160 + j * 52;
        if (((x - 400) / 100) ** 2 + ((y - 380) / 260) ** 2 < 0.9) cob.push([x, y]);
      }
      for (const [x, y] of cob) a.f(ellipse(x, y, 12, 20));
      a.f('M400 720C250 650 200 450 260 260C300 450 330 560 400 600Z');
      a.f('M400 720C550 650 600 450 540 260C500 450 470 560 400 600Z');
      eyes(a, 400, 380, 34, 16);
      smile(a, 400, 430, 24);
    },
  },
  {
    name: 'windmill', title: 'Farm Windmill', tags: ['windmill', 'farm', 'wind'], anim: 'spin',
    draw(a) {
      frame(a);
      cloud(a, 160, 120, 80, 36);
      ground(a, 640, 20);
      a.f('M320 680L350 330H450L480 680Z');
      a.f('M330 340L400 250L470 340Z');
      a.f('M370 680V600Q400 570 430 600V680Z');
      a.f(rect(375, 430, 50, 60, 25));
      a.anim('spin', () => {
        for (let i = 0; i < 4; i++) a.rot(i * 90 + 20, 400, 300, () => {
          a.f(rect(390, 90, 20, 210));
          a.f(rect(410, 100, 60, 170, 4));
        });
      });
      a.f(circle(400, 300, 22));
    },
  },
  {
    name: 'egg-basket', title: 'Basket of Eggs', tags: ['egg', 'basket', 'farm'], anim: 'float',
    draw(a) {
      frame(a);
      a.l('M190 430C190 140 610 140 610 430', 14);
      for (const [x, y] of [[280, 420], [360, 400], [440, 400], [520, 420], [320, 450], [480, 450]]) a.f(ellipse(x, y, 55, 72));
      a.f('M160 440H640L580 680H220Z');
      const basket = [[160, 440], [640, 440], [580, 680], [220, 680]];
      a.l(hatch(basket, 50, 0, 2) + hatch(basket, 70, 90, 2), 3);
      a.f(rect(140, 430, 520, 34, 16));
    },
  },
];

function mx2(pts) {
  return pts.map(([x, y]) => [mx(x), y]);
}
