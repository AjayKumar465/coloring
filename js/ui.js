// Shared UI helpers: element builder, toast, dialogs, parent gate, voice prompts.
import { settings } from './storage.js';
import { play } from './audio.js';

export function h(tag, attrs = {}, ...children) {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs || {})) {
    if (v == null || v === false) continue;
    if (k === 'class') el.className = v;
    else if (k === 'style' && typeof v === 'object') {
      for (const [sk, sv] of Object.entries(v)) sk.startsWith('--') ? el.style.setProperty(sk, sv) : (el.style[sk] = sv);
    }
    else if (k.startsWith('on') && typeof v === 'function') el.addEventListener(k.slice(2).toLowerCase(), v);
    else if (k === 'html') el.innerHTML = v;
    else el.setAttribute(k, v === true ? '' : v);
  }
  for (const c of children.flat()) {
    if (c == null || c === false) continue;
    el.append(c.nodeType ? c : document.createTextNode(String(c)));
  }
  return el;
}

let toastTimer = 0;
export function toast(msg, ms = 2200) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), ms);
}

export function speak(text) {
  if (!settings.get().voice || !('speechSynthesis' in self)) return;
  try {
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.rate = 0.95;
    u.pitch = 1.25;
    speechSynthesis.speak(u);
  } catch {
    /* voice not available */
  }
}

// Generic modal built on <dialog>. Resolves with the value passed to close().
export function modal(build) {
  return new Promise((resolve) => {
    const dlg = h('dialog', { class: 'modal' });
    let value;
    const close = (v) => {
      value = v;
      dlg.close();
    };
    build(dlg, close);
    dlg.addEventListener('close', () => {
      dlg.remove();
      resolve(value);
    });
    document.body.append(dlg);
    if (dlg.showModal) dlg.showModal();
    else dlg.setAttribute('open', '');
    const focusable = dlg.querySelector('input, button.btn-primary, button');
    focusable && focusable.focus();
  });
}

export function confirmKid(title, text, yes = 'Yes', no = 'No') {
  return modal((dlg, close) => {
    dlg.append(
      h('h2', {}, title),
      h('p', {}, text),
      h('div', { class: 'row' },
        h('button', { class: 'btn', type: 'button', onclick: () => close(false) }, no),
        h('button', { class: 'btn btn-primary', type: 'button', onclick: () => close(true) }, yes)
      )
    );
  }).then(Boolean);
}

// Parent lock: a simple math question that young kids are unlikely to answer.
export function parentGate(reason = 'This part is for grown-ups.') {
  const a = 6 + Math.floor(Math.random() * 7);
  const b = 3 + Math.floor(Math.random() * 7);
  speak('Ask a grown-up for help!');
  return modal((dlg, close) => {
    const input = h('input', { type: 'number', inputmode: 'numeric', 'aria-label': `What is ${a} times ${b}?`, autocomplete: 'off' });
    const err = h('p', { class: 'err', role: 'alert' });
    const check = () => {
      if (Number(input.value) === a * b) close(true);
      else {
        err.textContent = 'Not quite. Ask a grown-up!';
        input.value = '';
        input.focus();
      }
    };
    input.addEventListener('keydown', (e) => e.key === 'Enter' && check());
    dlg.append(
      h('h2', {}, '🔒 Grown-ups only'),
      h('p', {}, reason),
      h('p', {}, h('strong', {}, `What is ${a} × ${b}?`)),
      input,
      err,
      h('div', { class: 'row' },
        h('button', { class: 'btn', type: 'button', onclick: () => close(false) }, 'Cancel'),
        h('button', { class: 'btn btn-primary', type: 'button', onclick: check }, 'OK')
      )
    );
  }).then(Boolean);
}

export function clickSound(root) {
  root.addEventListener('click', (e) => {
    if (e.target.closest('button, a.btn, a.chip, a.cat-tile')) play('click');
  });
}
