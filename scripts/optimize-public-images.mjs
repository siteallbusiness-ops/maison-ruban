/**
 * Generate modern WebP versions for images in /public/images.
 *
 * - Keeps originals (png/jpg) for maximum compatibility (e.g. OG images).
 * - Writes sibling .webp files next to the originals.
 * - Skips when the .webp is already newer than the source.
 */
import sharp from "sharp";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const IMAGES_DIR = path.join(ROOT, "public", "images");

const SOURCE_EXTS = new Set([".png", ".jpg", ".jpeg"]);

function webpTargetFor(srcPath) {
  const dir = path.dirname(srcPath);
  const base = path.basename(srcPath, path.extname(srcPath));
  return path.join(dir, `${base}.webp`);
}

async function isNewer(a, b) {
  // returns true if file a is newer than file b
  const [aStat, bStat] = await Promise.all([fs.promises.stat(a), fs.promises.stat(b)]);
  return aStat.mtimeMs > bStat.mtimeMs;
}

async function optimizeOne(srcPath) {
  const ext = path.extname(srcPath).toLowerCase();
  if (!SOURCE_EXTS.has(ext)) return { skipped: true, reason: "unsupported" };

  const outPath = webpTargetFor(srcPath);
  const outExists = fs.existsSync(outPath);
  if (outExists) {
    const srcIsNewer = await isNewer(srcPath, outPath).catch(() => true);
    if (!srcIsNewer) return { skipped: true, reason: "up-to-date" };
  }

  const image = sharp(srcPath);
  const meta = await image.metadata();
  const hasAlpha = Boolean(meta.hasAlpha);

  // Reasonable defaults for “premium” visuals with small files.
  // Alpha assets (cutouts) get higher alphaQuality to avoid halos.
  const webpOptions = hasAlpha
    ? { quality: 82, alphaQuality: 92, effort: 6 }
    : { quality: 80, effort: 6 };

  await image
    .rotate() // respect EXIF
    .webp(webpOptions)
    .toFile(outPath);

  const [srcStat, outStat] = await Promise.all([
    fs.promises.stat(srcPath),
    fs.promises.stat(outPath),
  ]);

  return {
    skipped: false,
    outPath,
    hasAlpha,
    srcBytes: srcStat.size,
    outBytes: outStat.size,
  };
}

async function walk(dir) {
  const entries = await fs.promises.readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walk(full)));
    } else if (entry.isFile()) {
      files.push(full);
    }
  }
  return files;
}

async function main() {
  if (!fs.existsSync(IMAGES_DIR)) {
    console.error("Missing directory:", IMAGES_DIR);
    process.exit(1);
  }

  const allFiles = await walk(IMAGES_DIR);
  const sources = allFiles
    .filter((f) => SOURCE_EXTS.has(path.extname(f).toLowerCase()))
    .sort((a, b) => a.localeCompare(b));
  if (!sources.length) {
    console.log("No source images found in", IMAGES_DIR);
    return;
  }

  let done = 0;
  let skipped = 0;

  for (const srcPath of sources) {
    const result = await optimizeOne(srcPath);
    if (result.skipped) {
      skipped += 1;
      continue;
    }

    done += 1;
    const ratio = result.srcBytes ? (result.outBytes / result.srcBytes) : 0;
    console.log(
      `✓ ${path.relative(ROOT, srcPath)} → ${path.relative(ROOT, result.outPath)} ` +
        `(alpha=${result.hasAlpha ? "yes" : "no"} ` +
        `${Math.round(result.srcBytes / 1024)}KB → ${Math.round(result.outBytes / 1024)}KB, ` +
        `${Math.round(ratio * 100)}%)`
    );
  }

  console.log(`\nDone: ${done} converted, ${skipped} skipped.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

