import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const svgBuffer = fs.readFileSync(path.resolve('./public/icon.svg'));

async function generate() {
  // 512x512 standard
  await sharp(svgBuffer)
    .resize(512, 512)
    .png()
    .toFile('./public/pwa-512x512.png');

  // 192x192 standard
  await sharp(svgBuffer)
    .resize(192, 192)
    .png()
    .toFile('./public/pwa-192x192.png');

  // apple-touch-icon 180x180
  await sharp(svgBuffer)
    .resize(180, 180)
    .png()
    .toFile('./public/apple-touch-icon.png');

  // Maskable 512x512 with safe padding (15% padding = 76px around, icon size 360x360)
  const innerIcon = await sharp(svgBuffer)
    .resize(380, 380)
    .toBuffer();

  await sharp({
    create: {
      width: 512,
      height: 512,
      channels: 4,
      background: { r: 13, g: 60, b: 46, alpha: 1 }
    }
  })
    .composite([{ input: innerIcon, top: 66, left: 66 }])
    .png()
    .toFile('./public/pwa-maskable-512x512.png');

  // favicon 48x48
  await sharp(svgBuffer)
    .resize(48, 48)
    .png()
    .toFile('./public/favicon.png');

  console.log('Icons generated successfully!');
}

generate().catch(console.error);
