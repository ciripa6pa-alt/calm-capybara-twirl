const fs = require('fs');
const path = require('path');

// Create a proper 1x1 transparent PNG
function createPNG(width, height) {
  // PNG signature
  const signature = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]);
  
  // IHDR chunk
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);  // width
  ihdrData.writeUInt32BE(height, 4); // height
  ihdrData[8] = 8;   // bit depth
  ihdrData[9] = 6;   // color type (RGBA)
  ihdrData[10] = 0;  // compression
  ihdrData[11] = 0;  // filter
  ihdrData[12] = 0;  // interlace
  
  const ihdrCrc = crc32(Buffer.concat([Buffer.from('IHDR'), ihdrData]));
  const ihdrChunk = Buffer.concat([
    Buffer.from([0x00, 0x00, 0x00, 0x0D]), // length
    Buffer.from('IHDR'),
    ihdrData,
    ihdrCrc
  ]);
  
  // IDAT chunk (1x1 transparent pixel)
  const pixelData = Buffer.from([0x00, 0x00, 0x00, 0x00, 0x00]); // filter + RGBA
  const compressed = Buffer.from([0x78, 0x9C, 0x62, 0x00, 0x02, 0x00, 0x00, 0x05, 0x00, 0x01, 0x0D, 0x0A, 0x2D, 0xB4]);
  const idatCrc = crc32(Buffer.concat([Buffer.from('IDAT'), compressed]));
  const idatChunk = Buffer.concat([
    Buffer.from([0x00, 0x00, 0x00, 0x0E]), // length
    Buffer.from('IDAT'),
    compressed,
    idatCrc
  ]);
  
  // IEND chunk
  const iendCrc = crc32(Buffer.from('IEND'));
  const iendChunk = Buffer.concat([
    Buffer.from([0x00, 0x00, 0x00, 0x00]), // length
    Buffer.from('IEND'),
    iendCrc
  ]);
  
  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

// Simple CRC32 implementation
function crc32(data) {
  const table = [];
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let j = 0; j < 8; j++) {
      c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
    }
    table[i] = c;
  }
  
  let crc = 0 ^ (-1);
  for (let i = 0; i < data.length; i++) {
    crc = (crc >>> 8) ^ table[(crc ^ data[i]) & 0xFF];
  }
  return Buffer.from([(crc ^ -1) >>> 24, (crc ^ -1) >>> 16, (crc ^ -1) >>> 8, (crc ^ -1)]);
}

// Create public directory if it doesn't exist
const publicDir = path.join(__dirname, 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Icon sizes needed
const iconSizes = [72, 96, 128, 144, 152, 192, 384, 512];

// Create proper PNG icons
iconSizes.forEach(size => {
  const filename = `icon-${size}x${size}.png`;
  const pngData = createPNG(size, size);
  fs.writeFileSync(path.join(publicDir, filename), pngData);
  console.log(`Created ${filename} (${pngData.length} bytes)`);
});

// Create favicon.ico (16x16)
const faviconData = createPNG(16, 16);
fs.writeFileSync(path.join(publicDir, 'favicon.ico'), faviconData);

// Create apple-touch-icon (180x180)
const appleIconData = createPNG(180, 180);
fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), appleIconData);

// Create simple SVG icon
const svgContent = `<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <rect width="512" height="512" fill="#000000"/>
  <text x="256" y="280" font-family="Arial, sans-serif" font-size="240" font-weight="bold" text-anchor="middle" fill="#ffffff">KS</text>
</svg>`;
fs.writeFileSync(path.join(publicDir, 'icon.svg'), svgContent);

console.log('Icons generated successfully!');
