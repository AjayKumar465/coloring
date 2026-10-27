import { circle, ellipse, rect, poly, smooth, petal, scallop, arcPath, star, heart, regular, leaf, polar, band, zig } from '../lib/shapes.js';
import { frame, ground, sun, cloud, eyes, smile, cheeks, twinkleStars, person, flowerSmall, grass } from '../lib/parts.js';
import { critter } from './animals.js';

function meadow(a) {
  frame(a);
  cloud(a, 170, 120, 90, 40);
  cloud(a, 640, 150, 80, 36);
  ground(a, 640, 25);
}

export function castle(a) {
  const tower = (x, w, top) => {
    a.f(rect(x - w / 2, top, w, 640 - top));
    a.f(poly([[x - w / 2 - 15, top], [x, top - 120], [x + w / 2 + 15, top]]));
    a.anim('wiggle', () => a.f(poly([[x, top - 120], [x, top - 165], [x + 45, top - 150], [x, top - 135]])));
    a.f(rect(x - 15, top + 40, 30, 50, 15));
  };
  a.f(rect(220, 380, 360, 260));
  for (let i = 0; i < 6; i++) a.f(rect(222 + i * 62, 350, 40, 32));
  tower(170, 110, 300);
  tower(630, 110, 300);
  tower(400, 120, 220);
  a.f('M340 640V540Q400 480 460 540V640Z');
  a.l('M340 560H460M340 600H460M380 520V640M420 520V640', 3);
  a.f(rect(270, 440, 40, 50, 20));
  a.f(rect(490, 440, 40, 50, 20));
}

