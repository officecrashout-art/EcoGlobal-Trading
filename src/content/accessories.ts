import assetManifest from "./asset-manifest.json";

export interface AccessorySubItem {
  name: string;
  variants?: string[];
}

export interface AccessoryImagePlaceholder {
  id: string;
  label: string;
  aspectRatio: "4:3" | "1:1" | "16:10";
  /** Automatically resolved from /public/assets/images/<slug>.(png|jpg|webp) */
  src?: string;
  /** Automatically resolved from /public/assets/3d/<slug>.glb */
  modelSrc?: string;
  /** Base filename key in /public/assets/images/ (e.g. "labels" or "labels-1") */
  assetKey?: string;
  alt: string;
}

export interface AccessoryCategory {
  index: string;
  slug: string;
  title: string;
  shortCategoryTag: string;
  subItems: AccessorySubItem[];
  /** Clearly marked editable description placeholder — no invented specs, MOQs, prices, or lead times */
  descriptionPlaceholder: string;
  /** Clearly marked editable detail overview for /accessories/[slug]/ */
  detailPlaceholder: string;
  /** Primary card image & 3D asset config */
  imagePlaceholder: AccessoryImagePlaceholder;
  /** Gallery image placeholders for detail page */
  galleryPlaceholders: AccessoryImagePlaceholder[];
  /** Path to 3D GLB model in /public/assets/3d/<slug>.glb */
  modelSrc?: string;
  /** Slugs of related categories */
  relatedSlugs: string[];
  /** Visual diagram motif for the editorial placeholder plate */
  motif:
    | "label"
    | "sticker"
    | "heat-transfer"
    | "offset"
    | "patch"
    | "narrow-fabric"
    | "gum-tape"
    | "carton"
    | "button"
    | "zipper"
    | "collar"
    | "lock-string"
    | "desiccant";
}

