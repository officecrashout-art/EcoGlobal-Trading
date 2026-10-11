# How to Replace Pictures & 3D Assets (By Simply Renaming Files)

All product pictures and 3D models on the Eco Global BD website are loaded directly from this `public/assets/` folder. **You do not need to edit any code** to change a picture or 3D model — simply put your new file into the folder and rename it to match the existing filename.

---

## 1. Where the Files Live

- **Product Pictures Folder**: `public/assets/images/`
- **3D Models Folder**: `public/assets/3d/`
- **Brand Logos Folder**: `public/images/` (`logo-full.png` and `logo-mark.png`)

---

## 2. Exact Filenames for Each of the 13 Categories

For any category below, replace the file in `public/assets/images/` or `public/assets/3d/` using its exact name:

| # | Category Name | Main Card & Hero Picture (`public/assets/images/`) | 3 Detail Page Gallery Pictures (`public/assets/images/`) | 3D Model (`public/assets/3d/`) |
|---|---|---|---|---|
| **01** | **Labels** | `labels.png` | `labels-1.png`, `labels-2.png`, `labels-3.png` | `labels.glb` |
| **02** | **Stickers** | `stickers.png` | `stickers-1.png`, `stickers-2.png`, `stickers-3.png` | `stickers.glb` |
| **03** | **Heat Transfer** | `heat-transfer.png` | `heat-transfer-1.png`, `heat-transfer-2.png`, `heat-transfer-3.png` | `heat-transfer.glb` |
| **04** | **Offset (Paper Items)** | `offset-paper-items.png` | `offset-paper-items-1.png`, `offset-paper-items-2.png`, `offset-paper-items-3.png` | `offset-paper-items.glb` |
| **05** | **Patches** | `patches.png` | `patches-1.png`, `patches-2.png`, `patches-3.png` | `patches.glb` |
| **06** | **Narrow Fabrics** | `narrow-fabrics.png` | `narrow-fabrics-1.png`, `narrow-fabrics-2.png`, `narrow-fabrics-3.png` | `narrow-fabrics.glb` |
| **07** | **Gum Tape** | `gum-tape.png` | `gum-tape-1.png`, `gum-tape-2.png`, `gum-tape-3.png` | `gum-tape.glb` |
| **08** | **Cartons** | `cartons.png` | `cartons-1.png`, `cartons-2.png`, `cartons-3.png` | `cartons.glb` |
| **09** | **Buttons** | `buttons.png` | `buttons-1.png`, `buttons-2.png`, `buttons-3.png` | `buttons.glb` |
| **10** | **Metallic Items** | `metallic-items.png` | `metallic-items-1.png`, `metallic-items-2.png`, `metallic-items-3.png` | `metallic-items.glb` |
| **11** | **Collar Stand & Butterfly** | `collar-stand-and-butterfly.png` | `collar-stand-and-butterfly-1.png`, `collar-stand-and-butterfly-2.png`, `collar-stand-and-butterfly-3.png` | `collar-stand-and-butterfly.glb` |
| **12** | **Lock Strings & Pullers** | `lock-strings-and-pullers.png` | `lock-strings-and-pullers-1.png`, `lock-strings-and-pullers-2.png`, `lock-strings-and-pullers-3.png` | `lock-strings-and-pullers.glb` |
| **13** | **Desiccant Items** | `desiccant-items.png` | `desiccant-items-1.png`, `desiccant-items-2.png`, `desiccant-items-3.png` | `desiccant-items.glb` |

---

## 3. Supported Formats & Automatic Detection

- **Pictures (`public/assets/images/`)**:
  - Best aspect ratio: **4:3** (e.g., `960×720` or `1200×900` pixels).
  - You can overwrite the `.png` directly (e.g. `buttons.png`), **OR** drop in a `.jpg`, `.jpeg`, or `.webp` with the same name (e.g. `buttons.jpg`).
  - Both the build script (`npm.cmd run sync-assets`, which runs automatically during `npm.cmd run dev` and `npm.cmd run build`) and the browser image loader automatically detect `.png`, `.jpg`, `.jpeg`, and `.webp`.
- **3D Models (`public/assets/3d/`)**:
  - Format: Binary glTF **`.glb`** (exported from Blender, Spline, KeyShot, Tripo3D, Meshy, or Sketchfab).
  - You do **not** need to worry about model scale or origin position — the 3D viewer automatically centers your `.glb` model and normalizes its size to fit the studio camera frame.
