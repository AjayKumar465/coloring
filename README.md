# 🎨 ColorJoy

A free, ad-free coloring web app for kids. It's a static site that runs on GitHub Pages and works offline once it has loaded.

- **236 original coloring pages** in 15 themes, including 20 detailed showcase scenes
- **Tap-to-fill** with a ripple animation, plus **8 brushes**: crayon, marker, pencil, watercolor, glitter, rainbow, spray and neon
- **Pattern fills** (stripes, dots, stars, hearts, checkers, gradient), **40 stickers** you can drag, resize and rotate, and an eraser
- **Magic Color** fills the picture with a random harmonious palette. **Bring to Life** animates a finished picture
- Undo/redo (40 steps), pinch and wheel zoom, pan, autosave, PNG export, a My Art gallery and print (blank or colored)
- Confetti and a fanfare when a picture is finished. Dabby the mascot cheers at milestones
- Sounds are synthesized with the Web Audio API and can be muted. Spoken prompts are optional
- A parent lock (a math question) protects settings and deleting. There's also a high-contrast mode, a colorblind-friendly palette, a less-motion option and keyboard support
- No accounts, no ads, no tracking and no network calls besides the site's own files. Everything is saved on the device in IndexedDB and localStorage

## Run locally

No build step is needed. Serve the folder over HTTP (opening the file directly won't work, because ES modules and the service worker need HTTP):

```bash
npx serve .
# or
python3 -m http.server 8080
```

Then open the URL that gets printed, for example http://localhost:3000.

## Project structure

```
index.html            App shell
css/styles.css        All styles (print, high contrast and reduced-motion rules included)
js/app.js             Router, home screen, settings, service worker registration
js/gallery.js         Filters, search, favorites, recently colored
js/canvas.js          Coloring screen (loaded only when a picture is opened)
js/tools.js           Palettes, pattern fills, Magic Color palettes
js/brushes.js         Canvas brushes
js/stickers.js        Sticker layer (drag / resize / rotate)
js/animations.js      Fill ripple, sparkles, confetti
js/storage.js         IndexedDB + localStorage
js/audio.js           Web Audio sound effects
js/ui.js, mascot.js, myart.js
images/<category>/    Generated SVG coloring pages
stickers/             Generated sticker SVGs + stickers.json
data/catalog.json     Picture catalog
sw.js, manifest.json  Offline support / installable PWA
scripts/              Art generator, icon generator, checks, preview tool
```

### How the coloring layers work

The stage stacks four layers. From the bottom:

1. The SVG fill layer, where taps fill regions
2. A canvas for brush strokes
3. A second copy of the SVG drawn with `mix-blend-mode: multiply`. Its white fills disappear, so only the black outlines remain, and they always sit on top of colors
4. Stickers

Export draws the same stack onto a canvas.

## Adding or changing pictures

All art is produced by `scripts/generate-images.js` from small drawing modules in `scripts/categories/`.

1. Add an entry to a category file, for example `scripts/categories/animals.js`:

   ```js
   {
     name: 'turtle',                 // file name -> images/animals/turtle.svg
     title: 'Tiny Turtle',
     tags: ['turtle', 'pet'],
     anim: 'swim',                   // Bring to Life motion: float | wiggle | spin | twinkle | swim
     draw(a) {
       a.f(ellipse(400, 420, 200, 140));   // a.f() = fillable region (gets a unique id)
       a.l('M300 500q100 40 200 0');       // a.l() = outline-only detail
       a.k(circle(330, 380, 10));          // a.k() = solid ink (pupils)
     },
   },
   ```

   Helpers in `scripts/lib/shapes.js` (circle, ellipse, rect, star, heart, petal, scallop, smooth, band, hatch…) and `scripts/lib/parts.js` (frames, ground, sun, clouds, eyes, people…) cover most needs. Wrap parts in `a.anim('blink' | 'twinkle' | 'spin' | 'sway' | 'drift' | 'float' | 'wiggle' | 'pulse', () => …)` to animate them in Bring to Life mode.

2. Regenerate and validate:

   ```bash
   node scripts/generate-images.js     # writes images/, stickers/, data/catalog.json
   node scripts/check.js               # checks ids, sizes (<30KB), region counts, offline shell
   node scripts/preview.js animals preview.png   # optional contact sheet (needs Playwright)
   ```

You can also drop in a hand-made SVG. Use `viewBox="0 0 800 800"` and black outlines, and give every closed region a `<path id="…" class="fillable">`. Then add a matching entry to `data/catalog.json`: `{ id, title, category, difficulty, file, tags, anim }`. If you do this, delete the "Regenerate art" step from the deploy workflow, because regenerating would overwrite your edited catalog.

Difficulty is set automatically from the region count: easy ≤ 14, medium ≤ 32, hard above that.

## Deploy to GitHub Pages

1. Push the repository to GitHub.
2. Open **Settings → Pages** and set **Source** to **GitHub Actions**.
3. Push to `main`, or run the workflow by hand from the **Actions** tab. `.github/workflows/deploy.yml` regenerates the art, runs `scripts/check.js` and publishes the site.

The site will be at `https://<user>.github.io/<repo>/`. All paths are relative, so it works from that subfolder.

After you change files that the app shell caches, bump `VERSION` in `sw.js` so returning visitors get the update.

## Privacy

ColorJoy collects nothing. It has no analytics, cookies, accounts or third-party requests. Artwork stays on the device unless the user downloads it.

## License

The code is released under the MIT License (see [LICENSE](LICENSE)). **All artwork is original**: the coloring pages, stickers, the Dabby mascot and the icons were generated by the scripts in this repo. None of it was copied or traced from another coloring site, and it contains no trademarked or licensed characters. The artwork is released under the same MIT License.
