#!/usr/bin/env node
// Scans public/portfolio transfer/field notes/<bucket>/<file> and writes a
// typed manifest for the field-notes slide to sample from. Each entry is
// { src, w?, h? } — dimensions are probed at build time for image formats
// so the runtime can pick aspect-aware expansions for the breathing grid.
// Video formats (mp4/mov/webm) skip dimension probing; the runtime falls
// back to the <video>'s `loadedmetadata` event.
import { createReadStream, readdirSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import probe from "probe-image-size";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, "..");
const ASSETS_ROOT = resolve(REPO_ROOT, "public", "portfolio transfer", "field notes");
const URL_ROOT = "/portfolio%20transfer/field%20notes";
const OUT_PATH = resolve(
  REPO_ROOT,
  "app",
  "_deck",
  "slides",
  "field-notes",
  "manifest.generated.ts",
);

const MEDIA_RE = /\.(jpe?g|png|gif|webp|mp4|mov|webm)$/i;
const PROBABLE_IMAGE_RE = /\.(jpe?g|png|gif|webp)$/i;
const SKIP_RE = /^(\.DS_Store|Thumbs\.db|\._)/i;

async function probeDimensions(absPath) {
  if (!PROBABLE_IMAGE_RE.test(absPath)) return null;
  try {
    const stream = createReadStream(absPath);
    const result = await probe(stream);
    stream.destroy();
    return { w: result.width, h: result.height };
  } catch (err) {
    console.warn(`  ! could not probe ${absPath}: ${err.message}`);
    return null;
  }
}

const buckets = {};
const subdirs = readdirSync(ASSETS_ROOT, { withFileTypes: true })
  .filter((d) => d.isDirectory() && !SKIP_RE.test(d.name))
  .sort((a, b) => a.name.localeCompare(b.name));

for (const dir of subdirs) {
  const files = readdirSync(join(ASSETS_ROOT, dir.name))
    .filter((f) => MEDIA_RE.test(f) && !SKIP_RE.test(f))
    .sort();
  if (files.length === 0) continue;
  const entries = await Promise.all(
    files.map(async (f) => {
      const absPath = join(ASSETS_ROOT, dir.name, f);
      const url = `${URL_ROOT}/${encodeURIComponent(dir.name)}/${encodeURIComponent(f)}`;
      const dims = await probeDimensions(absPath);
      return dims ? { src: url, w: dims.w, h: dims.h } : { src: url };
    }),
  );
  buckets[dir.name] = entries;
}

const lines = [
  "// AUTO-GENERATED — do not edit by hand. Run `npm run gen:field-notes`.",
  "",
  "export type ManifestEntry = { src: string; w?: number; h?: number };",
  "",
  "export const BUCKETS: Record<string, readonly ManifestEntry[]> = {",
];
for (const [key, entries] of Object.entries(buckets)) {
  lines.push(`  ${JSON.stringify(key)}: [`);
  for (const entry of entries) lines.push(`    ${JSON.stringify(entry)},`);
  lines.push(`  ],`);
}
lines.push("} as const;");
lines.push("");
lines.push(
  `export const BUCKET_KEYS = ${JSON.stringify(Object.keys(buckets))} as const;`,
);
lines.push("");

mkdirSync(dirname(OUT_PATH), { recursive: true });
writeFileSync(OUT_PATH, lines.join("\n"));

const total = Object.values(buckets).reduce((n, list) => n + list.length, 0);
const probed = Object.values(buckets)
  .flat()
  .filter((e) => e.w && e.h).length;
console.log(
  `field-notes manifest → ${Object.keys(buckets).length} buckets, ${total} files (${probed} with dimensions)`,
);
for (const [k, v] of Object.entries(buckets)) {
  console.log(`  ${k}: ${v.length}`);
}
