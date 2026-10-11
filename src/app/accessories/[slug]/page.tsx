import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import {
  accessoryCategories,
  formatSubItemLabel,
  getCategoryBySlug,
  getRelatedCategories,
} from "@/content/accessories";
import { createPageMetadata } from "@/lib/seo";
import {
  buildCategoryInquiryMessage,
  buildWhatsAppUrl,
} from "@/lib/whatsapp";
import { Container } from "@/components/layout/Container";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { AccessoryPlaceholderPlate } from "@/components/ui/AccessoryPlaceholderPlate";
import { TextReveal } from "@/components/animations/TextReveal";
import { Reveal } from "@/components/animations/Reveal";

interface CategoryDetailPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return accessoryCategories.map((cat) => ({
    slug: cat.slug,
  }));
}

export async function generateMetadata({
  params,
}: CategoryDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);

  if (!category) {
    return createPageMetadata({
      title: "Category Not Found",
      path: "/accessories/",
    });
  }

  const subItemsSummary = category.subItems
    .map((s) => formatSubItemLabel(s))
    .join(", ");

  return createPageMetadata({
    title: `${category.title} — Garment Accessories`,
    description: `${category.title} supplied by Eco Global BD in Uttara, Dhaka. Includes: ${subItemsSummary}. Contact us on WhatsApp for details.`,
    path: `/accessories/${category.slug}/`,
  });
}

