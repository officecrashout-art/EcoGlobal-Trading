"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { SceneFallback } from "@/components/scenes/SceneFallback";

const HeroScene = dynamic(() => import("@/components/scenes/HeroScene"), {
  ssr: false,
  loading: () => <SceneFallback />,
});

export function HomeSceneStage() {
  const [shouldLoadWebGL, setShouldLoadWebGL] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const nav = navigator as Navigator & { deviceMemory?: number };
    if (
      (typeof nav.hardwareConcurrency === "number" &&
        nav.hardwareConcurrency < 2) ||
      (typeof nav.deviceMemory === "number" && nav.deviceMemory < 2)
    ) {
      return;
    }

    let mounted = true;
    const activate = () => {
      if (mounted) {
        setShouldLoadWebGL(true);
      }
      cleanup();
    };

    const events = ["scroll", "pointermove", "touchstart", "keydown"] as const;
    const cleanup = () => {
      for (const evt of events) {
        window.removeEventListener(evt, activate);
      }
    };

    for (const evt of events) {
      window.addEventListener(evt, activate, { once: true, passive: true });
    }

    // Activate automatically after initial paint so both phone and desktop users see 3D
    const timer = window.setTimeout(activate, 900);

    return () => {
      mounted = false;
      cleanup();
      window.clearTimeout(timer);
    };
  }, []);

  if (!shouldLoadWebGL) {
    return <SceneFallback />;
  }

  return <HeroScene />;
}
