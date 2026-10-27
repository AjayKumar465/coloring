import { hatch, ellipsePts, circle, ellipse, rect, poly, smooth, petal, scallop, arcPath, star, heart, regular, leaf, polar, band, zig, wave, wedge, annular } from '../lib/shapes.js';
import { frame, eyes, smile, cheeks } from '../lib/parts.js';

function face(a, x, y, s = 1) {
  eyes(a, x, y, 32 * s, 13 * s);
  smile(a, x, y + 36 * s, 20 * s);
  cheeks(a, x, y + 26 * s, 55 * s, 11 * s);
}

function table(a) {
  frame(a);
  a.f('M16 640H784V748A36 36 0 0 1 748 784H52A36 36 0 0 1 16 748Z');
  for (let x = 90; x < 760; x += 110) a.l(`M${x} 640V784`, 3);
}

export default [
  {
    name: 'cupcake', title: 'Sweet Cupcake', tags: ['cupcake', 'cake', 'dessert'], anim: 'wiggle',
    draw(a) {
      table(a);
      a.f('M230 420L280 660H520L570 420Z');
      for (const x of [300, 350, 400, 450, 500]) a.l(`M${x - (x - 400) * 0.25} 430L${x - (x - 400) * 0.1} 655`, 3);
      a.f(scallop(400, 380, 190, 70, 12));
      a.f(scallop(400, 300, 150, 70, 10));
      a.f(scallop(400, 230, 100, 55, 8));
      a.f(circle(400, 150, 36));
      a.l('M410 118Q430 90 460 85', 5);
      for (const [x, y, r] of [[320, 300, 30], [470, 290, -40], [380, 360, 10], [500, 370, 60], [300, 380, -20], [420, 230, 20]]) a.rot(r, x, y, () => a.f(rect(x - 16, y - 6, 32, 12, 6)));
      face(a, 400, 530, 1);
    },
  },
  {
    name: 'ice-cream', title: 'Ice Cream Cone', tags: ['ice cream', 'dessert', 'summer'], anim: 'wiggle',
    draw(a) {
      frame(a);
      a.f('M280 420L400 750L520 420Z');
      const cone = [[280, 420], [520, 420], [400, 750]];
      a.l(hatch(cone, 45, 62, 3) + hatch(cone, 45, 118, 3), 3);
      a.f(scallop(400, 420, 150, 50, 10));
      a.f(circle(400, 330, 130));
      a.f(circle(400, 190, 95));
      a.f(band(400, 190, 95, 95, 170, 300, { edgeA: wave(10, 60) }));
      a.f(circle(400, 82, 32));
      a.l('M405 52L425 20', 5);
      face(a, 400, 310);
    },
  },
  {
    name: 'pizza-slice', title: 'Pizza Slice', tags: ['pizza', 'lunch'], anim: 'wiggle',
    draw(a) {
      frame(a);
      a.f('M180 200Q400 120 620 200L400 720Z');
      a.f('M180 200Q400 120 620 200L600 250Q400 180 200 250Z');
      for (const [x, y, r] of [[330, 320, 36], [470, 330, 32], [400, 450, 34], [350, 560, 22], [450, 570, 20]]) {
        a.f(circle(x, y, r));
        a.k(circle(x - r * 0.3, y - r * 0.2, r * 0.15));
      }
      a.f(leaf(290, 410, 50, 12, 20));
      a.f(leaf(500, 450, 50, 12, 160));
      a.f(poly([[300, 600], [330, 680], [350, 630]]));
    },
  },
  {
    name: 'donut', title: 'Sprinkle Donut', tags: ['donut', 'dessert'], anim: 'spin',
    draw(a) {
      frame(a);
      a.fe(circle(400, 400, 280) + circle(400, 400, 95));
      const icing = [];
      for (let i = 0; i < 40; i++) {
        const ang = (i / 40) * 360;
        const r = 245 + (i % 2 ? -20 : 10) + Math.sin(i * 1.7) * 8;
        icing.push(polar(400, 400, r, ang));
      }
      a.fe(smooth(icing, true, 0.9) + circle(400, 400, 120));
      for (let i = 0; i < 16; i++) {
        const [x, y] = polar(400, 400, 180 + (i % 3) * 18, i * 22.5);
        a.rot(i * 40, x, y, () => a.f(rect(x - 18, y - 6, 36, 12, 6)));
      }
    },
  },
  {
    name: 'apple', title: 'Shiny Apple', tags: ['apple', 'fruit'], anim: 'wiggle',
    draw(a) {
      table(a);
      a.f('M400 240C330 180 160 190 160 400C160 560 280 680 360 660C380 655 420 655 440 660C520 680 640 560 640 400C640 190 470 180 400 240Z');
      a.f(rect(388, 130, 24, 120, 10));
      a.f(leaf(410, 180, 150, 30, -25));
      a.f('M230 380Q240 290 300 270Q270 330 260 400Z');
      face(a, 400, 450, 1.3);
    },
  },
  {
    name: 'watermelon', title: 'Watermelon Slice', tags: ['watermelon', 'fruit', 'summer'], anim: 'wiggle',
    draw(a) {
      frame(a);
      a.f(annular(400, 280, 270, 320, 0, 180));
      a.f(annular(400, 280, 245, 270, 0, 180));
      a.f(wedge(400, 280, 245, 0, 180));
      for (const [x, y] of [[260, 330], [330, 400], [470, 400], [540, 330], [400, 450], [300, 470], [500, 470]]) a.k(ellipse(x, y, 9, 15));
      face(a, 400, 330, 1);
    },
  },
  {
    name: 'burger', title: 'Yummy Burger', tags: ['burger', 'lunch'], anim: 'wiggle',
    draw(a) {
      table(a);
      a.f('M180 560H620Q620 640 540 640H260Q180 640 180 560Z');
      a.f(rect(170, 500, 460, 60, 30));
      a.f(band(400, 470, 250, 60, 440, 540, { edgeB: zig(16, 60) }));
      a.f(smooth([[150, 470], [250, 450], [350, 480], [450, 450], [550, 480], [650, 460], [620, 500], [180, 500]], true, 0.7));
      a.f('M170 440Q170 230 400 230Q630 230 630 440Z');
      for (const [x, y] of [[300, 310], [370, 280], [450, 300], [520, 340], [330, 380], [420, 360], [490, 400]]) a.f(ellipse(x, y, 12, 7, 20));
    },
  },
  {
    name: 'french-fries', title: 'French Fries', tags: ['fries', 'lunch'], anim: 'wiggle',
    draw(a) {
      frame(a);
      for (let i = 0; i < 7; i++) a.rot(-18 + i * 6, 400, 600, () => a.f(rect(270 + i * 38, 130 + (i % 2) * 40, 34, 340, 6)));
      a.f('M220 380Q400 440 580 380L540 720H260Z');
      a.f('M220 380Q400 440 580 380L570 450Q400 500 230 450Z');
      face(a, 400, 560, 1.2);
    },
  },
  {
    name: 'strawberry', title: 'Juicy Strawberry', tags: ['strawberry', 'fruit'], anim: 'wiggle',
    draw(a) {
      frame(a);
      a.f('M400 720C250 640 150 480 180 330C200 240 300 220 400 250C500 220 600 240 620 330C650 480 550 640 400 720Z');
      a.f(star(400, 240, 140, 60, 6, -90));
      a.f(rect(388, 110, 24, 90, 10));
      for (const [x, y] of [[260, 340], [330, 300], [470, 300], [540, 340], [250, 440], [550, 440], [300, 540], [500, 540], [400, 620], [350, 640], [450, 640]]) a.k(ellipse(x, y, 7, 11));
      face(a, 400, 420, 1.2);
    },
  },
  {
    name: 'cherries', title: 'Cherry Twins', tags: ['cherry', 'fruit'], anim: 'wiggle',
    draw(a) {
      frame(a);
      a.l('M290 470Q330 250 420 140M520 470Q480 270 420 140', 7);
      a.f(leaf(420, 140, 180, 36, -10));
      a.f(circle(280, 540, 130));
      a.f(circle(530, 540, 130));
      a.f('M210 480Q220 440 260 430Q240 460 235 500Z');
      a.f('M460 480Q470 440 510 430Q490 460 485 500Z');
      face(a, 280, 550);
      face(a, 530, 550);
    },
  },
  {
    name: 'pineapple', title: 'Pineapple', tags: ['pineapple', 'fruit', 'tropical'], anim: 'wiggle',
    draw(a) {
      frame(a);
      for (const [ang, len] of [[-120, 170], [-100, 210], [-80, 210], [-60, 170], [-140, 130], [-40, 130]]) a.f(leaf(400, 300, len, 22, ang));
      a.f(ellipse(400, 500, 170, 230));
      const body = ellipsePts(400, 500, 170, 230);
      a.l(hatch(body, 64, 55, 3) + hatch(body, 64, 125, 3), 3);
      a.f(rect(300, 440, 200, 110, 50));
      face(a, 400, 480);
    },
  },
  {
    name: 'lollipop', title: 'Swirly Lollipop', tags: ['lollipop', 'candy', 'sweet'], anim: 'spin',
    draw(a) {
      frame(a);
      a.f(rect(385, 500, 30, 260, 12));
      a.f(circle(400, 330, 220));
      for (let i = 0; i < 8; i++) {
        const a1 = i * 45;
        a.f(`M400 330L${polar(400, 330, 220, a1).map((v) => v.toFixed(1)).join(' ')}A220 220 0 0 1 ${polar(400, 330, 220, a1 + 45).map((v) => v.toFixed(1)).join(' ')}Q${polar(400, 330, 80, a1 + 60).map((v) => v.toFixed(1)).join(' ')} 400 330Z`);
      }
      a.f(circle(400, 330, 50));
      a.f('M330 520L400 470L470 520L440 570L400 540L360 570Z');
    },
  },
  {
    name: 'carrot', title: 'Crunchy Carrot', tags: ['carrot', 'vegetable'], anim: 'wiggle',
    draw(a) {
      table(a);
      for (const ang of [-120, -90, -60]) a.f(leaf(400, 220, 160, 26, ang));
      a.f('M300 240Q400 200 500 240Q470 500 400 740Q330 500 300 240Z');
      for (const [y, s] of [[320, 1], [400, -1], [480, 1], [560, -1]]) a.l(`M${400 + s * 70} ${y}h${-s * 40}`, 4);
      face(a, 400, 320);
    },
  },
  {
    name: 'pear', title: 'Happy Pear', tags: ['pear', 'fruit'], anim: 'wiggle',
    draw(a) {
      table(a);
      a.f('M400 180C340 180 320 260 320 320C320 380 210 430 210 540C210 640 300 690 400 690C500 690 590 640 590 540C590 430 480 380 480 320C480 260 460 180 400 180Z');
      a.f(rect(390, 100, 20, 90, 8));
      a.f(leaf(408, 130, 120, 24, -15));
      face(a, 400, 500, 1.3);
    },
  },
];