const rawAccessoryCategories: AccessoryCategory[] = [
  {
    index: "01",
    slug: "labels",
    title: "Labels",
    shortCategoryTag: "Branding & Care Identification",
    subItems: [
      { name: "Woven Label" },
      { name: "Printed Woven Label" },
      { name: "Badge Label" },
      { name: "Care Label" },
    ],
    descriptionPlaceholder:
      "[Editable Placeholder: Overview for Labels — Woven Label, Printed Woven Label, Badge Label, and Care Label. Edit in src/content/accessories.ts.]",
    detailPlaceholder:
      "[Editable Placeholder: Add your specific details for Labels here in src/content/accessories.ts. We supply Woven Labels, Printed Woven Labels, Badge Labels, and Care Labels for garment branding and garment care instructions. Contact us on WhatsApp to share your artwork or sample requirements.]",
    imagePlaceholder: {
      id: "labels-primary",
      label: "Labels — Image Placeholder (Woven / Printed / Badge / Care)",
      aspectRatio: "4:3",
      alt: "Labels category placeholder showing woven, printed woven, badge, and care label structure",
    },
    galleryPlaceholders: [
      {
        id: "labels-1",
        label: "Woven Label — Photo Placeholder",
        aspectRatio: "4:3",
        alt: "Woven Label specimen placeholder",
      },
      {
        id: "labels-2",
        label: "Printed Woven & Badge Label — Photo Placeholder",
        aspectRatio: "4:3",
        alt: "Printed Woven and Badge Label specimen placeholder",
      },
      {
        id: "labels-3",
        label: "Care Label — Photo Placeholder",
        aspectRatio: "4:3",
        alt: "Care Label specimen placeholder",
      },
    ],
    relatedSlugs: ["heat-transfer", "patches", "offset-paper-items"],
    motif: "label",
  },
  {
    index: "02",
    slug: "stickers",
    title: "Stickers",
    shortCategoryTag: "Adhesive Apparel & Packaging Identification",
    subItems: [{ name: "Garment & Packaging Stickers" }],
    descriptionPlaceholder:
      "[Editable Placeholder: Overview for Stickers for garments, polybags, and cartons. Edit in src/content/accessories.ts.]",
    detailPlaceholder:
      "[Editable Placeholder: Add your specific details for Stickers here in src/content/accessories.ts. Contact Eco Global BD via WhatsApp to discuss sticker formats, sizing, and printing requirements.]",
    imagePlaceholder: {
      id: "stickers-primary",
      label: "Stickers — Image Placeholder",
      aspectRatio: "4:3",
      alt: "Stickers category placeholder",
    },
    galleryPlaceholders: [
      {
        id: "stickers-1",
        label: "Stickers Specimen 01 — Photo Placeholder",
        aspectRatio: "4:3",
        alt: "Stickers specimen 1 placeholder",
      },
      {
        id: "stickers-2",
        label: "Stickers Specimen 02 — Photo Placeholder",
        aspectRatio: "4:3",
        alt: "Stickers specimen 2 placeholder",
      },
      {
        id: "stickers-3",
        label: "Stickers Specimen 03 — Photo Placeholder",
        aspectRatio: "4:3",
        alt: "Stickers specimen 3 placeholder",
      },
    ],
    relatedSlugs: ["offset-paper-items", "labels", "gum-tape"],
    motif: "sticker",
  },
  {
    index: "03",
    slug: "heat-transfer",
    title: "Heat Transfer",
    shortCategoryTag: "Tagless & Graphic Thermal Transfers",
    subItems: [{ name: "Heat Transfer Labels & Graphics" }],
    descriptionPlaceholder:
      "[Editable Placeholder: Overview for Heat Transfer items for tagless garment branding and graphic applications. Edit in src/content/accessories.ts.]",
    detailPlaceholder:
      "[Editable Placeholder: Add your specific details for Heat Transfer trims here in src/content/accessories.ts. Contact us on WhatsApp to share your artwork and fabric application needs.]",
    imagePlaceholder: {
      id: "heat-transfer-primary",
      label: "Heat Transfer — Image Placeholder",
      aspectRatio: "4:3",
      alt: "Heat Transfer category placeholder",
    },
    galleryPlaceholders: [
      {
        id: "heat-transfer-1",
        label: "Heat Transfer Specimen 01 — Photo Placeholder",
        aspectRatio: "4:3",
        alt: "Heat Transfer specimen 1 placeholder",
      },
      {
        id: "heat-transfer-2",
        label: "Heat Transfer Specimen 02 — Photo Placeholder",
        aspectRatio: "4:3",
        alt: "Heat Transfer specimen 2 placeholder",
      },
      {
        id: "heat-transfer-3",
        label: "Heat Transfer Specimen 03 — Photo Placeholder",
        aspectRatio: "4:3",
        alt: "Heat Transfer specimen 3 placeholder",
      },
    ],
    relatedSlugs: ["labels", "patches", "stickers"],
    motif: "heat-transfer",
  },
  {
    index: "04",
    slug: "offset-paper-items",
    title: "Offset (Paper Items)",
    shortCategoryTag: "Printed Paper Trims & Packaging Inserts",
    subItems: [{ name: "Offset Printed Paper Items" }],
    descriptionPlaceholder:
      "[Editable Placeholder: Overview for Offset (Paper Items) including printed garment tags, cards, and paper packaging inserts. Edit in src/content/accessories.ts.]",
    detailPlaceholder:
      "[Editable Placeholder: Add your specific details for Offset (Paper Items) here in src/content/accessories.ts. Reach out via WhatsApp to discuss your paper item specifications.]",
    imagePlaceholder: {
      id: "offset-primary",
      label: "Offset (Paper Items) — Image Placeholder",
      aspectRatio: "4:3",
      alt: "Offset Paper Items category placeholder",
    },
    galleryPlaceholders: [
      {
        id: "offset-1",
        label: "Offset Paper Item 01 — Photo Placeholder",
        aspectRatio: "4:3",
        alt: "Offset Paper Item 1 placeholder",
      },
      {
        id: "offset-2",
        label: "Offset Paper Item 02 — Photo Placeholder",
        aspectRatio: "4:3",
        alt: "Offset Paper Item 2 placeholder",
      },
      {
        id: "offset-3",
        label: "Offset Paper Item 03 — Photo Placeholder",
        aspectRatio: "4:3",
        alt: "Offset Paper Item 3 placeholder",
      },
    ],
    relatedSlugs: ["collar-stand-and-butterfly", "stickers", "lock-strings-and-pullers"],
    motif: "offset",
  },
  {
    index: "05",
    slug: "patches",
    title: "Patches",
    shortCategoryTag: "Dimensional Emblem & Waistband Trims",
    subItems: [
      { name: "Rubber Patches" },
      { name: "Silicone Patches" },
      { name: "Leather Patches" },
    ],
    descriptionPlaceholder:
      "[Editable Placeholder: Overview for Patches — Rubber Patches, Silicone Patches, and Leather Patches. Edit in src/content/accessories.ts.]",
    detailPlaceholder:
      "[Editable Placeholder: Add your specific details for Patches here in src/content/accessories.ts. We supply Rubber Patches, Silicone Patches, and Leather Patches for outerwear, denim, knitwear, and accessories. Contact us on WhatsApp for inquiries.]",
    imagePlaceholder: {
      id: "patches-primary",
      label: "Patches — Image Placeholder (Rubber / Silicone / Leather)",
      aspectRatio: "4:3",
      alt: "Patches category placeholder for rubber, silicone, and leather patches",
    },
    galleryPlaceholders: [
      {
        id: "patches-1",
        label: "Rubber Patches — Photo Placeholder",
        aspectRatio: "4:3",
        alt: "Rubber Patches placeholder",
      },
      {
        id: "patches-2",
        label: "Silicone Patches — Photo Placeholder",
        aspectRatio: "4:3",
        alt: "Silicone Patches placeholder",
      },
      {
        id: "patches-3",
        label: "Leather Patches — Photo Placeholder",
        aspectRatio: "4:3",
        alt: "Leather Patches placeholder",
      },
    ],
    relatedSlugs: ["labels", "heat-transfer", "buttons"],
    motif: "patch",
  },
  {
    index: "06",
    slug: "narrow-fabrics",
    title: "Narrow Fabrics",
    shortCategoryTag: "Elastics, Tapes, Cords & Drawstrings",
    subItems: [
      {
        name: "Elastic",
        variants: ["Normal", "Button Hole", "Gripper", "Woven", "Jacquard"],
      },
      { name: "Twill Tape" },
      { name: "Grosgrain Tape" },
      { name: "Draw Cord" },
      { name: "Drawstring" },
      { name: "Cotton Tape" },
    ],
    descriptionPlaceholder:
      "[Editable Placeholder: Overview for Narrow Fabrics — Elastic (Normal, Button Hole, Gripper, Woven, Jacquard), Twill Tape, Grosgrain Tape, Draw Cord, Drawstring, and Cotton Tape. Edit in src/content/accessories.ts.]",
    detailPlaceholder:
      "[Editable Placeholder: Add your specific details for Narrow Fabrics here in src/content/accessories.ts. Includes Elastic (Normal, Button Hole, Gripper, Woven, Jacquard), Twill Tape, Grosgrain Tape, Draw Cord, Drawstring, and Cotton Tape. Contact us via WhatsApp to discuss your requirements.]",
    imagePlaceholder: {
      id: "narrow-fabrics-primary",
      label: "Narrow Fabrics — Image Placeholder (Elastic / Tapes / Cords)",
      aspectRatio: "4:3",
      alt: "Narrow Fabrics category placeholder showing elastic, tapes, and cords",
    },
    galleryPlaceholders: [
      {
        id: "narrow-fabrics-1",
        label: "Elastic (Normal, Button Hole, Gripper, Woven, Jacquard) — Photo Placeholder",
        aspectRatio: "4:3",
        alt: "Elastic variants placeholder",
      },
      {
        id: "narrow-fabrics-2",
        label: "Twill, Grosgrain & Cotton Tape — Photo Placeholder",
        aspectRatio: "4:3",
        alt: "Twill, Grosgrain, and Cotton Tape placeholder",
      },
      {
        id: "narrow-fabrics-3",
        label: "Draw Cord & Drawstring — Photo Placeholder",
        aspectRatio: "4:3",
        alt: "Draw Cord and Drawstring placeholder",
      },
    ],
    relatedSlugs: ["lock-strings-and-pullers", "metallic-items", "labels"],
    motif: "narrow-fabric",
  },
  {
    index: "07",
    slug: "gum-tape",
    title: "Gum Tape",
    shortCategoryTag: "Carton Sealing & Packaging Tapes",
    subItems: [{ name: "Gum Tape" }],
    descriptionPlaceholder:
      "[Editable Placeholder: Overview for Gum Tape for garment carton sealing and export packaging. Edit in src/content/accessories.ts.]",
    detailPlaceholder:
      "[Editable Placeholder: Add your specific details for Gum Tape here in src/content/accessories.ts. Contact Eco Global BD on WhatsApp to inquire about gum tape specifications.]",
    imagePlaceholder: {
      id: "gum-tape-primary",
      label: "Gum Tape — Image Placeholder",
      aspectRatio: "4:3",
      alt: "Gum Tape category placeholder",
    },
    galleryPlaceholders: [
      {
        id: "gum-tape-1",
        label: "Gum Tape Specimen 01 — Photo Placeholder",
        aspectRatio: "4:3",
        alt: "Gum Tape specimen 1 placeholder",
      },
      {
        id: "gum-tape-2",
        label: "Gum Tape Specimen 02 — Photo Placeholder",
        aspectRatio: "4:3",
        alt: "Gum Tape specimen 2 placeholder",
      },
      {
        id: "gum-tape-3",
        label: "Gum Tape Specimen 03 — Photo Placeholder",
        aspectRatio: "4:3",
        alt: "Gum Tape specimen 3 placeholder",
      },
    ],
    relatedSlugs: ["cartons", "desiccant-items", "stickers"],
    motif: "gum-tape",
  },
  {
    index: "08",
    slug: "cartons",
    title: "Cartons",
    shortCategoryTag: "Corrugated Shipping & Packaging Cartons",
    subItems: [{ name: "Auto" }, { name: "Semi-Auto" }],
    descriptionPlaceholder:
      "[Editable Placeholder: Overview for Cartons — Auto and Semi-Auto corrugated cartons for garment packaging. Edit in src/content/accessories.ts.]",
    detailPlaceholder:
      "[Editable Placeholder: Add your specific details for Cartons (Auto and Semi-Auto) here in src/content/accessories.ts. Contact us on WhatsApp to share carton dimensions and ply requirements.]",
    imagePlaceholder: {
      id: "cartons-primary",
      label: "Cartons — Image Placeholder (Auto / Semi-Auto)",
      aspectRatio: "4:3",
      alt: "Cartons category placeholder for Auto and Semi-Auto cartons",
    },
    galleryPlaceholders: [
      {
        id: "cartons-1",
        label: "Auto Carton — Photo Placeholder",
        aspectRatio: "4:3",
        alt: "Auto Carton placeholder",
      },
      {
        id: "cartons-2",
        label: "Semi-Auto Carton — Photo Placeholder",
        aspectRatio: "4:3",
        alt: "Semi-Auto Carton placeholder",
      },
      {
        id: "cartons-3",
        label: "Carton Structure Detail — Photo Placeholder",
        aspectRatio: "4:3",
        alt: "Carton structure placeholder",
      },
    ],
    relatedSlugs: ["gum-tape", "desiccant-items", "offset-paper-items"],
    motif: "carton",
  },
  {
    index: "09",
    slug: "buttons",
    title: "Buttons",
    shortCategoryTag: "Structural & Material Closure Systems",
    subItems: [
      { name: "Flat" },
      { name: "Shank" },
      { name: "Stud" },
      { name: "Toggle" },
      { name: "Snap / Poppers" },
      { name: "Plastic" },
      { name: "Horn" },
      { name: "Pearl" },
      { name: "Metal" },
      { name: "Wooden" },
      { name: "Fabric" },
      { name: "Shell" },
      { name: "Glass" },
      { name: "Decorative" },
      { name: "Leather" },
      { name: "Ceramic" },
    ],
    descriptionPlaceholder:
      "[Editable Placeholder: Overview for Buttons across 16 structural and material varieties — Flat, Shank, Stud, Toggle, Snap / Poppers, Plastic, Horn, Pearl, Metal, Wooden, Fabric, Shell, Glass, Decorative, Leather, and Ceramic. Edit in src/content/accessories.ts.]",
    detailPlaceholder:
      "[Editable Placeholder: Add your specific details for Buttons here in src/content/accessories.ts. Our range spans Flat, Shank, Stud, Toggle, Snap / Poppers, Plastic, Horn, Pearl, Metal, Wooden, Fabric, Shell, Glass, Decorative, Leather, and Ceramic buttons. Message us on WhatsApp with your button specifications.]",
    imagePlaceholder: {
      id: "buttons-primary",
      label: "Buttons — Image Placeholder (16 Structural & Material Types)",
      aspectRatio: "4:3",
      alt: "Buttons category placeholder representing 16 structural and material button varieties",
    },
    galleryPlaceholders: [
      {
        id: "buttons-1",
        label: "Flat, Shank, Stud, Toggle & Snap / Poppers — Photo Placeholder",
        aspectRatio: "4:3",
        alt: "Structural button types placeholder",
      },
      {
        id: "buttons-2",
        label: "Horn, Pearl, Shell, Wooden & Leather Buttons — Photo Placeholder",
        aspectRatio: "4:3",
        alt: "Natural material buttons placeholder",
      },
      {
        id: "buttons-3",
        label: "Metal, Plastic, Fabric, Glass, Ceramic & Decorative — Photo Placeholder",
        aspectRatio: "4:3",
        alt: "Metal, plastic, ceramic and decorative buttons placeholder",
      },
    ],
    relatedSlugs: ["metallic-items", "lock-strings-and-pullers", "patches"],
    motif: "button",
  },
  {
    index: "10",
    slug: "metallic-items",
    title: "Metallic Items (Zipper and Others)",
    shortCategoryTag: "Zippers, Fasteners & Metal Hardware",
    subItems: [
      { name: "Zipper" },
      { name: "Other Metallic Garment Hardware" },
    ],
    descriptionPlaceholder:
      "[Editable Placeholder: Overview for Metallic Items (Zipper and Others). Edit in src/content/accessories.ts.]",
    detailPlaceholder:
      "[Editable Placeholder: Add your specific details for Metallic Items (Zipper and Others) here in src/content/accessories.ts. Contact Eco Global BD via WhatsApp to share your zipper gauge, finish, puller, or metal hardware requirements.]",
    imagePlaceholder: {
      id: "metallic-items-primary",
      label: "Metallic Items (Zipper and Others) — Image Placeholder",
      aspectRatio: "4:3",
      alt: "Metallic Items (Zipper and Others) category placeholder",
    },
    galleryPlaceholders: [
      {
        id: "metallic-items-1",
        label: "Metallic Zipper — Photo Placeholder",
        aspectRatio: "4:3",
        alt: "Metallic Zipper placeholder",
      },
      {
        id: "metallic-items-2",
        label: "Zipper Slider & Puller — Photo Placeholder",
        aspectRatio: "4:3",
        alt: "Zipper Slider and Puller placeholder",
      },
      {
        id: "metallic-items-3",
        label: "Metallic Hardware Trims — Photo Placeholder",
        aspectRatio: "4:3",
        alt: "Metallic Hardware Trims placeholder",
      },
    ],
    relatedSlugs: ["buttons", "lock-strings-and-pullers", "narrow-fabrics"],
    motif: "zipper",
  },
  {
    index: "11",
    slug: "collar-stand-and-butterfly",
    title: "Collar Stand & Butterfly",
    shortCategoryTag: "Shirt Collar Support & Presentation Inserts",
    subItems: [{ name: "Collar Stand" }, { name: "Butterfly" }],
    descriptionPlaceholder:
      "[Editable Placeholder: Overview for Collar Stand & Butterfly shirt packaging supports. Edit in src/content/accessories.ts.]",
    detailPlaceholder:
      "[Editable Placeholder: Add your specific details for Collar Stand & Butterfly items here in src/content/accessories.ts. Contact us on WhatsApp to inquire about collar support shapes and materials.]",
    imagePlaceholder: {
      id: "collar-stand-primary",
      label: "Collar Stand & Butterfly — Image Placeholder",
      aspectRatio: "4:3",
      alt: "Collar Stand and Butterfly category placeholder",
    },
    galleryPlaceholders: [
      {
        id: "collar-stand-1",
        label: "Collar Stand — Photo Placeholder",
        aspectRatio: "4:3",
        alt: "Collar Stand placeholder",
      },
      {
        id: "collar-stand-2",
        label: "Collar Butterfly — Photo Placeholder",
        aspectRatio: "4:3",
        alt: "Collar Butterfly placeholder",
      },
      {
        id: "collar-stand-3",
        label: "Shirt Packaging Assembly — Photo Placeholder",
        aspectRatio: "4:3",
        alt: "Shirt packaging assembly placeholder",
      },
    ],
    relatedSlugs: ["offset-paper-items", "stickers", "cartons"],
    motif: "collar",
  },
  {
    index: "12",
    slug: "lock-strings-and-pullers",
    title: "Lock Strings & Pullers",
    shortCategoryTag: "Hangtag Seal Cords & Custom Zipper Pullers",
    subItems: [{ name: "Lock Strings" }, { name: "Pullers" }],
    descriptionPlaceholder:
      "[Editable Placeholder: Overview for Lock Strings & Pullers for hangtag attachment and zipper sliders. Edit in src/content/accessories.ts.]",
    detailPlaceholder:
      "[Editable Placeholder: Add your specific details for Lock Strings & Pullers here in src/content/accessories.ts. Contact Eco Global BD on WhatsApp to discuss lock string styles and custom pullers.]",
    imagePlaceholder: {
      id: "lock-strings-primary",
      label: "Lock Strings & Pullers — Image Placeholder",
      aspectRatio: "4:3",
      alt: "Lock Strings and Pullers category placeholder",
    },
    galleryPlaceholders: [
      {
        id: "lock-strings-1",
        label: "Lock Strings — Photo Placeholder",
        aspectRatio: "4:3",
        alt: "Lock Strings placeholder",
      },
      {
        id: "lock-strings-2",
        label: "Custom Pullers — Photo Placeholder",
        aspectRatio: "4:3",
        alt: "Custom Pullers placeholder",
      },
      {
        id: "lock-strings-3",
        label: "Seal & Puller Details — Photo Placeholder",
        aspectRatio: "4:3",
        alt: "Seal and Puller Details placeholder",
      },
    ],
    relatedSlugs: ["metallic-items", "labels", "offset-paper-items"],
    motif: "lock-string",
  },
  {
    index: "13",
    slug: "desiccant-items",
    title: "Desiccant Items",
    shortCategoryTag: "Moisture Control & Export Protection",
    subItems: [
      { name: "Silica Gel" },
      { name: "Micropak", variants: ["Poly", "Dri Clay"] },
      { name: "Superdry" },
    ],
    descriptionPlaceholder:
      "[Editable Placeholder: Overview for Desiccant Items — Silica Gel, Micropak (Poly, Dri Clay), and Superdry. Edit in src/content/accessories.ts.]",
    detailPlaceholder:
      "[Editable Placeholder: Add your specific details for Desiccant Items here in src/content/accessories.ts. Includes Silica Gel, Micropak (Poly, Dri Clay), and Superdry moisture protection solutions for garment export packaging. Contact us on WhatsApp for inquiries.]",
    imagePlaceholder: {
      id: "desiccant-primary",
      label: "Desiccant Items — Image Placeholder (Silica Gel / Micropak / Superdry)",
      aspectRatio: "4:3",
      alt: "Desiccant Items category placeholder for Silica Gel, Micropak Poly and Dri Clay, and Superdry",
    },
    galleryPlaceholders: [
      {
        id: "desiccant-1",
        label: "Silica Gel — Photo Placeholder",
        aspectRatio: "4:3",
        alt: "Silica Gel placeholder",
      },
      {
        id: "desiccant-2",
        label: "Micropak (Poly, Dri Clay) — Photo Placeholder",
        aspectRatio: "4:3",
        alt: "Micropak Poly and Dri Clay placeholder",
      },
      {
        id: "desiccant-3",
        label: "Superdry — Photo Placeholder",
        aspectRatio: "4:3",
        alt: "Superdry desiccant placeholder",
      },
    ],
    relatedSlugs: ["cartons", "gum-tape", "stickers"],
    motif: "desiccant",
  },
];

