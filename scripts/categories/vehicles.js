import { circle, ellipse, rect, poly, smooth, petal, scallop, arcPath, star, line, wedge } from '../lib/shapes.js';
import { frame, ground, sun, cloud, wheel, sea, bubbles, seaweed, sand, eyes, smile } from '../lib/parts.js';

function road(a, y = 620) {
  frame(a);
  sun(a, 660, 120, 48);
  cloud(a, 180, 120, 95, 42);
  a.f(`M16 ${y}H784V${y + 100}H16Z`);
  for (let x = 40; x < 780; x += 110) a.f(rect(x, y + 45, 60, 12, 6));
  a.f(`M16 ${y + 100}H784V748A36 36 0 0 1 748 784H52A36 36 0 0 1 16 748Z`);
}

function sky(a) {
  frame(a);
  sun(a, 120, 120, 48);
  cloud(a, 620, 140, 100, 44);
  cloud(a, 180, 640, 110, 46);
  cloud(a, 610, 680, 80, 36);
}

function windowRow(a, x, y, w, h, count, gap = 14) {
  const ww = (w - gap * (count - 1)) / count;
  for (let i = 0; i < count; i++) a.f(rect(x + i * (ww + gap), y, ww, h, 10));
}

export default [
  {
    name: 'family-car', title: 'Family Car', tags: ['car', 'road'], anim: 'wiggle',
    draw(a) {
      road(a);
      a.f('M150 560V470Q150 450 175 445L250 430L320 340Q335 320 360 320H520Q545 320 560 345L610 430L660 445Q690 455 690 480V560Z');
      a.f('M275 430L335 355H425V430Z');
      a.f('M450 430V355H515Q530 355 540 370L575 430Z');
      a.f(rect(400, 470, 50, 14, 7));
      a.f(rect(660, 470, 30, 30, 8));
      a.f(rect(150, 480, 30, 26, 8));
      wheel(a, 270, 570, 60);
      wheel(a, 560, 570, 60);
    },
  },
  {
    name: 'school-bus', title: 'Big Bus', tags: ['bus', 'school', 'road'], anim: 'wiggle',
    draw(a) {
      road(a);
      a.f(rect(100, 300, 600, 290, 34));
      windowRow(a, 130, 340, 420, 100, 4);
      a.f(rect(575, 340, 95, 200, 10));
      a.l('M622 340V540');
      a.f(rect(100, 470, 470, 30, 0));
      a.f(rect(660, 545, 50, 26, 8));
      a.f(circle(690, 330, 20));
      wheel(a, 230, 595, 58);
      wheel(a, 540, 595, 58);
    },
  },
  {
    name: 'dump-truck', title: 'Dump Truck', tags: ['truck', 'construction'], anim: 'wiggle',
    draw(a) {
      road(a);
      a.f('M90 320H460L430 520H120Z');
      for (const x of [170, 250, 330, 400]) a.l(`M${x} 340V500`, 4);
      a.f(rect(90, 520, 600, 50, 12));
      a.f('M480 360H600Q630 360 650 400L700 470V530H480Z');
      a.f('M510 390H590Q605 390 615 405L645 460H510Z');
      a.f(rect(680, 480, 30, 26, 8));
      wheel(a, 200, 590, 55);
      wheel(a, 340, 590, 55);
      wheel(a, 590, 590, 55);
    },
  },
  {
    name: 'train-engine', title: 'Choo-Choo Train', tags: ['train', 'railway'], anim: 'wiggle',
    draw(a) {
      frame(a);
      cloud(a, 650, 120, 90, 40);
      a.anim('float', () => {
        a.f(circle(250, 150, 40));
        a.f(circle(300, 100, 30));
        a.f(circle(345, 65, 20));
      });
      a.f(rect(16, 640, 768, 30, 0));
      for (let x = 40; x < 780; x += 70) a.f(rect(x, 670, 34, 18, 4));
      a.f(rect(220, 210, 60, 110, 8));
      a.f(rect(205, 190, 90, 30, 10));
      a.f(rect(150, 320, 330, 210, 20));
      a.f(rect(470, 230, 220, 300, 20));
      a.f(rect(500, 270, 160, 110, 14));
      a.f(rect(450, 200, 260, 40, 14));
      a.f(poly([[150, 530], [90, 610], [200, 610]]));
      a.f(circle(150, 420, 30));
      a.f(rect(120, 530, 600, 40, 10));
      wheel(a, 240, 600, 45);
      wheel(a, 370, 600, 45);
      wheel(a, 560, 590, 60);
      a.l('M240 600H560', 8);
    },
  },
  {
    name: 'airplane', title: 'Airplane in the Clouds', tags: ['airplane', 'plane', 'sky'], anim: 'float',
    draw(a) {
      sky(a);
      a.f(poly([[600, 380], [690, 250], [730, 250], [700, 390]]));
      a.f(poly([[380, 420], [470, 590], [540, 590], [500, 420]]));
      a.f('M110 420Q110 360 200 350H640Q720 360 720 410Q720 450 640 460H200Q110 460 110 420Z');
      windowRow(a, 260, 380, 300, 40, 6);
      a.f('M110 420Q115 375 175 360L185 420Z');
      a.f(poly([[380, 400], [460, 260], [530, 260], [500, 400]]));
      a.f(poly([[620, 430], [700, 470], [730, 450], [700, 420]]));
    },
  },
  {
    name: 'helicopter', title: 'Helicopter', tags: ['helicopter', 'sky'], anim: 'float',
    draw(a) {
      sky(a);
      a.f(rect(500, 360, 220, 36, 18));
      a.f(poly([[690, 300], [740, 300], [740, 420], [700, 420]]));
      a.f(ellipse(380, 400, 190, 130));
      a.f('M220 380Q240 300 330 290V400H215Z');
      a.f(rect(370, 230, 20, 50));
      a.anim('spin', () => a.f(rect(160, 210, 440, 24, 12)));
      a.f(rect(250, 560, 270, 18, 9));
      a.l('M300 525L290 560M460 525L470 560', 8);
      a.f(circle(420, 380, 32));
      a.f(circle(500, 380, 26));
    },
  },
  {
    name: 'sailboat', title: 'Sailboat', tags: ['boat', 'sail', 'sea'], anim: 'float',
    draw(a) {
      frame(a);
      sun(a, 130, 130, 50);
      cloud(a, 620, 120, 90, 40);
      sea(a, 560, 14, 5);
      a.f(rect(395, 160, 14, 380));
      a.f(poly([[390, 180], [390, 500], [180, 500]]));
      a.f(poly([[415, 210], [415, 500], [590, 500]]));
      a.f(poly([[409, 160], [480, 180], [409, 200]]));
      a.f('M160 520H640L580 610H220Z');
      a.f(circle(300, 565, 18));
      a.f(circle(400, 565, 18));
      a.f(circle(500, 565, 18));
    },
  },
  {
    name: 'bicycle', title: 'Bicycle Ride', tags: ['bike', 'bicycle'], anim: 'wiggle',
    draw(a) {
      road(a);
      for (const x of [230, 570]) {
        a.anim('spin', () => {
          a.f(circle(x, 520, 110));
          a.f(circle(x, 520, 85));
          a.l(`M${x - 85} 520H${x + 85}M${x} 435V605M${x - 60} 460L${x + 60} 580M${x + 60} 460L${x - 60} 580`, 3);
        });
      }
      a.f(poly([[230, 520], [360, 520], [340, 520], [475, 360], [490, 372], [370, 525]]));
      a.f(poly([[300, 380], [460, 380], [460, 395], [380, 520], [360, 515], [440, 395], [310, 395]]));
      a.f(poly([[490, 372], [570, 520], [555, 527], [470, 380]]));
      a.f(ellipse(300, 355, 55, 18));
      a.f(rect(460, 320, 22, 60, 8));
      a.f(rect(430, 300, 90, 24, 12));
      a.f(circle(370, 520, 26));
    },
  },
  {
    name: 'hot-air-balloon', title: 'Hot Air Balloon', tags: ['balloon', 'sky'], anim: 'float',
    draw(a) {
      sky(a);
      a.f('M400 90C560 90 640 210 610 340C590 420 480 470 460 530H340C320 470 210 420 190 340C160 210 240 90 400 90Z');
      a.f('M400 90C460 90 500 210 490 340C480 420 450 470 440 530H360C350 470 320 420 310 340C300 210 340 90 400 90Z');
      a.f('M190 330Q400 380 610 330Q605 350 600 365Q400 410 200 365Z');
      a.l('M345 530L355 600M455 530L445 600', 4);
      a.f(rect(330, 600, 140, 90, 14));
      a.f(rect(320, 590, 160, 24, 10));
      a.l('M330 640H470M360 614V690M400 614V690M440 614V690', 3);
    },
  },
  {
    name: 'submarine', title: 'Yellow Submarine', tags: ['submarine', 'sea', 'boat'], anim: 'swim',
    draw(a) {
      frame(a);
      sand(a, 690);
      seaweed(a, 90, 720, 200);
      seaweed(a, 720, 720, 180, -1);
      bubbles(a, [[150, 260, 22], [120, 200, 14], [170, 150, 10]]);
      a.f(rect(300, 220, 26, 100));
      a.f(rect(300, 200, 80, 26, 10));
      a.f(rect(330, 250, 160, 110, 30));
      a.f('M130 450Q130 330 260 330H560Q680 330 680 450Q680 570 560 570H260Q130 570 130 450Z');
      a.f(poly([[660, 400], [740, 340], [740, 560], [660, 500]]));
      for (const x of [260, 390, 520]) {
        a.f(circle(x, 450, 50));
        a.f(circle(x, 450, 36));
      }
    },
  },
  {
    name: 'scooter', title: 'Zoomy Scooter', tags: ['scooter', 'ride'], anim: 'wiggle',
    draw(a) {
      road(a);
      a.f(rect(200, 520, 380, 34, 17));
      a.f(poly([[540, 530], [580, 280], [605, 285], [575, 540]]));
      a.f(rect(540, 260, 120, 26, 13));
      a.f(rect(640, 252, 50, 40, 16));
      a.f(rect(510, 252, 50, 40, 16));
      wheel(a, 240, 590, 48);
      wheel(a, 570, 590, 48);
      a.f(star(380, 537, 14, 6));
    },
  },
  {
    name: 'race-car', title: 'Race Car', tags: ['car', 'race', 'fast'], anim: 'wiggle',
    draw(a) {
      road(a);
      a.f(poly([[110, 420], [180, 420], [190, 360], [110, 360]]));
      a.f('M110 560V470L330 440L380 370H470L520 440L700 480Q720 500 700 560Z');
      a.f('M395 385H460L495 440H360Z');
      a.f(circle(270, 500, 40));
      a.f(circle(270, 500, 26));
      a.l('M590 480L630 500M560 490L600 510', 5);
      wheel(a, 220, 575, 52);
      wheel(a, 590, 575, 52);
      a.f(rect(150, 600, 10, 6, 3));
    },
  },
  {
    name: 'excavator', title: 'Busy Digger', tags: ['digger', 'construction', 'truck'], anim: 'wiggle',
    draw(a) {
      road(a);
      a.f(rect(110, 540, 420, 80, 40));
      for (const x of [160, 250, 340, 430, 480]) a.f(circle(x, 580, 26));
      a.f(rect(130, 480, 380, 60, 10));
      a.f(rect(330, 300, 170, 180, 16));
      a.f(rect(355, 325, 120, 90, 10));
      a.f(rect(160, 400, 170, 80, 10));
      a.f(poly([[480, 360], [650, 220], [675, 250], [505, 400]]));
      a.f(poly([[650, 220], [700, 420], [670, 425], [630, 250]]));
      a.f('M640 420H740L720 500Q690 520 650 500Z');
    },
  },
];
