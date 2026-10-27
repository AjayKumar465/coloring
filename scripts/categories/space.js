import { circle, ellipse, rect, poly, smooth, petal, scallop, arcPath, star, ring, regular, polar, line } from '../lib/shapes.js';
import { frame, twinkleStars, eyes, smile, cheeks, person } from '../lib/parts.js';

const STARS = [[90, 90, 20], [700, 90, 16], [130, 680, 14], [690, 700, 22], [600, 220, 12], [200, 260, 10], [720, 420, 12], [70, 430, 12]];

function space(a, stars = STARS) {
  frame(a);
  twinkleStars(a, stars);
}

export function rocket(a, x = 400, y = 400, s = 1) {
  const X = (v) => x + (v - 400) * s, Y = (v) => y + (v - 400) * s;
  a.anim('pulse', () => {
    a.f(`M${X(350)} ${Y(600)}Q${X(400)} ${Y(760)} ${X(450)} ${Y(600)}Z`);
    a.f(`M${X(370)} ${Y(600)}Q${X(400)} ${Y(690)} ${X(430)} ${Y(600)}Z`);
  });
  a.f(`M${X(320)} ${Y(470)}L${X(240)} ${Y(600)}L${X(330)} ${Y(580)}Z`);
  a.f(`M${X(480)} ${Y(470)}L${X(560)} ${Y(600)}L${X(470)} ${Y(580)}Z`);
  a.f(rect(X(350), Y(570), 100 * s, 40 * s, 10 * s));
  a.f(`M${X(400)} ${Y(120)}C${X(500)} ${Y(200)} ${X(510)} ${Y(420)} ${X(470)} ${Y(580)}H${X(330)}C${X(290)} ${Y(420)} ${X(300)} ${Y(200)} ${X(400)} ${Y(120)}Z`);
  a.f(`M${X(400)} ${Y(120)}C${X(440)} ${Y(150)} ${X(465)} ${Y(190)} ${X(475)} ${Y(230)}H${X(325)}C${X(335)} ${Y(190)} ${X(360)} ${Y(150)} ${X(400)} ${Y(120)}Z`);
  a.f(circle(X(400), Y(330), 55 * s));
  a.f(circle(X(400), Y(330), 38 * s));
  a.f(rect(X(385), Y(440), 30 * s, 140 * s, 12 * s));
}

