"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { siteConfig } from "@/content/site";
import { getCategoryBySlug } from "@/content/accessories";
import { Container } from "@/components/layout/Container";
import { TextReveal } from "@/components/animations/TextReveal";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

export function HomeButtonShowcaseSection() {
  const { buttonShowcase } = siteConfig.homeSections;
  const buttonsCategory = getCategoryBySlug("buttons");
  const buttonSubItems = buttonsCategory?.subItems ?? [];
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = sectionRef.current;
      if (!el) return;

      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      if (prefersReducedMotion) return;

      const items = el.querySelectorAll("[data-btn-variety]");
      gsap.fromTo(
        items,
        { y: 16, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.55,
          stagger: 0.035,
          ease: "power2.out",
          scrollTrigger: {
            trigger: el,
            start: "top 68%",
          },
        }
      );
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      id="button-showcase-section"
      aria-labelledby="button-showcase-heading"
      className="relative z-10 border-b border-border-warm/60 py-24 sm:py-36"
    >
      <Container>
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-12 lg:items-end">
          {/* Left Column: Minimalist Editorial Narrative */}
          <div className="lg:col-span-6 rounded-xs bg-canvas/80 backdrop-blur-xs p-2 sm:p-0">
            <p className="font-mono text-[11px] font-medium uppercase tracking-[0.22em] text-forest">
              {buttonShowcase.eyebrow}
            </p>
            <div className="mt-4">
              <TextReveal
                id="button-showcase-heading"
                as="h2"
                text={buttonShowcase.headline}
                className="font-serif text-3xl sm:text-5xl lg:text-6xl font-medium tracking-tight text-charcoal leading-[1.06]"
              />
            </div>
            <p className="mt-5 max-w-lg text-sm sm:text-lg leading-relaxed text-muted">
              {buttonShowcase.description}
            </p>

            <div className="mt-8 divide-y divide-border-warm/70 border-y border-border-warm/70">
              {buttonShowcase.materialNotes.map((note) => (
                <div
                  key={note.label}
                  className="py-3.5 flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1"
                >
                  <span className="text-xs font-medium uppercase tracking-[0.14em] text-charcoal">
                    {note.label}
                  </span>
                  <span className="text-xs sm:text-sm text-muted">
                    {note.detail}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-8">
              <Link
                href="/accessories/buttons/"
                className="group inline-flex items-center gap-2.5 text-xs font-medium uppercase tracking-[0.16em] text-charcoal transition-colors hover:text-forest"
              >
                <span>Explore Buttons Specification</span>
                <ArrowRight
                  className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </Link>
            </div>
          </div>

          {/* Right Column: Minimalist 16 Button Varieties Typographic Grid */}
          <div className="lg:col-span-6">
            <div className="border border-border-warm/80 bg-paper/82 dark:bg-paper/80 p-6 sm:p-8 backdrop-blur-md">
              <div className="flex items-center justify-between border-b border-border-warm/70 pb-3.5 text-[11px] font-mono uppercase tracking-[0.18em]">
                <span className="text-forest">09 / BUTTONS</span>
                <span className="text-soft-gray">16 VARIETIES</span>
              </div>

              <ul
                aria-label="16 Button Varieties"
                className="mt-5 grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-4"
              >
                {buttonSubItems.map((sub, idx) => (
                  <li
                    key={sub.name}
                    data-btn-variety
                    className="flex items-baseline gap-2 border-b border-border-warm/40 pb-2"
                  >
                    <span className="font-mono text-[10px] text-soft-gray">
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                    <span className="font-serif text-base sm:text-lg font-medium text-charcoal">
                      {sub.name}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
