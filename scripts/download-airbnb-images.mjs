#!/usr/bin/env node
/**
 * Download every Airbnb image referenced in src/data/villaDetails.json into
 * public/images/airbnb/villa-{id}/, run them through sharp (resize + jpeg
 * recompress) and rewrite villaDetails.json to point at the local paths.
 *
 * Run after scripts/fetch-villa-details.mjs to refresh the JSON first.
 *
 * Usage:
 *   node scripts/download-airbnb-images.mjs
 */

import { readFile, writeFile, mkdir, rm } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const JSON_PATH = resolve(ROOT, 'src/data/villaDetails.json');
const OUT_BASE = resolve(ROOT, 'public/images/airbnb');
const PUBLIC_BASE = '/images/airbnb';

const TARGET_WIDTH = 1400;
const JPEG_QUALITY = 80;
const UA = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36';

function isRemote(url) {
  return /^https?:\/\//i.test(url);
}

async function downloadAndCompress(url, destPath) {
  const res = await fetch(url, { headers: { 'User-Agent': UA, Referer: 'https://www.airbnb.com/' } });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  const inBuf = Buffer.from(await res.arrayBuffer());
  const outBuf = await sharp(inBuf)
    .resize({ width: TARGET_WIDTH, withoutEnlargement: true })
    .jpeg({ quality: JPEG_QUALITY, progressive: true, mozjpeg: true })
    .toBuffer();
  await writeFile(destPath, outBuf);
  return { before: inBuf.length, after: outBuf.length };
}

async function main() {
  const json = JSON.parse(await readFile(JSON_PATH, 'utf8'));
  let totalBefore = 0;
  let totalAfter = 0;

  for (const [villaId, villa] of Object.entries(json)) {
    const villaDir = resolve(OUT_BASE, `villa-${villaId}`);
    await rm(villaDir, { recursive: true, force: true });
    await mkdir(villaDir, { recursive: true });
    console.log(`\nVilla ${villaId} — ${villa.name}`);

    const newPaths = [];
    for (let i = 0; i < villa.images.length; i++) {
      const url = villa.images[i];
      const idx = String(i + 1).padStart(2, '0');
      const filename = `${idx}.jpeg`;
      const destPath = resolve(villaDir, filename);
      const publicPath = `${PUBLIC_BASE}/villa-${villaId}/${filename}`;

      // If already local, just keep the entry (defensive: re-runs are safe).
      if (!isRemote(url)) {
        newPaths.push(url);
        console.log(`  [${idx}] (local, skipped) ${url}`);
        continue;
      }

      try {
        const { before, after } = await downloadAndCompress(url, destPath);
        totalBefore += before;
        totalAfter += after;
        const saved = (((before - after) / before) * 100).toFixed(1);
        console.log(`  [${idx}] ${(before / 1024).toFixed(0)}KB → ${(after / 1024).toFixed(0)}KB (-${saved}%)`);
        newPaths.push(publicPath);
      } catch (e) {
        console.error(`  [${idx}] FAILED: ${e.message}`);
        // Keep remote URL as fallback so the site still renders.
        newPaths.push(url);
        process.exitCode = 2;
      }
    }
    villa.images = newPaths;
  }

  await writeFile(JSON_PATH, JSON.stringify(json, null, 2) + '\n');
  console.log(
    `\nTotal: ${(totalBefore / 1024 / 1024).toFixed(1)}MB → ${(totalAfter / 1024 / 1024).toFixed(1)}MB ` +
      `(saved ${((totalBefore - totalAfter) / 1024 / 1024).toFixed(1)}MB)`,
  );
  console.log(`Updated ${JSON_PATH}`);
}

main().catch((e) => { console.error(e); process.exit(1); });
