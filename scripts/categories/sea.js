import { circle, ellipse, rect, poly, star, scallop, smooth, petal, arcPath, band, softStar, regular, polar } from '../lib/shapes.js';
import { frame, sand, bubbles, seaweed, eyes, smile, cheeks, sea, sun, cloud } from '../lib/parts.js';

function underwater(a, opts = {}) {
  frame(a);
  sand(a, opts.sand ?? 700);
  seaweed(a, 80, 730, 260, 1);
  seaweed(a, 720, 730, 200, -1);
  bubbles(a, opts.bubbles ?? [[640, 120, 22], [680, 200, 14], [130, 150, 18], [160, 90, 11]]);
}

// Fish facing left, centered at (x, y).
export function fish(a, x = 400, y = 400, s = 1, o = {}) {
  const rx = 150 * s, ry = (o.tall ? 120 : 95) * s;
  a.anim('wiggle', () => a.f(poly([[x + rx * 0.8, y], [x + rx * 1.55, y - ry * 0.95], [x + rx * 1.4, y], [x + rx * 1.55, y + ry * 0.95]])));
  a.f(`M${x - rx * 0.1} ${y - ry * 0.9}Q${x + rx * 0.2} ${y - ry * 1.6} ${x + rx * 0.6} ${y - ry * 0.75}Z`);
  a.f(ellipse(x, y, rx, ry));
  if (o.bands) {
    for (const [b1, b2] of o.bands) a.f(band(x, y, rx, ry, x + b1 * rx, x + b2 * rx, { vertical: true }));
  } else if (o.scales !== false) {
    for (let i = 0; i < 3; i++)
      for (let j = -1; j <= 1; j++) a.l(arcPath(x + rx * (0.05 + i * 0.25), y + j * ry * 0.42, 22 * s, 18 * s, 100, 260), 3);
  }
  a.f(petal(x + rx * 0.05, y + ry * 0.35, 70 * s, 22 * s, 130));
  a.anim('blink', () => {
    a.f(circle(x - rx * 0.55, y - ry * 0.2, 24 * s));
    a.k(circle(x - rx * 0.58, y - ry * 0.18, 12 * s));
  });
  a.l(arcPath(x - rx * 0.78, y + ry * 0.2, 18 * s, 14 * s, 100, 250), 4);
}

