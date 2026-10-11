import React from "react";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, MapPin } from "lucide-react";
import { siteConfig } from "@/content/site";
import { Container } from "@/components/layout/Container";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { TextReveal } from "@/components/animations/TextReveal";
import { Reveal } from "@/components/animations/Reveal";

export function HomeAboutTeaserSection() {
  const { aboutTeaser } = siteConfig.homeSections;

  return (
    <section
      id="about-teaser-section"
      aria-labelledby="about-teaser-heading"
      className="relative z-10 py-24 sm:py-32"
    >
      <Container>
        <Reveal className="border border-border-warm bg-paper/95 p-8 sm:p-12 lg:p-16 backdrop-blur-xs">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center">
            {/* Left Column: About Intro & Editable Placeholder */}
            <div className="lg:col-span-7 space-y-5">
              <p className="text-xs font-medium uppercase tracking-[0.22em] text-forest">
                {aboutTeaser.eyebrow}
              </p>

              <div>
                <TextReveal
                  id="about-teaser-heading"
                  as="h2"
                  text={aboutTeaser.headline}
                  className="font-serif text-3xl sm:text-5xl font-medium tracking-tight text-charcoal leading-[1.08]"
                />
              </div>

              <div className="inline-block border border-forest/30 bg-forest-subtle/70 px-3 py-1 text-[11px] font-medium text-forest">
                {aboutTeaser.placeholderNotice}
              </div>

              <p className="border-l-2 border-border-strong bg-surface/65 p-4 text-sm sm:text-base leading-relaxed text-muted">
                {aboutTeaser.description}
              </p>

              <div className="pt-3 flex flex-wrap items-center gap-4">
                <WhatsAppButton
                  label={aboutTeaser.ctaLabel}
                  size="lg"
                  variant="primary"
                />
                <Link
                  href="/about/"
                  className="inline-flex items-center gap-2 border border-charcoal/25 bg-canvas px-6 py-4 text-xs sm:text-sm font-medium uppercase tracking-[0.15em] text-charcoal transition-colors hover:border-charcoal"
                >
                  <span>{aboutTeaser.secondaryLabel}</span>
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
            </div>

            {/* Right Column: Verified Address & Direct Contact Card */}
            <div className="lg:col-span-5">
              <div className="border border-border-warm bg-surface/80 p-7 sm:p-8 space-y-6">
                <div className="flex items-center justify-between border-b border-border-warm pb-3 text-[11px] font-mono uppercase tracking-[0.18em] text-soft-gray">
                  <span>OFFICE LOCATION</span>
                  <span>UTTARA, DHAKA</span>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin
                    className="mt-1 h-5 w-5 shrink-0 text-forest"
                    aria-hidden="true"
                  />
                  <div className="space-y-1">
                    <h3 className="font-serif text-2xl font-medium text-charcoal">
                      {siteConfig.companyName}
                    </h3>
                    <p className="text-sm leading-relaxed text-muted">
                      {siteConfig.address.full}
                    </p>
                  </div>
                </div>

                <div className="border-t border-border-warm pt-4 flex items-center justify-between text-xs">
                  <span className="uppercase tracking-[0.14em] text-soft-gray">
                    Direct WhatsApp
                  </span>
                  <span className="font-mono text-sm font-semibold text-forest">
                    {siteConfig.whatsapp.localNumber}
                  </span>
                </div>

                <div className="space-y-2.5 pt-1">
                  <WhatsAppButton
                    label="Contact Us on WhatsApp"
                    variant="dark"
                    size="md"
                    fullWidth
                  />
                  <a
                    href={siteConfig.address.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex w-full items-center justify-center gap-2 border border-border-warm bg-paper px-4 py-3 text-xs font-medium uppercase tracking-[0.14em] text-charcoal transition-colors hover:border-charcoal"
                  >
                    <span>Open in Google Maps</span>
                    <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