export default async function CategoryDetailPage({
  params,
}: CategoryDetailPageProps) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  const relatedCategories = getRelatedCategories(category.relatedSlugs);
  const currentIndex = accessoryCategories.findIndex(
    (c) => c.slug === category.slug
  );
  const prevCategory =
    currentIndex > 0 ? accessoryCategories[currentIndex - 1] : null;
  const nextCategory =
    currentIndex < accessoryCategories.length - 1
      ? accessoryCategories[currentIndex + 1]
      : null;

  const categoryInquiryMessage = buildCategoryInquiryMessage(category.title);

  return (
    <div className="flex flex-col">
      {/* Minimalist Category Hero & Primary 3D/Photo Specimen */}
      <section className="border-b border-border-warm/60 py-12 sm:py-20">
        <Container>
          {/* Breadcrumb */}
          <nav
            aria-label="Breadcrumb"
            className="mb-8 flex flex-wrap items-center gap-2 text-xs font-mono uppercase tracking-[0.15em] text-soft-gray"
          >
            <Link href="/" className="transition-colors hover:text-charcoal">
              Home
            </Link>
            <span aria-hidden="true">/</span>
            <Link
              href="/accessories/"
              className="transition-colors hover:text-charcoal"
            >
              Accessories
            </Link>
            <span aria-hidden="true">/</span>
            <span className="text-charcoal" aria-current="page">
              {category.title}
            </span>
          </nav>

          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-center">
            {/* Left: Title, Description & Actions */}
            <div className="lg:col-span-6 space-y-5">
              <div className="inline-flex items-center gap-2.5 font-mono text-xs uppercase tracking-[0.2em] text-forest">
                <span>{category.index} / 13</span>
                <span aria-hidden="true">•</span>
                <span className="text-muted">{category.shortCategoryTag}</span>
              </div>

              <TextReveal
                as="h1"
                immediate
                text={category.title}
                className="font-serif text-4xl sm:text-6xl font-medium tracking-tight text-charcoal leading-[1.05]"
              />

              <p className="max-w-xl text-sm sm:text-base leading-relaxed text-muted">
                {category.detailPlaceholder}
              </p>

              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <WhatsAppButton
                  label={`Inquire about ${category.title}`}
                  message={categoryInquiryMessage}
                  size="lg"
                  variant="primary"
                  className="w-full sm:w-auto"
                />
                <Link
                  href="/accessories/"
                  className="inline-flex min-h-[48px] items-center justify-center gap-2 border border-border-warm bg-paper px-5 py-3 text-xs font-medium uppercase tracking-[0.14em] text-charcoal transition-colors hover:border-charcoal"
                >
                  <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>All Categories</span>
                </Link>
              </div>
            </div>

            {/* Right: Interactive Photo / 3D Specimen Plate */}
            <div className="lg:col-span-6">
              <Reveal delay={0.08}>
                <AccessoryPlaceholderPlate
                  motif={category.motif}
                  index={category.index}
                  placeholder={category.imagePlaceholder}
                />
              </Reveal>
            </div>
          </div>
        </Container>
      </section>

      {/* Sub-items Breakdown */}
      <section className="py-16 sm:py-24">
        <Container>
          <Reveal>
            <div className="flex items-baseline justify-between border-b border-border-warm pb-4">
              <h2 className="font-serif text-2xl sm:text-4xl font-medium text-charcoal">
                Available Varieties
              </h2>
              <span className="font-mono text-xs uppercase tracking-[0.18em] text-soft-gray">
                {category.subItems.length}{" "}
                {category.subItems.length === 1 ? "VARIETY" : "VARIETIES"}
              </span>
            </div>

            <ul className="divide-y divide-border-warm/70 border-b border-border-warm/70">
              {category.subItems.map((subItem, idx) => {
                const subItemLabel = formatSubItemLabel(subItem);
                const subItemWaUrl = buildWhatsAppUrl(
                  `Hello Eco Global BD, I'm interested in ${category.title} (${subItemLabel}). Please share details.`
                );

                return (
                  <li
                    key={subItem.name}
                    className="py-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="space-y-2">
                      <div className="flex items-baseline gap-3.5">
                        <span className="font-mono text-xs text-soft-gray">
                          {String(idx + 1).padStart(2, "0")}
                        </span>
                        <h3 className="font-serif text-xl sm:text-2xl font-medium text-charcoal">
                          {subItem.name}
                        </h3>
                      </div>
                      {subItem.variants && subItem.variants.length > 0 && (
                        <div className="pl-7 flex flex-wrap gap-2">
                          {subItem.variants.map((variant) => (
                            <span
                              key={variant}
                              className="inline-block border border-border-warm bg-surface px-2.5 py-0.5 text-xs text-muted"
                            >
                              {variant}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="pl-7 sm:pl-0 shrink-0">
                      <a
                        href={subItemWaUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Inquire about ${subItemLabel} on WhatsApp`}
                        className="inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-[0.14em] text-forest transition-colors hover:underline"
                      >
                        <span>Inquire</span>
                        <ArrowRight
                          className="h-3.5 w-3.5"
                          aria-hidden="true"
                        />
                      </a>
                    </div>
                  </li>
                );
              })}
            </ul>
          </Reveal>
        </Container>
      </section>

      {/* 3-Plate Visual Reference Gallery */}
      <section className="border-t border-border-warm/60 bg-surface/25 py-16 sm:py-24">
        <Container>
          <Reveal>
            <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-forest">
                  Visual Gallery
                </p>
                <h2 className="mt-2 font-serif text-2xl sm:text-4xl font-medium text-charcoal">
                  {category.title} Specimens
                </h2>
              </div>
              <p className="font-mono text-[11px] text-soft-gray">
                /assets/images/{category.slug}-1..3.png
              </p>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
              {category.galleryPlaceholders.map((galleryItem) => (
                <div key={galleryItem.id} className="group">
                  <AccessoryPlaceholderPlate
                    motif={category.motif}
                    index={category.index}
                    placeholder={galleryItem}
                  />
                </div>
              ))}
            </div>
          </Reveal>
        </Container>
      </section>

      {/* Minimal Related Categories */}
      {relatedCategories.length > 0 && (
        <section className="border-t border-border-warm/60 py-16 sm:py-24">
          <Container>
            <Reveal>
              <div className="flex items-end justify-between border-b border-border-warm/70 pb-4">
                <h2 className="font-serif text-2xl sm:text-3xl font-medium text-charcoal">
                  Related Categories
                </h2>
                <Link
                  href="/accessories/"
                  className="inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-[0.14em] text-forest hover:underline"
                >
                  <span>View All</span>
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                </Link>
              </div>

              <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
                {relatedCategories.map((rel) => (
                  <Link
                    key={rel.slug}
                    href={`/accessories/${rel.slug}/`}
                    className="group flex flex-col justify-between border border-border-warm/80 bg-paper p-6 transition-colors hover:border-forest"
                  >
                    <div>
                      <span className="font-mono text-xs text-forest">
                        {rel.index}
                      </span>
                      <h3 className="mt-2 font-serif text-2xl font-medium text-charcoal group-hover:text-forest">
                        {rel.title}
                      </h3>
                      <p className="mt-2 text-xs text-muted line-clamp-2">
                        {rel.subItems.map((s) => s.name).join(" • ")}
                      </p>
                    </div>

                    <div className="mt-6 inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-[0.14em] text-charcoal group-hover:text-forest">
                      <span>Explore</span>
                      <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden="true" />
                    </div>
                  </Link>
                ))}
              </div>
            </Reveal>
          </Container>
        </section>
      )}

      {/* Minimal Prev / Next Category Pagination */}
      <section className="border-t border-border-warm/60 bg-surface/35 py-10">
        <Container>
          <div className="flex items-center justify-between gap-4">
            <div>
              {prevCategory ? (
                <Link
                  href={`/accessories/${prevCategory.slug}/`}
                  className="group inline-flex flex-col gap-1 text-left"
                >
                  <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-soft-gray group-hover:text-forest">
                    <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
                    Prev ({prevCategory.index})
                  </span>
                  <span className="font-serif text-lg sm:text-xl font-medium text-charcoal group-hover:text-forest">
                    {prevCategory.title}
                  </span>
                </Link>
              ) : (
                <Link
                  href="/accessories/"
                  className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-muted hover:text-charcoal"
                >
                  <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
                  All Categories
                </Link>
              )}
            </div>

            <div className="text-right">
              {nextCategory ? (
                <Link
                  href={`/accessories/${nextCategory.slug}/`}
                  className="group inline-flex flex-col items-end gap-1"
                >
                  <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-soft-gray group-hover:text-forest">
                    Next ({nextCategory.index})
                    <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </span>
                  <span className="font-serif text-lg sm:text-xl font-medium text-charcoal group-hover:text-forest">
                    {nextCategory.title}
                  </span>
                </Link>
              ) : (
                <Link
                  href="/accessories/"
                  className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-muted hover:text-charcoal"
                >
                  All Categories
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                </Link>
              )}
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
