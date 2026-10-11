"use client";

import React, { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === "undefined") return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      ScrollTrigger.refresh();
      return;
    }

    const lenis = new Lenis({
      duration: 1.05,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      syncTouch: false,
      touchMultiplier: 1.5,
      autoRaf: false,
    });

    lenisRef.current = lenis;

    lenis.on("scroll", ScrollTrigger.update);

    const updateTicker = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(updateTicker);
    gsap.ticker.lagSmoothing(0);

    // Ensure hash / in-page anchor links scroll smoothly and keep keyboard focus intact
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const anchor = target?.closest("a[href*='#']") as HTMLAnchorElement | null;
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href) return;

      try {
        const url = new URL(href, window.location.href);
        if (
          url.pathname.replace(/\/$/, "") ===
            window.location.pathname.replace(/\/$/, "") &&
          url.hash
        ) {
          const targetId = decodeURIComponent(url.hash.slice(1));
          const targetEl = document.getElementById(targetId);
          if (targetEl) {
            e.preventDefault();
            lenis.scrollTo(targetEl, { offset: -96 });
            window.history.pushState(null, "", url.hash);
            targetEl.setAttribute("tabindex", "-1");
            targetEl.focus({ preventScroll: true });
          }
        }
      } catch {
        // Ignore malformed URLs and allow native browser navigation
      }
    };

    document.addEventListener("click", handleAnchorClick);

    return () => {
      document.removeEventListener("click", handleAnchorClick);
      gsap.ticker.remove(updateTicker);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const hash = window.location.hash;
    if (hash) {
      const targetId = decodeURIComponent(hash.slice(1));
      const timer = window.setTimeout(() => {
        const targetEl = document.getElementById(targetId);
        if (targetEl) {
          if (lenisRef.current) {
            lenisRef.current.scrollTo(targetEl, { offset: -96, immediate: false });
          } else {
            targetEl.scrollIntoView({ behavior: "smooth" });
          }
        }
        ScrollTrigger.refresh();
      }, 120);
      return () => window.clearTimeout(timer);
    } else {
      if (lenisRef.current) {
        lenisRef.current.scrollTo(0, { immediate: true });
      } else {
        window.scrollTo(0, 0);
      }
      const timer = window.setTimeout(() => {
        ScrollTrigger.refresh();
      }, 100);
      return () => window.clearTimeout(timer);
    }
  }, [pathname]);

  return <>{children}</>;
}
