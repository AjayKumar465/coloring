#!/usr/bin/env node
// Copies the static site into www/ for the Android (Capacitor) build.
import { cpSync, rmSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const out = join(root, 'www');
rmSync(out, { recursive: true, force: true });
mkdirSync(out);
for (const f of ['index.html', 'manifest.json', 'sw.js', 'css', 'js', 'data', 'images', 'stickers', 'icons']) {
  cpSync(join(root, f), join(out, f), { recursive: true });
}
// Capacitor core (self-contained ES module) for native plugins, and the native flag.
mkdirSync(join(out, 'js/vendor'), { recursive: true });
cpSync(join(root, 'node_modules/@capacitor/core/dist/index.js'), join(out, 'js/vendor/capacitor-core.js'));
const html = readFileSync(join(out, 'index.html'), 'utf8');
writeFileSync(join(out, 'index.html'), html.replace('<script type="module"', '<script>window.COLORJOY_NATIVE = true;</script>\n  <script type="module"'));
console.log('Web files copied to www/');
