#!/usr/bin/env node
// Renders ColorJoy launcher icons and splash screens into the Capacitor Android project,
// replacing Capacitor's defaults. Usage: node scripts/android-icons.js
import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const res = join(root, 'android/app/src/main/res');
if (!existsSync(res)) throw new Error('Run "npx cap add android" first');

// The mascot artwork lives in icons/icon.svg (256x256, drop drawn inside a 240x260 box).
const iconSvg = readFileSync(join(root, 'icons/icon.svg'), 'utf8');
const drop = iconSvg.match(/<g transform="translate\(8 2\)">([\s\S]*)<\/g><\/svg>/)[1];
const CREAM = '#fff1d6';

const svg = (size, body) => `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 256 256">${body}</svg>`;
const mascotAt = (scale) => `<g transform="translate(${128 - 120 * scale} ${128 - 128 * scale}) scale(${scale})">${drop}</g>`;

const DENSITIES = { mdpi: 1, hdpi: 1.5, xhdpi: 2, xxhdpi: 3, xxxhdpi: 4 };

function pngSize(file) {
  const b = readFileSync(file);
  return [b.readUInt32BE(16), b.readUInt32BE(20)];
}

const { chromium } = require('playwright');
const browser = await chromium.launch();
const page = await browser.newPage();
async function render(file, w, h, markup) {
  await page.setViewportSize({ width: w, height: h });
  await page.setContent(`<style>html,body{margin:0;background:transparent;overflow:hidden}</style>${markup}`);
  await page.screenshot({ path: file, omitBackground: true, clip: { x: 0, y: 0, width: w, height: h } });
}

for (const [d, k] of Object.entries(DENSITIES)) {
  const dir = join(res, `mipmap-${d}`);
  const legacy = Math.round(48 * k);
  await render(join(dir, 'ic_launcher.png'), legacy, legacy, svg(legacy, `<rect width="256" height="256" rx="48" fill="${CREAM}"/>${mascotAt(0.9)}`));
  await render(join(dir, 'ic_launcher_round.png'), legacy, legacy, svg(legacy, `<circle cx="128" cy="128" r="128" fill="${CREAM}"/>${mascotAt(0.78)}`));
  // Adaptive icon foreground: 108dp canvas, artwork kept inside the 66dp safe zone.
  const fg = Math.round(108 * k);
  await render(join(dir, 'ic_launcher_foreground.png'), fg, fg, svg(fg, mascotAt(0.58)));
}

for (const dir of readdirSync(res).filter((n) => n.startsWith('drawable'))) {
  const file = join(res, dir, 'splash.png');
  if (!existsSync(file)) continue;
  const [w, h] = pngSize(file);
  const m = Math.min(w, h) * 0.32;
  await render(file, w, h, `<div style="width:${w}px;height:${h}px;background:#fff8ec;display:grid;place-items:center">${svg(m, mascotAt(0.95))}</div>`);
}
await browser.close();

writeFileSync(join(res, 'values/ic_launcher_background.xml'), `<?xml version="1.0" encoding="utf-8"?>\n<resources>\n    <color name="ic_launcher_background">#FFF1D6</color>\n</resources>\n`);
console.log('Android icons and splash screens updated');
