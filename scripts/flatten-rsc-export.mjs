import fs from "node:fs";
import path from "node:path";

const OUT_DIR = path.resolve(process.cwd(), "out");

/**
 * Next.js 16 static export writes RSC segment payloads inside nested `__next.*` folders
 * (e.g., `out/accessories/__next.accessories/__PAGE__.txt`), whereas the client router
 * requests dot-flattened filenames (`out/accessories/__next.accessories.__PAGE__.txt`)
 * on static file hosts like Plesk/Apache/Nginx.
 *
 * This post-build step copies nested `__next.*` files to their dot-flattened equivalents
 * inside `out/` so static servers serve every RSC prefetch with HTTP 200.
 */
function flattenNextRscDirs(dir) {
  if (!fs.existsSync(dir)) return 0;
  let copiedCount = 0;

  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name.startsWith("__next.")) {
        copiedCount += copyFlattenedChildren(dir, entry.name, fullPath);
      } else {
        copiedCount += flattenNextRscDirs(fullPath);
      }
    }
  }

  return copiedCount;
}

function copyFlattenedChildren(baseDir, prefix, currentDir) {
  let count = 0;
  const entries = fs.readdirSync(currentDir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(currentDir, entry.name);
    if (entry.isDirectory()) {
      count += copyFlattenedChildren(
        baseDir,
        `${prefix}.${entry.name}`,
        fullPath
      );
    } else if (entry.isFile()) {
      const targetName = `${prefix}.${entry.name}`;
      const targetPath = path.join(baseDir, targetName);
      fs.copyFileSync(fullPath, targetPath);
      count++;
    }
  }
  return count;
}

const total = flattenNextRscDirs(OUT_DIR);
console.log(`✓ Flattened ${total} Next.js RSC static export payload files in out/`);
