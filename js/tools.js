// Palettes, pattern fills and the Magic Color palette generator.

export const PALETTE = [
  ['#ff4d4d', 'Red'], ['#ff8787', 'Pink red'], ['#ff922b', 'Orange'], ['#ffc078', 'Peach'],
  ['#ffd43b', 'Yellow'], ['#fff3a3', 'Lemon'], ['#94d82d', 'Lime'], ['#40c057', 'Green'],
  ['#20c997', 'Teal'], ['#66d9e8', 'Aqua'], ['#4dabf7', 'Sky blue'], ['#1c7ed6', 'Blue'],
  ['#364fc7', 'Navy'], ['#9775fa', 'Purple'], ['#d0bfff', 'Lavender'], ['#f783ac', 'Pink'],
  ['#ffc9de', 'Baby pink'], ['#a0522d', 'Brown'], ['#d9a066', 'Tan'], ['#ffe8cc', 'Cream'],
  ['#ffffff', 'White'], ['#adb5bd', 'Gray'], ['#495057', 'Dark gray'], ['#212529', 'Black'],
];

// Colorblind-friendly set (Okabe-Ito and Tol based), named so color is never the only cue.
export const PALETTE_CB = [
  ['#e69f00', 'Orange'], ['#f5c710', 'Gold'], ['#56b4e9', 'Sky'], ['#009e73', 'Green'],
  ['#f0e442', 'Yellow'], ['#0072b2', 'Blue'], ['#d55e00', 'Vermilion'], ['#cc79a7', 'Pink'],
  ['#332288', 'Indigo'], ['#88ccee', 'Cyan'], ['#44aa99', 'Teal'], ['#117733', 'Forest'],
  ['#999933', 'Olive'], ['#ddcc77', 'Sand'], ['#cc6677', 'Rose'], ['#882255', 'Wine'],
  ['#aa4499', 'Purple'], ['#bbbbbb', 'Gray'], ['#ffffff', 'White'], ['#000000', 'Black'],
  ['#ffd7a8', 'Peach'], ['#b8e0f6', 'Ice'], ['#a65628', 'Brown'], ['#7f7f7f', 'Stone'],
];

export const PATTERNS = [
  ['stripes', 'Stripes', '〰️'],
  ['dots', 'Polka dots', '⚪'],
  ['stars', 'Stars', '⭐'],
  ['hearts', 'Hearts', '💗'],
  ['checkers', 'Checkers', '🏁'],
  ['gradient', 'Gradient', '🌅'],
];

const NS = 'http://www.w3.org/2000/svg';

export function hexToHsl(hex) {
  let r = parseInt(hex.slice(1, 3), 16) / 255, g = parseInt(hex.slice(3, 5), 16) / 255, b = parseInt(hex.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let hh = 0, s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    hh = max === r ? (g - b) / d + (g < b ? 6 : 0) : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
    hh *= 60;
  }
  return [hh, s * 100, l * 100];
}

