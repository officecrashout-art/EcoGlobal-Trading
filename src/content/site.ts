export interface NavItem {
  label: string;
  href: string;
}

export interface SiteConfig {
  companyName: string;
  shortName: string;
  domain: string;
  siteUrl: string;
  tagline: string;
  whatsapp: {
    localNumber: string;
    internationalNumber: string;
    defaultMessage: string;
  };
  address: {
    full: string;
    line1: string;
    line2: string;
    city: string;
    postalCode: string;
    country: string;
    countryCode: string;
    googleMapsUrl: string;
  };
  navigation: NavItem[];
  hero: {
    eyebrow: string;
    headline: string;
    description: string;
    primaryCtaLabel: string;
    secondaryCtaLabel: string;
    scrollHint: string;
  };
  homeSections: {
    unzipReveal: {
      eyebrow: string;
      headline: string;
      description: string;
      ctaLabel: string;
      highlights: Array<{
        title: string;
        description: string;
      }>;
    };
    buttonShowcase: {
      eyebrow: string;
      headline: string;
      description: string;
      ctaLabel: string;
      materialNotes: Array<{
        label: string;
        detail: string;
      }>;
    };
    categoriesSection: {
      eyebrow: string;
      headline: string;
      description: string;
      viewAllLabel: string;
      ctaLabel: string;
    };
    aboutTeaser: {
      eyebrow: string;
      headline: string;
      placeholderNotice: string;
      description: string;
      ctaLabel: string;
      secondaryLabel: string;
    };
  };
  aboutPage: {
    eyebrow: string;
    headline: string;
    placeholderBanner: string;
    overviewParagraphs: string[];
    whatWeOfferTitle: string;
    whatWeOfferIntro: string;
    locationTitle: string;
    locationSubtitle: string;
    mapsButtonLabel: string;
    closingTitle: string;
    closingDescription: string;
  };
  accessoriesPage: {
    eyebrow: string;
    headline: string;
    description: string;
    filterLabel: string;
    allCategoriesLabel: string;
    closingTitle: string;
    closingDescription: string;
  };
}

