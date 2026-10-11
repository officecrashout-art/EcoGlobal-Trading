import type { Metadata } from "next";
import { siteConfig } from "@/content/site";

interface PageMetadataOptions {
  title?: string;
  description?: string;
  path?: string;
}

export function createPageMetadata({
  title,
  description,
  path = "/",
}: PageMetadataOptions = {}): Metadata {
  const normalizedPath = path.endsWith("/") ? path : `${path}/`;
  const canonicalUrl = `${siteConfig.siteUrl}${normalizedPath === "//" ? "/" : normalizedPath}`;
  const fullTitle = title
    ? `${title} | ${siteConfig.companyName}`
    : `${siteConfig.companyName} — ${siteConfig.tagline}`;
  const metaDescription =
    description ??
    "Eco Global BD supplies garment accessories and trims in Uttara, Dhaka: labels, stickers, heat transfer, offset paper items, patches, narrow fabrics, gum tape, cartons, buttons, metallic zippers, collar stands, lock strings, and desiccants.";

  return {
    title: fullTitle,
    description: metaDescription,
    metadataBase: new URL(siteConfig.siteUrl),
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: fullTitle,
      description: metaDescription,
      url: canonicalUrl,
      siteName: siteConfig.companyName,
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: metaDescription,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

/**
 * Generates strictly verified LocalBusiness JSON-LD (only verified company name, URL, and supplied address).
 * Never includes unverified phone, hours, ratings, or certifications.
 */
export function getLocalBusinessJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: siteConfig.companyName,
    url: `${siteConfig.siteUrl}/`,
    description: siteConfig.tagline,
    address: {
      "@type": "PostalAddress",
      streetAddress: `${siteConfig.address.line1}, ${siteConfig.address.line2}`,
      addressLocality: siteConfig.address.city,
      postalCode: siteConfig.address.postalCode,
      addressCountry: siteConfig.address.countryCode,
    },
  };
}