export function hslToHex(hh, s, l) {
  s /= 100; l /= 100;
  const k = (n) => (n + hh / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return '#' + [f(0), f(8), f(4)].map((x) => Math.round(x * 255).toString(16).padStart(2, '0')).join('');
}

export function shade(hex, dl) {
  const [hh, s, l] = hexToHsl(hex);
  return hslToHex(hh, s, Math.max(0, Math.min(100, l + dl)));
}

// A fill value is a plain color or "pat:<type>:<color>".
export function fillValue(pattern, color) {
  return pattern ? `pat:${pattern}:${color}` : color;
}

export function isFilled(v) {
  return !!v && v.toLowerCase() !== '#ffffff' && v.toLowerCase() !== '#fff';
}

// Ensure the <pattern>/<linearGradient> exists in the svg's defs and return the paint string.
export function paintFor(svg, value) {
  if (!value || !value.startsWith('pat:')) return value || '#ffffff';
  const [, type, color] = value.split(':');
  const id = `p-${type}-${color.slice(1)}`;
  if (!svg.getElementById(id)) {
    let defs = svg.querySelector('defs');
    if (!defs) { defs = document.createElementNS(NS, 'defs'); svg.prepend(defs); }
    defs.insertAdjacentHTML('beforeend', patternMarkup(id, type, color));
    // insertAdjacentHTML inside SVG parses in the SVG namespace in modern browsers.
  }
  return `url(#${id})`;
}

export function patternMarkup(id, type, color) {
  const light = shade(color, 22), dark = shade(color, -18);
  const accent = hexToHsl(color)[2] > 75 ? dark : light;
  const bg = `<rect width="40" height="40" fill="${color}"/>`;
  switch (type) {
    case 'stripes':
      return `<pattern id="${id}" width="40" height="40" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">${bg}<rect width="20" height="40" fill="${accent}"/></pattern>`;
    case 'dots':
      return `<pattern id="${id}" width="40" height="40" patternUnits="userSpaceOnUse">${bg}<circle cx="10" cy="10" r="7" fill="${accent}"/><circle cx="30" cy="30" r="7" fill="${accent}"/></pattern>`;
    case 'stars':
      return `<pattern id="${id}" width="48" height="48" patternUnits="userSpaceOnUse"><rect width="48" height="48" fill="${color}"/><path d="M12 2l3 7h7l-6 4.5 2.5 7.5L12 16l-6.5 5 2.5-7.5L2 9h7z" fill="${accent}"/><path d="M36 26l3 7h7l-6 4.5 2.5 7.5-6.5-5-6.5 5 2.5-7.5-6-4.5h7z" fill="${accent}"/></pattern>`;
    case 'hearts':
      return `<pattern id="${id}" width="48" height="48" patternUnits="userSpaceOnUse"><rect width="48" height="48" fill="${color}"/><path d="M12 20C4 14 2 8 7 5c3-2 5 0 5 2 0-2 2-4 5-2 5 3 3 9-5 15z" fill="${accent}"/><path d="M36 44c-8-6-10-12-5-15 3-2 5 0 5 2 0-2 2-4 5-2 5 3 3 9-5 15z" fill="${accent}"/></pattern>`;
    case 'checkers':
      return `<pattern id="${id}" width="40" height="40" patternUnits="userSpaceOnUse">${bg}<rect width="20" height="20" fill="${accent}"/><rect x="20" y="20" width="20" height="20" fill="${accent}"/></pattern>`;
    case 'gradient':
    default:
      return `<linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${shade(color, 25)}"/><stop offset="1" stop-color="${shade(color, -15)}"/></linearGradient>`;
  }
}

// Small CSS preview of a pattern for the options bar.
export function patternPreviewCSS(type, color) {
  const a = hexToHsl(color)[2] > 75 ? shade(color, -18) : shade(color, 22);
  switch (type) {
    case 'stripes': return `repeating-linear-gradient(45deg, ${color} 0 6px, ${a} 6px 12px)`;
    case 'dots': return `radial-gradient(${a} 30%, transparent 32%) 0 0/12px 12px, ${color}`;
    case 'stars': return `radial-gradient(${a} 22%, transparent 24%) 0 0/10px 10px, ${color}`;
    case 'hearts': return `radial-gradient(${a} 28%, transparent 30%) 3px 3px/12px 12px, ${color}`;
    case 'checkers': return `conic-gradient(${a} 25%, ${color} 0 50%, ${a} 0 75%, ${color} 0) 0 0/16px 16px`;
    default: return `linear-gradient(${shade(color, 25)}, ${shade(color, -15)})`;
  }
}

// Random harmonious palette for Magic Color.
export function magicPalette() {
  const base = Math.random() * 360;
  const schemes = [
    [0, 30, 60, 180, 210],
    [0, 120, 240, 60, 300],
    [0, 25, 50, 75, 100],
    [0, 150, 210, 30, 180],
    [0, 180, 40, 220, 90],
  ];
  const offs = schemes[Math.floor(Math.random() * schemes.length)];
  const pastel = Math.random() < 0.4;
  return offs.map((o, i) => hslToHex((base + o) % 360, pastel ? 70 : 78 + (i % 2) * 10, pastel ? 78 - (i % 3) * 4 : 58 + (i % 3) * 6));
}
