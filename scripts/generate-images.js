#!/usr/bin/env node
// Generates every coloring page SVG, the sticker set and data/catalog.json.
// Usage: node scripts/generate-images.js [--only=<category>]
import { mkdirSync, writeFileSync, rmSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Art } from './lib/shapes.js';
import { CATEGORIES } from './categories/index.js';
import { STICKERS, stickerSVG } from './lib/stickers.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const only = (process.argv.find((x) => x.startsWith('--only=')) || '').slice(7);
const MAX_BYTES = 30 * 1024;

function difficulty(regions) {
  if (regions <= 14) return 'easy';
  if (regions <= 32) return 'medium';
  return 'hard';
}

const images = [];
const problems = [];

for (const cat of CATEGORIES) {
  if (only && cat.id !== only) continue;
  const dir = join(root, 'images', cat.id);
  if (existsSync(dir)) rmSync(dir, { recursive: true });
  mkdirSync(dir, { recursive: true });
  const seen = new Set();
  for (const item of cat.items) {
    if (seen.has(item.name)) throw new Error(`Duplicate image name ${cat.id}/${item.name}`);
    seen.add(item.name);
    const a = new Art();
    item.draw(a);
    const svg = a.toSVG({ title: item.title, anim: item.anim || 'float' });
    const bytes = Buffer.byteLength(svg);
    if (bytes > MAX_BYTES) problems.push(`${cat.id}/${item.name}.svg is ${bytes} bytes`);
    if (a.id < 3) problems.push(`${cat.id}/${item.name}.svg has only ${a.id} regions`);
    writeFileSync(join(dir, `${item.name}.svg`), svg);
    images.push({
      id: `${cat.id}-${item.name}`,
      title: item.title,
      category: cat.id,
      difficulty: item.difficulty || difficulty(a.id),
      file: `images/${cat.id}/${item.name}.svg`,
      tags: [...new Set([...(item.tags || []), cat.id])],
      anim: item.anim || 'float',
      regions: a.id,
      ...(item.showcase ? { showcase: true } : {}),
    });
  }
}

if (!only) {
  const sdir = join(root, 'stickers');
  if (existsSync(sdir)) rmSync(sdir, { recursive: true });
  mkdirSync(sdir, { recursive: true });
  for (const s of STICKERS) writeFileSync(join(sdir, `${s.name}.svg`), stickerSVG(s));
  writeFileSync(
    join(sdir, 'stickers.json'),
    JSON.stringify(STICKERS.map((s) => ({ id: s.name, title: s.title, file: `stickers/${s.name}.svg` })), null, 1) + '\n'
  );

  const catalog = {
    version: 1,
    generated: 'scripts/generate-images.js',
    categories: CATEGORIES.map(({ id, name, icon, color }) => ({ id, name, icon, color })),
    images,
  };
  mkdirSync(join(root, 'data'), { recursive: true });
  writeFileSync(join(root, 'data', 'catalog.json'), JSON.stringify(catalog) + '\n');
}

const byCat = {};
for (const im of images) byCat[im.category] = (byCat[im.category] || 0) + 1;
console.log(Object.entries(byCat).map(([k, v]) => `${k}: ${v}`).join('\n'));
console.log(`Total images: ${images.length}${only ? '' : `, stickers: ${STICKERS.length}`}`);
if (problems.length) {
  console.error('Problems:\n' + problems.join('\n'));
  process.exitCode = 1;
}
