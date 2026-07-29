// One-off asset generator: creates brand PNGs for the splash logo and app icon.
// Uses only Node built-ins (zlib) so it runs anywhere without extra deps.
// Run: node scripts/gen-splash.js
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

// ---- Brand palette -------------------------------------------------------
const MAROON = [0x4b, 0x14, 0x26];
const CREAM = [0xff, 0xf4, 0xde];
const GOLD = [0xf0, 0xb4, 0x58];
const ROSE = [0x7a, 0x1b, 0x39];

// ---- PNG encoder ---------------------------------------------------------
function crc32(buf) {
  let c = ~0;
  for (let i = 0; i < buf.length; i++) {
    c ^= buf[i];
    for (let k = 0; k < 8; k++) c = (c >>> 1) ^ (0xedb88320 & -(c & 1));
  }
  return ~c >>> 0;
}
function chunk(type, data) {
  const t = Buffer.from(type, 'ascii');
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(Buffer.concat([t, data])), 0);
  return Buffer.concat([len, t, data, crc]);
}
function encodePNG(width, height, rgba) {
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // color type RGBA
  const raw = Buffer.alloc((width * 4 + 1) * height);
  for (let y = 0; y < height; y++) {
    raw[y * (width * 4 + 1)] = 0; // filter type none
    rgba.copy(raw, y * (width * 4 + 1) + 1, y * width * 4, (y + 1) * width * 4);
  }
  const idat = zlib.deflateSync(raw, { level: 9 });
  return Buffer.concat([
    sig,
    chunk('IHDR', ihdr),
    chunk('IDAT', idat),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

// ---- Drawing (rendered at 2x then box-downsampled for anti-aliasing) -----
// Heart implicit function; returns true when point (u,v) is inside the heart.
function insideHeart(u, v) {
  const a = u * u + v * v - 1;
  return a * a * a - u * u * v * v * v <= 0;
}

function renderLogo(size, opaqueBg) {
  const SS = 2; // supersample factor
  const N = size * SS;
  const hi = Buffer.alloc(N * N * 4);
  const cx = N / 2;
  const cy = N / 2;
  const rimR = N * 0.46;
  const plateR = N * 0.42;
  const heartS = N * 0.24; // heart scale

  for (let y = 0; y < N; y++) {
    for (let x = 0; x < N; x++) {
      const dx = x + 0.5 - cx;
      const dy = y + 0.5 - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      let r, g, b, a;
      if (opaqueBg) {
        [r, g, b] = MAROON;
        a = 255;
      } else {
        r = g = b = 0;
        a = 0;
      }
      if (dist <= rimR) {
        [r, g, b] = GOLD;
        a = 255;
      }
      if (dist <= plateR) {
        [r, g, b] = CREAM;
        a = 255;
      }
      // Heart centered, y flipped (image y grows downward), nudged up slightly.
      const u = dx / heartS;
      const v = -(dy + N * 0.02) / heartS;
      if (insideHeart(u, v)) {
        [r, g, b] = ROSE;
        a = 255;
      }
      const o = (y * N + x) * 4;
      hi[o] = r;
      hi[o + 1] = g;
      hi[o + 2] = b;
      hi[o + 3] = a;
    }
  }

  // Box downsample SSxSS -> 1x
  const out = Buffer.alloc(size * size * 4);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      let r = 0, g = 0, bl = 0, al = 0;
      for (let sy = 0; sy < SS; sy++) {
        for (let sx = 0; sx < SS; sx++) {
          const o = ((y * SS + sy) * N + (x * SS + sx)) * 4;
          const pa = hi[o + 3];
          r += hi[o] * pa;
          g += hi[o + 1] * pa;
          bl += hi[o + 2] * pa;
          al += pa;
        }
      }
      const o = (y * size + x) * 4;
      if (al === 0) {
        out[o] = out[o + 1] = out[o + 2] = out[o + 3] = 0;
      } else {
        out[o] = Math.round(r / al);
        out[o + 1] = Math.round(g / al);
        out[o + 2] = Math.round(bl / al);
        out[o + 3] = Math.round(al / (SS * SS));
      }
    }
  }
  return out;
}

const outDir = path.join(__dirname, '..', 'assets', 'images');
fs.mkdirSync(outDir, { recursive: true });

const splash = renderLogo(1024, false);
fs.writeFileSync(path.join(outDir, 'splash-logo.png'), encodePNG(1024, 1024, splash));

const icon = renderLogo(1024, true);
fs.writeFileSync(path.join(outDir, 'icon.png'), encodePNG(1024, 1024, icon));

// Adaptive icon foreground: transparent bg, logo sized smaller for safe zone.
const adaptive = renderLogo(1024, false);
fs.writeFileSync(path.join(outDir, 'adaptive-icon.png'), encodePNG(1024, 1024, adaptive));

console.log('Wrote splash-logo.png, icon.png, adaptive-icon.png to', outDir);
