#!/usr/bin/env node
/**
 * optimize-images.mjs
 *
 * Automatically optimizes all images in public/images/:
 * - Resizes to max 2000px wide (preserves aspect ratio)
 * - Compresses JPEG to quality 80
 * - Creates WebP version alongside originals
 * - Skips already-optimized images (uses .optimized marker)
 *
 * Run: node scripts/optimize-images.mjs
 * Runs automatically before `npm run build` via prebuild hook.
 */

import sharp from "sharp";
import { readdirSync, statSync, existsSync, writeFileSync, readFileSync, unlinkSync, mkdirSync } from "fs";
import { join, extname, basename } from "path";

const IMAGE_DIR = "public/images";
const WEBP_DIR = join(IMAGE_DIR, "webp");
const MAX_WIDTH = 2000;
const JPEG_QUALITY = 80;
const WEBP_QUALITY = 80;
const MARKER_FILE = join(IMAGE_DIR, ".optimized");

// Size limits for web — warn if exceeded after optimization
const WARN_SIZE_KB = 500;   // hero images can be up to 500KB
const MAX_SIZE_KB = 800;    // absolute max — build fails if any image exceeds this
const JPEG_QUALITY_AGGRESSIVE = 60;  // retry quality if still too large

const IMAGE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp"]);

function getImageFiles(dir) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir).filter((f) => {
    const ext = extname(f).toLowerCase();
    return IMAGE_EXTENSIONS.has(ext) && !f.startsWith(".");
  });
}

function loadMarker() {
  if (!existsSync(MARKER_FILE)) return {};
  try {
    return JSON.parse(readFileSync(MARKER_FILE, "utf-8"));
  } catch {
    return {};
  }
}

function saveMarker(data) {
  writeFileSync(MARKER_FILE, JSON.stringify(data, null, 2));
}

async function optimizeImage(filePath) {
  const image = sharp(filePath);
  const metadata = await image.metadata();

  const needsResize = metadata.width > MAX_WIDTH;
  const ext = extname(filePath).toLowerCase();

  // First pass: normal quality
  let buffer = await compressImage(filePath, ext, JPEG_QUALITY, needsResize);
  let sizeKB = Math.round(buffer.length / 1024);

  // Second pass: if still too large, use aggressive compression
  if (sizeKB > WARN_SIZE_KB && ext !== ".webp") {
    console.log(`  ⚠️  ${basename(filePath)}: ${sizeKB}KB > ${WARN_SIZE_KB}KB, retrying with quality ${JPEG_QUALITY_AGGRESSIVE}...`);
    buffer = await compressImage(filePath, ext, JPEG_QUALITY_AGGRESSIVE, needsResize);
    sizeKB = Math.round(buffer.length / 1024);
  }

  // Write optimized file
  writeFileSync(filePath, buffer);

  // Also create .webp version in webp/ subfolder (keeps CMS media clean)
  if (ext !== ".webp") {
    mkdirSync(WEBP_DIR, { recursive: true });
    const webpPath = join(WEBP_DIR, basename(filePath).replace(/\.[^.]+$/, ".webp"));
    const webpBuffer = await sharp(buffer)
      .resize({ width: MAX_WIDTH, withoutEnlargement: true })
      .webp({ quality: WEBP_QUALITY })
      .toBuffer();
    writeFileSync(webpPath, webpBuffer);
  }

  return {
    width: needsResize ? MAX_WIDTH : metadata.width,
    originalWidth: metadata.width,
    sizeKB,
  };
}

async function compressImage(filePath, ext, quality, needsResize) {
  let pipeline = sharp(filePath);
  if (needsResize) {
    pipeline = pipeline.resize({ width: MAX_WIDTH, withoutEnlargement: true });
  }

  if (ext === ".jpg" || ext === ".jpeg") {
    return pipeline.jpeg({ quality, mozjpeg: true }).toBuffer();
  } else if (ext === ".png") {
    return pipeline.png({ compressionLevel: 9 }).toBuffer();
  } else if (ext === ".webp") {
    return pipeline.webp({ quality }).toBuffer();
  }
  // Fallback
  return pipeline.toBuffer();
}

