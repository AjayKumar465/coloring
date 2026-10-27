// Hand-composed, detailed showcase scenes (one or two per category).
import { circle, ellipse, rect, poly, smooth, petal, scallop, star, heart, leaf, polar, annular, regular, band, zig, hatch, wavyLine, softStar } from '../lib/shapes.js';
import { frame, ground, sun, cloud, eyes, smile, cheeks, grass, tree, pineTree, flowerSmall, sea, sand, seaweed, bubbles, twinkleStars, wheel, person, hill } from '../lib/parts.js';
import { critter } from './animals.js';
import { fish } from './sea.js';
import { rocket } from './space.js';
import { castle } from './fantasy.js';
import { butterfly } from './bugs.js';
import { flower } from './nature.js';
import { snowman } from './holidays.js';
import { mandala } from './patterns.js';

const show = (category, name, title, tags, anim, draw) => ({ category, item: { name, title, tags: [...tags, 'showcase'], anim, showcase: true, difficulty: 'hard', draw } });

export const SHOWCASE = [
  show('animals', 'jungle-friends', 'Jungle Friends', ['jungle', 'monkey', 'lion', 'parrot'], 'wiggle', (a) => {
    frame(a);
    sun(a, 400, 110, 50, true);
    for (const [x, ang] of [[60, -60], [60, -20], [740, -120], [740, -160]]) a.anim('sway', () => a.f(leaf(x, 300, 260, 45, ang)));
    a.f('M16 520Q200 470 400 520T784 500V748A36 36 0 0 1 748 784H52A36 36 0 0 1 16 748Z');
    a.f(rect(120, 120, 50, 420, 16));
    a.f(scallop(145, 120, 120, 70, 10));
    a.place(230, 520, 0.45, () => critter(a, {
      headR: 120,
      mane: (hy) => a.f(scallop(400, hy + 5, 185, 175, 16, 0.62)),
      ears: (hy) => { a.f(circle(305, hy - 95, 36)); a.f(circle(495, hy - 95, 36)); },
      muzzle: (hy) => { a.f(ellipse(372, hy + 45, 34, 26)); a.f(ellipse(428, hy + 45, 34, 26)); },
      nose: (hy) => a.f(`M385 ${hy + 18}h30l-15 18z`),
    }));
    a.place(560, 540, 0.42, () => critter(a, {
      ears: (hy) => { a.f(circle(262, hy, 48)); a.f(circle(538, hy, 48)); },
      overHead: (hy) => a.f(`M400 ${hy - 40}C350 ${hy - 110} 280 ${hy - 50} 310 ${hy}C270 ${hy + 60} 320 ${hy + 115} 400 ${hy + 115}C480 ${hy + 115} 530 ${hy + 60} 490 ${hy}C520 ${hy - 50} 450 ${hy - 110} 400 ${hy - 40}Z`),
      cheeks: false,
      tail: () => a.l('M500 640C640 680 720 600 680 520', 9),
    }));
    // parrot on the branch
    a.f(rect(560, 250, 200, 20, 10));
    a.f(petal(650, 250, 120, 18, 100));
    a.f(ellipse(650, 200, 40, 60));
    a.f(circle(650, 135, 34));
    a.f('M675 130Q705 140 690 165Q680 150 668 150Z');
    a.f(petal(640, 190, 70, 18, 120));
    eyes(a, 645, 128, 0, 9);
    for (const [x, y] of [[90, 600], [360, 690], [720, 640]]) flowerSmall(a, x, y, 22);
  }),
  show('animals', 'cozy-cat-nap', 'Cozy Cat Nap', ['cat', 'sleep', 'yarn', 'pet'], 'float', (a) => {
    frame(a);
    a.f(rect(80, 80, 260, 220, 10));
    a.l('M210 80V300M80 190H340', 5);
    a.f(circle(250, 140, 30));
    a.f('M16 560H784V748A36 36 0 0 1 748 784H52A36 36 0 0 1 16 748Z');
    a.f(ellipse(400, 640, 330, 100));
    a.f(ellipse(400, 640, 250, 70));
    a.f(ellipse(400, 640, 160, 40));
    a.f(smooth([[220, 600], [240, 470], [380, 420], [540, 440], [600, 520], [580, 610], [400, 640]], true, 0.9));
    a.f(smooth([[560, 600], [660, 600], [640, 540], [590, 560]], true, 0.8));
    a.f(poly([[230, 460], [250, 380], [300, 445]]));
    a.f(poly([[320, 440], [350, 370], [370, 445]]));
    a.f(ellipse(300, 510, 100, 80));
    a.l('M245 505q15 12 30 0M315 505q15 12 30 0', 5);
    a.f('M285 530h20l-10 12z');
    a.l('M230 540l-60 -8M230 550l-60 10M360 540l60 -8M360 550l60 10', 3);
    for (const [x, y] of [[430, 470], [480, 490], [520, 520]]) a.l(`M${x} ${y}q10 30 30 40`, 4);
    a.anim('float', () => {
      a.text(450, 380, 'z', 50);
      a.text(500, 330, 'z', 64);
      a.text(560, 270, 'Z', 80);
    });
    a.f(circle(660, 470, 60));
    a.l('M620 440Q660 480 700 440M610 480Q660 520 710 480M640 415Q660 470 640 525', 4);
    a.l('M660 530Q640 600 560 600', 4);
  }),
  show('sea-life', 'coral-reef', 'Coral Reef Party', ['reef', 'coral', 'fish', 'ocean'], 'swim', (a) => {
    frame(a);
    sand(a, 650);
    bubbles(a, [[680, 100, 20], [650, 170, 12], [120, 90, 14], [100, 150, 9]]);
    for (const [x, h] of [[60, 280], [740, 240], [300, 200]]) seaweed(a, x, 700, h);
    for (const [x, y] of [[150, 620], [470, 620], [650, 630]]) {
      a.f(`M${x - 40} ${y + 60}C${x - 60} ${y - 40} ${x - 100} ${y - 80} ${x - 70} ${y - 120}C${x - 40} ${y - 120} ${x - 20} ${y - 60} ${x} ${y - 30}C${x + 10} ${y - 120} ${x + 40} ${y - 150} ${x + 70} ${y - 130}C${x + 90} ${y - 80} ${x + 40} ${y - 20} ${x + 40} ${y + 60}Z`);
    }
    a.f(scallop(300, 690, 70, 30, 9));
    a.f(softStar(560, 720, 45, 20));
    fish(a, 240, 300, 0.6, { bands: [[-0.55, -0.3], [0.05, 0.3]] });
    fish(a, 520, 220, 0.5);
    fish(a, 520, 430, 0.55, { tall: true });
    a.place(670, 360, 0.35, () => {
      for (const dx of [-160, -110, -55, 0, 55, 110, 160]) a.f(petal(400 + dx, 420, 260 - Math.abs(dx) * 0.4, 30, 90 + dx * 0.28, 0.7));
      a.f(ellipse(400, 330, 200, 180));
      eyes(a, 400, 360, 60, 26);
      smile(a, 400, 425, 34);
    });
  }),
  show('sea-life', 'dolphin-waves', 'Dolphin Splash', ['dolphin', 'waves', 'ocean'], 'float', (a) => {
    frame(a);
    sun(a, 640, 140, 60, true);
    cloud(a, 180, 130, 100, 44);
    sea(a, 520, 18, 4);
    a.f(wavyLine(16, 784, 620, 14, 5).replace('M', 'M') + 'V748A36 36 0 0 1 748 784H52A36 36 0 0 1 16 748Z');
    a.anim('float', () => {
      a.f('M180 520C200 380 340 260 480 270C560 275 610 300 640 330C600 330 570 340 560 350C580 380 600 420 590 460C560 420 520 400 470 400C400 400 300 450 250 540Z');
      a.f('M470 275L440 200L520 265Z');
      a.f('M250 540L190 600L260 590L230 640L300 560Z');
      a.f('M300 450C360 420 430 400 500 410C450 430 380 460 330 500Z');
      a.f(petal(420, 380, 80, 22, 120));
      eyes(a, 545, 315, 0, 12);
    });
    a.anim('float', () => {
      for (const [x, y, r] of [[200, 470, 14], [160, 500, 10], [640, 470, 12], [670, 440, 8]]) a.f(circle(x, y, r));
    });
    a.f(softStar(150, 700, 40, 18));
    a.f(scallop(620, 710, 50, 22, 8));
  }),
  show('dinosaurs', 'volcano-valley', 'Volcano Valley', ['volcano', 'dinosaur', 'prehistoric'], 'wiggle', (a) => {
    frame(a);
    cloud(a, 160, 110, 80, 36);
    a.f('M260 520L380 220H460L580 520Z');
    a.anim('pulse', () => {
      a.f('M380 220Q420 260 460 220L470 250Q440 300 420 260Q400 300 370 250Z');
      a.f(scallop(420, 160, 70, 40, 8));
      a.f(scallop(470, 90, 50, 30, 7));
    });
    a.f('M400 230Q390 330 350 360Q380 300 390 240Z');
    ground(a, 520, 20);
    for (const [x, y] of [[620, 500], [700, 520]]) {
      a.f(rect(x - 8, y - 140, 16, 140, 6));
      for (const ang of [-150, -110, -70, -30]) a.f(leaf(x, y - 140, 90, 14, ang));
    }
    a.place(250, 560, 0.45, () => {
      a.f(rect(270, 520, 60, 160, 20));
      a.f(rect(520, 520, 60, 160, 20));
      a.f(smooth([[50, 590], [200, 500], [330, 410], [440, 390], [530, 420], [575, 330], [590, 200], [620, 130], [690, 115], [725, 150], [690, 185], [640, 195], [650, 300], [650, 440], [610, 530], [470, 570], [310, 560], [180, 580]], true, 0.9));
      a.f(rect(330, 540, 66, 150, 20));
      a.f(rect(580, 530, 66, 160, 20));
      eyes(a, 670, 145, 0, 14);
    });
    a.place(560, 640, 0.3, () => {
      a.f(ellipse(400, 430, 120, 110));
      a.f(band(400, 560, 180, 220, 500, 800, { edgeA: zig(25, 70) }));
      eyes(a, 400, 420, 42, 18);
      smile(a, 400, 470, 26);
    });
    for (const [x, y, r] of [[120, 700, 26], [700, 700, 20], [450, 740, 16]]) a.f(circle(x, y, r));
  }),
  show('dinosaurs', 'dino-friends', 'Dino Best Friends', ['dinosaur', 'friends'], 'wiggle', (a) => {
    frame(a);
    sun(a, 660, 110, 45);
    a.f(heart(400, 140, 50));
    ground(a, 640, 25);
    for (const [cx, flip] of [[260, 1], [560, -1]]) {
      a.g(` transform="translate(${cx} 0) scale(${flip} 1) translate(${-cx} 0)"`, () => {
        a.f(rect(cx - 70, 560, 50, 130, 18));
        a.f(rect(cx + 20, 560, 50, 130, 18));
        a.f(smooth([[cx - 200, 650], [cx - 110, 560], [cx - 90, 480], [cx - 20, 420], [cx + 40, 330], [cx + 60, 240], [cx + 130, 220], [cx + 170, 260], [cx + 150, 300], [cx + 100, 310], [cx + 100, 420], [cx + 110, 560], [cx + 20, 620], [cx - 100, 620]], true, 0.9));
        a.f(ellipse(cx + 20, 520, 60, 80));
        for (const [dx, dy] of [[-60, 440], [-10, 380], [30, 300]]) a.f(poly([[cx + dx - 40, dy + 20], [cx + dx - 50, dy - 30], [cx + dx, dy]]));
        a.f(circle(cx + 115, 255, 14));
        a.k(circle(cx + 118, 258, 7));
        a.l(`M${cx + 165} 285Q${cx + 140} 300 ${cx + 120} 292`, 4);
        a.f(petal(cx + 90, 380, 70, 16, flip > 0 ? 30 : 30));
      });
    }
    for (const x of [100, 400, 700]) flowerSmall(a, x, 680, 22);
  }),
  show('vehicles', 'train-ride', 'Train Ride Through the Hills', ['train', 'railway', 'hills'], 'wiggle', (a) => {
    frame(a);
    sun(a, 670, 110, 45);
    cloud(a, 200, 120, 80, 36);
    hill(a, 180, 380, 280);
    hill(a, 600, 340, 300);
    ground(a, 560, 10);
    pineTree(a, 690, 540, 0.35);
    pineTree(a, 120, 540, 0.3);
    a.f(rect(16, 660, 768, 22));
    for (let x = 40; x < 780; x += 60) a.f(rect(x, 682, 30, 14, 4));
    a.anim('float', () => {
      a.f(circle(600, 290, 36));
      a.f(circle(650, 240, 26));
      a.f(circle(690, 200, 16));
    });
    a.f(rect(570, 320, 50, 90, 6));
    a.f(rect(520, 410, 200, 200, 16));
    a.f(rect(420, 360, 120, 250, 14));
    a.f(rect(440, 385, 80, 70, 8));
    a.f(rect(405, 340, 150, 30, 10));
    a.f(poly([[720, 610], [760, 650], [720, 650]]));
    for (const x of [120, 280]) {
      a.f(rect(x - 70, 450, 150, 160, 14));
      a.f(rect(x - 50, 470, 50, 50, 8));
      a.f(rect(x + 10, 470, 50, 50, 8));
      a.f(rect(x - 80, 440, 170, 20, 8));
    }
    a.l('M200 590H220M360 590H420', 8);
    for (const x of [80, 160, 240, 320, 460, 580, 680]) wheel(a, x, 625, x > 500 ? 40 : 30);
  }),
  show('vehicles', 'harbor-day', 'Busy Harbor', ['boat', 'ship', 'lighthouse', 'harbor'], 'float', (a) => {
    frame(a);
    cloud(a, 220, 110, 90, 40);
    a.f(circle(420, 120, 40));
    sea(a, 430, 10, 6);
    a.f('M560 430L590 150H690L720 430Z');
    a.f(band(640, 290, 120, 160, 200, 240));
    a.f(band(640, 290, 120, 160, 300, 340));
    a.f(rect(580, 110, 120, 50, 8));
    a.f(poly([[570, 110], [640, 60], [710, 110]]));
    a.anim('twinkle', () => a.f(rect(615, 120, 50, 30, 6)));
    a.f('M520 430H784V470H520Z');
    a.anim('float', () => {
      a.f('M60 580H380L340 660H100Z');
      a.f(rect(110, 510, 180, 70, 8));
      for (const x of [140, 200, 260]) a.f(circle(x, 545, 18));
      a.f(rect(230, 450, 40, 60));
      a.f(rect(220, 440, 60, 18, 6));
    });
    a.anim('float', () => {
      a.f('M420 640H700L660 710H460Z');
      a.l('M560 640V470', 6);
      a.f(poly([[555, 480], [555, 630], [440, 630]]));
      a.f(poly([[566, 490], [566, 630], [670, 630]]));
    });
    for (const [x, y] of [[330, 250], [370, 230], [130, 300]]) a.l(`M${x - 20} ${y}q10 -14 20 0q10 -14 20 0`, 4);
  }),
  show('space', 'rocket-launch', 'Rocket Launch Day', ['rocket', 'launch', 'space'], 'float', (a) => {
    frame(a);
    twinkleStars(a, [[100, 100, 20], [690, 90, 24], [600, 240, 14], [160, 300, 14], [710, 380, 16]]);
    a.f(circle(140, 180, 50));
    a.f(ellipse(140, 180, 90, 16, -20));
    a.f('M16 660H784V748A36 36 0 0 1 748 784H52A36 36 0 0 1 16 748Z');
    a.f(rect(560, 200, 40, 460));
    for (let y = 230; y < 650; y += 70) a.l(`M560 ${y}l40 40M600 ${y}l-40 40`, 3);
    a.f(rect(470, 300, 90, 20));
    a.f(rect(240, 620, 320, 40, 6));
    rocket(a, 400, 330, 0.85);
    a.anim('pulse', () => {
      for (const [x, y, r] of [[250, 640, 60], [330, 680, 50], [470, 680, 50], [550, 640, 60], [180, 670, 40], [620, 670, 40]]) a.f(scallop(x, y, r, r * 0.7, 7));
    });
  }),
  show('space', 'moon-walk', 'Moon Walk', ['astronaut', 'moon', 'earth', 'space'], 'float', (a) => {
    frame(a);
    twinkleStars(a, [[100, 90, 18], [380, 70, 14], [720, 260, 16], [80, 340, 12], [460, 200, 12]]);
    a.f(circle(620, 140, 80));
    a.f('M570 100Q600 80 630 110Q600 150 640 170Q600 190 580 160Q560 130 570 100Z');
    a.f('M650 190Q680 170 690 200Q670 220 650 190Z');
    a.f('M16 560Q300 500 784 570V748A36 36 0 0 1 748 784H52A36 36 0 0 1 16 748Z');
    for (const [x, y, rx] of [[150, 650, 70], [560, 690, 60], [700, 620, 30], [350, 720, 40]]) {
      a.f(ellipse(x, y, rx, rx * 0.3));
      a.f(ellipse(x, y + 4, rx * 0.7, rx * 0.18));
    }
    a.l('M620 560V330', 6);
    a.anim('wiggle', () => {
      a.f(rect(624, 330, 120, 80, 4));
      a.f(star(684, 370, 24, 10));
    });
    a.place(330, 420, 0.62, () => person(a, {
      hairBack: () => a.f(circle(400, 245, 125)),
      noFringe: true, belt: true, badge: true,
      prop: () => a.f(rect(240, 340, 70, 150, 20)),
    }));
  }),
  show('fantasy', 'enchanted-castle', 'Enchanted Castle', ['castle', 'rainbow', 'magic', 'princess'], 'float', (a) => {
    frame(a);
    for (let i = 0; i < 5; i++) a.f(annular(400, 640, 330 - i * 30, 360 - i * 30, 180, 360));
    twinkleStars(a, [[90, 100, 22], [710, 100, 22], [400, 60, 16]]);
    a.place(400, 410, 0.8, () => castle(a));
    a.f('M16 640Q200 610 400 640T784 630V748A36 36 0 0 1 748 784H52A36 36 0 0 1 16 748Z');
    a.f('M350 640Q330 700 300 784H500Q470 700 450 640Z');
    for (const x of [100, 200, 600, 700]) flowerSmall(a, x, 680, 20);
    a.f(cloudPath(120, 300));
    a.f(cloudPath(680, 300));
  }),
  show('fantasy', 'unicorn-rainbow', 'Unicorn Over the Rainbow', ['unicorn', 'rainbow', 'magic'], 'float', (a) => {
    frame(a);
    for (let i = 0; i < 6; i++) a.f(annular(400, 520, 220 + i * 26, 246 + i * 26, 180, 360));
    a.f(scallop(150, 520, 120, 60, 9));
    a.f(scallop(650, 520, 120, 60, 9));
    twinkleStars(a, [[100, 90, 20], [700, 90, 22], [400, 120, 16], [700, 650, 18], [100, 660, 18]]);
    a.anim('float', () => {
      a.f(ellipse(400, 470, 150, 80));
      for (const [x, y] of [[300, 520], [350, 530], [450, 530], [500, 520]]) a.f(rect(x - 15, y, 30, 110, 12));
      a.f(smooth([[520, 450], [580, 350], [620, 300], [680, 300], [710, 340], [690, 380], [640, 380], [600, 430], [560, 480]], true, 0.9));
      a.f(poly([[640, 300], [670, 210], [665, 300]]));
      for (const [x, y, ang] of [[600, 320, 200], [580, 360, 210], [560, 400, 220]]) a.f(petal(x, y, 80, 22, ang, 0.7));
      a.f(smooth([[250, 450], [180, 470], [150, 560], [200, 520], [240, 490]], true, 0.8));
      eyes(a, 660, 330, 0, 10);
    });
    a.f('M16 700Q400 650 784 700V748A36 36 0 0 1 748 784H52A36 36 0 0 1 16 748Z');
  }),
  show('food', 'picnic-basket', 'Picnic in the Park', ['picnic', 'fruit', 'sandwich', 'park'], 'wiggle', (a) => {
    frame(a);
    sun(a, 660, 110, 45);
    cloud(a, 180, 110, 80, 36);
    tree(a, 110, 420, 0.8);
    ground(a, 420, 15);
    const blanket = [[80, 520], [720, 520], [784, 760], [16, 760]];
    a.f(poly(blanket));
    for (let i = 1; i < 6; i++) a.l(`M${80 + i * 106 - i * 12} 520L${16 + i * 128} 760`, 4);
    for (let j = 1; j < 3; j++) a.l(`M${80 - j * 21} ${520 + j * 80}H${720 + j * 21}`, 4);
    a.l('M380 420C380 260 600 260 600 420', 12);
    a.f(poly([[350, 420], [630, 420], [600, 580], [380, 580]]));
    a.l(hatch([[350, 420], [630, 420], [600, 580], [380, 580]], 40, 90, 2) + hatch([[350, 420], [630, 420], [600, 580], [380, 580]], 40, 0, 2), 3);
    a.f(rect(340, 410, 300, 24, 10));
    a.f(circle(140, 620, 45));
    a.f(leaf(145, 578, 40, 10, -40));
    a.f(poly([[220, 680], [340, 680], [280, 590]]));
    a.f(poly([[230, 670], [330, 670], [280, 610]]));
    a.f(annular(680, 640, 50, 70, 180, 360));
    a.f(annular(680, 640, 0.1, 50, 180, 360));
    a.f(rect(450, 640, 60, 80, 10));
    a.f(rect(460, 620, 40, 20));
  }),
  show('nature', 'flower-garden', 'Flower Garden', ['flower', 'garden', 'butterfly'], 'wiggle', (a) => {
    frame(a);
    sun(a, 660, 110, 45, true);
    cloud(a, 170, 110, 80, 36);
    ground(a, 560, 20);
    a.f(rect(16, 470, 768, 16));
    for (let x = 40; x < 780; x += 70) a.f(`M${x} 560V450L${x + 15} 430L${x + 30} 450V560Z`);
    const flowers = [[110, 520, 6, 'round'], [250, 460, 8, 'pointy'], [400, 500, 5, 'round'], [550, 450, 7, 'round'], [690, 520, 10, 'pointy'], [180, 640, 6, 'pointy'], [470, 640, 8, 'round'], [640, 670, 5, 'round'], [330, 680, 7, 'round']];
    for (const [x, y, n, kind] of flowers) {
      a.l(`M${x} ${y}V784`, 6);
      a.f(leaf(x, y + 90, 60, 14, -40));
      a.anim('wiggle', () => flower(a, x, y, n, 26, 54, 17, kind));
    }
    butterfly(a, 400, 260, 0.35, 0);
  }),
  show('nature', 'forest-path', 'Forest Path', ['forest', 'tree', 'path', 'deer'], 'float', (a) => {
    frame(a);
    sun(a, 400, 120, 45);
    cloud(a, 180, 110, 70, 32);
    cloud(a, 640, 120, 70, 32);
    ground(a, 470, 10);
    a.f('M370 470Q340 600 220 784H580Q460 600 430 470Z');
    for (const [x, y, s] of [[90, 470, 0.7], [210, 500, 0.6], [600, 500, 0.6], [710, 470, 0.7], [140, 640, 0.5], [670, 650, 0.5]]) pineTree(a, x, y, s);
    for (const [x, y] of [[300, 600], [520, 610], [260, 720], [560, 720]]) {
      a.f(rect(x - 8, y - 20, 16, 30, 6));
      a.f(`M${x - 30} ${y - 18}Q${x} ${y - 60} ${x + 30} ${y - 18}Z`);
    }
    a.f(ellipse(400, 560, 26, 16));
    a.f(ellipse(430, 680, 30, 18));
    a.anim('float', () => {
      butterfly(a, 300, 300, 0.18, 1);
      butterfly(a, 520, 330, 0.15, 0);
    });
  }),
  show('holidays', 'winter-wonderland', 'Winter Wonderland', ['winter', 'snow', 'snowman', 'christmas'], 'twinkle', (a) => {
    frame(a);
    a.anim('twinkle', () => {
      for (const [x, y] of [[90, 90], [250, 160], [700, 100], [600, 230], [120, 330], [720, 360], [420, 60]]) a.f(star(x, y, 16, 6, 6));
    });
    a.f(circle(560, 120, 50));
    hill(a, 160, 420, 300);
    hill(a, 640, 440, 300);
    ground(a, 600, 20);
    for (const [x, y, s] of [[110, 600, 0.5], [700, 610, 0.55], [600, 560, 0.35]]) pineTree(a, x, y, s);
    a.place(380, 470, 0.58, () => snowman(a));
    a.f(rect(520, 610, 100, 70, 6));
    a.f(rect(560, 610, 20, 70));
    a.f(petal(570, 610, 40, 14, -150));
    a.f(petal(570, 610, 40, 14, -30));
    a.f(rect(100, 690, 200, 20, 10));
    a.f(poly([[120, 690], [100, 650], [280, 650], [300, 690]]));
  }),
  show('bugs', 'bug-garden', 'Bug Garden Party', ['bugs', 'garden', 'butterfly', 'ladybug', 'bee'], 'float', (a) => {
    frame(a);
    sun(a, 660, 110, 45, true);
    ground(a, 600, 20);
    for (const [x, y] of [[120, 560], [330, 520], [560, 560], [700, 600]]) {
      a.l(`M${x} ${y}V784`, 6);
      a.f(leaf(x, y + 100, 70, 16, -30));
      a.anim('wiggle', () => flower(a, x, y, 7, 28, 56, 18));
    }
    butterfly(a, 250, 250, 0.4, 0);
    butterfly(a, 520, 300, 0.32, 1);
    a.place(160, 700, 0.22, () => {
      a.f(circle(400, 250, 80));
      a.f(circle(400, 440, 200));
      a.l('M400 240V640', 6);
      for (const [x, y, r] of [[300, 380, 36], [500, 380, 36], [300, 500, 30], [500, 500, 30]]) a.f(circle(x, y, r));
    });
    a.place(460, 680, 0.25, () => {
      for (const [x, y, r] of [[600, 520, 70], [520, 480, 72], [440, 510, 74], [360, 480, 76]]) a.f(circle(x, y, r));
      a.f(circle(250, 420, 90));
      eyes(a, 250, 410, 34, 16);
    });
    a.place(400, 140, 0.25, () => {
      a.f(ellipse(320, 260, 80, 120, -30));
      a.f(ellipse(480, 260, 80, 120, 30));
      a.f(ellipse(420, 420, 190, 140));
      for (const x of [380, 470, 560]) a.f(band(420, 420, 190, 140, x - 25, x + 15, { vertical: true }));
      a.f(circle(240, 420, 100));
      eyes(a, 240, 410, 38, 20);
    });
  }),
  show('farm', 'farm-day', 'A Day on the Farm', ['farm', 'barn', 'cow', 'chicken', 'tractor'], 'wiggle', (a) => {
    frame(a);
    sun(a, 680, 100, 40);
    cloud(a, 160, 100, 70, 32);
    hill(a, 600, 330, 280);
    ground(a, 450, 15);
    a.f('M60 470V250L200 160L340 250V470Z');
    a.f('M40 265L200 145L360 265L340 280L200 180L60 280Z');
    a.f(rect(150, 340, 100, 130));
    a.l('M150 340L250 470M250 340L150 470', 4);
    a.f(rect(170, 220, 60, 50, 6));
    a.f(rect(370, 280, 60, 190, 30));
    for (let x = 460; x < 770; x += 60) a.f(`M${x} 480V400L${x + 12} 385L${x + 24} 400V480Z`);
    a.f(rect(450, 415, 320, 14, 4));
    a.place(560, 600, 0.32, () => critter(a, {
      headR: 130, headY: 330,
      ears: (hy) => { a.f(ellipse(250, hy - 50, 60, 28, -20)); a.f(ellipse(550, hy - 50, 60, 28, 20)); },
      overHead: (hy) => a.f(scallop(460, hy - 50, 50, 40, 7)),
      muzzle: (hy) => { a.f(ellipse(400, hy + 60, 95, 60)); a.k(ellipse(365, hy + 55, 9, 13)); a.k(ellipse(435, hy + 55, 9, 13)); },
      mouth: false,
    }));
    a.place(230, 640, 0.22, () => {
      a.f(ellipse(420, 500, 180, 140));
      a.f(petal(430, 470, 160, 50, 10));
      a.f(circle(290, 340, 95));
      a.f(scallop(280, 240, 50, 26, 6, 0.65, 180));
      a.f(poly([[200, 340], [150, 360], [200, 380]]));
      eyes(a, 290, 330, 34, 13);
    });
    for (const [x, y] of [[100, 700], [720, 720], [380, 740]]) flowerSmall(a, x, y, 18);
  }),
  show('jobs', 'community-street', 'Our Community Street', ['town', 'helpers', 'fire station', 'hospital', 'school'], 'float', (a) => {
    frame(a);
    sun(a, 400, 90, 40);
    const building = (x, w, h, label) => {
      a.f(rect(x, 520 - h, w, h));
      a.f(rect(x - 10, 520 - h - 30, w + 20, 34, 6));
      a.f(rect(x + w / 2 - 30, 430, 60, 90, 8));
      for (const dx of [20, w - 70]) a.f(rect(x + dx, 520 - h + 50, 50, 50, 6));
      a.text(x + w / 2, 520 - h - 6, label, 22);
    };
    building(40, 210, 260, 'FIRE');
    building(300, 200, 300, 'SCHOOL');
    building(550, 210, 260, 'CLINIC');
    a.f('M16 520H784V640H16Z');
    for (let x = 40; x < 780; x += 110) a.f(rect(x, 575, 60, 10, 5));
    a.f('M16 640H784V748A36 36 0 0 1 748 784H52A36 36 0 0 1 16 748Z');
    a.place(170, 690, 0.3, () => person(a, {
      coat: true,
      hat: () => { a.f(ellipse(400, 185, 140, 34)); a.f('M320 185Q320 100 400 100Q480 100 480 185Z'); },
    }));
    a.place(400, 690, 0.3, () => person(a, { glasses: true }));
    a.place(630, 690, 0.3, () => person(a, { coat: true, pocket: true }));
    a.place(560, 530, 0.3, () => {
      a.f('M120 600V500Q120 470 160 465L250 450L320 370H500L580 450L660 465Q690 475 690 505V600Z');
      a.f('M270 450L330 395H400V450Z');
      a.f('M425 450V395H490L545 450Z');
      wheel(a, 240, 610, 56);
      wheel(a, 570, 610, 56);
    });
  }),
  show('patterns', 'grand-mandala', 'Grand Mandala', ['mandala', 'pattern', 'relax', 'detailed'], 'spin', (a) => {
    frame(a);
    for (const [x, y] of [[70, 70], [730, 70], [70, 730], [730, 730]]) {
      a.f(softStar(x, y, 40, 18, 6));
      a.f(circle(x, y, 12));
    }
    a.place(400, 400, 0.94, () => a.anim('spin', () => mandala(a, 2024, 9)));
  }),
];

function cloudPath(x, y) {
  return scallop(x, y, 80, 36, 9, 0.62, 10);
}
