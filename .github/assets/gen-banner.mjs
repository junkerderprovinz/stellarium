/**
 * Generates the Stellarium README banners (theme-adaptive pair, 1600x500):
 *   stellarium-banner.svg / .png      : white bg, night-sky app tile, dark name, grey claim
 *   stellarium-banner-dark.svg / .png : GitHub-dark #0d1117, light name, lighter grey claim
 * The README serves the pair via <picture> (prefers-color-scheme).
 *
 * House banner standard: the app tile (icon.png - a self-contained rounded
 * night-sky icon that reads on both a light and a dark ground, so it is embedded
 * UNCHANGED in both themes) is left-anchored at x=165, 300px tall; the
 * "Stellarium" wordmark sits to its right in Open Sans (OFL), foreground colour;
 * the cheeky claim in Lato (OFL) grey, left-aligned with the wordmark and pulled
 * close. Name + claim are rendered to VECTOR PATHS (opentype.js) so the SVG needs
 * no font; the raster tile is inlined as a data URI so the SVG is self-contained.
 *
 * Deps: `npm i -g @resvg/resvg-js opentype.js`. Fonts (OFL) are fetched at
 * runtime to the OS temp dir - NEVER committed. Run:
 *   node .github/assets/gen-banner.mjs
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { tmpdir } from "node:os";
import { createRequire } from "node:module";
import { execSync } from "node:child_process";

const require = createRequire(import.meta.url);
const gRoot = execSync("npm root -g").toString().trim();
const opentype = require(`${gRoot}/opentype.js`);
const { Resvg } = require(`${gRoot}/@resvg/resvg-js`);
const __dir = dirname(fileURLToPath(import.meta.url));

// ---- content + styling -----------------------------------------------------
const NAME = "Stellarium";
const CLAIM = "Clear skies, guaranteed.";
const W = 1600, H = 500;
const LH = 300;                     // tile height (house standard) - square
const startX = 165;                 // left-anchor (house standard)
const gap = 70;                     // tile-to-wordmark gap
let nameSize = 132;                 // auto-fit down if the wordmark is too wide
const claimSize = 44, lineGap = 8;  // name -> claim gap
const THEMES = [
  { suffix: "",      bg: "#ffffff", name: "#1f2328", claim: "#5a5d5e" },
  { suffix: "-dark", bg: "#0d1117", name: "#e6edf3", claim: "#9aa4ad" },
];
// ---------------------------------------------------------------------------

// Fonts (OFL): Open Sans for the wordmark, Lato for the claim - fetched, never committed.
// Verify Content-Length so a truncated download can't silently break glyph outlines
// (a short file still parses, but the tail glyphs render broken - e.g. "guaranteed").
async function font(url, file) {
  const p = join(tmpdir(), file);
  if (!existsSync(p) || readFileSync(p).length < 50000) {
    for (let attempt = 1; ; attempt++) {
      const r = await fetch(url);
      if (!r.ok) throw new Error(`font fetch ${r.status}: ${url}`);
      const buf = Buffer.from(await r.arrayBuffer());
      const len = Number(r.headers.get("content-length") || 0);
      if (len && buf.length !== len) {
        if (attempt >= 3) throw new Error(`font truncated ${buf.length}/${len}: ${url}`);
        continue;
      }
      writeFileSync(p, buf);
      break;
    }
  }
  const b = readFileSync(p);
  return opentype.parse(b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength));
}
const openSans = await font("https://github.com/google/fonts/raw/main/ofl/opensans/OpenSans%5Bwdth,wght%5D.ttf", "stellarium-OpenSans.ttf");
const lato = await font("https://github.com/google/fonts/raw/main/ofl/lato/Lato-Regular.ttf", "stellarium-Lato-Regular.ttf");

// The tile (icon.png) inlined as a data URI so the SVG is self-contained.
const tileHref = "data:image/png;base64," + readFileSync(join(__dir, "icon.png")).toString("base64");

// Auto-fit the wordmark to the free width, then place the [wordmark + claim] block.
const textX = startX + LH + gap;
const maxNameW = W - textX - 90;
if (openSans.getAdvanceWidth(NAME, nameSize) > maxNameW)
  nameSize *= maxNameW / openSans.getAdvanceWidth(NAME, nameSize);
const em = (f, s) => s / f.unitsPerEm;
const nameAsc = openSans.ascender * em(openSans, nameSize);
const nameDesc = -openSans.descender * em(openSans, nameSize);
const claimAsc = lato.ascender * em(lato, claimSize);
const claimDesc = -lato.descender * em(lato, claimSize);
const blockH = nameAsc + nameDesc + lineGap + claimAsc + claimDesc;
const top = (H - blockH) / 2;
const nameBaseline = top + nameAsc;
const claimBaseline = nameBaseline + nameDesc + lineGap + claimAsc;
// Render text as ONE <path> PER GLYPH, not a single merged path: resvg's tessellator
// can silently abort a merged multi-subpath path partway through for certain
// glyph/coordinate combinations (it dropped "uaranteed." from the claim here),
// and per-glyph paths sidestep that entirely. Colour is applied per theme, so
// only the geometry (d) is precomputed.
const glyphD = (font, text, x, baseline, size) =>
  font.getPaths(text, x, baseline, size).map((p) => p.toPathData(2)).filter(Boolean);
const nameD = glyphD(openSans, NAME, textX, nameBaseline, nameSize);
const claimD = glyphD(lato, CLAIM, textX, claimBaseline, claimSize);
const paths = (ds, fill) => ds.map((d) => `<path d="${d}" fill="${fill}"/>`).join("");

const LY = (H - LH) / 2;
const tile = `<image x="${startX}" y="${LY}" width="${LH}" height="${LH}" href="${tileHref}"/>`;
for (const t of THEMES) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="${NAME}">
  <rect width="${W}" height="${H}" fill="${t.bg}"/>
  ${tile}
  ${paths(nameD, t.name)}
  ${paths(claimD, t.claim)}
</svg>
`;
  writeFileSync(join(__dir, `stellarium-banner${t.suffix}.svg`), svg);
  const png = new Resvg(svg, { fitTo: { mode: "width", value: W }, background: t.bg }).render().asPng();
  writeFileSync(join(__dir, `stellarium-banner${t.suffix}.png`), png);
  console.log(`wrote stellarium-banner${t.suffix}.svg + .png (name ${Math.round(nameSize)}px)`);
}
console.log(`claim: "${CLAIM}"`);
