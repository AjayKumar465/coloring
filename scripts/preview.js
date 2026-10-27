#!/usr/bin/env node
// Dev helper: renders a contact sheet PNG of generated SVGs for visual review.
// Usage: node scripts/preview.js <category|stickers> <out.png> [columns]
import { readdirSync, readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const [cat, out, cols = 5] = process.argv.slice(2);
const dir = cat.includes('/') ? cat : cat === 'stickers' ? join(root, 'stickers') : join(root, 'images', cat);
const files = readdirSync(dir).filter((f) => f.endsWith('.svg')).sort();
const cells = files
  .map((f) => `<figure><div>${readFileSync(join(dir, f), 'utf8').replace(/<title>.*?<\/title>/, '')}</div><figcaption>${f}</figcaption></figure>`)
  .join('');
const html = `<style>body{margin:0;display:grid;grid-template-columns:repeat(${cols},260px);gap:6px;background:#ddd;font:12px sans-serif}
figure{margin:0;background:#fff}div svg{width:260px;height:260px;display:block}figcaption{text-align:center}</style>${cells}`;
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: cols * 266, height: 400 } });
await page.setContent(html);
await page.screenshot({ path: out, fullPage: true });
await browser.close();
console.log(`${files.length} files -> ${out}`);
