// Visual delight: fill ripples, sparkles, confetti. All respect reduced motion.
import { reducedMotion } from './storage.js';

const NS = 'http://www.w3.org/2000/svg';
let clipCounter = 0;

// Animate a fill spreading from the tapped point inside the region, then commit it.
export function rippleFill(path, paint, clientPt, done) {
  if (reducedMotion() || !path.getBBox) {
    done();
    return;
  }
  const svg = path.ownerSVGElement;
  const parent = path.parentNode;
  let local;
  try {
    const ctm = parent.getScreenCTM().inverse();
    const p = svg.createSVGPoint();
    p.x = clientPt.x;
    p.y = clientPt.y;
    local = p.matrixTransform(ctm);
  } catch {
    done();
    return;
  }
  const bb = path.getBBox();
  const corners = [[bb.x, bb.y], [bb.x + bb.width, bb.y], [bb.x, bb.y + bb.height], [bb.x + bb.width, bb.y + bb.height]];
  const R = Math.max(...corners.map(([x, y]) => Math.hypot(x - local.x, y - local.y))) + 4;
  const id = `cj-clip-${++clipCounter}`;
  const clip = document.createElementNS(NS, 'clipPath');
  clip.id = id;
  const use = document.createElementNS(NS, 'use');
  use.setAttribute('href', `#${path.id}`);
  clip.append(use);
  const circle = document.createElementNS(NS, 'circle');
  circle.setAttribute('cx', local.x);
  circle.setAttribute('cy', local.y);
  circle.setAttribute('r', 0);
  circle.setAttribute('clip-path', `url(#${id})`);
  circle.style.fill = paint;
  circle.style.pointerEvents = 'none';
  parent.insertBefore(clip, path.nextSibling);
  parent.insertBefore(circle, clip.nextSibling);
  const start = performance.now();
  const dur = Math.min(520, 220 + R * 0.6);
  const tick = (now) => {
    const t = Math.max(0, Math.min(1, (now - start) / dur));
    const e = 1 - Math.pow(1 - t, 3);
    circle.setAttribute('r', R * e);
    if (t < 1) requestAnimationFrame(tick);
    else {
      done();
      circle.remove();
      clip.remove();
    }
  };
  requestAnimationFrame(tick);
}

const SPARKS = ['✨', '⭐', '💫', '🌟'];
export function sparkleAt(x, y, count = 6) {
  if (reducedMotion()) return;
  for (let i = 0; i < count; i++) {
    const s = document.createElement('span');
    s.className = 'sparkle-dot';
    s.textContent = SPARKS[i % SPARKS.length];
    const ang = Math.random() * Math.PI * 2, d = 30 + Math.random() * 60;
    s.style.left = `${x - 9}px`;
    s.style.top = `${y - 9}px`;
    s.style.setProperty('--dx', `${Math.cos(ang) * d}px`);
    s.style.setProperty('--dy', `${Math.sin(ang) * d}px`);
    document.body.append(s);
    setTimeout(() => s.remove(), 900);
  }
}

export function confetti(duration = 3200) {
  if (reducedMotion()) return;
  const c = document.createElement('canvas');
  c.className = 'fx-canvas';
  const dpr = Math.min(2, devicePixelRatio || 1);
  c.width = innerWidth * dpr;
  c.height = innerHeight * dpr;
  document.body.append(c);
  const ctx = c.getContext('2d');
  ctx.scale(dpr, dpr);
  const colors = ['#ff6b6b', '#ffd43b', '#69db7c', '#4dabf7', '#b197fc', '#f783ac', '#ff922b'];
  const parts = Array.from({ length: 160 }, () => ({
    x: innerWidth / 2 + (Math.random() - 0.5) * innerWidth * 0.3,
    y: innerHeight * 0.35,
    vx: (Math.random() - 0.5) * 14,
    vy: -6 - Math.random() * 12,
    r: 5 + Math.random() * 7,
    rot: Math.random() * 6,
    vr: (Math.random() - 0.5) * 0.4,
    color: colors[Math.floor(Math.random() * colors.length)],
    shape: Math.floor(Math.random() * 3),
  }));
  const start = performance.now();
  const frame = (now) => {
    const t = now - start;
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    ctx.globalAlpha = Math.max(0, 1 - Math.max(0, t - duration + 800) / 800);
    for (const p of parts) {
      p.vy += 0.32;
      p.vx *= 0.99;
      p.x += p.vx;
      p.y += p.vy;
      p.rot += p.vr;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = p.color;
      if (p.shape === 0) ctx.fillRect(-p.r, -p.r / 2, p.r * 2, p.r);
      else if (p.shape === 1) { ctx.beginPath(); ctx.arc(0, 0, p.r * 0.7, 0, Math.PI * 2); ctx.fill(); }
      else { ctx.beginPath(); for (let i = 0; i < 10; i++) { const rr = i % 2 ? p.r * 0.45 : p.r; ctx.lineTo(Math.cos((i * Math.PI) / 5) * rr, Math.sin((i * Math.PI) / 5) * rr); } ctx.fill(); }
      ctx.restore();
    }
    if (t < duration) requestAnimationFrame(frame);
    else c.remove();
  };
  requestAnimationFrame(frame);
}
