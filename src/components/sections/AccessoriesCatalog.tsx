"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import {
  accessoryCategories,
  formatSubItemLabel,
  type AccessoryCategory,
} from "@/content/accessories";
import { siteConfig } from "@/content/site";
import { buildCategoryInquiryMessage } from "@/lib/whatsapp";
import { Container } from "@/components/layout/Container";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { AccessoryPlaceholderPlate } from "@/components/ui/AccessoryPlaceholderPlate";
import { Reveal } from "@/components/animations/Reveal";
import { cn } from "@/lib/utils";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

const INITIAL_VISIBLE_SUBITEMS = 6;

export function AccessoriesCatalog() {
  const catalogRef = useRef<HTMLDivElement | null>(null);
  const [selectedSlug, setSelectedSlug] = useState<string>("all");
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>(
    {}
  );

  const toggleExpand = (slug: string) => {
    setExpandedCards((prev) => ({
      ...prev,
      [slug]: !prev[slug],
    }));
  };

  const displayedCategories =
    selectedSlug === "all"
      ? accessoryCategories
      : accessoryCategories.filter((c) => c.slug === selectedSlug);

  useGSAP(
    () => {
      const container = catalogRef.current;
      if (!container) return;

      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      const plates = Array.from(
        container.querySelectorAll<HTMLElement>("[data-plate-reveal]")
      );
      if (plates.length === 0) return;

      if (prefersReducedMotion) {
        gsap.set(plates, { clipPath: "inset(0% 0% 0% 0%)" });
        return;
      }

      plates.forEach((plate) => {
        gsap.fromTo(
          plate,
          { clipPath: "inset(12% 8% 12% 8% round 4px)" },
          {
            clipPath: "inset(0% 0% 0% 0% round 0px)",
            ease: "power2.out",
            scrollTrigger: {
              trigger: plate,
              start: "top 88%",
              end: "top 45%",
              scrub: 0.6,
            },
          }
        );
      });
    },
    { scope: catalogRef, dependencies: [selectedSlug] }
  );

  return (
    <div ref={catalogRef}>
      {/* Minimal Sticky Filter Bar */}
      <div className="sticky top-16 sm:top-20 z-30 border-b border-border-warm/70 bg-canvas/92 backdrop-blur-md">
        <Container className="py-3">
          <div
            role="toolbar"
            aria-label="Category filter and quick jump index"
            className="flex items-center gap-1.5 overflow-x-auto no-scrollbar"
          >
            <button
              type="button"
              onClick={() => setSelectedSlug("all")}
              aria-pressed={selectedSlug === "all"}
              className={cn(
                "shrink-0 border px-3 py-1.5 text-[11px] font-mono uppercase tracking-[0.14em] transition-colors",
                selectedSlug === "all"
                  ? "border-btn-primary bg-btn-primary text-btn-primary-text"
                  : "border-border-warm bg-paper text-charcoal hover:border-forest"
              )}
            >
              {siteConfig.accessoriesPage.allCategoriesLabel}
            </button>

            {accessoryCategories.map((cat) => {
              const isSelected = selectedSlug === cat.slug;
              return (
                <a
                  key={cat.slug}
                  href={`#${cat.slug}`}
                  onClick={() => {
                    if (selectedSlug !== "all" && selectedSlug !== cat.slug) {
                      setSelectedSlug("all");
                    }
                  }}
                  className={cn(
                    "shrink-0 inline-flex items-center gap-1.5 border px-3 py-1.5 text-[11px] font-medium tracking-wide transition-colors",
                    isSelected
                      ? "border-btn-primary bg-btn-primary text-btn-primary-text"
                      : "border-border-warm bg-paper text-charcoal hover:border-forest hover:text-forest"
                  )}
                >
                  <span className="font-mono text-[10px] opacity-60">
                    {cat.index}
                  </span>
                  <span>{cat.title}</span>
                </a>
              );
            })}
          </div>
        </Container>
      </div>

      {/* Minimalist Category Cards Grid */}
      <Container className="py-14 sm:py-20">
        <Reveal
          staggerChildren="[data-accessory-card]"
          staggerAmount={0.05}
          className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3"
        >
          {displayedCategories.map((category) => (
            <AccessoryCategoryCard
              key={category.slug}
              category={category}
              isExpanded={Boolean(expandedCards[category.slug])}
              onToggleExpand={() => toggleExpand(category.slug)}
            />
          ))}
        </Reveal>
      </Container>
    </div>
  );
}

