import React from "react";
import Link from "next/link";
import { ArrowUpRight, MapPin } from "lucide-react";
import { siteConfig } from "@/content/site";
import { accessoryCategories } from "@/content/accessories";
import { Container } from "@/components/layout/Container";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { BrandLogo } from "@/components/ui/BrandLogo";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border-warm bg-surface/65 text-charcoal overflow-hidden">
      <Container className="py-14 sm:py-16 lg:py-24">
        {/* Top Editorial Banner */}
        <div className="flex flex-col justify-between gap-6 sm:gap-8 border-b border-border-warm pb-10 sm:pb-12 lg:flex-row lg:items-end">
          <div className="max-w-2xl">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-forest">
              Direct Sourcing Inquiry
            </p>
            <h2 className="mt-3 font-serif text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-charcoal">
              Precision garment accessories, tailored to your specification.
            </h2>
          </div>
          <div className="shrink-0">
            <WhatsAppButton
              label="Contact Us on WhatsApp"
              size="lg"
              variant="primary"
              className="w-full sm:w-auto"
            />
          </div>
        </div>

        {/* Main Footer Columns */}
        <div className="grid grid-cols-1 gap-10 py-12 sm:py-14 lg:grid-cols-12">
          {/* Column 1: Official Brand Logo & Address */}
          <div className="min-w-0 lg:col-span-5 space-y-6">
            <div>
              <Link
                href="/"
                aria-label={`${siteConfig.companyName} — Home`}
                className="inline-block focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-forest"
              >
                <BrandLogo variant="full" size="lg" />
              </Link>
              <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted">
                {siteConfig.tagline}
              </p>
            </div>

            <address className="not-italic space-y-2 text-sm text-muted">
              <div className="flex items-start gap-2.5">
                <MapPin
                  className="mt-0.5 h-4 w-4 shrink-0 text-forest"
                  aria-hidden="true"
                />
                <div>
                  <span className="block font-medium text-charcoal">
                    Office Address
                  </span>
                  <span>{siteConfig.address.full}</span>
                </div>
              </div>
              <div className="pl-6.5 pt-1">
                <a
                  href={siteConfig.address.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-medium uppercase tracking-[0.14em] text-forest underline-offset-4 hover:underline"
                >
                  <span>Open in Google Maps</span>
                  <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                </a>
              </div>
            </address>

            <div className="pt-1 text-xs text-muted">
              <span className="uppercase tracking-[0.14em] text-soft-gray">
                WhatsApp:{" "}
              </span>
              <span className="font-mono font-semibold text-charcoal">
                {siteConfig.whatsapp.localNumber}
              </span>
            </div>
          </div>

          {/* Column 2: Navigation */}
          <div className="min-w-0 lg:col-span-2 space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-soft-gray">
              Navigation
            </h3>
            <ul className="space-y-2.5 text-sm">
              {siteConfig.navigation.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-muted transition-colors hover:text-forest"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Product Categories Index */}
          <div className="min-w-0 lg:col-span-5 space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-soft-gray">
              Accessory Categories (13)
            </h3>
            <ul className="grid grid-cols-1 gap-x-6 gap-y-2.5 text-sm sm:grid-cols-2">
              {accessoryCategories.map((cat) => (
                <li key={cat.slug} className="min-w-0">
                  <Link
                    href={`/accessories/${cat.slug}/`}
                    className="group flex items-baseline gap-2 text-muted transition-colors hover:text-forest"
                  >
                    <span className="shrink-0 font-mono text-[10px] text-soft-gray">
                      {cat.index}
                    </span>
                    <span className="leading-snug">{cat.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Copyright Bar */}
        <div className="flex flex-col items-start justify-between gap-4 border-t border-border-warm pt-8 text-xs text-soft-gray sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <BrandLogo variant="mark" size="sm" className="h-6 w-6" />
            <p>
              © {currentYear} {siteConfig.companyName} ({siteConfig.domain}). All
              rights reserved.
            </p>
          </div>
          <p className="text-[11px] uppercase tracking-[0.16em]">
            Sector 11, Uttara, Dhaka 1230
          </p>
        </div>
      </Container>
    </footer>
  );
}
