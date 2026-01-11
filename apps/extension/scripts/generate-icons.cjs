/**
 * Script to generate placeholder icons for the extension
 * Run with: node scripts/generate-icons.cjs
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const { Buffer } = require('buffer');

const iconsDir = path.join(__dirname, '../icons');
const sizes = [16, 48, 128];

// Create icons directory if it doesn't exist
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// Color scheme: Yellow sticky note with blue accent
const backgroundColor = '#FFD700'; // Gold/Yellow
const noteColor = '#FFE55C'; // Lighter yellow
const borderColor = '#D4AF37'; // Darker gold
const textColor = '#1E3A8A'; // Dark blue

async function generateIcon(size) {
  // Create SVG string for the icon
  const svg = `
    <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${backgroundColor};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${noteColor};stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="${size}" height="${size}" fill="url(#grad)" rx="${size * 0.1}"/>
      <!-- Sticky note corner fold -->
      <path d="M ${size * 0.7} 0 L ${size} 0 L ${size} ${size * 0.3} L ${size * 0.7} 0 Z" fill="${borderColor}" opacity="0.3"/>
      <!-- Note lines (for larger sizes) -->
      ${size >= 48 ? `
        <line x1="${size * 0.2}" y1="${size * 0.4}" x2="${size * 0.8}" y2="${size * 0.4}" stroke="${textColor}" stroke-width="${size * 0.02}" opacity="0.3"/>
        <line x1="${size * 0.2}" y1="${size * 0.5}" x2="${size * 0.7}" y2="${size * 0.5}" stroke="${textColor}" stroke-width="${size * 0.02}" opacity="0.3"/>
        <line x1="${size * 0.2}" y1="${size * 0.6}" x2="${size * 0.75}" y2="${size * 0.6}" stroke="${textColor}" stroke-width="${size * 0.02}" opacity="0.3"/>
      ` : ''}
    </svg>
  `;

  const iconPath = path.join(iconsDir, `icon${size}.png`);
  
  // Convert SVG string to Buffer for sharp
  await sharp(Buffer.from(svg))
    .png()
    .resize(size, size)
    .toFile(iconPath);
  
  console.log(`✅ Generated ${iconPath} (${size}x${size})`);
}

async function generateAllIcons() {
  console.log('🎨 Generating extension icons...\n');
  
  for (const size of sizes) {
    await generateIcon(size);
  }
  
  console.log('\n✨ All icons generated successfully!');
}

generateAllIcons().catch(console.error);

