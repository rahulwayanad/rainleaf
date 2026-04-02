/**
 * Generates icon-192.png and icon-512.png for PWA
 * Run: node generate-icons.mjs
 */
import { createCanvas } from 'canvas';
import { writeFileSync } from 'fs';

function drawLeaf(ctx, cx, cy, size) {
  const s = size * 0.38;

  // Main leaf shape
  ctx.beginPath();
  ctx.moveTo(cx, cy - s * 1.1);
  ctx.bezierCurveTo(cx + s * 1.1, cy - s * 0.6, cx + s * 1.1, cy + s * 0.6, cx, cy + s * 0.9);
  ctx.bezierCurveTo(cx - s * 1.1, cy + s * 0.6, cx - s * 1.1, cy - s * 0.6, cx, cy - s * 1.1);
  ctx.closePath();

  // Leaf gradient
  const grad = ctx.createLinearGradient(cx - s, cy - s, cx + s, cy + s);
  grad.addColorStop(0, '#7ec86e');
  grad.addColorStop(0.5, '#4a9e3f');
  grad.addColorStop(1, '#2d6e25');
  ctx.fillStyle = grad;
  ctx.fill();

  // Leaf shadow/depth
  ctx.beginPath();
  ctx.moveTo(cx, cy - s * 1.1);
  ctx.bezierCurveTo(cx + s * 1.1, cy - s * 0.6, cx + s * 1.1, cy + s * 0.6, cx, cy + s * 0.9);
  ctx.lineTo(cx, cy - s * 1.1);
  ctx.closePath();
  ctx.fillStyle = 'rgba(0,0,0,0.1)';
  ctx.fill();

  // Center vein
  ctx.beginPath();
  ctx.moveTo(cx, cy - s * 1.0);
  ctx.quadraticCurveTo(cx + s * 0.1, cy, cx, cy + s * 0.85);
  ctx.strokeStyle = 'rgba(255,255,255,0.35)';
  ctx.lineWidth = size * 0.018;
  ctx.lineCap = 'round';
  ctx.stroke();

  // Side veins
  const veins = [
    [0.25, -0.5, 0.55, -0.35],
    [0.2,  -0.1, 0.6,   0.05],
    [0.15,  0.3, 0.5,   0.45],
    [-0.2, -0.5, -0.5, -0.35],
    [-0.15,-0.1, -0.55,  0.05],
    [-0.1,  0.3, -0.45,  0.45],
  ];
  ctx.strokeStyle = 'rgba(255,255,255,0.2)';
  ctx.lineWidth = size * 0.01;
  veins.forEach(([x1, y1, x2, y2]) => {
    ctx.beginPath();
    ctx.moveTo(cx + x1 * s * 0.3, cy + y1 * s);
    ctx.lineTo(cx + x2 * s, cy + y2 * s);
    ctx.stroke();
  });

  // Stem
  ctx.beginPath();
  ctx.moveTo(cx, cy + s * 0.85);
  ctx.quadraticCurveTo(cx - s * 0.15, cy + s * 1.3, cx - s * 0.05, cy + s * 1.5);
  ctx.strokeStyle = '#4a7c3f';
  ctx.lineWidth = size * 0.022;
  ctx.lineCap = 'round';
  ctx.stroke();
}

function generateIcon(size) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');

  // Background with rounded corners
  ctx.fillStyle = '#1a2e1a';
  ctx.beginPath();
  ctx.roundRect(0, 0, size, size, size * 0.22);
  ctx.fill();

  // Subtle background glow
  const glow = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size * 0.5);
  glow.addColorStop(0, 'rgba(90,143,74,0.18)');
  glow.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.beginPath();
  ctx.roundRect(0, 0, size, size, size * 0.22);
  ctx.fillStyle = glow;
  ctx.fill();

  // Draw leaf centered slightly above middle
  drawLeaf(ctx, size / 2, size * 0.47, size);

  return canvas.toBuffer('image/png');
}

writeFileSync('public/images/icon-192.png', generateIcon(192));
console.log('✓ icon-192.png');

writeFileSync('public/images/icon-512.png', generateIcon(512));
console.log('✓ icon-512.png');
