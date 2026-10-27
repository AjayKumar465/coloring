// "Dabby", ColorJoy's original paint-drop mascot.
import { reducedMotion } from './storage.js';

export function mascotSVG(cls = 'mascot') {
  return `<svg class="${cls}" viewBox="0 0 240 260" role="img" aria-label="Dabby the paint drop waving hello">
  <ellipse cx="120" cy="245" rx="70" ry="10" fill="#000" opacity=".12"/>
  <g class="m-body">
    <g class="m-arm-l"><path d="M44 150Q14 130 18 100" fill="none" stroke="#2b2340" stroke-width="12" stroke-linecap="round"/><circle cx="18" cy="96" r="13" fill="#ffd43b" stroke="#2b2340" stroke-width="5"/></g>
    <g class="m-arm-r"><path d="M196 150Q222 160 226 186" fill="none" stroke="#2b2340" stroke-width="12" stroke-linecap="round"/><circle cx="226" cy="190" r="13" fill="#ffd43b" stroke="#2b2340" stroke-width="5"/></g>
    <path d="M120 14C150 64 206 104 206 158C206 206 168 238 120 238C72 238 34 206 34 158C34 104 90 64 120 14Z" fill="#ff6b6b" stroke="#2b2340" stroke-width="6"/>
    <path d="M70 150C70 120 86 96 104 80" fill="none" stroke="#fff" stroke-width="10" stroke-linecap="round" opacity=".55"/>
    <path d="M38 175C70 190 170 190 202 175C200 214 166 236 120 236C74 236 40 214 38 175Z" fill="#ffd43b" stroke="#2b2340" stroke-width="6"/>
    <circle cx="70" cy="200" r="7" fill="#4dabf7"/><circle cx="110" cy="214" r="6" fill="#69db7c"/><circle cx="160" cy="205" r="8" fill="#b197fc"/>
    <g class="m-eye"><ellipse cx="95" cy="140" rx="14" ry="18" fill="#fff" stroke="#2b2340" stroke-width="5"/><circle cx="98" cy="144" r="7" fill="#2b2340"/></g>
    <g class="m-eye"><ellipse cx="148" cy="140" rx="14" ry="18" fill="#fff" stroke="#2b2340" stroke-width="5"/><circle cx="151" cy="144" r="7" fill="#2b2340"/></g>
    <path d="M100 170Q122 190 144 170" fill="none" stroke="#2b2340" stroke-width="6" stroke-linecap="round"/>
    <ellipse cx="76" cy="166" rx="11" ry="7" fill="#ff8fab"/><ellipse cx="168" cy="166" rx="11" ry="7" fill="#ff8fab"/>
  </g>
</svg>`;
}

const CHEERS = ['Wow!', 'Super!', 'Yay!', 'So pretty!', 'Great job!', 'Amazing!', 'Beautiful!'];

// Make a mascot element cheer or clap, with an optional speech bubble.
export function mascotReact(wrap, kind = 'cheer', text) {
  if (!wrap) return;
  const svg = wrap.querySelector('.mascot, .mascot-mini');
  if (svg && !reducedMotion()) {
    svg.classList.remove('cheer', 'clap');
    void svg.getBBox?.();
    svg.classList.add(kind);
    setTimeout(() => svg.classList.remove(kind), 1600);
  }
  const msg = text || CHEERS[Math.floor(Math.random() * CHEERS.length)];
  wrap.querySelector('.speech')?.remove();
  const bubble = document.createElement('div');
  bubble.className = 'speech';
  bubble.textContent = msg;
  wrap.append(bubble);
  setTimeout(() => bubble.remove(), 2200);
  return msg;
}
