import { circle, ellipse, rect, poly, smooth, petal, scallop, arcPath, star, band, zig, leaf } from '../lib/shapes.js';
import { frame, ground, sun, cloud, eyes, smile, cheeks, sea, grass } from '../lib/parts.js';

function land(a) {
  frame(a);
  sun(a, 120, 120, 50);
  cloud(a, 600, 110, 90, 40);
  ground(a, 650, 25);
}

function dinoEye(a, x, y, r = 18) {
  a.anim('blink', () => {
    a.f(circle(x, y, r));
    a.k(circle(x + r * 0.2, y + r * 0.1, r * 0.55));
    a.f(circle(x + r * 0.35, y - r * 0.2, r * 0.18));
  });
}

function leg(a, x, top, w = 60, h = 130) {
  a.f(rect(x - w / 2, top, w, h, 20));
  for (const dx of [-w / 4, 0, w / 4]) a.f(circle(x + dx, top + h - 2, 9));
}

const REX = [[70, 610], [200, 530], [320, 430], [420, 340], [470, 240], [530, 170], [640, 165], [700, 205], [690, 255], [610, 275], [550, 305], [530, 390], [505, 470], [440, 545], [330, 590], [210, 615]];

function rex(a, pts = REX) {
  leg(a, 320, 540, 60, 150);
  a.f(smooth(pts, true, 0.9));
  a.f(smooth([[520, 330], [535, 400], [505, 470], [440, 540], [400, 480], [470, 420]], true, 0.9));
  a.f(ellipse(395, 540, 75, 95, -10));
  leg(a, 410, 600, 64, 110);
  a.anim('wiggle', () => a.f(petal(530, 360, 70, 16, 40)));
  dinoEye(a, 590, 210, 20);
  a.l('M690 240Q640 250 600 245', 4);
  for (const x of [610, 630, 650, 670]) a.f(`M${x} 244l8 14l8 -15z`);
  for (const [x, y] of [[300, 480], [360, 420], [420, 380]]) a.f(circle(x, y, 18));
}

