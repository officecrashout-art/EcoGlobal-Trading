import type { MetadataRoute } from "next";
import { siteConfig } from "@/content/site";
import { accessoryCategories } from "@/content/accessories";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = siteConfig.siteUrl;
  const lastModified = new Date("2026-10-11T00:00:00.000Z");

  const coreRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified,
      changeFrequency: "monthly",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/accessories/`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about/`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];

  const categoryRoutes: MetadataRoute.Sitemap = accessoryCategories.map(
    (category) => ({
      url: `${baseUrl}/accessories/${category.slug}/`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.7,
    })
  );

  return [...coreRoutes, ...categoryRoutes];
}