export const siteConfig: SiteConfig = {
  companyName: "Eco Global BD",
  shortName: "Eco Global",
  domain: "eco-globalbd.com",
  siteUrl: "https://eco-globalbd.com",
  tagline: "Garment Accessories & Trims Supplier in Dhaka, Bangladesh",
  whatsapp: {
    localNumber: "01714011220",
    internationalNumber: "8801714011220",
    defaultMessage:
      "Hello Eco Global BD, I would like to inquire about your garment accessories and trims.",
  },
  address: {
    full: "House 32, Level 7, Road 3, Sector 11, Uttara, Dhaka 1230",
    line1: "House 32, Level 7, Road 3",
    line2: "Sector 11, Uttara",
    city: "Dhaka",
    postalCode: "1230",
    country: "Bangladesh",
    countryCode: "BD",
    googleMapsUrl:
      "https://www.google.com/maps/search/?api=1&query=House+32,+Level+7,+Road+3,+Sector+11,+Uttara,+Dhaka+1230",
  },
  navigation: [
    { label: "Home", href: "/" },
    { label: "Accessories", href: "/accessories/" },
    { label: "About Us", href: "/about/" },
  ],
  hero: {
    eyebrow: "Uttara, Dhaka • Garment Trims & Packaging",
    headline: "Every detail, perfectly fastened.",
    description:
      "Garment trims, labels, closures, narrow fabrics, and export packaging coordinated under one roof.",
    primaryCtaLabel: "Contact Us",
    secondaryCtaLabel: "Explore Catalog",
    scrollHint: "Scroll to unfasten",
  },
  homeSections: {
    unzipReveal: {
      eyebrow: "01 / Precision Trims",
      headline: "Built for structure, finish, and longevity.",
      description:
        "From metallic zippers, lock strings, and custom pullers to woven labels and structural packaging across 13 specialized product categories.",
      ctaLabel: "Contact Us",
      highlights: [
        {
          title: "Identity & Branding",
          description:
            "Woven, printed, badge, and care labels alongside heat transfers, stickers, and dimensional patches in rubber, silicone, and leather.",
        },
        {
          title: "Fasteners & Closures",
          description:
            "Complete range of buttons, metallic zippers, lock strings, pullers, and narrow fabric elastics, tapes, and cords.",
        },
        {
          title: "Finishing & Protection",
          description:
            "Offset paper items, collar stands and butterflies, gum tapes, auto/semi-auto cartons, and moisture-control desiccant solutions.",
        },
      ],
    },
    buttonShowcase: {
      eyebrow: "02 / Tactile Closures",
      headline: "Sixteen button forms across every material.",
      description:
        "Tailoring horn, mother-of-pearl, brushed metal studs, wooden toggles, and precision snap closures matched to your garment swatch.",
      ctaLabel: "Inquire on WhatsApp",
      materialNotes: [
        {
          label: "Structural Forms",
          detail: "Flat, Shank, Stud, Toggle, and Snap / Poppers",
        },
        {
          label: "Natural & Mineral",
          detail: "Horn, Pearl, Shell, Wooden, Leather, Glass, and Ceramic",
        },
        {
          label: "Engineered Finishes",
          detail: "Plastic, Metal, Fabric-covered, and Decorative",
        },
      ],
    },
    categoriesSection: {
      eyebrow: "03 / Full Product Index",
      headline: "Thirteen specialized categories.",
      description:
        "Explore our complete trim and packaging range or message us directly on WhatsApp with your specification.",
      viewAllLabel: "View Full Catalog",
      ctaLabel: "Contact Us",
    },
    aboutTeaser: {
      eyebrow: "04 / Studio & Sourcing",
      headline: "Based in Uttara, Dhaka — built around apparel sourcing.",
      placeholderNotice: "Sector 11, Uttara, Dhaka 1230",
      description:
        "Eco Global BD coordinates garment accessories, closures, branding labels, narrow fabrics, and export packaging for apparel manufacturers and sourcing teams from our office in Sector 11, Uttara, Dhaka.",
      ctaLabel: "Contact Us on WhatsApp",
      secondaryLabel: "About Eco Global",
    },
  },
  aboutPage: {
    eyebrow: "About Eco Global BD",
    headline: "Supplying the essential details behind every finished garment.",
    placeholderBanner: "Garment Accessories & Trims Solution — Uttara, Dhaka",
    overviewParagraphs: [
      "Eco Global BD supplies garment accessories, closures, branding trims, narrow fabrics, and export packaging from our office at House 32, Level 7, Road 3, Sector 11, Uttara, Dhaka 1230.",
      "We work directly with apparel manufacturers, buying houses, and merchandising teams to coordinate trim specifications across labels, stickers, heat transfers, offset paper items, patches, narrow fabrics, gum tapes, cartons, buttons, metallic zippers, collar supports, lock strings, and desiccants.",
    ],
    whatWeOfferTitle: "13 Core Supply Categories",
    whatWeOfferIntro:
      "Streamlined coordination across garment branding trims, structural closures, and export packaging protection.",
    locationTitle: "Office Location",
    locationSubtitle: "Visit or correspond with us at our Uttara, Dhaka office.",
    mapsButtonLabel: "Open in Google Maps",
    closingTitle: "Ready to discuss your garment accessory requirements?",
    closingDescription:
      "Reach us directly on WhatsApp to share your trim list, item specifications, or category inquiries.",
  },
  accessoriesPage: {
    eyebrow: "Catalog / 01 — 13",
    headline: "Garment Accessories & Trims",
    description:
      "Thirteen specialized categories covering branding labels, closures, narrow fabrics, and export packaging. Switch any specimen between Studio Photo and 360° 3D View.",
    filterLabel: "Filter",
    allCategoriesLabel: "All (13)",
    closingTitle: "Looking for a specific trim or custom sample?",
    closingDescription:
      "Send us a message on WhatsApp with the category or sub-item you need, and our team will respond directly.",
  },
};
