/**
 * Removes baked-in ChatGPT backgrounds (black or checkerboard) using
 * edge-connected flood fill only — interior food pixels are never touched.
 */
import sharp from "sharp";
import { readFileSync, existsSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const ASSETS =
  "/Users/denish/.cursor/projects/Users-denish-Projects-AllSites-maison-ruban/assets";

const IMAGE_MAP = [
  ["window-cookie-float.png", "ChatGPT_Image_Jul_2__2026__12_31_53_PM-34517395-1d5b-4dcb-9728-9de7ccc14663.png"],
  ["madeleine-float.png", "ChatGPT_Image_Jul_2__2026__12_29_49_PM-de62dc87-cbd3-46a7-9f66-f36fab8da171.png"],
  ["naked-cake-float.png", "ChatGPT_Image_Jul_2__2026__12_35_50_PM-30984b42-4211-4582-a8fd-3de4055e145f.png"],
  ["apple-buns-float.png", "ChatGPT_Image_Jul_2__2026__12_28_13_PM-0a1ada89-50b5-4a20-8d78-d69ac444cd38.png"],
  ["trifle-float.png", "ChatGPT_Image_Jul_2__2026__12_26_30_PM-28587a66-b456-4b13-8057-dc391b360cf0.png"],
  ["semifreddo-float.png", "ChatGPT_Image_Jul_2__2026__12_24_21_PM-f88dda68-45b2-4b87-8d31-032e518a934c.png"],
  ["oat-cookie-float.png", "ChatGPT_Image_Jul_2__2026__12_22_58_PM-26c3bc9f-0de8-42ff-a028-b7ecda7ddb2d.png"],
  ["savoury-plate-float.png", "ChatGPT_Image_Jul_2__2026__12_29_08_PM-aae54957-0dcb-4399-8d14-1091172ca677.png"],
];

function colorSpread(r, g, b) {
  return Math.max(r, g, b) - Math.min(r, g, b);
}

function isForeground(r, g, b) {
  const spread = colorSpread(r, g, b);
  if (spread > 20) return true;
  if (r - g > 6 && r - b > 10) return true;
  if (g - b > 8 && r > 80) return true;
  return false;
}

function isBlackBackground(r, g, b) {
  return r <= 60 && g <= 60 && b <= 60;
}

function isLightBackground(r, g, b) {
  if (isForeground(r, g, b)) return false;
  const spread = colorSpread(r, g, b);
  if (spread > 14) return false;
  const avg = (r + g + b) / 3;
  return avg >= 195;
}

function detectMode(data, width, height) {
  const corners = [
    [0, 0],
    [width - 1, 0],
    [0, height - 1],
    [width - 1, height - 1],
  ];
  let sum = 0;
  for (const [x, y] of corners) {
    const i = (y * width + x) * 4;
    sum += (data[i] + data[i + 1] + data[i + 2]) / 3;
  }
  return sum / corners.length < 40 ? "black" : "light";
}

function isBackground(r, g, b, mode) {
  if (isForeground(r, g, b)) return false;
  return mode === "black" ? isBlackBackground(r, g, b) : isLightBackground(r, g, b);
}

function floodRemoveBackground(data, width, height, mode) {
  const total = width * height;
  const visited = new Uint8Array(total);
  const remove = new Uint8Array(total);
  const queue = [];

  const tryPush = (x, y) => {
    if (x < 0 || y < 0 || x >= width || y >= height) return;
    const idx = y * width + x;
    if (visited[idx]) return;
    const i = idx * 4;
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    if (!isBackground(r, g, b, mode)) return;
    visited[idx] = 1;
    remove[idx] = 1;
    queue.push(idx);
  };

  for (let x = 0; x < width; x++) {
    tryPush(x, 0);
    tryPush(x, height - 1);
  }
  for (let y = 0; y < height; y++) {
    tryPush(0, y);
    tryPush(width - 1, y);
  }

  while (queue.length) {
    const idx = queue.pop();
    const x = idx % width;
    const y = (idx - x) / width;
    tryPush(x - 1, y);
    tryPush(x + 1, y);
    tryPush(x, y - 1);
    tryPush(x, y + 1);
  }

  for (let idx = 0; idx < total; idx++) {
    if (remove[idx]) data[idx * 4 + 3] = 0;
  }
}

async function processImage(sourcePath, outputPath) {
  const { data, info } = await sharp(sourcePath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const pixels = new Uint8Array(data);
  const mode = detectMode(pixels, info.width, info.height);
  floodRemoveBackground(pixels, info.width, info.height, mode);

  await sharp(pixels, {
    raw: { width: info.width, height: info.height, channels: 4 },
  })
    .png({ compressionLevel: 9 })
    .toFile(outputPath);

  return mode;
}

for (const [outName, assetName] of IMAGE_MAP) {
  const source = path.join(ASSETS, assetName);
  const output = path.join(ROOT, "public/images", outName);

  if (!existsSync(source)) {
    console.error("Missing source:", source);
    continue;
  }

  const mode = await processImage(source, output);
  const meta = await sharp(output).metadata();
  console.log(`✓ ${outName} (${mode} bg) → ${meta.width}x${meta.height} alpha=${meta.hasAlpha}`);
}
