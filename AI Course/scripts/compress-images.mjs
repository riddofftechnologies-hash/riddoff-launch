import sharp from "sharp";
import { readdirSync, statSync } from "fs";
import { join, extname } from "path";

const dir = decodeURIComponent(new URL("../src/assets", import.meta.url).pathname.replace(/^\/([A-Z]:)/, "$1"));

const files = readdirSync(dir).filter(f => [".png", ".jpg", ".jpeg"].includes(extname(f).toLowerCase()));

for (const file of files) {
  const src = join(dir, file);
  const before = statSync(src).size;

  await sharp(src)
    .resize({ width: 800, withoutEnlargement: true })
    .webp({ quality: 80 })
    .toFile(src.replace(/\.(png|jpe?g)$/i, ".webp"));

  // Overwrite original PNG with compressed version too (for fallback)
  await sharp(src)
    .resize({ width: 800, withoutEnlargement: true })
    .png({ compressionLevel: 9, quality: 80 })
    .toFile(src + ".tmp");

  const { renameSync } = await import("fs");
  renameSync(src + ".tmp", src);

  const after = statSync(src).size;
  console.log(`${file}: ${(before / 1024).toFixed(0)} KB → ${(after / 1024).toFixed(0)} KB`);
}

console.log("\nDone. WebP versions created alongside originals.");
