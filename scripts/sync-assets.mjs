import fs from "node:fs";
import path from "node:path";

const ROOT_DIR = process.cwd();
const IMAGES_DIR = path.join(ROOT_DIR, "public", "assets", "images");
const MODELS_DIR = path.join(ROOT_DIR, "public", "assets", "3d");
const MANIFEST_PATH = path.join(ROOT_DIR, "src", "content", "asset-manifest.json");

const CATEGORY_SLUGS = [
  { index: "01", slug: "labels" },
  { index: "02", slug: "stickers" },
  { index: "03", slug: "heat-transfer" },
  { index: "04", slug: "offset-paper-items" },
  { index: "05", slug: "patches" },
  { index: "06", slug: "narrow-fabrics" },
  { index: "07", slug: "gum-tape" },
  { index: "08", slug: "cartons" },
  { index: "09", slug: "buttons" },
  { index: "10", slug: "metallic-items" },
  { index: "11", slug: "collar-stand-and-butterfly" },
  { index: "12", slug: "lock-strings-and-pullers" },
  { index: "13", slug: "desiccant-items" },
];

const IMAGE_EXTENSIONS = [".png", ".jpg", ".jpeg", ".webp", ".avif", ".svg"];
const MODEL_EXTENSIONS = [".glb", ".gltf"];

function findBestMatch(dirPath, urlPrefix, baseNames, allowedExts, defaultFile) {
  if (!fs.existsSync(dirPath)) {
    return `${urlPrefix}/${defaultFile}`;
  }

  const allFiles = fs.readdirSync(dirPath);
  const candidates = [];

  for (const file of allFiles) {
    const ext = path.extname(file).toLowerCase();
    if (!allowedExts.includes(ext)) continue;

    const nameWithoutExt = path.basename(file, path.extname(file)).toLowerCase();
    if (baseNames.includes(nameWithoutExt)) {
      const fullPath = path.join(dirPath, file);
      const stat = fs.statSync(fullPath);
      candidates.push({
        file,
        mtimeMs: stat.mtimeMs,
        isNonDefaultExt: ext !== path.extname(defaultFile).toLowerCase(),
      });
    }
  }

  if (candidates.length === 0) {
    return `${urlPrefix}/${defaultFile}`;
  }

  // Sort by most recently modified first (so newly dropped/renamed user files win automatically)
  candidates.sort((a, b) => b.mtimeMs - a.mtimeMs);
  return `${urlPrefix}/${candidates[0].file}`;
}

function buildManifest() {
  const manifest = {
    images: {},
    models: {},
  };

  for (const { index, slug } of CATEGORY_SLUGS) {
    // Primary category image: supports <slug>.(png|jpg|jpeg|webp) or <index>-<slug>.(png|jpg|jpeg|webp)
    manifest.images[slug] = findBestMatch(
      IMAGES_DIR,
      "/assets/images",
      [slug, `${index}-${slug}`],
      IMAGE_EXTENSIONS,
      `${slug}.png`
    );

    // 3 Gallery images: <slug>-1, <slug>-2, <slug>-3
    for (const num of [1, 2, 3]) {
      const key = `${slug}-${num}`;
      manifest.images[key] = findBestMatch(
        IMAGES_DIR,
        "/assets/images",
        [key, `${index}-${key}`],
        IMAGE_EXTENSIONS,
        `${key}.png`
      );
    }

    // 3D GLB model: <slug>.glb or <index>-<slug>.glb
    manifest.models[slug] = findBestMatch(
      MODELS_DIR,
      "/assets/3d",
      [slug, `${index}-${slug}`],
      MODEL_EXTENSIONS,
      `${slug}.glb`
    );
  }

  fs.mkdirSync(path.dirname(MANIFEST_PATH), { recursive: true });
  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2) + "\n", "utf-8");
  console.log(
    `Synced ${Object.keys(manifest.images).length} image slots and ${Object.keys(manifest.models).length} 3D model slots -> src/content/asset-manifest.json`
  );
}

buildManifest();