interface AccessoryCategoryCardProps {
  category: AccessoryCategory;
  isExpanded: boolean;
  onToggleExpand: () => void;
}

function AccessoryCategoryCard({
  category,
  isExpanded,
  onToggleExpand,
}: AccessoryCategoryCardProps) {
  const hasMoreSubItems = category.subItems.length > INITIAL_VISIBLE_SUBITEMS;
  const visibleSubItems =
    hasMoreSubItems && !isExpanded
      ? category.subItems.slice(0, INITIAL_VISIBLE_SUBITEMS)
      : category.subItems;
  const hiddenCount = category.subItems.length - INITIAL_VISIBLE_SUBITEMS;

  const inquiryMessage = buildCategoryInquiryMessage(category.title);

  return (
    <article
      id={category.slug}
      data-accessory-card
      className="group scroll-mt-36 flex flex-col justify-between border border-border-warm/80 bg-paper p-5 sm:p-6 transition-colors duration-300 hover:border-border-strong"
    >
      <div>
        {/* Specimen Plate with Photo / 3D View Toggle */}
        <div data-plate-reveal className="will-change-[clip-path]">
          <AccessoryPlaceholderPlate
            motif={category.motif}
            index={category.index}
            placeholder={category.imagePlaceholder}
          />
        </div>

        {/* Title & Index */}
        <div className="mt-5 flex items-baseline justify-between gap-3">
          <h2 className="font-serif text-2xl sm:text-3xl font-medium tracking-tight text-charcoal">
            <Link
              href={`/accessories/${category.slug}/`}
              className="transition-colors hover:text-forest"
            >
              {category.title}
            </Link>
          </h2>
          <span className="shrink-0 font-mono text-xs text-forest">
            {category.index}
          </span>
        </div>

        {/* Clean Sub-Item Pills */}
        <div className="mt-3.5 flex flex-wrap gap-1.5">
          {visibleSubItems.map((sub) => (
            <span
              key={sub.name}
              className="inline-block border border-border-warm bg-surface/70 px-2.5 py-1 text-xs text-muted"
            >
              {formatSubItemLabel(sub)}
            </span>
          ))}
          {hasMoreSubItems && (
            <button
              type="button"
              onClick={onToggleExpand}
              aria-expanded={isExpanded}
              className="inline-block border border-dashed border-border-strong px-2.5 py-1 text-xs font-medium text-forest hover:border-forest"
            >
              {isExpanded ? "Show less" : `+${hiddenCount} more`}
            </button>
          )}
        </div>
      </div>

      {/* Minimalist Single-Row Footer Action */}
      <div className="mt-6 flex items-center justify-between gap-3 border-t border-border-warm/70 pt-4">
        <Link
          href={`/accessories/${category.slug}/`}
          className="group/link inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-[0.14em] text-charcoal transition-colors hover:text-forest"
        >
          <span>Details</span>
          <ArrowRight
            className="h-3.5 w-3.5 transition-transform duration-300 group-hover/link:translate-x-0.5"
            aria-hidden="true"
          />
        </Link>

        <WhatsAppButton
          label="Inquire"
          ariaLabel={`Inquire about ${category.title} on WhatsApp`}
          message={inquiryMessage}
          variant="subtle"
          size="sm"
        />
      </div>
    </article>
  );
}
