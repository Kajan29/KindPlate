const sharp = require('sharp');
const path = require('path');

const ASSETS = path.join(__dirname, '..', 'assets');
const IMAGES = path.join(ASSETS, 'images');
const SRC = path.join(ASSETS, 'log0.png');

(async () => {
  const meta = await sharp(SRC).metadata();
  console.log('source:', meta.width, 'x', meta.height);

  // Sample the cream background color from a top corner of the source.
  const { data } = await sharp(SRC)
    .extract({ left: 4, top: 4, width: 1, height: 1 })
    .raw()
    .toBuffer({ resolveWithObject: true });
  const cream = { r: data[0], g: data[1], b: data[2] };
  console.log('sampled cream bg:', cream);

  // 1) Crop off the "KIND PLATE" text, keep the circular emblem, then trim the border.
  const cropH = Math.round(meta.height * 0.72);
  const croppedBuf = await sharp(SRC)
    .extract({ left: 0, top: 0, width: meta.width, height: cropH })
    .toBuffer();
  const emblemBuf = await sharp(croppedBuf).trim({ threshold: 15 }).toBuffer();
  const em = await sharp(emblemBuf).metadata();
  console.log('trimmed emblem:', em.width, 'x', em.height);

  // 2) App icon (iOS / web / general): emblem on a full-bleed cream square, 1024x1024.
  //    Small inset so the badge doesn't touch the edges.
  const ICON = 1024;
  const iconInner = Math.round(ICON * 0.9);
  const iconEmblem = await sharp(emblemBuf)
    .resize(iconInner, iconInner, { fit: 'contain', background: { ...cream, alpha: 0 } })
    .toBuffer();
  await sharp({
    create: {
      width: ICON,
      height: ICON,
      channels: 4,
      background: { ...cream, alpha: 1 },
    },
  })
    .composite([{ input: iconEmblem, gravity: 'center' }])
    .png()
    .toFile(path.join(IMAGES, 'icon.png'));
  console.log('wrote images/icon.png');

  // 3) Android adaptive foreground: emblem centered on transparent canvas within the
  //    safe zone (~66%), so the maroon backgroundColor (#4b1426) frames it.
  const ADAPT = 1024;
  const adaptInner = Math.round(ADAPT * 0.66);
  const adaptEmblem = await sharp(emblemBuf)
    .resize(adaptInner, adaptInner, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .toBuffer();
  await sharp({
    create: {
      width: ADAPT,
      height: ADAPT,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite([{ input: adaptEmblem, gravity: 'center' }])
    .png()
    .toFile(path.join(IMAGES, 'adaptive-icon.png'));
  console.log('wrote images/adaptive-icon.png');

  // 4) Web favicon.
  await sharp(path.join(IMAGES, 'icon.png'))
    .resize(48, 48)
    .png()
    .toFile(path.join(IMAGES, 'favicon.png'));
  console.log('wrote images/favicon.png');
})();
