// Original, full-color emoji-style stickers (stamps) drawn with the same primitives.
import { circle, ellipse, rect, poly, star, heart, petal, scallop, leaf, polar, annular, softStar, smooth, regular, wedge, band } from './shapes.js';

const O = '#3a2a1a';
const P = (d, fill, extra = '') => `<path d="${d}" fill="${fill}"${extra}/>`;
const L = (d, w = 6) => `<path d="${d}" fill="none" stroke="${O}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;
const dot = (x, y, r, c = O) => P(circle(x, y, r), c, ' stroke="none"');
const happy = (x = 200, y = 200, s = 1) =>
  dot(x - 40 * s, y - 15 * s, 13 * s) + dot(x + 40 * s, y - 15 * s, 13 * s) + dot(x - 36 * s, y - 20 * s, 4 * s, '#fff') + dot(x + 44 * s, y - 20 * s, 4 * s, '#fff') +
  L(`M${x - 35 * s} ${y + 25 * s}Q${x} ${y + 60 * s} ${x + 35 * s} ${y + 25 * s}`, 7 * s) +
  P(ellipse(x - 72 * s, y + 18 * s, 16 * s, 10 * s), '#ff8fab', ' stroke="none"') + P(ellipse(x + 72 * s, y + 18 * s, 16 * s, 10 * s), '#ff8fab', ' stroke="none"');

const animalFace = (color, ears, extra = '') => ears + P(circle(200, 210, 130), color) + happy(200, 210) + extra;

export const STICKERS = [
  { name: 'star', title: 'Gold Star', body: () => P(softStar(200, 210, 170, 80), '#ffd43b') + happy(200, 215, 0.8) },
  { name: 'heart', title: 'Heart', body: () => P(heart(200, 210, 150), '#ff4d6d') + P(ellipse(130, 140, 24, 14, -40), '#ffc2d1', ' stroke="none"') },
  { name: 'smile', title: 'Smiley', body: () => P(circle(200, 200, 170), '#ffd43b') + happy(200, 200, 1.4) },
  { name: 'laugh', title: 'Laughing Face', body: () => P(circle(200, 200, 170), '#ffc078') + L('M120 160q25 -25 50 0M230 160q25 -25 50 0', 9) + P('M110 220Q200 330 290 220Z', '#e8590c') + P('M140 255Q200 300 260 255Q200 280 140 255Z', '#ff8787', ' stroke="none"') },
  { name: 'cool', title: 'Cool Face', body: () => P(circle(200, 200, 170), '#ffd43b') + P('M70 150H330L310 210Q260 230 220 200H180Q140 230 90 210Z', '#222') + L('M140 270Q200 300 260 260', 9) },
  { name: 'love-eyes', title: 'Love Eyes', body: () => P(circle(200, 200, 170), '#ffd43b') + P(heart(140, 170, 40), '#ff4d6d') + P(heart(260, 170, 40), '#ff4d6d') + L('M140 250Q200 300 260 250', 9) },
  { name: 'sun', title: 'Sunshine', body: () => P(star(200, 200, 185, 135, 14), '#ff922b') + P(circle(200, 200, 125), '#ffd43b') + happy(200, 205, 0.9) },
  { name: 'moon', title: 'Moon', body: () => P('M250 40C130 50 60 150 70 240C80 340 190 390 290 350C190 340 140 260 150 180C160 110 200 70 250 40Z', '#ffe066') + dot(140, 200, 10) + L('M120 260q20 20 45 5', 7) },
  { name: 'cloud', title: 'Cloud', body: () => P(scallop(200, 220, 160, 90, 9, 0.62, 10), '#e7f5ff') + happy(200, 225, 0.8) },
  { name: 'rainbow', title: 'Rainbow', body: () => ['#ff6b6b', '#ffa94d', '#ffe066', '#69db7c', '#4dabf7', '#9775fa'].map((c, i) => P(annular(200, 280, 70 + i * 20, 90 + i * 20, 180, 360), c)).join('') + P(scallop(80, 285, 55, 30, 7), '#fff') + P(scallop(320, 285, 55, 30, 7), '#fff') },
  { name: 'flower', title: 'Flower', body: () => [0, 1, 2, 3, 4, 5].map((i) => P(circle(...polar(200, 200, 100, i * 60), 70), '#f783ac')).join('') + P(circle(200, 200, 70), '#ffd43b') + happy(200, 205, 0.55) },
  { name: 'tulip', title: 'Tulip', body: () => L('M200 250V380', 14) + P(leaf(200, 360, 110, 22, -50), '#51cf66') + P('M120 100Q110 260 200 260Q290 260 280 100L240 150L200 80L160 150Z', '#ff6b6b') },
  { name: 'butterfly', title: 'Butterfly', body: () => P('M195 180C150 40 30 50 40 150C50 220 150 220 195 200Z', '#74c0fc') + P('M205 180C250 40 370 50 360 150C350 220 250 220 205 200Z', '#74c0fc') + P('M195 210C130 220 70 300 120 340C160 360 190 290 195 230Z', '#b197fc') + P('M205 210C270 220 330 300 280 340C240 360 210 290 205 230Z', '#b197fc') + P(ellipse(200, 210, 18, 110), '#5c3d2e') + L('M190 110Q170 60 140 50M210 110Q230 60 260 50', 6) },
  { name: 'ladybug', title: 'Ladybug', body: () => P(circle(200, 100, 60), '#222') + P(circle(200, 230, 150), '#fa5252') + L('M200 90V380', 8) + [[140, 190], [260, 190], [130, 280], [270, 280], [200, 330]].map(([x, y]) => dot(x, y, 24, '#222')).join('') + dot(180, 90, 9, '#fff') + dot(220, 90, 9, '#fff') },
  { name: 'bee', title: 'Bee', body: () => P(ellipse(150, 110, 60, 80, -30), '#d0ebff') + P(ellipse(250, 110, 60, 80, 30), '#d0ebff') + P(ellipse(200, 230, 150, 120), '#ffd43b') + P(band(200, 230, 150, 120, 165, 200, { vertical: true }), '#222') + P(band(200, 230, 150, 120, 240, 275, { vertical: true }), '#222') + happy(110, 230, 0.6) },
  { name: 'fish', title: 'Fish', body: () => P(poly([[270, 200], [380, 110], [360, 200], [380, 290]]), '#ffa94d') + P(ellipse(190, 200, 150, 110), '#ff922b') + dot(110, 180, 18) + dot(115, 174, 6, '#fff') + L('M70 220q20 14 40 4', 7) + L('M200 130q30 70 0 140', 7) },
  { name: 'cat', title: 'Kitty', body: () => animalFace('#ffa94d', P(poly([[80, 160], [90, 30], [190, 100]]), '#ffa94d') + P(poly([[320, 160], [310, 30], [210, 100]]), '#ffa94d'), P('M185 235h30l-15 18z', '#ff6b9a') + L('M110 240l-80 -10M110 255l-80 15M290 240l80 -10M290 255l80 15', 5)) },
  { name: 'dog', title: 'Puppy', body: () => animalFace('#e9c46a', '', P(ellipse(75, 210, 45, 100, 15), '#8d6e63') + P(ellipse(325, 210, 45, 100, -15), '#8d6e63') + P(ellipse(200, 250, 30, 20), '#222')) },
  { name: 'bunny', title: 'Bunny', body: () => animalFace('#f1f3f5', P(ellipse(140, 80, 40, 100, -10), '#f1f3f5') + P(ellipse(260, 80, 40, 100, 10), '#f1f3f5') + P(ellipse(140, 90, 18, 70, -10), '#ffc9d9') + P(ellipse(260, 90, 18, 70, 10), '#ffc9d9'), P(ellipse(200, 235, 16, 11), '#ff6b9a')) },
  { name: 'bear', title: 'Bear', body: () => animalFace('#a0522d', P(circle(90, 90, 55), '#a0522d') + P(circle(310, 90, 55), '#a0522d') + P(circle(90, 90, 28), '#e6b98a') + P(circle(310, 90, 28), '#e6b98a'), P(ellipse(200, 255, 55, 40), '#e6b98a') + P(ellipse(200, 238, 20, 14), '#222')) },
  { name: 'pig', title: 'Piggy', body: () => animalFace('#ffb3c6', P(poly([[80, 130], [80, 40], [170, 90]]), '#ff8fab') + P(poly([[320, 130], [320, 40], [230, 90]]), '#ff8fab'), P(ellipse(200, 250, 50, 36), '#ff8fab') + dot(183, 250, 9) + dot(217, 250, 9)) },
  { name: 'frog', title: 'Froggy', body: () => P(circle(120, 90, 55), '#69db7c') + P(circle(280, 90, 55), '#69db7c') + P(ellipse(200, 220, 170, 130), '#69db7c') + P(circle(120, 90, 30), '#fff') + P(circle(280, 90, 30), '#fff') + dot(125, 95, 15) + dot(285, 95, 15) + L('M100 230Q200 320 300 230', 9) },
  { name: 'balloon', title: 'Balloon', body: () => P(ellipse(200, 160, 120, 145), '#4dabf7') + P(poly([[180, 315], [220, 315], [200, 295]]), '#4dabf7') + L('M200 315C170 350 230 370 200 395', 5) + P(ellipse(150, 110, 20, 34, 20), '#d0ebff', ' stroke="none"') },
  { name: 'gift', title: 'Gift', body: () => P(rect(70, 160, 260, 210, 12), '#cc5de8') + P(rect(50, 120, 300, 60, 12), '#da77f2') + P(rect(180, 120, 40, 250), '#ffd43b') + P(petal(200, 120, 100, 34, -150), '#ffd43b') + P(petal(200, 120, 100, 34, -30), '#ffd43b') },
  { name: 'cupcake', title: 'Cupcake', body: () => P('M90 220L120 370H280L310 220Z', '#74c0fc') + P(scallop(200, 200, 130, 60, 10), '#ffc9de') + P(scallop(200, 140, 90, 50, 8), '#ffc9de') + P(circle(200, 80, 26), '#fa5252') + happy(200, 290, 0.5) },
  { name: 'ice-cream', title: 'Ice Cream', body: () => P(poly([[130, 200], [270, 200], [200, 390]]), '#e9c46a') + P(circle(200, 160, 95), '#ffc9de') + P(circle(200, 70, 30), '#fa5252') + happy(200, 165, 0.6) },
  { name: 'donut', title: 'Donut', body: () => P(circle(200, 200, 170) + circle(200, 200, 60), '#e9c46a', ' fill-rule="evenodd"') + P(scallop(200, 200, 145, 145, 14, 0.6) + circle(200, 200, 75), '#ff8fab', ' fill-rule="evenodd"') + [0, 1, 2, 3, 4, 5, 6, 7].map((i) => { const [x, y] = polar(200, 200, 112, i * 45 + 10); return P(rect(x - 12, y - 4, 24, 8, 4), ['#fff', '#4dabf7', '#ffd43b'][i % 3], ` transform="rotate(${i * 50} ${x.toFixed(1)} ${y.toFixed(1)})" stroke="none"`); }).join('') },
  { name: 'apple', title: 'Apple', body: () => P('M200 110C150 70 40 80 40 220C40 330 130 390 180 380C190 378 210 378 220 380C270 390 360 330 360 220C360 80 250 70 200 110Z', '#fa5252') + P(rect(190, 40, 20, 80, 8), '#8d6e63') + P(leaf(208, 70, 90, 20, -25), '#51cf66') },
  { name: 'strawberry', title: 'Strawberry', body: () => P('M200 380C110 330 50 230 70 150C85 90 150 80 200 100C250 80 315 90 330 150C350 230 290 330 200 380Z', '#fa5252') + P(star(200, 100, 90, 40, 6), '#51cf66') + [[140, 170], [260, 170], [200, 220], [150, 270], [250, 270], [200, 320]].map(([x, y]) => P(ellipse(x, y, 6, 10), '#ffe066', ' stroke="none"')).join('') },
  { name: 'rocket', title: 'Rocket', body: () => P('M150 270L100 350L160 340Z', '#fa5252') + P('M250 270L300 350L240 340Z', '#fa5252') + P('M200 30C280 90 285 230 255 340H145C115 230 120 90 200 30Z', '#f1f3f5') + P(circle(200, 170, 40), '#4dabf7') + P('M160 345Q200 420 240 345Z', '#ffa94d') },
  { name: 'crown', title: 'Crown', body: () => P('M70 300L50 110L140 200L200 80L260 200L350 110L330 300Z', '#ffd43b') + P(rect(65, 290, 270, 60, 14), '#fab005') + [[50, 110], [200, 80], [350, 110]].map(([x, y]) => P(circle(x, y, 20), '#e64980')).join('') + P(regular(200, 320, 20, 4, 0), '#4dabf7') },
  { name: 'diamond', title: 'Gem', body: () => P(poly([[100, 140], [300, 140], [360, 190], [200, 370], [40, 190]]), '#66d9e8') + P(poly([[100, 140], [300, 140], [250, 190], [150, 190]]), '#c5f6fa') + L('M40 190H360M150 190L200 370L250 190', 5) },
  { name: 'music', title: 'Music Note', body: () => P(ellipse(120, 300, 60, 45, -20), '#7950f2') + P(ellipse(290, 260, 60, 45, -20), '#7950f2') + P(rect(160, 80, 22, 220), '#7950f2') + P(rect(330, 40, 22, 220), '#7950f2') + P('M160 80L352 40V100L160 140Z', '#7950f2') },
  { name: 'lightning', title: 'Lightning', body: () => P(poly([[230, 20], [90, 220], [190, 220], [150, 380], [310, 160], [210, 160]]), '#ffd43b') },
  { name: 'snowflake', title: 'Snowflake', body: () => [0, 1, 2, 3, 4, 5].map((i) => `<g transform="rotate(${i * 60} 200 200)">${L('M200 200V40M200 90l-35 -30M200 90l35 -30M200 140l-25 -20M200 140l25 -20', 14).replace(O, '#74c0fc')}</g>`).join('') + P(circle(200, 200, 26), '#d0ebff') },
  { name: 'sparkle', title: 'Sparkle', body: () => P('M200 30Q215 185 370 200Q215 215 200 370Q185 215 30 200Q185 185 200 30Z', '#ffd43b') + P('M320 40Q326 74 360 80Q326 86 320 120Q314 86 280 80Q314 74 320 40Z', '#ffe066') },
  { name: 'paw', title: 'Paw Print', body: () => P(ellipse(200, 260, 100, 85), '#ff8787') + [[90, 160], [160, 100], [240, 100], [310, 160]].map(([x, y]) => P(ellipse(x, y, 40, 50), '#ff8787')).join('') },
  { name: 'unicorn', title: 'Unicorn', body: () => P(poly([[200, 20], [175, 130], [225, 130]]), '#ffd43b') + P(ellipse(200, 230, 130, 140), '#fff0f6') + P(ellipse(200, 300, 80, 55), '#ffc9de') + P(petal(110, 120, 110, 30, 150), '#b197fc') + P(petal(290, 120, 110, 30, 30), '#74c0fc') + dot(160, 220, 13) + dot(240, 220, 13) + dot(180, 300, 8) + dot(220, 300, 8) },
  { name: 'car', title: 'Red Car', body: () => P('M40 300V230Q40 210 60 205L120 195L170 130H260L310 195L350 210Q370 220 370 240V300Z', '#fa5252') + P('M140 195L180 150H215V195Z', '#d0ebff') + P('M230 195V150H255L290 195Z', '#d0ebff') + P(circle(110, 305, 40), '#343a40') + P(circle(300, 305, 40), '#343a40') + dot(110, 305, 15, '#adb5bd') + dot(300, 305, 15, '#adb5bd') },
  { name: 'trophy', title: 'Trophy', body: () => P('M120 60H280V150Q280 240 200 250Q120 240 120 150Z', '#fab005') + L('M120 90H70Q60 170 130 190M280 90H330Q340 170 270 190', 14).replace(O, '#fab005') + P(rect(180, 250, 40, 60), '#fab005') + P(rect(120, 310, 160, 50, 10), '#8d6e63') + P(star(200, 140, 40, 18), '#fff3bf') },
];

export function stickerSVG(s) {
  // A white outline behind the colored art makes stickers pop on any color.
  const art = s.body();
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400"><title>${s.title}</title>` +
    `<g stroke="${O}" stroke-width="7" stroke-linejoin="round" stroke-linecap="round">${art}</g></svg>`
  );
}
