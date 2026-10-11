"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import {
  accessoryCategories,
  type AccessoryCategory,
} from "@/content/accessories";
import { siteConfig } from "@/content/site";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

export function FixedScrollCategoriesReveal() {
  const { categoriesSection } = siteConfig.homeSections;

  // Strictly typed animation refs
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const stickyRef = useRef<HTMLDivElement | null>(null);
  const leftColumnRef = useRef<HTMLDivElement | null>(null);
  const rightColumnRef = useRef<HTMLDivElement | null>(null);
  const leftCardRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const rightCardRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const centerContentRef = useRef<HTMLDivElement | null>(null);
  const centerItemRefs = useRef<(HTMLElement | null)[]>([]);

  const setLeftCardRef = (index: number) => (el: HTMLAnchorElement | null) => {
    leftCardRefs.current[index] = el;
  };

  const setRightCardRef = (index: number) => (el: HTMLAnchorElement | null) => {
    rightCardRefs.current[index] = el;
  };

  const setCenterItemRef = (index: number) => (el: HTMLElement | null) => {
    centerItemRefs.current[index] = el;
  };

  // Split the 13 categories cleanly into Left Side (7) and Right Side (6)
  const leftCategories: AccessoryCategory[] = [];
  const rightCategories: AccessoryCategory[] = [];

  accessoryCategories.forEach((cat, idx) => {
    if (idx % 2 === 0) {
      leftCategories.push(cat);
    } else {
      rightCategories.push(cat);
    }
  });

  useGSAP(
    () => {
      const sectionEl = sectionRef.current;
      const leftCol = leftColumnRef.current;
      const rightCol = rightColumnRef.current;
      const centerEl = centerContentRef.current;
      if (!sectionEl || !leftCol || !rightCol || !centerEl) return;

      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      const leftCards = leftCardRefs.current.filter(
        (el): el is HTMLAnchorElement => el !== null
      );
      const rightCards = rightCardRefs.current.filter(
        (el): el is HTMLAnchorElement => el !== null
      );
      const allCards = [...leftCards, ...rightCards];
      const centerItems = centerItemRefs.current.filter(
        (el): el is HTMLElement => el !== null
      );

      if (prefersReducedMotion) {
        gsap.set(leftCol, { x: "-25vw", y: 0 });
        gsap.set(rightCol, { x: "25vw", y: 0 });
        gsap.set(allCards, { clipPath: "inset(0% 0% 0% 0%)", opacity: 1 });
        gsap.set(centerEl, { opacity: 1, scale: 1 });
        gsap.set(centerItems, { opacity: 1, y: 0 });
        return;
      }

      const mm = gsap.matchMedia();

      mm.add(
        {
          isDesktop: "(min-width: 1024px)",
          isTablet: "(min-width: 640px) and (max-width: 1023px)",
          isMobile: "(max-width: 639px)",
        },
        (context) => {
          const { isDesktop, isTablet } = context.conditions as {
            isDesktop: boolean;
            isTablet: boolean;
            isMobile: boolean;
          };

          // Horizontal split distance: starts at x=0 (joined in the center) and parts outward to two sides
          const splitX = isDesktop ? "26vw" : isTablet ? "28vw" : "34vw";

          // Vertical scroll travel so all cards in both side columns glide past smoothly
          const startY = isDesktop ? 360 : isTablet ? 270 : 210;
          const endY = isDesktop ? -420 : isTablet ? -320 : -260;

          // Initial state: Left & Right columns sit side-by-side in the center covering the middle
          gsap.set(leftCol, {
            x: "0vw",
            y: startY,
          });
          gsap.set(rightCol, {
            x: "0vw",
            y: startY + (isDesktop ? 48 : 30),
          });

          gsap.set(allCards, {
            clipPath: isDesktop
              ? "inset(6% 6% 6% 6% round 4px)"
              : "inset(3% 3% 3% 3% round 4px)",
            scale: 0.96,
          });

          // Central content starts hidden behind the joined center cards
          gsap.set(centerEl, {
            opacity: 0,
            scale: 0.9,
          });
          gsap.set(centerItems, {
            opacity: 0,
            y: 22,
          });

          // Main ScrollTrigger timeline synchronized with Lenis
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: sectionEl,
              start: "top top",
              end: "bottom bottom",
              scrub: 0.85,
              invalidateOnRefresh: true,
            },
          });

          // Phase 1 (0 -> 0.42): Cards un-clip and part horizontally into TWO SIDES (Left & Right)
          tl.to(
            allCards,
            {
              clipPath: "inset(0% 0% 0% 0% round 2px)",
              scale: 1,
              duration: 0.35,
              ease: "power2.out",
            },
            0
          );

          tl.to(
            leftCol,
            {
              x: `-${splitX}`,
              duration: 0.44,
              ease: "power2.inOut",
            },
            0.03
          );

          tl.to(
            rightCol,
            {
              x: splitX,
              duration: 0.44,
              ease: "power2.inOut",
            },
            0.03
          );

          // Subtle alternating horizontal & rotational fan-out as cards move to the two sides
          tl.to(
            leftCards,
            {
              xPercent: (i) => (i % 2 === 0 ? -5 : 3),
              rotation: (i) => (i % 2 === 0 ? -1.8 : 1.2),
              duration: 0.44,
              ease: "power2.out",
            },
            0.03
          );

          tl.to(
            rightCards,
            {
              xPercent: (i) => (i % 2 === 0 ? 5 : -3),
              rotation: (i) => (i % 2 === 0 ? 1.8 : -1.2),
              duration: 0.44,
              ease: "power2.out",
            },
            0.03
          );

          // Phase 2 (0.15 -> 0.45): Central minimalist content reveals in the open space between the two sides
          tl.to(
            centerEl,
            {
              opacity: 1,
              scale: 1,
              duration: 0.28,
              ease: "power2.out",
            },
            0.15
          );

          tl.to(
            centerItems,
            {
              opacity: 1,
              y: 0,
              stagger: 0.04,
              duration: 0.28,
              ease: "power3.out",
            },
            0.17
          );

          // Phase 3 (0 -> 1.0): Continuous smooth vertical glide of both side columns
          tl.to(
            leftCol,
            {
              y: endY,
              duration: 1,
              ease: "none",
            },
            0
          );

          tl.to(
            rightCol,
            {
              y: endY - (isDesktop ? 55 : 35),
              duration: 1,
              ease: "none",
            },
            0
          );
        }
      );
    },
    { scope: sectionRef }
  );

  return (
    <div
      ref={sectionRef}
      className="relative h-[260vh] sm:h-[290vh] lg:h-[320vh] w-full border-b border-border-warm bg-canvas"
    >
      {/* Full-Screen Sticky Container */}
      <div
        ref={stickyRef}
        className="sticky top-16 sm:top-20 flex h-[calc(100svh-4rem)] sm:h-[calc(100vh-5rem)] w-full items-center justify-center overflow-hidden"
      >
        {/* Minimalist Central Content (Reveals in the middle as cards split to two sides) */}
        <div
          ref={centerContentRef}
          className="relative z-10 mx-auto flex max-w-[260px] xs:max-w-xs sm:max-w-md lg:max-w-lg flex-col items-center px-3 text-center will-change-[transform,opacity]"
        >
          <div ref={setCenterItemRef(0)} className="mb-3 sm:mb-4">
            <BrandLogo variant="mark" size="md" className="mx-auto" />
          </div>

          <p
            ref={setCenterItemRef(1)}
            className="font-mono text-[10px] sm:text-xs font-medium uppercase tracking-[0.22em] text-forest"
          >
            {categoriesSection.eyebrow}
          </p>

          <h2
            ref={setCenterItemRef(2)}
            id="categories-teaser-heading"
            className="mt-3 sm:mt-4 font-serif text-2xl xs:text-3xl sm:text-5xl lg:text-6xl font-medium tracking-tight text-charcoal leading-[1.06]"
          >
            {categoriesSection.headline}
          </h2>

          <p
            ref={setCenterItemRef(3)}
            className="mt-3 sm:mt-4 max-w-md text-xs sm:text-base leading-relaxed text-muted"
          >
            {categoriesSection.description}
          </p>

          <div
            ref={setCenterItemRef(4)}
            className="mt-5 sm:mt-7 flex flex-col sm:flex-row items-center justify-center gap-2.5 sm:gap-3.5 w-full sm:w-auto"
          >
            <WhatsAppButton
              label={categoriesSection.ctaLabel}
              size="md"
              variant="primary"
              className="w-full sm:w-auto"
            />
            <Link
              href="/accessories/"
              className="inline-flex w-full sm:w-auto min-h-[42px] items-center justify-center gap-2 border border-border-strong bg-paper px-5 py-2.5 text-xs font-medium uppercase tracking-[0.15em] text-charcoal transition-colors hover:border-btn-primary hover:bg-btn-primary hover:text-btn-primary-text"
            >
              <span>{categoriesSection.viewAllLabel}</span>
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </div>
        </div>

        {/* Left & Right Card Columns (Start joined in center, split into two sides on scroll) */}
        <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center gap-2.5 sm:gap-4 lg:gap-6">
          {/* Left Side Column */}
          <div
            ref={leftColumnRef}
            className="flex flex-col gap-4 sm:gap-6 lg:gap-8 will-change-transform"
          >
            {leftCategories.map((cat, idx) => (
              <MinimalCategoryCard
                key={cat.slug}
                category={cat}
                setCardRef={setLeftCardRef(idx)}
              />
            ))}
          </div>

          {/* Right Side Column */}
          <div
            ref={rightColumnRef}
            className="flex flex-col gap-4 sm:gap-6 lg:gap-8 will-change-transform"
          >
            {rightCategories.map((cat, idx) => (
              <MinimalCategoryCard
                key={cat.slug}
                category={cat}
                setCardRef={setRightCardRef(idx)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

interface MinimalCategoryCardProps {
  category: AccessoryCategory;
  setCardRef: (el: HTMLAnchorElement | null) => void;
}

function MinimalCategoryCard({
  category,
  setCardRef,
}: MinimalCategoryCardProps) {
  return (
    <Link
      ref={setCardRef}
      href={`/accessories/${category.slug}/`}
      aria-label={`${category.title} (${category.index})`}
      className="pointer-events-auto group block w-36 xs:w-40 sm:w-48 lg:w-68 overflow-hidden border border-border-warm bg-paper p-1.5 sm:p-2 shadow-lg transition-colors duration-300 hover:border-forest will-change-[clip-path,transform]"
    >
      <div className="relative aspect-4/3 w-full overflow-hidden bg-[#091822]">
        {category.imagePlaceholder.src && (
          <img
            src={category.imagePlaceholder.src}
            alt={category.imagePlaceholder.alt}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          />
        )}
      </div>

      <div className="mt-1.5 sm:mt-2 flex items-center justify-between gap-2 px-1 pb-0.5">
        <span className="truncate font-serif text-xs sm:text-base font-medium text-charcoal group-hover:text-forest">
          {category.title}
        </span>
        <span className="shrink-0 font-mono text-[10px] text-soft-gray">
          {category.index}
        </span>
      </div>
    </Link>
  );
}