export default [
  {
    name: 'castle', title: 'Fairy Tale Castle', tags: ['castle', 'princess', 'king'], anim: 'float',
    draw(a) {
      frame(a);
      cloud(a, 120, 140, 70, 32);
      cloud(a, 680, 120, 70, 32);
      castle(a);
      a.f('M16 640H784V748A36 36 0 0 1 748 784H52A36 36 0 0 1 16 748Z');
      a.f('M340 640L300 784H500L460 640Z');
    },
  },
  {
    name: 'royal-crown', title: 'Royal Crown', tags: ['crown', 'king', 'queen', 'jewels'], anim: 'twinkle',
    draw(a) {
      frame(a);
      twinkleStars(a, [[120, 140, 30], [680, 160, 26], [110, 650, 22], [690, 640, 30]]);
      a.f('M170 560L130 260L280 400L400 200L520 400L670 260L630 560Z');
      for (const [x, y] of [[130, 260], [400, 200], [670, 260]]) a.f(circle(x, y, 30));
      a.f(rect(160, 540, 480, 90, 20));
      for (const x of [250, 400, 550]) a.f(regular(x, 585, 30, 4, 0));
      a.f(heart(400, 430, 40));
      a.f(circle(280, 470, 22));
      a.f(circle(520, 470, 22));
    },
  },
  {
    name: 'unicorn', title: 'Magical Unicorn', tags: ['unicorn', 'horse', 'magic', 'rainbow'], anim: 'wiggle',
    draw(a) {
      frame(a);
      twinkleStars(a, [[120, 120, 30], [690, 650, 26], [120, 600, 20], [690, 120, 18]]);
      a.f('M300 760C300 640 320 560 360 480L560 520C560 600 580 680 610 760Z');
      a.anim('wiggle', () => {
        for (const [x, y, ang, len] of [[400, 230, 200, 140], [370, 300, 190, 160], [360, 380, 180, 170], [370, 460, 175, 160], [390, 540, 170, 150]]) a.f(petal(x, y, len, 45, ang, 0.7));
      });
      a.f(smooth([[420, 200], [520, 180], [600, 260], [650, 380], [660, 470], [610, 520], [540, 500], [500, 420], [440, 360], [400, 280]], true, 0.9));
      a.f(ellipse(615, 470, 55, 50, 20));
      a.k(ellipse(630, 470, 7, 10));
      a.f(poly([[440, 210], [450, 110], [500, 195]]));
      a.f(poly([[480, 190], [520, 40], [560, 210]]));
      a.l('M490 160L545 145M500 120L535 110', 4);
      a.anim('blink', () => {
        a.f(ellipse(540, 300, 22, 26));
        a.k(circle(545, 305, 13));
      });
      a.l('M520 280l-12 -14M535 275l-6 -16M552 278l2 -16', 3);
      flowerSmall(a, 460, 230, 18);
      a.l('M580 500Q600 510 620 500', 4);
    },
  },
  {
    name: 'friendly-dragon', title: 'Friendly Dragon', tags: ['dragon', 'magic'], anim: 'wiggle',
    draw(a) {
      meadow(a);
      critter(a, {
        headR: 130, headY: 330,
        tail: () => {
          a.f(smooth([[500, 650], [620, 660], [700, 580], [680, 520], [650, 560], [600, 610], [510, 610]], true, 0.9));
          a.f(poly([[680, 520], [730, 470], [700, 550]]));
          a.anim('wiggle', () => {
            a.f('M300 520L120 360L150 450L90 470L170 520L130 580L290 580Z');
            a.f('M500 520L680 360L650 450L710 470L630 520L670 580L510 580Z');
          });
        },
        ears: (hy) => {
          a.f(poly([[320, hy - 90], [290, hy - 200], [370, hy - 120]]));
          a.f(poly([[480, hy - 90], [510, hy - 200], [430, hy - 120]]));
        },
        muzzle: (hy) => {
          a.f(ellipse(400, hy + 55, 85, 50));
          a.k(ellipse(370, hy + 45, 7, 10));
          a.k(ellipse(430, hy + 45, 7, 10));
        },
        extra: () => {
          for (let i = 0; i < 4; i++) a.l(`M${340 + i * 5} ${545 + i * 30}H${460 - i * 5}`, 4);
        },
      });
    },
  },
  {
    name: 'magic-wand', title: 'Magic Wand', tags: ['wand', 'magic', 'stars'], anim: 'twinkle',
    draw(a) {
      frame(a);
      a.rot(35, 400, 450, () => a.f(rect(370, 380, 60, 360, 30)));
      a.rot(35, 400, 450, () => a.f(rect(370, 620, 60, 60, 0)));
      a.f(star(520, 270, 170, 75, 5, -70));
      a.f(star(520, 275, 90, 40, 5, -70));
      twinkleStars(a, [[200, 160, 40], [700, 520, 36], [150, 400, 24], [660, 690, 20], [300, 80, 18], [740, 150, 20]]);
      for (const [x, y] of [[250, 560], [610, 640], [690, 380]]) a.f(heart(x, y, 26));
    },
  },
  {
    name: 'mushroom-house', title: 'Fairy Mushroom House', tags: ['mushroom', 'fairy', 'house'], anim: 'float',
    draw(a) {
      meadow(a);
      sun(a, 660, 110, 40);
      a.f('M250 660V400H550V660Z');
      a.f('M120 420C120 220 260 130 400 130C540 130 680 220 680 420Q400 470 120 420Z');
      for (const [x, y, r] of [[250, 300, 40], [400, 200, 36], [550, 300, 42], [400, 360, 30], [180, 380, 22], [620, 390, 20]]) a.f(circle(x, y, r));
      a.f('M350 660V560Q400 500 450 560V660Z');
      a.f(circle(430, 600, 8));
      a.f(circle(300, 500, 32));
      a.f(circle(500, 500, 32));
      a.l('M268 500H332M300 468V532M468 500H532M500 468V532', 3);
      flowerSmall(a, 170, 680, 20);
      flowerSmall(a, 640, 690, 22);
    },
  },
  {
    name: 'treasure-chest', title: 'Treasure Chest', tags: ['treasure', 'pirate', 'gold'], anim: 'twinkle',
    draw(a) {
      frame(a);
      a.f('M180 360Q180 230 400 230Q620 230 620 360Z');
      for (let i = 0; i < 9; i++) a.f(circle(240 + i * 40, 360 - (i % 3) * 18, 26));
      a.f(regular(300, 300, 34, 6));
      a.f(regular(500, 300, 34, 6));
      a.f(rect(170, 370, 460, 280, 16));
      a.f(rect(170, 370, 460, 50, 10));
      a.f(rect(240, 370, 40, 280));
      a.f(rect(520, 370, 40, 280));
      a.f(rect(360, 440, 80, 90, 12));
      a.f(circle(400, 475, 14));
      twinkleStars(a, [[130, 180, 30], [690, 190, 28], [400, 140, 24]]);
      a.f('M16 680H784V748A36 36 0 0 1 748 784H52A36 36 0 0 1 16 748Z');
    },
  },
  {
    name: 'wizard-hat', title: 'Wizard Hat', tags: ['wizard', 'magic', 'hat'], anim: 'twinkle',
    draw(a) {
      frame(a);
      a.f(ellipse(400, 620, 280, 70));
      a.f('M240 610C260 450 330 300 360 190C380 120 440 90 520 110C460 130 440 170 450 250C470 380 520 500 560 610Q400 650 240 610Z');
      a.f(band(400, 590, 170, 60, 540, 600));
      a.f(star(390, 420, 50, 22));
      a.f(star(470, 520, 30, 14));
      a.f('M440 290A40 40 0 1 0 470 360A30 30 0 1 1 440 290Z');
      twinkleStars(a, [[150, 200, 30], [650, 230, 28], [140, 440, 20], [670, 430, 22]]);
    },
  },
  {
    name: 'knight-shield', title: 'Brave Knight Shield', tags: ['knight', 'shield', 'sword'], anim: 'wiggle',
    draw(a) {
      frame(a);
      a.rot(-30, 400, 400, () => {
        a.f(rect(385, 80, 30, 560, 10));
        a.f(rect(330, 560, 140, 26, 12));
        a.f(rect(385, 586, 30, 90, 8));
        a.f(circle(400, 690, 24));
      });
      a.f('M220 200Q400 140 580 200V420Q580 590 400 680Q220 590 220 420Z');
      a.f('M260 230Q400 185 540 230V420Q540 560 400 635Q260 560 260 420Z');
      a.f(rect(375, 210, 50, 410));
      a.f(rect(265, 340, 270, 50));
      a.f(heart(400, 365, 40));
    },
  },
  {
    name: 'magic-potions', title: 'Magic Potions', tags: ['potion', 'magic', 'bottle'], anim: 'float',
    draw(a) {
      frame(a);
      a.f(rect(16, 620, 768, 50));
      const bottle = (x, w, h, round) => {
        const top = 620 - h;
        if (round) a.f(circle(x, 620 - w, w));
        else a.f(rect(x - w, top, w * 2, h, 24));
        a.f(rect(x - 22, top - 60 + (round ? h - w * 2 : 0), 44, 70, 6));
        a.f(rect(x - 30, top - 95 + (round ? h - w * 2 : 0), 60, 40, 12));
      };
      bottle(200, 90, 200, true);
      bottle(400, 80, 300, false);
      bottle(600, 85, 180, true);
      a.f(band(200, 530, 90, 90, 540, 800, { edgeA: zig(10, 40) }));
      a.f(band(600, 535, 85, 85, 545, 800, { edgeA: zig(10, 40) }));
      a.f(rect(330, 420, 140, 80, 8));
      a.f(heart(400, 460, 26));
      a.anim('float', () => {
        for (const [x, y, r] of [[200, 280, 14], [230, 230, 10], [600, 300, 12], [400, 200, 12], [420, 150, 8]]) a.f(circle(x, y, r));
      });
    },
  },
  {
    name: 'fairy', title: 'Garden Fairy', tags: ['fairy', 'wings', 'magic'], anim: 'float',
    draw(a) {
      meadow(a);
      person(a, {
        dress: true,
        wings: true,
        hairBack: () => a.f(smooth([[300, 240], [320, 150], [400, 130], [480, 150], [500, 240], [510, 340], [460, 330], [340, 330], [290, 340]], true, 0.9)),
        hat: () => a.f('M340 165L360 120L385 150L400 105L415 150L440 120L460 165Z'),
        prop: () => {
          a.l('M540 545L620 430', 6);
          a.f(star(625, 420, 34, 15));
        },
      });
    },
  },
  {
    name: 'garden-gnome', title: 'Garden Gnome', tags: ['gnome', 'garden'], anim: 'wiggle',
    draw(a) {
      meadow(a);
      a.f(rect(310, 600, 70, 80, 16));
      a.f(rect(420, 600, 70, 80, 16));
      a.f(ellipse(335, 685, 55, 24));
      a.f(ellipse(465, 685, 55, 24));
      a.f('M260 620Q260 420 400 420Q540 420 540 620Z');
      a.f(rect(260, 560, 280, 30, 8));
      a.f(rect(380, 560, 40, 30, 4));
      a.f(circle(250, 520, 30));
      a.f(circle(550, 520, 30));
      a.f('M300 380Q300 560 400 580Q500 560 500 380Z');
      a.f(circle(400, 330, 90));
      a.f(circle(400, 360, 24));
      eyes(a, 400, 310, 35, 12, { white: false });
      a.f('M290 300Q330 100 470 60Q430 140 510 300Z');
      a.f(ellipse(400, 300, 125, 26));
    },
  },
  {
    name: 'pumpkin-carriage', title: 'Pumpkin Carriage', tags: ['carriage', 'pumpkin', 'princess'], anim: 'wiggle',
    draw(a) {
      frame(a);
      twinkleStars(a, [[120, 120, 26], [690, 110, 24], [400, 80, 18]]);
      a.f('M16 640H784V748A36 36 0 0 1 748 784H52A36 36 0 0 1 16 748Z');
      for (const x of [230, 570]) {
        a.f(circle(x, 600, 75));
        a.f(circle(x, 600, 20));
        for (let i = 0; i < 6; i++) a.l(`M${x} 600L${polar(x, 600, 70, i * 60).map((v) => v.toFixed(1)).join(' ')}`, 3);
      }
      a.f(ellipse(400, 420, 250, 180));
      a.f(ellipse(400, 420, 160, 180));
      a.f(ellipse(400, 420, 60, 180));
      a.f(rect(330, 340, 140, 120, 60));
      a.l('M400 340V460M330 400H470', 3);
      a.f(rect(385, 200, 30, 50, 8));
      a.f(leaf(415, 225, 80, 18, -20));
      a.l('M150 580Q120 520 170 480', 5);
    },
  },
];
