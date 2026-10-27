#!/usr/bin/env node
// Builds the app icons (SVG + PNGs) from the Dabby mascot artwork using the
// pre-installed Playwright Chromium. Usage: node scripts/generate-icons.js
import { mkdirSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const out = join(root, 'icons');
mkdirSync(out, { recursive: true });

const drop = `<path d="M120 14C150 64 206 104 206 158C206 206 168 238 120 238C72 238 34 206 34 158C34 104 90 64 120 14Z" fill="#ff6b6b" stroke="#2b2340" stroke-width="8"/>
<path d="M38 175C70 190 170 190 202 175C200 214 166 236 120 236C74 236 40 214 38 175Z" fill="#ffd43b" stroke="#2b2340" stroke-width="7"/>
<path d="M70 150C70 120 86 96 104 80" fill="none" stroke="#fff" stroke-width="10" stroke-linecap="round" opacity=".55"/>
<ellipse cx="95" cy="140" rx="14" ry="18" fill="#fff" stroke="#2b2340" stroke-width="5"/><circle cx="98" cy="144" r="7" fill="#2b2340"/>
<ellipse cx="148" cy="140" rx="14" ry="18" fill="#fff" stroke="#2b2340" stroke-width="5"/><circle cx="151" cy="144" r="7" fill="#2b2340"/>
<path d="M100 170Q122 190 144 170" fill="none" stroke="#2b2340" stroke-width="6" stroke-linecap="round"/>
<circle cx="70" cy="200" r="7" fill="#4dabf7"/><circle cx="110" cy="214" r="6" fill="#69db7c"/><circle cx="160" cy="205" r="8" fill="#b197fc"/>`;

const icon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"><rect width="256" height="256" rx="56" fill="#fff8ec"/><g transform="translate(8 2)">${drop}</g></svg>`;
const maskable = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"><rect width="256" height="256" fill="#fff1d6"/><g transform="translate(38 36) scale(0.75)">${drop}</g></svg>`;
writeFileSync(join(out, 'icon.svg'), icon);

const { chromium } = require('playwright');
const browser = await chromium.launch();
const page = await browser.newPage();
for (const [name, svg, size] of [['icon-192.png', icon, 192], ['icon-512.png', icon, 512], ['maskable-512.png', maskable, 512]]) {
  await page.setViewportSize({ width: size, height: size });
  await page.setContent(`<style>html,body{margin:0;background:transparent}</style>${svg.replace('<svg ', `<svg width="${size}" height="${size}" `)}`);
  await page.screenshot({ path: join(out, name), omitBackground: true });
}
await browser.close();
console.log('Icons written to icons/');
