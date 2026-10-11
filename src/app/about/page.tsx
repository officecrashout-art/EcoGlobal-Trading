import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { siteConfig } from "@/content/site";
import { accessoryCategories, formatSubItemLabel } from "@/content/accessories";
import { createPageMetadata } from "@/lib/seo";
import { Container } from "@/components/layout/Container";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { TextReveal } from "@/components/animations/TextReveal";
import { Reveal } from "@/components/animations/Reveal";

export const metadata: Metadata = createPageMetadata({
  title: "About Us — Garment Accessories Supplier in Uttara, Dhaka",
  description:
    "Learn about Eco Global BD, supplier of garment accessories and trims located at House 32, Level 7, Road 3, Sector 11, Uttara, Dhaka 1230. Contact us on WhatsApp.",
  path: "/about/",
});

export default function AboutPage() {
  return (
    <div className="flex flex-col">
      {/* Section 1: Minimalist Company Overview & Specification Sheet */}
      <section className="border-b border-border-warm/60 py-14 sm:py-24">
        <Container>
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-start">
            <div className="lg:col-span-7">
              <p className="font-mono text-[11px] font-medium uppercase tracking-[0.22em] text-forest">
                {siteConfig.aboutPage.eyebrow}
              </p>
              <TextReveal
                as="h1"
                immediate
                text={siteConfig.aboutPage.headline}
                className="mt-4 font-serif text-4xl sm:text-6xl font-medium tracking-tight text-charcoal leading-[1.06]"
              />

              <div className="mt-8 space-y-5 text-sm sm:text-lg leading-relaxed text-muted">
                {siteConfig.aboutPage.overviewParagraphs.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>

              <div className="mt-9 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
                <WhatsAppButton
                  label="Contact Us"
                  size="lg"
                  variant="primary"
                  className="w-full sm:w-auto"
                />
                <Link
                  href="/accessories/"
                  className="inline-flex min-h-[48px] items-center justify-center gap-2 border border-border-strong bg-paper px-6 py-3.5 text-xs font-medium uppercase tracking-[0.16em] text-charcoal transition-colors hover:border-btn-primary hover:bg-btn-primary hover:text-btn-primary-text"
                >
                  <span>Explore 13 Categories</span>
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
            </div>

            {/* Right: Verified Business Specification Card */}
            <div className="lg:col-span-5">
              <Reveal delay={0.1}>
                <aside
                  aria-label="Company Directory Specification"
                  className="border border-border-warm bg-paper p-6 sm:p-9 space-y-6"
                >
                  <div className="flex items-center justify-between border-b border-border-warm pb-4 font-mono text-xs uppercase tracking-[0.18em]">
                    <span className="text-forest">STUDIO SPECIFICATION</span>
                    <span className="text-soft-gray">DHAKA / BD</span>
                  </div>

                  <div className="border-b border-border-warm pb-5">
                    <BrandLogo variant="full" size="md" />
                  </div>

                  <dl className="space-y-4 text-sm">
                    <div>
                      <dt className="text-[11px] font-mono uppercase tracking-[0.16em] text-soft-gray">
                        Discipline
                      </dt>
                      <dd className="mt-1 text-charcoal">
                        Garment Accessories, Trims, Closures &amp; Packaging Supply
                      </dd>
                    </div>

                    <div className="border-t border-border-warm pt-4">
                      <dt className="text-[11px] font-mono uppercase tracking-[0.16em] text-soft-gray">
                        Office Address
                      </dt>
                      <dd className="mt-1 leading-relaxed text-charcoal">
                        {siteConfig.address.full}
                      </dd>
                    </div>

                    <div className="border-t border-border-warm pt-4">
                      <dt className="text-[11px] font-mono uppercase tracking-[0.16em] text-soft-gray">
                        Direct WhatsApp
                      </dt>
                      <dd className="mt-1 font-mono text-base font-medium text-forest">
                        {siteConfig.whatsapp.localNumber}
                      </dd>
                    </div>
                  </dl>

                  <div className="pt-2">
                    <a
                      href={siteConfig.address.googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex w-full items-center justify-center gap-2 border border-border-warm bg-surface/60 px-5 py-3 text-xs font-medium uppercase tracking-[0.14em] text-charcoal transition-colors hover:border-charcoal"
                    >
                      <span>{siteConfig.aboutPage.mapsButtonLabel}</span>
                      <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </a>
                  </div>
                </aside>
              </Reveal>
            </div>
          </div>
        </Container>
      </section>

      {/* Section 2: Minimalist 13-Category Supply Index */}
      <section className="py-16 sm:py-24">
        <Container>
          <Reveal>
            <div className="max-w-2xl border-b border-border-warm pb-6">
              <p className="font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-forest">
                Scope / 01 — 13
              </p>
              <h2 className="mt-2 font-serif text-3xl sm:text-5xl font-medium tracking-tight text-charcoal">
                {siteConfig.aboutPage.whatWeOfferTitle}
              </h2>
            </div>
          </Reveal>

          <Reveal
            staggerChildren="[data-offer-item]"
            staggerAmount={0.035}
            className="divide-y divide-border-warm/70 border-b border-border-warm/70"
          >
            {accessoryCategories.map((category) => (
              <Link
                key={category.slug}
                href={`/accessories/${category.slug}/`}
                data-offer-item
                className="group py-5 grid grid-cols-1 gap-2 md:grid-cols-12 md:items-baseline transition-colors hover:bg-surface/35 px-2 -mx-2"
              >
                <div className="md:col-span-4 flex items-baseline gap-3">
                  <span className="font-mono text-xs text-forest">
                    {category.index}
                  </span>
                  <h3 className="font-serif text-2xl font-medium text-charcoal group-hover:text-forest transition-colors">
                    {category.title}
                  </h3>
                </div>

                <div className="md:col-span-7 text-xs sm:text-sm leading-relaxed text-muted">
                  {category.subItems
                    .map((item) => formatSubItemLabel(item))
                    .join(" • ")}
                </div>

                <div className="md:col-span-1 flex md:justify-end">
                  <ArrowRight
                    className="h-4 w-4 text-soft-gray transition-transform duration-300 group-hover:translate-x-1 group-hover:text-forest"
                    aria-hidden="true"
                  />
                </div>
              </Link>
            ))}
          </Reveal>
        </Container>
      </section>
    </div>
  );
}
