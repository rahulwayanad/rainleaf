#!/usr/bin/env node
/**
 * Pre-fetch Airbnb listing details for the 3 Rainleaf villas by scraping the
 * schema.org JSON-LD block embedded in the public listing pages. No API key,
 * no quota — re-run any time to refresh.
 *
 * Usage:
 *   node scripts/fetch-villa-details.mjs
 *
 * Output:
 *   src/data/villaDetails.json — keyed by villa id
 */

import { writeFile, mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import villas from '../src/data/villas.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const OUT_DIR = resolve(ROOT, 'src/data');
const OUT = resolve(OUT_DIR, 'villaDetails.json');

const VILLAS = villas.map(v => ({ id: v.id, airbnbId: v.airbnbId }));

const UA = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36';

async function fetchOne(airbnbId) {
  const url = `https://www.airbnb.co.in/rooms/${airbnbId}`;
  const res = await fetch(url, { headers: { 'User-Agent': UA, 'Accept-Language': 'en-IN,en;q=0.9' } });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${airbnbId}`);
  const html = await res.text();
  const m = html.match(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/);
  if (!m) throw new Error(`No JSON-LD block found for ${airbnbId}`);
  const ld = JSON.parse(m[1]);
  return {
    name: ld.name,
    description: ld.description,
    images: Array.isArray(ld.image) ? ld.image : (ld.image ? [ld.image] : []),
    guests: ld.containsPlace?.occupancy?.value,
    latitude: ld.latitude,
    longitude: ld.longitude,
    locality: ld.address?.addressLocality,
    rating: ld.aggregateRating?.ratingValue,
    reviews: Number(ld.aggregateRating?.ratingCount) || 0,
    sourceUrl: url,
    fetchedAt: new Date().toISOString(),
  };
}

async function main() {
  const out = {};
  for (const v of VILLAS) {
    process.stdout.write(`Fetching villa ${v.id} (${v.airbnbId})… `);
    try {
      out[v.id] = await fetchOne(v.airbnbId);
      console.log(`ok — "${out[v.id].name}" (${out[v.id].images.length} photos)`);
    } catch (e) {
      console.log('FAILED');
      console.error(`  ${e.message}`);
      process.exitCode = 2;
    }
  }
  await mkdir(OUT_DIR, { recursive: true });
  await writeFile(OUT, JSON.stringify(out, null, 2) + '\n');
  console.log(`\nWrote ${OUT}`);
}

main().catch(e => { console.error(e); process.exit(1); });
