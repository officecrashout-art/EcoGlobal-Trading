"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { cn } from "@/lib/utils";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

interface TextRevealProps {
  id?: string;
  text: string;
  as?: "h1" | "h2" | "h3" | "p" | "span";
  className?: string;
  delay?: number;
  immediate?: boolean;
}

export function TextReveal({
  id,
  text,
  as: Tag = "h2",
  className,
  delay = 0,
  immediate = false,
}: TextRevealProps) {
  const rootRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = rootRef.current;
      if (!el) return;

      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      if (prefersReducedMotion) return;

      const words = el.querySelectorAll("[data-word-inner]");
      if (!words.length) return;

      if (immediate) {
        // Transform-only entrance for above-the-fold headings so FCP/LCP remain locked at first paint
        gsap.fromTo(
          words,
          { yPercent: 32 },
          {
            yPercent: 0,
            duration: 0.7,
            stagger: 0.025,
            delay,
            ease: "expo.out",
            clearProps: "transform",
          }
        );
      } else {
        gsap.fromTo(
          words,
          {
            yPercent: 105,
            opacity: 0,
          },
          {
            yPercent: 0,
            opacity: 1,
            duration: 0.85,
            stagger: 0.035,
            delay,
            ease: "expo.out",
            clearProps: "transform,opacity",
            scrollTrigger: {
              trigger: el,
              start: "top 88%",
              toggleActions: "play none none none",
            },
          }
        );
      }
    },
    { scope: rootRef, dependencies: [text, immediate, delay] }
  );

  const words = text.split(" ");

  return (
    <Tag
      id={id}
      ref={rootRef as React.RefObject<HTMLHeadingElement>}
      className={cn(className)}
    >
      {words.map((word, index) => (
        <React.Fragment key={`${word}-${index}`}>
          <span className="inline-block overflow-hidden align-bottom pb-[0.08em] -mb-[0.08em]">
            <span data-word-inner className="inline-block will-change-transform">
              {word}
            </span>
          </span>
          {index < words.length - 1 ? " " : ""}
        </React.Fragment>
      ))}
    </Tag>
  );
}
