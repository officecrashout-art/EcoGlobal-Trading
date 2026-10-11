# DEPLOYMENT & CONTENT MAINTENANCE GUIDE — ECO GLOBAL BD (`eco-globalbd.com`)

This guide explains how to run, edit, build, and deploy the **Eco Global BD** static website to **Plesk** (or any static web server) with zero Node.js runtime required on the hosting server.

> **Security Note:** Never share Plesk, FTP, SSH, or domain registrar credentials in chat or commit them to Git. Deployment is performed manually by uploading the generated static files inside `out/` through the Plesk File Manager.

---

## 1. Required Software (Local Machine)

To edit content and produce a fresh static build on your Windows computer, you need:

- **Node.js**: `v20.x` or `v24.x` LTS (verified with `node -v`, currently `v24.19.0`)
- **npm**: `v10+` or `v12+` (bundled with Node.js)
- **Git**: `v2.x+` (for version control)

> **Windows PowerShell Note:** If Windows PowerShell blocks `npm` due to script execution policy (`npm.ps1 cannot be loaded`), run `npm.cmd` instead of `npm` (for example: `npm.cmd install`, `npm.cmd run dev`, `npm.cmd run build`).

---

## 2. Local Installation, Development & Production Build

Open a terminal in the project folder (`c:\Users\User\Downloads\Ecoglabal`):

### Install Dependencies
```powershell
npm.cmd install
```

### Start Local Development Server
```powershell
npm.cmd run dev
```
- Opens at `http://localhost:3000/` with hot reloading for instant previews when editing `src/content/site.ts` or `src/content/accessories.ts`.

### Run TypeScript Verification
```powershell
npm.cmd run typecheck
```

### Build Static Export for Production
```powershell
npm.cmd run build
```
- Runs `next build` followed by `node scripts/flatten-rsc-export.mjs`.
- Generates the complete, self-contained static website inside:
  ```text
  c:\Users\User\Downloads\Ecoglabal\out\
  ```

---

## 3. Inspecting the `out/` Directory

After running `npm.cmd run build`, the `out/` folder contains:

- `out/index.html` — Home page (`/`)
- `out/about/index.html` — About Us page (`/about/`)
- `out/accessories/index.html` — Accessories catalog page (`/accessories/`)
- `out/accessories/<slug>/index.html` — All 13 individual category detail pages:
  - `/accessories/labels/`
  - `/accessories/stickers/`
  - `/accessories/heat-transfer/`
  - `/accessories/offset-paper-items/`
  - `/accessories/patches/`
  - `/accessories/narrow-fabrics/`
  - `/accessories/gum-tape/`
  - `/accessories/cartons/`
  - `/accessories/buttons/`
  - `/accessories/metallic-items/`
  - `/accessories/collar-stand-and-butterfly/`
  - `/accessories/lock-strings-and-pullers/`
  - `/accessories/desiccant-items/`
- `out/404.html` — Custom Not Found page
- `out/robots.txt`, `out/sitemap.xml`, `out/icon.svg` — SEO and favicon files
- `out/_next/` — Self-hosted fonts, compiled CSS, and JavaScript bundles

Because `trailingSlash: true` and `output: "export"` are configured in `next.config.ts`, every route has its own directory with an `index.html` file, so Plesk/Apache/Nginx serves every URL cleanly without needing special rewrite rules.

---

## 4. Step-by-Step Plesk Deployment

### Step 1: Verify Your Document Root in Plesk
1. Log in to your **Plesk Control Panel**.
2. Go to **Websites & Domains** → locate **`eco-globalbd.com`**.
3. Check the **Document Root** path shown under the domain (typically `httpdocs` or `public_html`).
4. Click **File Manager** to open that document root folder.

### Step 2: Back Up the Existing Site (Mandatory Before Uploading)
1. Inside the Plesk File Manager (in `httpdocs`), select all existing website files and folders.
2. Click **Archive** → **Add to Archive** and name it with today's date, e.g.:
   ```text
   backup-eco-globalbd-YYYY-MM-DD.zip
   ```
3. Download a copy of `backup-eco-globalbd-YYYY-MM-DD.zip` to your local computer, or move it outside `httpdocs` (e.g., to your home directory `/backups/`) so it is not publicly downloadable.
4. Once backed up, remove the old website files inside `httpdocs` (keep system folders like `.well-known` if used for SSL validation).

### Step 3: Upload ONLY the Contents of `out/`
> **IMPORTANT:** Upload the **contents inside** `out/` directly into `httpdocs` — do **not** upload the `out` folder itself as `httpdocs/out/`.