async function main() {
  // 1. Clean up orphaned .webp files in webp/ subfolder (source image was deleted)
  const allFiles = existsSync(IMAGE_DIR) ? readdirSync(IMAGE_DIR) : [];
  const originals = new Set(
    allFiles
      .filter((f) => !f.startsWith(".") && extname(f).toLowerCase() !== ".webp")
      .map((f) => f.replace(/\.[^.]+$/, ""))
  );
  const webpFiles = existsSync(WEBP_DIR)
    ? readdirSync(WEBP_DIR).filter((f) => extname(f).toLowerCase() === ".webp" && !f.startsWith("."))
    : [];
  let removed = 0;
  for (const wf of webpFiles) {
    const stem = wf.replace(/\.webp$/i, "");
    if (!originals.has(stem)) {
      const wPath = join(WEBP_DIR, wf);
      unlinkSync(wPath);
      console.log(`  🗑️  webp/${wf} poistettu (alkuperäiskuva puuttuu)`);
      // Also remove from marker
      const marker = loadMarker();
      delete marker[wf];
      saveMarker(marker);
      removed++;
    }
  }
  if (removed > 0) {
    console.log(`\n🧹 Siivottu ${removed} orpoa .webp-tiedostoa.`);
  }

  // 2. Optimize images
  const files = getImageFiles(IMAGE_DIR);
  if (files.length === 0) {
    console.log("📷 No images to optimize.");
    return;
  }

  const marker = loadMarker();
  let optimized = 0;
  let skipped = 0;

  for (const file of files) {
    const filePath = join(IMAGE_DIR, file);
    const stat = statSync(filePath);
    const fileKey = `${file}:${stat.size}:${stat.mtimeMs}`;

    // Skip if already optimized (same file, same size, same mtime)
    if (marker[file] === fileKey) {
      skipped++;
      continue;
    }

    const originalSizeKB = Math.round(stat.size / 1024);
    try {
      const result = await optimizeImage(filePath);
      const newStat = statSync(filePath);
      marker[file] = `${file}:${newStat.size}:${newStat.mtimeMs}`;

      const saved = originalSizeKB - result.sizeKB;
      const pct = originalSizeKB > 0 ? Math.round((saved / originalSizeKB) * 100) : 0;

      if (result.originalWidth > MAX_WIDTH) {
        console.log(
          `  ✅ ${file}: ${result.originalWidth}→${result.width}px, ${originalSizeKB}KB→${result.sizeKB}KB (−${pct}%)`
        );
      } else {
        console.log(`  ✅ ${file}: ${originalSizeKB}KB→${result.sizeKB}KB (−${pct}%)`);
      }
      optimized++;
    } catch (err) {
      console.error(`  ❌ ${file}: ${err.message}`);
    }
  }

  saveMarker(marker);
  console.log(`\n📷 Done: ${optimized} optimized, ${skipped} skipped (already up to date).`);

  // Final check: verify ALL images (including skipped) are within limits
  const warnings = [];
  const errors = [];
  for (const file of getImageFiles(IMAGE_DIR)) {
    const filePath = join(IMAGE_DIR, file);
    const sizeKB = Math.round(statSync(filePath).size / 1024);
    if (sizeKB > MAX_SIZE_KB) {
      errors.push(`  🚫 ${file}: ${sizeKB}KB ylittää rajan ${MAX_SIZE_KB}KB — kuva on liian suuri verkkosivulle!`);
    } else if (sizeKB > WARN_SIZE_KB) {
      warnings.push(`  ⚠️  ${file}: ${sizeKB}KB > ${WARN_SIZE_KB}KB — toimii mutta iso`);
    }
  }

  if (warnings.length > 0) {
    console.log("\n⚠️  Isot kuvat (varoitus):");
    warnings.forEach((w) => console.log(w));
  }

  if (errors.length > 0) {
    console.log("\n🚫 Liian suuret kuvat (build estetty):");
    errors.forEach((e) => console.error(e));
    console.error("\n❌ Build keskeytetty: kuvia yli " + MAX_SIZE_KB + "KB. Pienennä kuvat ennen julkaisua.");
    process.exit(1);
  }

  console.log("✅ Kaikki kuvat verkkosivukelpoisia.");
}

main();
