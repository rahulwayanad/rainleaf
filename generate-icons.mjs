/**
 * Generates icon-192.png and icon-512.png for PWA
 * Run: node generate-icons.mjs
 */
import { createCanvas } from 'canvas';
import { writeFileSync } from 'fs';

function generateIcon(size) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');

  // Background
  ctx.fillStyle = '#1a2e1a';
  ctx.beginPath();
  ctx.roundRect(0, 0, size, size, size * 0.2);
  ctx.fill();

  // Leaf emoji
  ctx.font = `${size * 0.6}px serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('🍃', size / 2, size / 2);

  return canvas.toBuffer('image/png');
}

writeFileSync('public/images/icon-192.png', generateIcon(192));
console.log('✓ icon-192.png');

writeFileSync('public/images/icon-512.png', generateIcon(512));
console.log('✓ icon-512.png');
