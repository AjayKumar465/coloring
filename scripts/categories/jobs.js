import { circle, ellipse, rect, poly, smooth, petal, scallop, arcPath, star, heart, leaf, polar, regular } from '../lib/shapes.js';
import { frame, ground, sun, cloud, eyes, smile, cheeks, person, wheel } from '../lib/parts.js';

function town(a) {
  frame(a);
  sun(a, 660, 110, 40);
  cloud(a, 150, 110, 75, 34);
  a.f('M16 690H784V748A36 36 0 0 1 748 784H52A36 36 0 0 1 16 748Z');
}

function road(a) {
  frame(a);
  sun(a, 660, 120, 45);
  cloud(a, 170, 120, 90, 40);
  a.f('M16 620H784V720H16Z');
  for (let x = 40; x < 780; x += 110) a.f(rect(x, 665, 60, 12, 6));
  a.f('M16 720H784V748A36 36 0 0 1 748 784H52A36 36 0 0 1 16 748Z');
}

const helper = (name, title, tags, o) => ({
  name, title, tags: [...tags, 'helper', 'job'], anim: 'wiggle',
  draw(a) {
    town(a);
    person(a, o(a));
  },
});

export default [
  helper('firefighter', 'Brave Firefighter', ['firefighter', 'fire'], (a) => ({
    coat: true, belt: true,
    hat: () => {
      a.f(ellipse(400, 185, 140, 34));
      a.f('M320 185Q320 100 400 100Q480 100 480 185Z');
      a.f(regular(400, 150, 26, 6));
    },
    prop: () => {
      a.l('M550 540Q650 600 680 450', 12);
      a.f(rect(660, 400, 40, 60, 8));
      a.anim('float', () => {
        for (const [x, y] of [[690, 360], [720, 320], [660, 330]]) a.f(circle(x, y, 14));
      });
    },
  })),
  helper('police-officer', 'Police Officer', ['police', 'officer'], (a) => ({
    badge: true, belt: true, pocket: true,
    hat: () => {
      a.f('M300 175Q400 90 500 175L490 200H310Z');
      a.f(rect(310, 185, 180, 28, 8));
      a.f(ellipse(400, 215, 100, 14));
      a.f(star(400, 160, 20, 9));
    },
  })),
  helper('doctor', 'Kind Doctor', ['doctor', 'hospital', 'health'], (a) => ({
    coat: true, pocket: true,
    hat: () => {
      a.f(circle(400, 175, 26));
      a.l('M330 200Q400 160 470 200', 5);
    },
    prop: () => {
      a.l('M370 360Q340 440 380 470Q410 490 430 460', 5);
      a.f(circle(430, 455, 16));
      a.f(rect(530, 520, 120, 90, 12));
      a.f(rect(570, 500, 40, 24, 6));
      a.f('M580 545h20v-15h20v15h20v20h-20v15h-20v-15h-20z');
    },
  })),
  helper('chef', 'Happy Chef', ['chef', 'cook', 'food'], (a) => ({
    coat: true,
    hat: () => {
      a.f(rect(330, 150, 140, 50, 6));
      a.f(scallop(400, 110, 90, 55, 9));
    },
    prop: () => {
      a.f('M520 520H680Q680 620 600 620Q520 620 520 520Z');
      a.f(rect(510, 505, 180, 20, 8));
      a.anim('float', () => {
        a.l('M560 490q-10 -20 0 -40t0 -40M600 490q-10 -20 0 -40t0 -40M640 490q-10 -20 0 -40t0 -40', 4);
      });
    },
  })),
  helper('builder', 'Busy Builder', ['builder', 'construction'], (a) => ({
    belt: true,
    hat: () => {
      a.f(ellipse(400, 190, 135, 26));
      a.f('M318 190Q318 95 400 95Q482 95 482 190Z');
      a.f(rect(390, 95, 20, 95));
    },
    prop: () => {
      a.f(rect(520, 470, 30, 130, 8));
      a.f(rect(490, 440, 120, 50, 8));
      a.f(rect(110, 600, 140, 80, 6));
      a.f(rect(130, 540, 100, 60, 6));
    },
  })),
  helper('farmer', 'Friendly Farmer', ['farmer', 'farm'], (a) => ({
    pocket: true,
    hat: () => {
      a.f(ellipse(400, 180, 170, 34));
      a.f('M320 180Q320 100 400 100Q480 100 480 180Z');
      a.f(rect(322, 155, 156, 22));
    },
    prop: () => {
      a.l('M560 690V300', 8);
      a.l('M520 300V230M560 300V220M600 300V230M520 300H600', 6);
    },
  })),
  helper('mail-carrier', 'Mail Carrier', ['mail', 'letter', 'post'], (a) => ({
    pocket: true,
    hat: () => {
      a.f('M310 180Q400 110 490 180Z');
      a.f(ellipse(440, 185, 80, 16));
    },
    prop: () => {
      a.l('M330 360L500 520', 8);
      a.f(rect(460, 480, 150, 110, 14));
      a.f(rect(570, 620, 140, 90, 6));
      a.l('M570 620L640 670L710 620', 4);
    },
  })),
  helper('teacher', 'Teacher', ['teacher', 'school', 'books'], (a) => ({
    glasses: true,
    hairBack: () => a.f(smooth([[300, 250], [320, 150], [400, 130], [480, 150], [500, 250], [520, 330], [400, 320], [280, 330]], true, 0.9)),
    prop: () => {
      a.f(rect(540, 220, 220, 160, 8));
      a.f(rect(552, 232, 196, 136, 4));
      a.l('M575 270h40M640 270h20M575 310h60M660 310h50', 4);
      a.f(rect(110, 560, 140, 40, 6));
      a.f(rect(120, 600, 130, 40, 6));
    },
  })),
  helper('pilot', 'Airplane Pilot', ['pilot', 'airplane'], (a) => ({
    coat: true, badge: true,
    hat: () => {
      a.f('M300 185Q400 100 500 185Z');
      a.f(rect(310, 180, 180, 24, 8));
      a.f(ellipse(400, 210, 100, 14));
      a.f(petal(400, 150, 40, 10, 0));
      a.f(petal(400, 150, 40, 10, 180));
    },
  })),
  helper('artist', 'Painter Artist', ['artist', 'painter', 'art'], (a) => ({
    hat: () => {
      a.f(ellipse(390, 160, 110, 40, -10));
      a.f(circle(390, 118, 10));
    },
    prop: () => {
      a.f('M520 440C520 380 640 360 690 410C730 450 700 520 650 510C610 500 620 550 580 550C540 550 520 500 520 440Z');
      for (const [x, y] of [[570, 420], [620, 400], [670, 430], [560, 480]]) a.f(circle(x, y, 13));
      a.f(rect(160, 380, 14, 200, 6));
      a.f(poly([[160, 380], [167, 340], [174, 380]]));
    },
  })),
  {
    name: 'fire-truck', title: 'Fire Truck', tags: ['fire', 'truck', 'firefighter'], anim: 'wiggle',
    draw(a) {
      road(a);
      a.f(rect(80, 380, 440, 220, 16));
      a.f('M520 320H640Q690 320 710 380L730 460V600H520Z');
      a.f('M545 345H630Q660 345 675 390L690 450H545Z');
      a.f(rect(110, 280, 380, 26, 8));
      for (let x = 130; x < 480; x += 50) a.l(`M${x} 280V306`, 4);
      a.l('M110 330H490', 4);
      a.f(rect(110, 420, 120, 140, 10));
      a.f(rect(250, 420, 120, 140, 10));
      a.f(circle(310, 490, 34));
      a.anim('twinkle', () => a.f(rect(580, 290, 50, 30, 10)));
      wheel(a, 190, 610, 58);
      wheel(a, 610, 610, 58);
    },
  },
  {
    name: 'ambulance', title: 'Ambulance', tags: ['ambulance', 'hospital', 'doctor'], anim: 'wiggle',
    draw(a) {
      road(a);
      a.f(rect(80, 340, 450, 260, 20));
      a.f('M530 380H630Q680 380 700 430L730 500V600H530Z');
      a.f('M555 405H620Q650 405 665 445L680 495H555Z');
      a.f('M260 410h50v-40h50v40h50v50h-50v40h-50v-40h-50z');
      a.f(rect(80, 520, 450, 30));
      a.anim('twinkle', () => a.f(rect(270, 300, 70, 40, 12)));
      wheel(a, 190, 610, 58);
      wheel(a, 610, 610, 58);
    },
  },
  {
    name: 'police-car', title: 'Police Car', tags: ['police', 'car'], anim: 'wiggle',
    draw(a) {
      road(a);
      a.f('M120 600V500Q120 470 160 465L250 450L320 370H500L580 450L660 465Q690 475 690 505V600Z');
      a.f('M270 450L330 395H400V450Z');
      a.f('M425 450V395H490L545 450Z');
      a.f(rect(120, 510, 570, 40));
      a.f(star(400, 530, 18, 8));
      a.anim('twinkle', () => {
        a.f(rect(360, 335, 40, 30, 8));
        a.f(rect(400, 335, 40, 30, 8));
      });
      wheel(a, 240, 610, 56);
      wheel(a, 570, 610, 56);
    },
  },
  {
    name: 'school-house', title: 'Our School', tags: ['school', 'teacher', 'building'], anim: 'float',
    draw(a) {
      town(a);
      a.f(rect(160, 330, 480, 360));
      a.f(poly([[130, 340], [400, 180], [670, 340]]));
      a.f(rect(370, 100, 60, 90));
      a.f(poly([[430, 100], [500, 120], [430, 140]]));
      a.f(circle(400, 270, 40));
      a.l('M400 270V245M400 270L420 280', 4);
      a.f('M350 690V560Q400 510 450 560V690Z');
      for (const x of [200, 520]) for (const y of [370, 500]) {
        a.f(rect(x, y, 80, 80, 6));
        a.l(`M${x + 40} ${y}V${y + 80}M${x} ${y + 40}H${x + 80}`, 3);
      }
      a.f(rect(330, 380, 140, 50, 6));
    },
  },
];
