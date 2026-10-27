// Tiny synthesized sound effects (Web Audio API). No audio files, nothing copyrighted.
import { settings } from './storage.js';

let ctx = null;
let master = null;

function ac() {
  if (!ctx) {
    const AC = self.AudioContext || self.webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = 0.35;
    master.connect(ctx.destination);
  }
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}

function tone(freq, start, dur, { type = 'sine', vol = 0.6, slide = 0 } = {}) {
  const c = ctx;
  const o = c.createOscillator();
  const g = c.createGain();
  o.type = type;
  o.frequency.setValueAtTime(freq, start);
  if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(40, freq + slide), start + dur);
  g.gain.setValueAtTime(0.0001, start);
  g.gain.exponentialRampToValueAtTime(vol, start + 0.012);
  g.gain.exponentialRampToValueAtTime(0.0001, start + dur);
  o.connect(g).connect(master);
  o.start(start);
  o.stop(start + dur + 0.05);
}

function noise(start, dur, vol = 0.3, freq = 2000) {
  const c = ctx;
  const buf = c.createBuffer(1, Math.ceil(c.sampleRate * dur), c.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / data.length);
  const src = c.createBufferSource();
  src.buffer = buf;
  const f = c.createBiquadFilter();
  f.type = 'bandpass';
  f.frequency.value = freq;
  const g = c.createGain();
  g.gain.value = vol;
  src.connect(f).connect(g).connect(master);
  src.start(start);
}

const SOUNDS = {
  click: (t) => tone(660, t, 0.06, { type: 'triangle', vol: 0.3 }),
  pop: (t) => tone(420 + Math.random() * 200, t, 0.14, { vol: 0.5, slide: 500 }),
  stamp: (t) => { tone(200, t, 0.12, { type: 'square', vol: 0.15, slide: -80 }); noise(t, 0.08, 0.2, 900); },
  erase: (t) => noise(t, 0.18, 0.15, 3000),
  whoosh: (t) => noise(t, 0.35, 0.25, 1200),
  undo: (t) => tone(520, t, 0.1, { type: 'triangle', vol: 0.3, slide: -200 }),
  sparkle: (t) => [1568, 2093, 2637].forEach((f, i) => tone(f, t + i * 0.06, 0.18, { vol: 0.18 })),
  chime: (t) => [784, 988, 1175, 1568].forEach((f, i) => tone(f, t + i * 0.09, 0.35, { type: 'triangle', vol: 0.3 })),
  magic: (t) => [523, 659, 784, 1047, 1319, 1568].forEach((f, i) => tone(f, t + i * 0.05, 0.25, { vol: 0.22 })),
  fanfare: (t) => {
    const notes = [523, 523, 523, 659, 784, 659, 784, 1047];
    const times = [0, 0.12, 0.24, 0.36, 0.6, 0.78, 0.9, 1.08];
    notes.forEach((f, i) => tone(f, t + times[i], i === notes.length - 1 ? 0.7 : 0.16, { type: 'triangle', vol: 0.35 }));
    noise(t + 1.08, 0.5, 0.12, 5000);
  },
};

export function play(name) {
  if (!settings.get().sound) return;
  const c = ac();
  if (!c || !SOUNDS[name]) return;
  try {
    SOUNDS[name](c.currentTime + 0.01);
  } catch {
    /* ignore audio failures */
  }
}

// Unlock audio on the first touch (mobile browsers require a gesture).
export function unlockOnGesture() {
  const unlock = () => {
    if (settings.get().sound) ac();
    removeEventListener('pointerdown', unlock);
  };
  addEventListener('pointerdown', unlock, { once: true });
}
