#!/usr/bin/env node
// Validates the generated art and app shell. Run in CI before deploying.
import { readFileSync, existsSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const errors = [];
const catalog = JSON.parse(readFileSync(join(root, 'data/catalog.json'), 'utf8'));
const ids = new Set();

for (const im of catalog.images) {
  if (ids.has(im.id)) errors.push(`duplicate id ${im.id}`);
  ids.add(im.id);
  for (const k of ['id', 'title', 'category', 'difficulty', 'file', 'tags']) if (im[k] == null) errors.push(`${im.id}: missing ${k}`);
  if (!['easy', 'medium', 'hard'].includes(im.difficulty)) errors.push(`${im.id}: bad difficulty`);
  if (!catalog.categories.some((c) => c.id === im.category)) errors.push(`${im.id}: unknown category`);
  const file = join(root, im.file);
  if (!existsSync(file)) { errors.push(`${im.id}: missing ${im.file}`); continue; }
  const svg = readFileSync(file, 'utf8');
  if (statSync(file).size > 30 * 1024) errors.push(`${im.file}: over 30KB`);
  if (!svg.includes('viewBox="0 0 800 800"')) errors.push(`${im.file}: wrong viewBox`);
  const fillables = [...svg.matchAll(/<path id="([^"]+)" class="fillable"/g)].map((m) => m[1]);
  if (fillables.length !== (svg.match(/class="fillable"/g) || []).length) errors.push(`${im.file}: fillable without id`);
  if (new Set(fillables).size !== fillables.length) errors.push(`${im.file}: duplicate region ids`);
  if (fillables.length < 3) errors.push(`${im.file}: too few regions`);
}

const perCat = {};
for (const im of catalog.images) perCat[im.category] = (perCat[im.category] || 0) + 1;
if (catalog.images.length < 200) errors.push(`only ${catalog.images.length} images`);

const stickers = JSON.parse(readFileSync(join(root, 'stickers/stickers.json'), 'utf8'));
if (stickers.length < 30) errors.push(`only ${stickers.length} stickers`);
for (const s of stickers) if (!existsSync(join(root, s.file))) errors.push(`missing sticker ${s.file}`);

const sw = readFileSync(join(root, 'sw.js'), 'utf8');
const shell = [...sw.matchAll(/^\s+'([^']+)',$/gm)].map((m) => m[1]).filter((f) => f !== './');
for (const f of shell) if (!existsSync(join(root, f))) errors.push(`sw.js precaches missing file ${f}`);

console.log(`${catalog.images.length} images in ${Object.keys(perCat).length} categories, ${stickers.length} stickers`);
if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}
console.log('All checks passed.');
