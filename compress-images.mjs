import sharp from 'sharp';
import { readdirSync, statSync } from 'fs';
import { join, extname } from 'path';

const inputDir = './public/images';
const files = readdirSync(inputDir);

const config = {
  // Hero/CTA backgrounds - wide landscape, max 1600px wide
  'hero-banner.jpeg':     { width: 1600, quality: 82 },
  'cta-aerial.jpeg':      { width: 1600, quality: 80 },
  // About section images
  'about-aerial.jpeg':    { width: 1200, quality: 80 },
  // Villa cards
  'villa-1.jpeg':         { width: 800,  quality: 80 },
  'villa-2.jpeg':         { width: 800,  quality: 80 },
  'villa-3.jpeg':         { width: 800,  quality: 80 },
  // Gallery images
  'gallery-aerial-night.jpeg':  { width: 1000, quality: 78 },
  'gallery-bedroom.jpeg':       { width: 800,  quality: 78 },
  'gallery-kitchen.jpeg':       { width: 800,  quality: 78 },
  'gallery-living.jpeg':        { width: 800,  quality: 78 },
  'gallery-pool-day.jpeg':      { width: 800,  quality: 80 },
  'gallery-pool-night.jpeg':    { width: 800,  quality: 80 },
  'gallery-villa-palms.jpeg':   { width: 1000, quality: 78 },
  'gallery-villa-pool.jpeg':    { width: 1000, quality: 80 },
  // Services
  'dinner-table-with-foods-soft-drinks-restaurant.jpg': { width: 900, quality: 80 },
  'gallery-trekking.jpg': { width: 900, quality: 80 },
};

let totalBefore = 0;
let totalAfter = 0;

for (const file of files) {
  const inputPath = join(inputDir, file);
  const ext = extname(file).toLowerCase();
  if (!['.jpg', '.jpeg', '.png'].includes(ext)) continue;

  const before = statSync(inputPath).size;
  totalBefore += before;

  const cfg = config[file] || { width: 1200, quality: 80 };

  try {
    const buf = await sharp(inputPath)
      .resize({ width: cfg.width, withoutEnlargement: true })
      .jpeg({ quality: cfg.quality, progressive: true, mozjpeg: true })
      .toBuffer();

    // Only overwrite if smaller
    if (buf.length < before) {
      await sharp(buf).toFile(inputPath);
      totalAfter += buf.length;
      const saved = (((before - buf.length) / before) * 100).toFixed(1);
      console.log(`✓ ${file}: ${(before/1024/1024).toFixed(2)}MB → ${(buf.length/1024/1024).toFixed(2)}MB (-${saved}%)`);
    } else {
      totalAfter += before;
      console.log(`- ${file}: already optimized, skipped`);
    }
  } catch (err) {
    totalAfter += before;
    console.error(`✗ ${file}: ${err.message}`);
  }
}

console.log(`\nTotal: ${(totalBefore/1024/1024).toFixed(1)}MB → ${(totalAfter/1024/1024).toFixed(1)}MB (saved ${((totalBefore-totalAfter)/1024/1024).toFixed(1)}MB)`);
