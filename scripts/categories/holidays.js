import { circle, ellipse, rect, poly, smooth, petal, scallop, arcPath, star, heart, leaf, polar, band, zig, wave, annular, regular, line, wedge } from '../lib/shapes.js';
import { frame, ground, sun, cloud, eyes, smile, cheeks, twinkleStars, sea, sand, pineTree, tree } from '../lib/parts.js';

export function snowman(a) {
  a.f(circle(400, 580, 150));
  a.f(circle(400, 380, 110));
  a.f(circle(400, 230, 85));
  a.f(rect(330, 100, 140, 90, 10));
  a.f(rect(300, 180, 200, 24, 10));
  a.f(rect(330, 150, 140, 22));
  eyes(a, 400, 220, 30, 12, { white: false });
  a.f('M400 240L470 260L400 262Z');
  smile(a, 400, 275, 26);
  a.f('M310 300Q400 340 490 300L495 330Q400 370 305 330Z');
  a.f(rect(440, 320, 40, 110, 10));
  for (const y of [370, 420, 540, 610]) a.f(circle(400, y, 13));
  a.l('M300 380L190 300M180 330l10 -30l-30 -6M500 380L610 300M620 330l-10 -30l30 -6', 6);
}

export default [
  {
    name: 'christmas-tree', title: 'Holiday Tree', tags: ['christmas', 'tree', 'winter'], anim: 'twinkle',
    draw(a) {
      frame(a);
      a.f(rect(360, 620, 80, 80, 8));
      a.f(poly([[400, 120], [530, 300], [270, 300]]));
      a.f(poly([[400, 200], [580, 450], [220, 450]]));
      a.f(poly([[400, 320], [640, 630], [160, 630]]));
      a.anim('twinkle', () => a.f(star(400, 120, 60, 26)));
      for (const [x, y] of [[360, 270], [450, 280], [300, 420], [420, 400], [520, 430], [260, 600], [350, 560], [460, 590], [560, 600], [400, 500]]) a.anim('twinkle', () => a.f(circle(x, y, 18)));
      a.l(line([[300, 340], [420, 360], [520, 330]]) + line([[240, 520], [400, 540], [580, 510]]), 4);
      a.f(rect(160, 650, 120, 90, 6));
      a.f(rect(205, 650, 30, 90));
      a.f(rect(520, 660, 120, 80, 6));
      a.f(rect(565, 660, 30, 80));
    },
  },
  {
    name: 'snowman', title: 'Jolly Snowman', tags: ['snowman', 'winter', 'snow'], anim: 'wiggle',
    draw(a) {
      frame(a);
      a.f('M16 660Q400 620 784 660V748A36 36 0 0 1 748 784H52A36 36 0 0 1 16 748Z');
      a.anim('twinkle', () => {
        for (const [x, y] of [[120, 120], [680, 160], [150, 460], [660, 470], [560, 80], [240, 230]]) a.f(star(x, y, 18, 6, 6));
      });
      snowman(a);
    },
  },
  {
    name: 'jack-o-lantern', title: 'Smiling Pumpkin', tags: ['halloween', 'pumpkin', 'autumn'], anim: 'wiggle',
    draw(a) {
      frame(a);
      a.f(circle(650, 140, 60));
      a.f(rect(380, 160, 40, 90, 10));
      a.f(leaf(420, 190, 110, 24, -20));
      a.f(ellipse(400, 450, 280, 220));
      a.f(ellipse(400, 450, 180, 220));
      a.f(ellipse(400, 450, 70, 220));
      a.f(poly([[290, 360], [350, 360], [320, 410]]).replace('Z', 'Z'));
      a.f(poly([[450, 360], [510, 360], [480, 410]]));
      a.f(poly([[380, 430], [420, 430], [400, 460]]));
      a.f('M250 490Q400 600 550 490L520 520L490 505L460 535L430 510L400 540L370 510L340 535L310 505L280 520Z');
    },
  },
  {
    name: 'easter-eggs', title: 'Spring Eggs', tags: ['easter', 'egg', 'spring'], anim: 'wiggle',
    draw(a) {
      frame(a);
      a.f('M16 640Q400 600 784 640V748A36 36 0 0 1 748 784H52A36 36 0 0 1 16 748Z');
      const egg = (x, y, rx, ry, style) => {
        a.f(ellipse(x, y, rx, ry));
        if (style === 0) {
          a.f(band(x, y, rx, ry, y - 50, y - 10, { edgeA: zig(12, 40), edgeB: zig(12, 40) }));
          a.f(band(x, y, rx, ry, y + 40, y + 80, { edgeA: wave(10, 50), edgeB: wave(10, 50) }));
        } else if (style === 1) {
          for (const [dx, dy] of [[-40, -60], [30, -30], [-30, 20], [40, 60], [-10, 110], [0, -110]]) a.f(circle(x + dx, y + dy, 18));
        } else {
          a.f(band(x, y, rx, ry, y - 20, y + 30));
          for (const dx of [-60, 0, 60]) a.f(star(x + dx, y + 5, 20, 9));
        }
      };
      egg(210, 470, 120, 160, 0);
      egg(590, 470, 120, 160, 1);
      egg(400, 560, 110, 145, 2);
      for (const x of [120, 300, 500, 690]) a.l(`M${x - 10} 650l6 -30M${x} 650l0 -36M${x + 10} 650l-6 -30`, 4);
    },
  },
  {
    name: 'gift-box', title: 'Surprise Gift', tags: ['gift', 'present', 'birthday'], anim: 'wiggle',
    draw(a) {
      frame(a);
      a.f(rect(200, 380, 400, 340, 12));
      a.f(rect(170, 300, 460, 90, 12));
      a.f(rect(370, 300, 60, 420));
      a.anim('wiggle', () => {
        a.f(petal(400, 300, 170, 50, -150));
        a.f(petal(400, 300, 170, 50, -30));
        a.f(circle(400, 290, 34));
      });
      for (const [x, y] of [[270, 500], [520, 480], [300, 640], [500, 640]]) a.f(star(x, y, 30, 13));
      twinkleStars(a, [[110, 120, 26], [690, 120, 30], [110, 500, 18], [700, 500, 22]]);
    },
  },
  {
    name: 'valentine-hearts', title: 'Love Hearts', tags: ['valentine', 'heart', 'love'], anim: 'float',
    draw(a) {
      frame(a);
      a.anim('pulse', () => a.f(heart(400, 400, 230)));
      a.f(heart(400, 400, 150));
      a.f(heart(400, 400, 70));
      for (const [x, y, s] of [[130, 140, 44], [670, 140, 50], [130, 650, 50], [670, 660, 40], [400, 720, 28], [400, 90, 30]]) a.f(heart(x, y, s));
    },
  },
  {
    name: 'birthday-cake', title: 'Birthday Cake', tags: ['birthday', 'cake', 'party'], anim: 'twinkle',
    draw(a) {
      frame(a);
      a.f(ellipse(400, 690, 300, 50));
      a.f(rect(160, 500, 480, 180, 20));
      a.f(band(400, 500, 260, 200, 470, 560, { edgeB: wave(14, 80) }));
      a.f(rect(230, 350, 340, 150, 20));
      a.f(band(400, 350, 190, 200, 320, 400, { edgeB: wave(12, 68) }));
      for (const x of [290, 400, 510]) {
        a.f(rect(x - 14, 230, 28, 120, 6));
        a.anim('twinkle', () => a.f(`M${x} 160Q${x + 28} 205 ${x} 222Q${x - 28} 205 ${x} 160Z`));
      }
      for (const x of [220, 320, 420, 520, 600]) a.f(circle(x, 620, 16));
    },
  },
  {
    name: 'spring-kite', title: 'Spring Kite', tags: ['kite', 'spring', 'wind'], anim: 'float',
    draw(a) {
      frame(a);
      cloud(a, 170, 150, 90, 40);
      sun(a, 660, 120, 45);
      ground(a, 660, 20);
      a.anim('wiggle', () => {
        a.f(poly([[450, 140], [600, 320], [450, 500], [300, 320]]));
        a.f(poly([[450, 140], [450, 320], [300, 320]]));
        a.f(poly([[450, 320], [600, 320], [450, 500]]));
        a.l('M450 500C420 560 480 600 440 660C410 700 300 720 220 760', 4);
        for (const [x, y, r] of [[448, 560, 20], [446, 640, -20], [360, 700, 30]]) a.rot(r, x, y, () => a.f(`M${x - 26} ${y - 16}L${x} ${y}L${x - 26} ${y + 16}ZM${x + 26} ${y - 16}L${x} ${y}L${x + 26} ${y + 16}Z`));
      });
    },
  },
  {
    name: 'beach-day', title: 'Summer Beach Day', tags: ['summer', 'beach', 'sun'], anim: 'float',
    draw(a) {
      frame(a);
      sun(a, 650, 130, 55, true);
      sea(a, 380, 12, 5);
      sand(a, 520);
      a.rot(-12, 320, 400, () => {
        a.l('M320 250V700', 8);
        a.f('M150 310Q320 110 490 310Q448 285 405 310Q362 285 320 310Q278 285 235 310Q192 285 150 310Z');
        a.l('M320 190Q280 250 235 310M320 190Q360 250 405 310', 3);
      });
      a.f(rect(460, 600, 120, 100, 10));
      a.f(rect(440, 580, 160, 30, 10));
      a.l('M470 580Q520 500 570 580', 6);
      a.f(circle(640, 680, 50));
      a.f(wedge(640, 680, 50, 0, 60));
      a.f(wedge(640, 680, 50, 120, 180));
      a.f(wedge(640, 680, 50, 240, 300));
      a.f(scallop(150, 700, 50, 26, 7));
    },
  },
  {
    name: 'autumn-tree', title: 'Autumn Tree', tags: ['autumn', 'fall', 'tree', 'leaves'], anim: 'wiggle',
    draw(a) {
      frame(a);
      ground(a, 650, 20);
      a.f('M340 680L365 420H435L460 680Z');
      a.l('M400 480L320 400M400 450L480 380', 8);
      a.anim('sway', () => {
        a.f(scallop(400, 290, 260, 200, 13, 0.62));
        for (const [x, y, r] of [[290, 250, 34], [420, 200, 30], [520, 280, 34], [360, 340, 26], [470, 360, 28]]) a.f(scallop(x, y, r, r, 6, 0.6));
      });
      for (const [x, y, ang] of [[160, 700, -40], [600, 720, 20], [680, 600, -70], [130, 560, 30], [260, 740, 50]]) a.f(leaf(x, y, 60, 14, ang));
    },
  },
  {
    name: 'rainy-umbrella', title: 'Rainy Day Umbrella', tags: ['rain', 'umbrella', 'weather'], anim: 'float',
    draw(a) {
      frame(a);
      a.f(scallop(220, 140, 130, 60, 9));
      a.f(scallop(580, 150, 140, 64, 9));
      for (const [x, y] of [[150, 260], [260, 300], [560, 280], [670, 250], [110, 420], [690, 420], [140, 580], [680, 600]]) a.anim('float', () => a.f(`M${x} ${y - 26}Q${x - 18} ${y} ${x} ${y + 10}Q${x + 18} ${y} ${x} ${y - 26}Z`));
      a.f('M200 440Q220 250 400 250Q580 250 600 440Q560 410 520 440Q480 410 440 440Q400 410 360 440Q320 410 280 440Q240 410 200 440Z');
      a.f('M400 250Q340 300 360 440Q400 410 440 440Q460 300 400 250Z');
      a.l('M400 440V650Q400 690 365 690Q330 690 330 655', 9);
      a.f(ellipse(400, 720, 160, 28));
      a.f(rect(390, 225, 20, 30, 6));
    },
  },
  {
    name: 'snowflake', title: 'Sparkly Snowflake', tags: ['snowflake', 'winter', 'snow'], anim: 'spin',
    draw(a) {
      frame(a);
      a.f(regular(400, 400, 60, 6, 0));
      for (let i = 0; i < 6; i++) {
        a.rot(i * 60, 400, 400, () => {
          a.f(rect(388, 110, 24, 240, 10));
          a.f(regular(400, 120, 34, 4, 0));
          a.f(petal(400, 230, 80, 16, -45));
          a.f(petal(400, 230, 80, 16, -135));
          a.f(petal(400, 300, 50, 12, -45));
          a.f(petal(400, 300, 50, 12, -135));
        });
      }
      a.f(circle(400, 400, 30));
    },
  },
  {
    name: 'diya-lamp', title: 'Festival Lamp', tags: ['diwali', 'lamp', 'festival', 'light'], anim: 'twinkle',
    draw(a) {
      frame(a);
      twinkleStars(a, [[120, 130, 30], [680, 130, 30], [150, 650, 20], [650, 650, 20]]);
      a.anim('pulse', () => {
        a.f('M400 140C470 230 470 330 400 360C330 330 330 230 400 140Z');
        a.f('M400 230C430 270 430 320 400 340C370 320 370 270 400 230Z');
      });
      a.f('M150 420Q400 380 650 420Q600 620 400 630Q200 620 150 420Z');
      a.f('M180 420Q400 390 620 420Q400 470 180 420Z');
      a.f(rect(390, 360, 20, 50, 6));
      for (const x of [270, 400, 530]) a.f(regular(x, 530, 30, 4, 0));
      for (const x of [215, 335, 465, 585]) a.f(circle(x, 510, 14));
      a.f(ellipse(400, 670, 160, 30));
    },
  },
  {
    name: 'paper-lantern', title: 'Paper Lanterns', tags: ['lantern', 'festival', 'new year'], anim: 'wiggle',
    draw(a) {
      frame(a);
      a.l('M16 120Q400 200 784 120', 4);
      for (const [x, y, s] of [[220, 190, 0.8], [400, 210, 1], [580, 190, 0.8]]) {
        a.anim('wiggle', () => {
          a.l(`M${x} ${y - 30}V${y}`, 4);
          a.f(rect(x - 50 * s, y, 100 * s, 30 * s, 6));
          a.f(ellipse(x, y + 170 * s, 140 * s, 150 * s));
          a.f(ellipse(x, y + 170 * s, 70 * s, 150 * s));
          a.f(rect(x - 50 * s, y + 310 * s, 100 * s, 30 * s, 6));
          for (const dx of [-30, -10, 10, 30]) a.l(`M${x + dx * s} ${y + 340 * s}v${60 * s}`, 4);
        });
      }
    },
  },
];
