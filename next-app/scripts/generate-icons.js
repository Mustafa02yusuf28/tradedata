const fs = require('fs');
const path = require('path');

// Create a simple SVG icon that can be converted to PNG
const createSVGIcon = (size) => `
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#00ffcc;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#0080ff;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="${size}" height="${size}" rx="${size * 0.2}" fill="url(#grad1)"/>
  <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="${size * 0.4}" font-weight="bold" text-anchor="middle" dy=".3em" fill="white">Q</text>
</svg>
`;

// Create placeholder icon files
const createIconFile = (filename, size) => {
  const svgContent = createSVGIcon(size);
  const filePath = path.join(__dirname, '..', 'public', filename);
  
  // Create public directory if it doesn't exist
  const publicDir = path.dirname(filePath);
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }
  
  fs.writeFileSync(filePath, svgContent);
  console.log(`Created ${filename}`);
};

// Generate the required icons
console.log('Generating PWA icons...');

// Create icon files
createIconFile('icon-192x192.png', 192);
createIconFile('icon-512x512.png', 512);
createIconFile('apple-touch-icon.png', 180);
createIconFile('og-image.jpg', 1200);

console.log('Icon generation complete!');
console.log('Note: These are SVG placeholders. For production, replace with actual PNG/JPG icons.'); 