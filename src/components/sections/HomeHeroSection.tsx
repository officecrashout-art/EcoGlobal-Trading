"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { ArrowDown, ArrowRight } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { siteConfig } from "@/content/site";
import { Container } from "@/components/layout/Container";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { TextReveal } from "@/components/animations/TextReveal";

export function HomeHeroSection() {
  const heroRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = heroRef.current;
      if (!el) return;

      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      if (prefersReducedMotion) return;

      const items = el.querySelectorAll("[data-hero-enter]");
      gsap.fromTo(
        items,
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          stagger: 0.1,
          ease: "power3.out",
          clearProps: "transform,opacity",
        }
      );
    },
    { scope: heroRef }
  );

  return (
    <section
      ref={heroRef}
      id="hero-section"
      aria-labelledby="hero-heading"
      className="relative min-h-[calc(100svh-4rem)] sm:min-h-[calc(100vh-5rem)] flex flex-col justify-between overflow-hidden border-b border-border-warm/60 py-10 sm:py-16 lg:py-24"
    >
      <div aria-hidden="true" />

      {/* Main Minimalist Hero Content (Leaves right stage open for the 3D Zipper) */}
      <Container className="relative z-10 my-auto py-8 sm:py-12">
        <div className="max-w-xl rounded-xs bg-canvas/75 dark:bg-canvas/80 backdrop-blur-xs p-3 sm:p-0">
          <div
            data-hero-enter
            className="inline-flex items-center gap-2.5 text-[11px] font-mono uppercase tracking-[0.22em] text-forest"
          >
            <BrandLogo variant="mark" size="sm" className="h-4 w-4" />
            <span>{siteConfig.hero.eyebrow}</span>
          </div>

          <div className="mt-5 sm:mt-6">
            <TextReveal
              id="hero-heading"
              as="h1"
              immediate
              text={siteConfig.hero.headline}
              className="font-serif text-4xl xs:text-5xl sm:text-6xl lg:text-7xl font-medium tracking-tight text-charcoal leading-[1.03]"
            />
          </div>

          <p
            data-hero-enter
            className="mt-5 sm:mt-6 max-w-md text-sm sm:text-lg leading-relaxed text-muted"
          >
            {siteConfig.hero.description}
          </p>

          <div
            data-hero-enter
            className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4"
          >
            <WhatsAppButton
              label={siteConfig.hero.primaryCtaLabel}
              size="lg"
              variant="primary"
              className="w-full sm:w-auto"
            />
            <Link
              href="/accessories/"
              className="group inline-flex min-h-[48px] items-center justify-center gap-2.5 border border-border-strong bg-paper/85 px-7 py-3.5 text-xs font-medium uppercase tracking-[0.16em] text-charcoal transition-all duration-300 hover:border-btn-primary hover:bg-btn-primary hover:text-btn-primary-text"
            >
              <span>{siteConfig.hero.secondaryCtaLabel}</span>
              <ArrowRight
                className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                aria-hidden="true"
              />
            </Link>
          </div>
        </div>
      </Container>

      {/* Minimal Scroll Indicator */}
      <Container className="relative z-10">
        <div data-hero-enter className="pt-4">
          <a
            href="#unzip-reveal-section"
            className="group inline-flex items-center gap-2.5 text-[11px] font-mono uppercase tracking-[0.2em] text-soft-gray transition-colors hover:text-forest"
          >
            <ArrowDown
              className="h-3.5 w-3.5 text-forest transition-transform duration-300 group-hover:translate-y-0.5"
              aria-hidden="true"
            />
            <span>{siteConfig.hero.scrollHint}</span>
          </a>
        </div>
      </Container>
    </section>
  );
}