export default [
  {
    name: 'rocket', title: 'Rocket to the Stars', tags: ['rocket', 'space'], anim: 'float',
    draw(a) {
      space(a);
      a.f(circle(140, 180, 60));
      a.f(circle(120, 165, 14));
      rocket(a, 420, 380, 0.95);
    },
  },
  {
    name: 'ringed-planet', title: 'Ringed Planet', tags: ['planet', 'saturn', 'space'], anim: 'spin',
    draw(a) {
      space(a);
      a.f(circle(400, 400, 170));
      a.f('M232 380Q400 340 568 380Q575 400 570 420Q400 380 230 420Q226 400 232 380Z');
      a.f('M230 460Q400 430 570 460Q560 490 545 510Q400 480 255 510Q240 490 230 460Z');
      a.fe(ellipse(400, 420, 300, 70, -8) + ellipse(400, 420, 230, 40, -8));
      a.f(circle(320, 320, 22));
    },
  },
  {
    name: 'astronaut', title: 'Little Astronaut', tags: ['astronaut', 'space'], anim: 'float',
    draw(a) {
      space(a);
      person(a, {
        hairBack: () => a.f(circle(400, 245, 125)),
        noFringe: true,
        belt: true,
        badge: true,
        prop: () => {
          a.f(rect(240, 340, 70, 150, 20));
          a.f(rect(370, 400, 60, 50, 8));
          a.f(circle(385, 425, 8));
          a.f(circle(415, 425, 8));
        },
      });
      a.l('M290 175Q400 120 510 175', 6);
    },
  },
  {
    name: 'ufo', title: 'Flying Saucer', tags: ['ufo', 'alien', 'space'], anim: 'float',
    draw(a) {
      space(a);
      a.f('M320 480L230 720H570L480 480Z');
      a.f('M270 315Q400 150 530 315Z');
      a.f(circle(400, 250, 40));
      eyes(a, 400, 245, 0, 14);
      a.f(ellipse(400, 375, 270, 70));
      a.f(ellipse(400, 352, 160, 36));
      for (const x of [220, 310, 400, 490, 580]) a.anim('twinkle', () => a.f(circle(x, 385, 18)));
      a.f(ellipse(400, 450, 90, 26));
    },
  },
  {
    name: 'sleepy-moon', title: 'Sleepy Moon', tags: ['moon', 'night', 'space'], anim: 'float',
    draw(a) {
      space(a, [[620, 160, 40], [680, 330, 26], [560, 560, 34], [660, 650, 20], [120, 690, 18]]);
      a.f('M420 120C250 140 160 300 190 450C220 600 380 690 520 650C380 640 280 520 290 390C300 260 360 170 420 120Z');
      a.l('M250 380q20 20 40 0', 5);
      smile(a, 290, 470, 30, 0.6);
      a.f(circle(240, 300, 16));
      a.f(circle(330, 560, 22));
      a.f(circle(380, 620, 12));
      cloud2(a);
    },
  },
  {
    name: 'alien-friend', title: 'Alien Friend', tags: ['alien', 'space'], anim: 'wiggle',
    draw(a) {
      space(a);
      a.f(circle(160, 640, 70));
      a.f(circle(140, 620, 18));
      a.f(circle(190, 670, 12));
      a.l('M330 240L280 130M470 240L520 130', 6);
      a.anim('twinkle', () => {
        a.f(circle(280, 125, 22));
        a.f(circle(520, 125, 22));
      });
      a.f(ellipse(400, 550, 120, 140));
      a.f(ellipse(400, 580, 70, 80));
      a.f(ellipse(290, 540, 30, 70, 30));
      a.f(ellipse(510, 540, 30, 70, -30));
      a.f(ellipse(350, 690, 40, 24));
      a.f(ellipse(450, 690, 40, 24));
      a.f(ellipse(400, 320, 160, 130));
      a.anim('blink', () => {
        a.f(circle(400, 300, 50));
        a.k(circle(408, 305, 24));
        a.f(circle(418, 292, 8));
      });
      smile(a, 400, 380, 40);
      cheeks(a, 400, 365, 100, 14);
    },
  },
  {
    name: 'solar-system', title: 'Solar System', tags: ['planets', 'sun', 'space'], anim: 'spin',
    draw(a) {
      frame(a);
      a.f(circle(150, 400, 115));
      for (const [x, r] of [[300, 22], [370, 30], [450, 34], [530, 26]]) a.f(circle(x, 400, r));
      a.f(ellipse(640, 400, 90, 18, -15));
      a.f(circle(640, 400, 55));
      a.f(circle(735, 400, 26));
      for (const [x, y, r] of [[350, 160, 16], [560, 640, 14], [460, 200, 10], [300, 650, 12], [700, 160, 14]]) a.f(star(x, y, r, r * 0.45));
      
    },
  },
  {
    name: 'comet', title: 'Shooting Comet', tags: ['comet', 'star', 'space'], anim: 'float',
    draw(a) {
      space(a);
      a.f('M520 260L120 600L200 610L540 300Z');
      a.f('M500 240L140 470L190 500L520 280Z');
      a.f('M560 300L330 680L390 670L580 330Z');
      a.f(scallop(560, 260, 90, 90, 10));
      a.f(circle(560, 260, 60));
      eyes(a, 560, 250, 22, 10);
      smile(a, 560, 280, 16);
    },
  },
  {
    name: 'satellite', title: 'Satellite', tags: ['satellite', 'space'], anim: 'spin',
    draw(a) {
      space(a);
      a.f(circle(120, 660, 90));
      for (const x of [110, 520]) {
        a.f(rect(x, 330, 170, 140, 8));
        a.l(`M${x + 57} 330V470M${x + 113} 330V470M${x} 400H${x + 170}`, 3);
      }
      a.f(rect(280, 390, 40, 20));
      a.f(rect(480, 390, 40, 20));
      a.f(rect(320, 320, 160, 160, 18));
      a.f(circle(400, 400, 40));
      a.f('M400 320L360 240H440Z');
      a.f(circle(400, 230, 16));
    },
  },
  {
    name: 'moon-rover', title: 'Moon Rover', tags: ['rover', 'moon', 'space'], anim: 'wiggle',
    draw(a) {
      space(a);
      a.f('M16 600Q200 560 400 600T784 590V748A36 36 0 0 1 748 784H52A36 36 0 0 1 16 748Z');
      a.f(ellipse(200, 680, 60, 20));
      a.f(ellipse(600, 700, 50, 16));
      a.f(rect(200, 420, 400, 110, 20));
      a.f(rect(240, 440, 80, 60, 8));
      a.f(rect(340, 440, 80, 60, 8));
      a.l('M520 420V300', 6);
      a.f('M470 260Q520 330 580 270Z');
      a.f(circle(530, 300, 12));
      for (const x of [240, 400, 560]) {
        a.f(circle(x, 560, 50));
        a.f(circle(x, 560, 20));
      }
    },
  },
  {
    name: 'telescope', title: 'Stargazing Telescope', tags: ['telescope', 'stars', 'space'], anim: 'twinkle',
    draw(a) {
      space(a, [[560, 120, 30], [680, 220, 22], [480, 220, 16], [700, 90, 14], [620, 330, 12]]);
      a.f('M16 640Q400 600 784 640V748A36 36 0 0 1 748 784H52A36 36 0 0 1 16 748Z');
      a.l('M380 420L280 640M400 420V650M420 420L520 640', 8);
      a.rot(-35, 400, 380, () => {
        a.f(rect(250, 340, 320, 80, 14));
        a.f(rect(560, 325, 50, 110, 10));
        a.f(rect(210, 355, 50, 50, 8));
        a.f(rect(330, 340, 30, 80));
      });
      a.f(circle(400, 420, 26));
    },
  },
  {
    name: 'constellation', title: 'Star Pictures', tags: ['stars', 'constellation', 'night'], anim: 'twinkle',
    draw(a) {
      frame(a);
      const pts = [[150, 200], [260, 160], [370, 230], [470, 180], [560, 300], [640, 260], [540, 450], [400, 520], [260, 470], [180, 600], [620, 620]];
      a.l(line(pts.slice(0, 9)), 3);
      a.l(line([[260, 470], [180, 600]]) + line([[540, 450], [620, 620]]), 3);
      a.anim('twinkle', () => {
        for (const [x, y] of pts) a.f(star(x, y, 36, 15));
      });
      a.f(circle(680, 110, 40));
    },
  },
  {
    name: 'space-station', title: 'Space Station', tags: ['station', 'space'], anim: 'spin',
    draw(a) {
      space(a);
      a.f(ring(400, 400, 210, 250));
      for (let i = 0; i < 4; i++) {
        const [x, y] = polar(400, 400, 230, i * 90 + 45);
        a.f(circle(x, y, 40));
      }
      a.f(rect(390, 160, 20, 480));
      a.f(rect(160, 390, 480, 20));
      a.f(circle(400, 400, 80));
      a.f(circle(400, 400, 45));
      a.f(rect(300, 90, 200, 50, 8));
    },
  },
];

function cloud2(a) {
  a.anim('drift', () => a.f(scallop(560, 420, 90, 36, 8)));
}