1. On your Windows computer, open `c:\Users\User\Downloads\Ecoglabal\out\`.
2. Select **all files and folders inside `out/`** (`index.html`, `404.html`, `about`, `accessories`, `_next`, `robots.txt`, `sitemap.xml`, `icon.svg`, etc.) and compress them into a single ZIP file named `deploy-out.zip` (so `index.html` is at the root of the ZIP).
3. In Plesk **File Manager** (inside `httpdocs`), click **Upload** → **Upload File** and select `deploy-out.zip`.
4. Once uploaded, click the menu next to `deploy-out.zip` → **Extract Files** (check "Replace existing files" if prompted).
5. Delete `deploy-out.zip` from `httpdocs` after extraction completes.
6. Confirm that `httpdocs/index.html`, `httpdocs/about/index.html`, `httpdocs/accessories/index.html`, and `httpdocs/_next/` exist directly inside `httpdocs`.

### Step 4: Verify SSL / HTTPS Configuration in Plesk
1. In Plesk, go to **Websites & Domains** → **`eco-globalbd.com`** → **SSL/TLS Certificates**.
2. Confirm a valid certificate (e.g., Let's Encrypt) is active for both `eco-globalbd.com` and `www.eco-globalbd.com`.
3. Under **Hosting & DNS** → **Hosting Settings**, verify that **Permanent SEO-safe 301 redirect from HTTP to HTTPS** is enabled.

### Step 5: Post-Deployment Verification Checklist
Open an incognito/private browser window and test:
- [ ] `https://eco-globalbd.com/` loads with the Hero headline, 3D zipper (or SVG fallback on reduced-motion/low-end devices), and no console errors.
- [ ] `https://eco-globalbd.com/accessories/` loads all 13 categories, sticky filter/jump bar, and expandable sub-items.
- [ ] `https://eco-globalbd.com/accessories/buttons/` and `/accessories/narrow-fabrics/` load directly on hard refresh (`Ctrl+F5`).
- [ ] `https://eco-globalbd.com/about/` displays the company overview, Uttara Dhaka address, and opens Google Maps cleanly.
- [ ] `https://eco-globalbd.com/robots.txt` and `https://eco-globalbd.com/sitemap.xml` load properly.
- [ ] Click **Contact Us** in the navbar, hero, category cards, detail pages, About page, and footer to confirm each opens `https://wa.me/8801714011220?text=...` in a new tab with the expected pre-filled message.

### Step 6: Rollback Procedure (If Needed)
If you ever need to revert to the previous version:
1. Open Plesk **File Manager** → `httpdocs`.
2. Delete the current files in `httpdocs` (keeping `.well-known` if present).
3. Upload/move your `backup-eco-globalbd-YYYY-MM-DD.zip` into `httpdocs`, click **Extract Files**, and delete the `.zip` archive after extraction.

---

## 5. How to Edit Website Content

All site text, placeholders, and catalog items live in two TypeScript files under `src/content/`:

### A. Editing Company Overview, Headlines & Address (`src/content/site.ts`)
Open `src/content/site.ts`:
- **Hero Headline & Description:** Edit `siteConfig.hero.headline` (currently `"Every detail, perfectly fastened."`) and `siteConfig.hero.description`.
- **About Us Placeholder Paragraphs:**
  - On the Home page teaser: Edit `siteConfig.homeSections.aboutTeaser.description` (and remove `placeholderNotice` text or set it to what you want displayed).
  - On the About Us page (`/about/`): Edit `siteConfig.aboutPage.overviewParagraphs` and `siteConfig.aboutPage.placeholderBanner`.
- **Address & Google Maps URL:** Edit `siteConfig.address`.

### B. Editing the 13 Accessory Categories, Descriptions & Photos (`src/content/accessories.ts`)
Open `src/content/accessories.ts`:
- Each of the 13 categories in `accessoryCategories` contains:
  - `title` and `shortCategoryTag`
  - `subItems`: Array of sub-items and optional `variants` (e.g., `{ name: "Elastic", variants: ["Normal", "Button Hole", "Gripper", "Woven", "Jacquard"] }`).
  - `descriptionPlaceholder`: Short summary shown on the `/accessories/` card.
  - `detailPlaceholder`: Detailed paragraph shown at the top of `/accessories/[slug]/`.
  - **Adding Real Product Photos:**
    1. Place your product images inside `public/images/accessories/` (create the folder if needed), e.g., `public/images/accessories/labels-main.jpg`.
    2. In `src/content/accessories.ts`, add `src: "/images/accessories/labels-main.jpg"` to `imagePlaceholder` or any item in `galleryPlaceholders`.
    3. The `<AccessoryPlaceholderPlate />` component will automatically render your photo instead of the technical SVG plate.

After editing any file in `src/content/`, run `npm.cmd run build` and re-upload the contents of `out/` to Plesk.

---

## 6. How to Change the WhatsApp Number

The WhatsApp number is configured in **one single place**: `src/content/site.ts`.

Open `src/content/site.ts` and update `siteConfig.whatsapp`:

```ts
  whatsapp: {
    /** Local display format shown in text */
    localNumber: "01714011220",
    /** International format: country code (880) + number without leading 0 */
    internationalNumber: "8801714011220",
    defaultMessage:
      "Hello Eco Global BD, I would like to inquire about your garment accessories and trims.",
  },
```

Every `<WhatsAppButton />`, floating WhatsApp widget, and category inquiry link uses `buildWhatsAppUrl()` from `src/lib/whatsapp.ts`, which reads `siteConfig.whatsapp.internationalNumber`. After updating `src/content/site.ts`, run `npm.cmd run build` and re-upload `out/`.

---

## 7. What Would Require a Backend Server (Future Enhancements)

Currently, this site is a **100% static export (`output: "export"`)** and runs on any standard web host without Node.js or a database. You would only need a backend server, serverless function, or third-party API if you decide to add:

1. **Server-Side Contact / RFQ Email Forms** (sending emails directly from the site instead of opening WhatsApp).
2. **Dynamic CMS / Admin Dashboard** (editing categories or uploading product photos via a web login without running `npm.cmd run build`).
3. **Authenticated Buyer Portals, Live Inventory, or Online Ordering / Payments**.
4. **Next.js Server Actions, API Routes (`src/app/api/*`), Middleware, or On-Demand ISR**.
