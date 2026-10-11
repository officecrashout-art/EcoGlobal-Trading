"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { siteConfig } from "@/content/site";
import { Container } from "@/components/layout/Container";
import { TextReveal } from "@/components/animations/TextReveal";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

export function HomeUnzipSection() {
  const { unzipReveal } = siteConfig.homeSections;
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = sectionRef.current;
      if (!el) return;

      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      if (prefersReducedMotion) return;

      const lines = el.querySelectorAll("[data-line-draw]");
      const pillars = el.querySelectorAll("[data-discipline-card]");

      gsap.fromTo(
        lines,
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 0.9,
          stagger: 0.14,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 75%",
          },
        }
      );

      gsap.fromTo(
        pillars,
        { y: 24, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.14,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 72%",
          },
        }
      );
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      id="unzip-reveal-section"
      aria-labelledby="unzip-reveal-heading"
      className="relative z-10 border-b border-border-warm/60 py-24 sm:py-36"
    >
      <Container>
        <div className="max-w-2xl rounded-xs bg-canvas/80 backdrop-blur-xs p-2 sm:p-0">
          <p className="font-mono text-[11px] font-medium uppercase tracking-[0.22em] text-forest">
            {unzipReveal.eyebrow}
          </p>
          <div className="mt-4">
            <TextReveal
              id="unzip-reveal-heading"
              as="h2"
              text={unzipReveal.headline}
              className="font-serif text-3xl sm:text-5xl lg:text-6xl font-medium tracking-tight text-charcoal leading-[1.06]"
            />
          </div>
          <p className="mt-5 max-w-xl text-sm sm:text-lg leading-relaxed text-muted">
            {unzipReveal.description}
          </p>
        </div>

        {/* 3 Minimalist Architectural Pillars */}
        <div className="mt-16 sm:mt-20 grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-12">
          {unzipReveal.highlights.map((item, idx) => (
            <article
              key={item.title}
              data-discipline-card
              className="relative rounded-xs bg-canvas/80 backdrop-blur-xs p-4 sm:p-6"
            >
              <div
                data-line-draw
                className="h-px w-full origin-left bg-border-strong mb-6"
              />
              <span className="font-mono text-xs text-forest">
                0{idx + 1}
              </span>
              <h3 className="mt-3 font-serif text-2xl sm:text-3xl font-medium text-charcoal">
                {item.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                {item.description}
              </p>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
