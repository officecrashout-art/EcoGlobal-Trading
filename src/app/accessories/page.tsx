import type { Metadata } from "next";
import { siteConfig } from "@/content/site";
import { createPageMetadata } from "@/lib/seo";
import { Container } from "@/components/layout/Container";
import { TextReveal } from "@/components/animations/TextReveal";
import { AccessoriesCatalog } from "@/components/sections/AccessoriesCatalog";

export const metadata: Metadata = createPageMetadata({
  title: "Garment Accessories & Trims Catalog (13 Categories)",
  description:
    "Explore Eco Global BD's 13 garment accessory categories: Labels, Stickers, Heat Transfer, Offset Paper Items, Patches, Narrow Fabrics, Gum Tape, Cartons, Buttons, Metallic Items, Collar Stands, Lock Strings, and Desiccants.",
  path: "/accessories/",
});

export default function AccessoriesPage() {
  return (
    <div className="flex flex-col">
      {/* Minimalist Page Header */}
      <section className="border-b border-border-warm/60 py-14 sm:py-20">
        <Container>
          <p className="font-mono text-[11px] font-medium uppercase tracking-[0.22em] text-forest">
            {siteConfig.accessoriesPage.eyebrow}
          </p>
          <TextReveal
            as="h1"
            immediate
            text={siteConfig.accessoriesPage.headline}
            className="mt-3 font-serif text-4xl sm:text-6xl font-medium tracking-tight text-charcoal"
          />
          <p className="mt-4 max-w-xl text-sm sm:text-base leading-relaxed text-muted">
            {siteConfig.accessoriesPage.description}
          </p>
        </Container>
      </section>

      {/* Sticky Filter + Minimalist 13-Category Grid */}
      <AccessoriesCatalog />
    </div>
  );
}
