// Canvas brushes. Each brush paints from point a to point b on a 2D context.
// Coordinates are in canvas pixels; size is the brush diameter in canvas pixels.

export const BRUSHES = [
  ['crayon', 'Crayon', '🖍️'],
  ['marker', 'Marker', '🖊️'],
  ['pencil', 'Pencil', '✏️'],
  ['watercolor', 'Watercolor', '💧'],
  ['glitter', 'Glitter', '✨'],
  ['rainbow', 'Rainbow', '🌈'],
  ['spray', 'Spray', '💨'],
  ['neon', 'Neon', '💡'],
];

const textureCache = new Map();

// Crayon texture: the color with random speckles knocked out, used as a pattern.
function crayonPattern(ctx, color) {
  if (textureCache.has(color)) return textureCache.get(color);
  const c = document.createElement('canvas');
  c.width = c.height = 64;
  const x = c.getContext('2d');
  x.fillStyle = color;
  x.fillRect(0, 0, 64, 64);
  x.globalCompositeOperation = 'destination-out';
  for (let i = 0; i < 520; i++) {
    x.globalAlpha = Math.random() * 0.8;
    x.fillRect(Math.random() * 64, Math.random() * 64, 1 + Math.random() * 2, 1 + Math.random() * 1.5);
  }
  const p = ctx.createPattern(c, 'repeat');
  textureCache.set(color, p);
  if (textureCache.size > 40) textureCache.delete(textureCache.keys().next().value);
  return p;
}

function line(ctx, a, b, width, style, alpha = 1) {
  ctx.globalAlpha = alpha;
  ctx.strokeStyle = style;
  ctx.lineWidth = width;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.beginPath();
  ctx.moveTo(a.x, a.y);
  ctx.lineTo(b.x, b.y);
  ctx.stroke();
}

function stepAlong(a, b, spacing, fn) {
  const d = Math.hypot(b.x - a.x, b.y - a.y);
  const n = Math.max(1, Math.ceil(d / spacing));
  for (let i = 1; i <= n; i++) fn(a.x + ((b.x - a.x) * i) / n, a.y + ((b.y - a.y) * i) / n);
}

export function createStroke(type, color, size) {
  let travelled = 0;
  return {
    type,
    // Returns optional sparkle points for the UI effect layer.
    paint(ctx, a, b) {
      ctx.save();
      ctx.globalCompositeOperation = 'source-over';
      const dist = Math.hypot(b.x - a.x, b.y - a.y);
      travelled += dist;
      let sparkles = null;
      switch (type) {
        case 'eraser':
          ctx.globalCompositeOperation = 'destination-out';
          line(ctx, a, b, size, '#000');
          break;
        case 'crayon':
          line(ctx, a, b, size, crayonPattern(ctx, color), 0.95);
          line(ctx, { x: a.x + size * 0.12, y: a.y - size * 0.1 }, { x: b.x + size * 0.12, y: b.y - size * 0.1 }, size * 0.6, crayonPattern(ctx, color), 0.5);
          break;
        case 'marker':
          line(ctx, a, b, size, color, 1);
          break;
        case 'pencil': {
          const w = Math.max(2, size * 0.35);
          for (let i = 0; i < 3; i++) {
            const j = () => (Math.random() - 0.5) * w * 0.6;
            line(ctx, { x: a.x + j(), y: a.y + j() }, { x: b.x + j(), y: b.y + j() }, w * 0.55, color, 0.55);
          }
          break;
        }
        case 'watercolor':
          stepAlong(a, b, size * 0.2, (x, y) => {
            const r = size * (0.45 + Math.random() * 0.15);
            const g = ctx.createRadialGradient(x, y, r * 0.2, x, y, r);
            g.addColorStop(0, color);
            g.addColorStop(1, color + '00');
            ctx.globalAlpha = 0.09;
            ctx.fillStyle = g;
            ctx.beginPath();
            ctx.arc(x, y, r, 0, Math.PI * 2);
            ctx.fill();
          });
          break;
        case 'glitter':
          line(ctx, a, b, size * 0.8, color, 0.85);
          stepAlong(a, b, Math.max(3, size * 0.15), (x, y) => {
            for (let i = 0; i < 2; i++) {
              const ang = Math.random() * Math.PI * 2, r = Math.random() * size * 0.55;
              ctx.globalAlpha = 0.9;
              ctx.fillStyle = Math.random() < 0.5 ? '#ffffff' : ['#ffd43b', '#fff3bf', '#e7f5ff', '#ffc9de'][Math.floor(Math.random() * 4)];
              const s = 1 + Math.random() * size * 0.08;
              ctx.fillRect(x + Math.cos(ang) * r, y + Math.sin(ang) * r, s, s);
            }
          });
          if (Math.random() < 0.35) sparkles = [b];
          break;
        case 'rainbow': {
          const hue = (travelled * 0.5) % 360;
          line(ctx, a, b, size, `hsl(${hue} 90% 60%)`, 1);
          break;
        }
        case 'spray':
          stepAlong(a, b, Math.max(2, size * 0.12), (x, y) => {
            ctx.fillStyle = color;
            for (let i = 0; i < Math.ceil(size * 0.6); i++) {
              const ang = Math.random() * Math.PI * 2, r = Math.sqrt(Math.random()) * size * 0.7;
              ctx.globalAlpha = 0.5;
              ctx.fillRect(x + Math.cos(ang) * r, y + Math.sin(ang) * r, 1.6, 1.6);
            }
          });
          break;
        case 'neon':
          ctx.shadowColor = color;
          ctx.shadowBlur = size * 0.9;
          line(ctx, a, b, size * 0.7, color, 0.9);
          ctx.shadowBlur = size * 0.3;
          line(ctx, a, b, size * 0.28, '#ffffff', 0.95);
          break;
      }
      ctx.restore();
      return sparkles;
    },
  };
}

// Draws a short sample stroke for the size preview.
export function drawPreview(canvas, type, color, size) {
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const s = createStroke(type, color, Math.min(size, canvas.width * 0.6));
  const pts = [];
  for (let i = 0; i <= 12; i++) pts.push({ x: canvas.width * (0.2 + 0.6 * (i / 12)), y: canvas.height / 2 + Math.sin(i / 2) * canvas.height * 0.12 });
  for (let i = 1; i < pts.length; i++) s.paint(ctx, pts[i - 1], pts[i]);
}