export default [
  {
    name: 'happy-fish', title: 'Happy Fish', tags: ['fish', 'ocean'], anim: 'swim',
    draw(a) {
      underwater(a);
      fish(a, 360, 380, 1.3);
    },
  },
  {
    name: 'clownfish', title: 'Striped Clownfish', tags: ['fish', 'clownfish', 'reef'], anim: 'swim',
    draw(a) {
      underwater(a);
      for (const [x, h] of [[560, 120], [610, 150], [660, 110]]) a.anim('sway', () => a.f(rect(x - 16, 700 - h, 32, h + 10, 16)));
      fish(a, 330, 380, 1.2, { bands: [[-0.55, -0.3], [0.05, 0.3], [0.6, 0.8]] });
    },
  },
  {
    name: 'angelfish', title: 'Angelfish', tags: ['fish', 'tropical'], anim: 'swim',
    draw(a) {
      underwater(a);
      a.f(petal(400, 300, 170, 38, -70));
      a.f(petal(400, 500, 170, 38, 70));
      a.f(poly([[520, 400], [640, 310], [620, 400], [640, 490]]));
      a.f(smooth([[220, 400], [330, 250], [450, 300], [540, 400], [450, 500], [330, 550]], true, 1));
      a.f(band(380, 400, 170, 160, 330, 370, { vertical: true }));
      a.f(band(380, 400, 170, 160, 430, 470, { vertical: true }));
      eyes(a, 280, 380, 0, 22, { white: true });
      a.l(arcPath(240, 420, 16, 12, 100, 250), 4);
    },
  },
  {
    name: 'whale', title: 'Big Blue Whale', tags: ['whale', 'ocean'], anim: 'float',
    draw(a) {
      frame(a);
      sea(a, 470, 12, 4);
      a.anim('pulse', () => {
        a.f('M300 230C280 170 240 150 220 180C250 170 270 190 290 230Z');
        a.f('M300 230C320 170 360 150 380 180C350 170 330 190 310 230Z');
        a.f(ellipse(300, 260, 30, 40));
      });
      a.f('M600 380C640 330 700 300 740 310C720 340 700 360 690 380C710 400 730 430 740 460C700 460 650 430 620 410Z');
      a.f('M120 420C120 320 220 280 330 280C480 280 620 340 640 400C620 520 480 560 330 560C200 560 120 510 120 420Z');
      a.f('M140 470C220 520 450 540 600 450C560 530 450 560 330 560C220 560 160 520 140 470Z');
      for (const x of [220, 280, 340, 400, 460, 520]) a.l(`M${x} ${500 + (x === 220 ? -4 : 0)}v30`, 3);
      eyes(a, 220, 400, 0, 18);
      smile(a, 220, 440, 40, 0.4);
      cheeks(a, 200, 455, 80, 12);
      cloud(a, 600, 140, 100, 45);
    },
  },
  {
    name: 'octopus', title: 'Friendly Octopus', tags: ['octopus', 'ocean'], anim: 'wiggle',
    draw(a) {
      underwater(a);
      a.anim('wiggle', () => {
        for (const dx of [-160, -115, -70, -25, 25, 70, 115, 160]) a.f(petal(400 + dx * 0.9, 420, 250 - Math.abs(dx) * 0.4, 30, 90 + dx * 0.28, 0.7));
      });
      a.f(ellipse(400, 330, 200, 180));
      for (const [x, y, r] of [[330, 220, 22], [470, 230, 16], [520, 300, 12], [280, 280, 12]]) a.f(circle(x, y, r));
      eyes(a, 400, 360, 60, 26);
      smile(a, 400, 425, 34);
      cheeks(a, 400, 420, 105, 16);
    },
  },
  {
    name: 'crab', title: 'Crab on the Beach', tags: ['crab', 'beach'], anim: 'wiggle',
    draw(a) {
      frame(a);
      sun(a, 660, 130, 50);
      sea(a, 330, 10, 5);
      sand(a, 520);
      for (const s of [-1, 1]) {
        const X = (x) => 400 + s * x;
        for (const i of [0, 1, 2]) a.f(`M${X(150)} ${560 + i * 30}L${X(240 + i * 10)} ${600 + i * 40}L${X(225 + i * 10)} ${620 + i * 40}L${X(140)} ${590 + i * 30}Z`);
        a.f(`M${X(140)} 480C${X(200)} 440 ${X(220)} 400 ${X(210)} 360L${X(185)} 360C${X(185)} 400 ${X(170)} 430 ${X(130)} 450Z`);
        a.anim('wiggle', () => {
          a.f(`M${X(200)} 360C${X(140)} 330 ${X(140)} 240 ${X(200)} 230L${X(225)} 280L${X(250)} 230C${X(300)} 250 ${X(290)} 330 ${X(220)} 360Z`);
        });
        a.f(rect(X(55) - 10, 360, 20, 80, 8));
        a.anim('blink', () => {
          a.f(circle(X(55), 355, 30));
          a.k(circle(X(55), 360, 14));
        });
      }
      a.f(ellipse(400, 540, 170, 110));
      smile(a, 400, 560, 40);
      cheeks(a, 400, 540, 100, 16);
    },
  },
  {
    name: 'jellyfish', title: 'Glowing Jellyfish', tags: ['jellyfish', 'ocean'], anim: 'float',
    draw(a) {
      underwater(a);
      a.anim('sway', () => {
        for (const x of [290, 350, 410, 470, 530]) {
          const pts = [];
          for (let i = 0; i <= 6; i++) pts.push([x + Math.sin(i * 1.1) * 18 - 12, 410 + i * 45]);
          const back = pts.map(([px, py]) => [px + 24, py]).reverse();
          a.f(smooth([...pts, ...back], true, 0.8));
        }
      });
      a.f(scallop(400, 410, 175, 30, 12, 0.6));
      a.f('M220 410C220 240 300 170 400 170C500 170 580 240 580 410Z');
      for (const [x, y, r] of [[310, 280, 18], [480, 260, 14], [520, 340, 10]]) a.f(circle(x, y, r));
      eyes(a, 400, 320, 50, 20);
      smile(a, 400, 370, 26);
      cheeks(a, 400, 362, 90, 13);
    },
  },
  {
    name: 'starfish', title: 'Smiling Starfish', tags: ['starfish', 'beach', 'star'], anim: 'spin',
    draw(a) {
      underwater(a, { sand: 640 });
      a.f(softStar(400, 400, 270, 115, 5, -90));
      for (let i = 0; i < 5; i++) {
        for (const r of [130, 185]) {
          const [x, y] = polar(400, 405, r, -90 + i * 72);
          a.f(circle(x, y, r === 130 ? 16 : 11));
        }
      }
      eyes(a, 400, 390, 36, 18);
      smile(a, 400, 440, 28);
      a.f(scallop(150, 730, 50, 30, 7));
    },
  },
  {
    name: 'seahorse', title: 'Little Seahorse', tags: ['seahorse', 'ocean'], anim: 'float',
    draw(a) {
      underwater(a);
      a.anim('wiggle', () => a.f(petal(500, 420, 90, 34, 10)));
      a.f(smooth([[360, 180], [450, 160], [500, 220], [490, 300], [520, 380], [510, 480], [450, 560], [430, 630], [480, 680], [440, 720], [380, 680], [380, 600], [400, 520], [360, 440], [380, 340], [340, 300], [300, 300], [260, 270], [270, 230]], true, 0.9));
      a.f(smooth([[300, 300], [230, 285], [220, 255], [280, 240]], true, 0.6));
      for (let i = 0; i < 6; i++) a.l(arcPath(450, 330 + i * 45, 40, 14, 180, 360), 3);
      a.f(poly([[400, 165], [420, 120], [440, 170]]));
      a.f(poly([[450, 175], [490, 140], [480, 195]]));
      eyes(a, 380, 230, 0, 20);
    },
  },
  {
    name: 'sea-turtle', title: 'Sea Turtle', tags: ['turtle', 'ocean'], anim: 'swim',
    draw(a) {
      underwater(a);
      a.anim('wiggle', () => {
        a.f(petal(310, 330, 170, 50, 225));
        a.f(petal(310, 470, 150, 45, 135));
        a.f(petal(500, 330, 120, 35, -45));
        a.f(petal(500, 470, 110, 35, 45));
      });
      a.f(poly([[560, 400], [640, 380], [630, 420]]));
      a.f(ellipse(230, 390, 75, 60));
      eyes(a, 210, 375, 0, 16);
      smile(a, 200, 410, 20);
      a.f(ellipse(420, 400, 170, 120));
      a.f(regular(420, 400, 55, 6, 0));
      for (let i = 0; i < 6; i++) {
        const [x, y] = polar(420, 400, 105, i * 60 + 30);
        a.f(regular(x, y, 40, 6, 0));
      }
    },
  },
  {
    name: 'friendly-shark', title: 'Friendly Shark', tags: ['shark', 'ocean'], anim: 'swim',
    draw(a) {
      underwater(a);
      a.f(poly([[600, 380], [720, 260], [690, 390], [730, 480]]));
      a.f('M390 300L450 170L520 310Z');
      a.f('M140 400C200 300 380 280 520 310C590 330 630 370 640 400C600 460 480 500 360 500C240 500 170 460 140 400Z');
      a.f('M150 420C250 450 450 470 610 430C560 480 460 500 360 500C250 500 180 470 150 420Z');
      a.f(petal(380, 480, 110, 32, 110));
      for (const x of [430, 455, 480]) a.l(`M${x} 360q-6 20 0 40`, 4);
      eyes(a, 240, 370, 0, 18);
      a.l('M170 430Q230 470 300 440', 5);
      for (let i = 0; i < 4; i++) a.f(`M${195 + i * 25} ${445 + i * 4}l10 14l10 -12z`);
    },
  },
  {
    name: 'pufferfish', title: 'Puffy Pufferfish', tags: ['pufferfish', 'fish'], anim: 'float',
    draw(a) {
      underwater(a);
      a.f(poly([[560, 400], [660, 330], [640, 400], [660, 470]]));
      a.f(star(400, 400, 215, 175, 22));
      a.f(circle(400, 400, 175));
      a.f(band(400, 400, 175, 175, 450, 700));
      eyes(a, 360, 360, 55, 26);
      a.f(ellipse(290, 440, 20, 16));
      a.f(petal(420, 430, 70, 24, 60));
    },
  },
  {
    name: 'seashells', title: 'Seashell Collection', tags: ['shell', 'beach'], anim: 'float',
    draw(a) {
      frame(a);
      sea(a, 220, 10, 5);
      sand(a, 330);
      for (let i = 0; i < 7; i++) {
        const a1 = 200 + i * 20;
        a.f(wedgeShell(230, 600, 200, a1, a1 + 20));
      }
      a.f(rect(195, 600, 70, 30, 10));
      a.f(smooth([[480, 640], [460, 540], [520, 440], [600, 400], [660, 460], [670, 560], [620, 640]], true, 0.8));
      a.l('M600 520C560 500 560 460 600 460C640 460 640 520 600 540C540 560 520 480 560 440', 4);
      a.f(scallop(590, 710, 60, 26, 8));
      a.f(softStar(140, 720, 50, 22));
    },
  },
];

function wedgeShell(cx, cy, r, a1, a2) {
  const p1 = polar(cx, cy, r, a1), p2 = polar(cx, cy, r, a2);
  const m = polar(cx, cy, r * 1.08, (a1 + a2) / 2);
  return `M${cx} ${cy}L${p1[0].toFixed(1)} ${p1[1].toFixed(1)}Q${m[0].toFixed(1)} ${m[1].toFixed(1)} ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}Z`;
}