export default [
  {
    name: 't-rex', title: 'Mighty T-Rex', tags: ['t-rex', 'dinosaur'], anim: 'wiggle',
    draw(a) {
      land(a);
      rex(a);
    },
  },
  {
    name: 'brontosaurus', title: 'Long Neck Dino', tags: ['brontosaurus', 'dinosaur'], anim: 'float',
    draw(a) {
      land(a);
      leg(a, 280, 520, 64, 160);
      leg(a, 520, 520, 64, 160);
      a.f(smooth([[50, 590], [200, 500], [330, 410], [440, 390], [530, 420], [575, 330], [590, 200], [620, 130], [690, 115], [725, 150], [690, 185], [640, 195], [650, 300], [650, 440], [610, 530], [470, 570], [310, 560], [180, 580]], true, 0.9));
      leg(a, 340, 540, 66, 150);
      leg(a, 590, 530, 66, 160);
      for (const [x, y, r] of [[380, 450, 26], [450, 430, 18], [300, 470, 16], [600, 290, 12], [610, 380, 15]]) a.f(circle(x, y, r));
      dinoEye(a, 670, 145, 14);
      smile(a, 700, 172, 14, 0.4);
    },
  },
  {
    name: 'stegosaurus', title: 'Spiky Stegosaurus', tags: ['stegosaurus', 'dinosaur'], anim: 'wiggle',
    draw(a) {
      land(a);
      for (const [x, y, h, r] of [[240, 490, 90, -55], [320, 425, 115, -35], [410, 395, 125, -8], [500, 405, 110, 18], [580, 450, 85, 40]]) a.f(petal(x, y, h, 30, -90 + r, 0.5));
      leg(a, 300, 520, 60, 130);
      leg(a, 520, 520, 60, 130);
      a.f(smooth([[60, 560], [200, 480], [330, 380], [450, 360], [570, 410], [650, 470], [710, 490], [735, 530], [700, 560], [620, 555], [520, 580], [350, 590], [200, 585]], true, 0.9));
      for (const [x, y, r] of [[90, 520, -120], [120, 510, -70]]) a.f(petal(x, y, 60, 12, r));
      leg(a, 360, 540, 62, 125);
      leg(a, 580, 540, 62, 115);
      dinoEye(a, 690, 515, 12);
    },
  },
  {
    name: 'triceratops', title: 'Triceratops', tags: ['triceratops', 'dinosaur', 'horns'], anim: 'wiggle',
    draw(a) {
      land(a);
      leg(a, 260, 520, 64, 140);
      leg(a, 470, 520, 64, 140);
      a.f(smooth([[60, 540], [200, 450], [350, 390], [480, 410], [530, 470], [520, 560], [440, 600], [300, 600], [170, 570]], true, 0.9));
      leg(a, 320, 550, 66, 120);
      leg(a, 520, 550, 66, 110);
      a.f(scallop(560, 410, 120, 130, 11, 0.62));
      a.f(ellipse(560, 410, 85, 95));
      a.f(poly([[560, 380], [640, 240], [600, 390]]));
      a.f(poly([[610, 400], [700, 270], [640, 410]]));
      a.f(smooth([[520, 420], [610, 390], [700, 440], [735, 480], [700, 530], [610, 545], [540, 510]], true, 0.9));
      a.f(poly([[700, 450], [740, 400], [722, 465]]));
      dinoEye(a, 630, 445, 15);
      smile(a, 690, 505, 20, 0.4);
    },
  },
  {
    name: 'pterodactyl', title: 'Flying Pterodactyl', tags: ['pterodactyl', 'flying', 'dinosaur'], anim: 'float',
    draw(a) {
      frame(a);
      sun(a, 660, 130, 50);
      cloud(a, 160, 620, 110, 50);
      cloud(a, 620, 650, 90, 40);
      a.anim('wiggle', () => {
        a.f('M370 360L100 260L140 330L90 380L170 400L120 460L260 450Z');
        a.f('M430 360L700 260L660 330L710 380L630 400L680 460L540 450Z');
      });
      a.f(ellipse(400, 420, 70, 120));
      a.f(ellipse(400, 440, 40, 80));
      a.f(poly([[370, 525], [340, 590], [385, 540]]));
      a.f(poly([[430, 525], [460, 590], [415, 540]]));
      a.f(circle(400, 270, 70));
      a.f(poly([[440, 240], [560, 280], [440, 300]]));
      a.f(poly([[380, 210], [330, 130], [420, 205]]));
      eyes(a, 400, 265, 26, 13);
    },
  },
  {
    name: 'ankylosaurus', title: 'Armored Ankylosaurus', tags: ['ankylosaurus', 'dinosaur'], anim: 'wiggle',
    draw(a) {
      land(a);
      a.f(rect(90, 520, 160, 26, 12));
      a.f(scallop(90, 533, 45, 40, 8));
      leg(a, 300, 540, 60, 110);
      leg(a, 520, 540, 60, 110);
      a.f('M220 560C220 420 330 370 430 370C540 370 620 430 630 560Z');
      for (let i = 0; i < 6; i++) for (let j = 0; j < 2; j++) a.f(circle(270 + i * 60 + j * 30, 440 + j * 55, 22));
      a.f(rect(220, 540, 410, 34, 14));
      a.f(smooth([[610, 500], [690, 480], [740, 520], [720, 570], [640, 570]], true, 0.9));
      dinoEye(a, 690, 515, 12);
      leg(a, 340, 560, 62, 100);
      leg(a, 570, 560, 62, 100);
    },
  },
  {
    name: 'raptor', title: 'Speedy Raptor', tags: ['raptor', 'dinosaur'], anim: 'wiggle',
    draw(a) {
      land(a);
      leg(a, 330, 520, 46, 170);
      a.f(smooth([[40, 470], [200, 440], [340, 400], [450, 330], [500, 250], [560, 210], [660, 215], [720, 245], [700, 280], [620, 290], [560, 310], [520, 400], [460, 490], [360, 520], [200, 490]], true, 0.9));
      a.f(ellipse(380, 500, 60, 80, -20));
      leg(a, 410, 560, 50, 140);
      a.anim('wiggle', () => a.f(petal(510, 380, 80, 16, 50)));
      for (let i = 0; i < 5; i++) a.f(poly([[460 + i * 22, 300 - i * 25], [430 + i * 22, 270 - i * 25], [480 + i * 22, 280 - i * 25]]));
      dinoEye(a, 610, 240, 15);
      a.l('M720 265Q660 275 620 270', 4);
    },
  },
  {
    name: 'spinosaurus', title: 'Spinosaurus Sail', tags: ['spinosaurus', 'dinosaur'], anim: 'wiggle',
    draw(a) {
      land(a);
      a.f('M240 470C260 330 330 220 400 200C470 220 520 300 520 420Z');
      rex(a, [[50, 600], [200, 520], [320, 440], [420, 380], [480, 300], [540, 230], [650, 225], [720, 255], [700, 290], [610, 305], [555, 330], [530, 400], [505, 470], [440, 545], [330, 590], [200, 610]]);
    },
  },
  {
    name: 'parasaurolophus', title: 'Crested Dino', tags: ['parasaurolophus', 'dinosaur'], anim: 'float',
    draw(a) {
      land(a);
      leg(a, 300, 520, 60, 150);
      a.f(smooth([[580, 210], [480, 140], [440, 128], [452, 165], [560, 240]], true, 0.6));
      a.f(smooth([[60, 580], [220, 500], [350, 420], [460, 380], [510, 300], [540, 210], [620, 190], [690, 220], [690, 260], [610, 270], [575, 330], [560, 430], [500, 520], [380, 580], [220, 600]], true, 0.9));
      a.f(ellipse(390, 520, 70, 90, -15));
      leg(a, 400, 580, 64, 120);
      a.f(petal(540, 410, 70, 14, 60));
      dinoEye(a, 600, 225, 15);
      smile(a, 670, 250, 15, 0.3);
      for (const [x, y] of [[250, 520], [320, 470], [470, 420]]) a.f(circle(x, y, 15));
    },
  },
  {
    name: 'plesiosaur', title: 'Sea Dino Plesiosaur', tags: ['plesiosaur', 'sea', 'dinosaur'], anim: 'swim',
    draw(a) {
      frame(a);
      sun(a, 130, 120, 45);
      sea(a, 430, 14, 4);
      a.anim('wiggle', () => {
        a.f(petal(330, 520, 130, 36, 150));
        a.f(petal(500, 520, 130, 36, 30));
      });
      a.f(smooth([[150, 470], [280, 410], [450, 400], [560, 420], [600, 330], [600, 230], [640, 180], [710, 185], [730, 220], [690, 245], [650, 250], [650, 340], [640, 450], [560, 520], [400, 540], [250, 510]], true, 0.9));
      dinoEye(a, 680, 210, 13);
      smile(a, 705, 232, 12, 0.3);
      a.l('M120 470h60M600 470h70', 4);
    },
  },
  {
    name: 'baby-dino-egg', title: 'Baby Dino Hatching', tags: ['egg', 'baby', 'dinosaur'], anim: 'wiggle',
    draw(a) {
      frame(a);
      ground(a, 640, 20);
      a.f(ellipse(400, 700, 240, 50));
      a.f(ellipse(400, 430, 120, 110));
      a.f(poly([[350, 330], [365, 280], [385, 325]]));
      a.f(poly([[395, 322], [410, 270], [428, 322]]));
      a.f(poly([[440, 330], [460, 285], [470, 340]]));
      eyes(a, 400, 420, 42, 18);
      smile(a, 400, 470, 26);
      cheeks(a, 400, 460, 70, 12);
      a.f(band(400, 560, 180, 220, 500, 800, { edgeA: zig(25, 70) }));
      for (const [x, y, r] of [[330, 640, 22], [460, 610, 16], [420, 700, 14]]) a.f(circle(x, y, r));
      a.f(poly([[600, 480], [640, 440], [660, 500]]));
      a.f(poly([[170, 500], [200, 455], [230, 505]]));
    },
  },
  {
    name: 'dino-nest', title: 'Dino Egg Nest', tags: ['egg', 'nest', 'dinosaur'], anim: 'float',
    draw(a) {
      frame(a);
      ground(a, 560, 20);
      for (const [x, y, r] of [[300, 420, 0], [400, 400, 0], [500, 420, 0]]) {
        a.f(ellipse(x, y, 75, 105, r));
      }
      a.f(zigBand(300, 430));
      a.f(circle(390, 380, 16));
      a.f(circle(420, 430, 12));
      a.f(circle(375, 450, 10));
      a.f(band(500, 420, 75, 105, 380, 410, { edgeA: zig(10, 30), edgeB: zig(10, 30) }));
      a.f('M150 470Q400 560 650 470L620 600Q400 660 180 600Z');
      for (let i = 0; i < 6; i++) a.l(`M${200 + i * 75} ${520 + (i % 2) * 20}l60 30`, 4);
      a.f(leaf(160, 470, 130, 22, 210));
      a.f(leaf(640, 470, 130, 22, -30));
    },
  },
  {
    name: 'dino-footprints', title: 'Dino Footprints', tags: ['footprints', 'dinosaur', 'easy'], anim: 'float',
    draw(a) {
      frame(a);
      for (const [x, y, r] of [[200, 640, -20], [360, 520, 10], [470, 360, -15], [620, 220, 15]]) {
        a.rot(r, x, y, () => {
          a.f(ellipse(x, y + 20, 55, 50));
          a.f(petal(x - 30, y - 10, 80, 16, -125));
          a.f(petal(x, y - 20, 90, 16, -90));
          a.f(petal(x + 30, y - 10, 80, 16, -55));
        });
      }
    },
  },
];

function zigBand(x, y) {
  return band(x, y - 10, 75, 105, y - 30, y + 10, { edgeA: zig(12, 32), edgeB: zig(12, 32) });
}