const imageMap = assetManifest.images as Record<string, string>;
const modelMap = assetManifest.models as Record<string, string>;

export const accessoryCategories: AccessoryCategory[] = rawAccessoryCategories.map(
  (cat) => {
    const primarySrc =
      cat.imagePlaceholder.src ??
      imageMap[cat.slug] ??
      `/assets/images/${cat.slug}.png`;
    const modelSrc =
      cat.modelSrc ??
      cat.imagePlaceholder.modelSrc ??
      modelMap[cat.slug] ??
      `/assets/3d/${cat.slug}.glb`;

    const subItemNames = cat.subItems
      .map((s) =>
        s.variants && s.variants.length > 0
          ? `${s.name} (${s.variants.join(", ")})`
          : s.name
      )
      .join(", ");

    return {
      ...cat,
      descriptionPlaceholder: `Includes ${subItemNames}.`,
      detailPlaceholder: `Supplied across ${subItemNames} configurations from our Sector 11, Uttara, Dhaka office. Contact us on WhatsApp to share your artwork or sample reference.`,
      modelSrc,
      imagePlaceholder: {
        ...cat.imagePlaceholder,
        assetKey: cat.slug,
        src: primarySrc,
        modelSrc,
      },
      galleryPlaceholders: cat.galleryPlaceholders.map((item, idx) => {
        const galleryKey = `${cat.slug}-${idx + 1}`;
        return {
          ...item,
          assetKey: galleryKey,
          src:
            item.src ??
            imageMap[galleryKey] ??
            `/assets/images/${galleryKey}.png`,
        };
      }),
    };
  }
);

export function getCategoryBySlug(slug: string): AccessoryCategory | undefined {
  return accessoryCategories.find((item) => item.slug === slug);
}

export function getRelatedCategories(slugs: string[]): AccessoryCategory[] {
  return slugs
    .map((slug) => getCategoryBySlug(slug))
    .filter((item): item is AccessoryCategory => Boolean(item));
}

export function formatSubItemLabel(subItem: AccessorySubItem): string {
  if (!subItem.variants || subItem.variants.length === 0) {
    return subItem.name;
  }
  return `${subItem.name} (${subItem.variants.join(", ")})`;
}
