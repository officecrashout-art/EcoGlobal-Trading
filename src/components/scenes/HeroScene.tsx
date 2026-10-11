"use client";

import React, { useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Zipper } from "@/components/scenes/Zipper";
import { Button3D } from "@/components/scenes/Button3D";
import { SceneFallback } from "@/components/scenes/SceneFallback";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

function checkWebGLAndDevice(): {
  supported: boolean;
  isMobile: boolean;
} {
  if (typeof window === "undefined") {
    return { supported: false, isMobile: false };
  }

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return { supported: false, isMobile: false };
  }

  const nav = navigator as Navigator & { deviceMemory?: number };
  if (
    (typeof nav.hardwareConcurrency === "number" &&
      nav.hardwareConcurrency < 2) ||
    (typeof nav.deviceMemory === "number" && nav.deviceMemory < 2)
  ) {
    return { supported: false, isMobile: false };
  }

  try {
    const canvas = document.createElement("canvas");
    const gl =
      canvas.getContext("webgl2") ||
      canvas.getContext("webgl") ||
      canvas.getContext("experimental-webgl");
    if (!gl) {
      return { supported: false, isMobile: false };
    }
  } catch {
    return { supported: false, isMobile: false };
  }

  const isMobile = window.innerWidth < 768;
  return { supported: true, isMobile };
}

export default function HeroScene() {
  const scrollProgressRef = useRef<number>(0);
  const [ready, setReady] = useState(false);
  const [capable, setCapable] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [isCanvasActive, setIsCanvasActive] = useState(true);
  const activeRef = useRef(true);

  useEffect(() => {
    const rafId = window.requestAnimationFrame(() => {
      const result = checkWebGLAndDevice();
      setCapable(result.supported);
      setIsMobile(result.isMobile);
      setIsDark(document.documentElement.classList.contains("dark"));
      setReady(true);
    });

    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    const handleThemeChange = () => {
      setIsDark(document.documentElement.classList.contains("dark"));
    };

    window.addEventListener("resize", handleResize, { passive: true });
    window.addEventListener("eco-theme-change", handleThemeChange);
    return () => {
      window.cancelAnimationFrame(rafId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("eco-theme-change", handleThemeChange);
    };
  }, []);

  useEffect(() => {
    if (!ready || !capable) return;

    const stageEl =
      document.getElementById("home-scroll-stage") ?? document.body;
    const endEl =
      document.getElementById("button-showcase-section") ?? stageEl;

    const trigger = ScrollTrigger.create({
      trigger: stageEl,
      start: "top top",
      endTrigger: endEl,
      end: "bottom top",
      scrub: true,
      onUpdate: (self) => {
        const mappedProgress = self.progress * 0.82;
        scrollProgressRef.current = mappedProgress;
        const shouldBeActive = mappedProgress <= 0.78 && !document.hidden;
        if (shouldBeActive !== activeRef.current) {
          activeRef.current = shouldBeActive;
          setIsCanvasActive(shouldBeActive);
        }
      },
    });

    const handleVisibilityChange = () => {
      const shouldBeActive =
        !document.hidden && scrollProgressRef.current <= 0.78;
      if (shouldBeActive !== activeRef.current) {
        activeRef.current = shouldBeActive;
        setIsCanvasActive(shouldBeActive);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      trigger.kill();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [ready, capable]);

  if (!ready || !capable) {
    return <SceneFallback />;
  }

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden select-none"
    >
      <Canvas
        dpr={isMobile ? [1, 1.25] : [1, 1.5]}
        frameloop={isCanvasActive ? "always" : "demand"}
        camera={{ position: [0, 0, isMobile ? 6.1 : 5.4], fov: isMobile ? 42 : 38 }}
        gl={{
          antialias: !isMobile,
          alpha: true,
          powerPreference: "high-performance",
          stencil: false,
        }}
      >
        <ambientLight
          intensity={isDark ? 0.65 : 0.8}
          color={isDark ? "#D4EEF7" : "#F5F8F9"}
        />
        <directionalLight
          position={[4, 6, 5]}
          intensity={isDark ? 1.85 : 1.65}
          color={isDark ? "#E6F7FC" : "#FFFFFF"}
        />
        <directionalLight
          position={[-4, -3, 3]}
          intensity={isDark ? 0.85 : 0.65}
          color={isDark ? "#268CA9" : "#BCE3EE"}
        />

        <Environment resolution={64} frames={1}>
          <Lightformer
            form="rect"
            intensity={2.4}
            position={[3, 4, 3]}
            scale={[6, 6, 1]}
            color="#FFFFFF"
          />
          <Lightformer
            form="rect"
            intensity={1.3}
            position={[-4, 1, 2]}
            scale={[5, 4, 1]}
            color="#5AC5E5"
          />
          <Lightformer
            form="ring"
            intensity={1.4}
            position={[0, -4, 2]}
            scale={4}
            color="#268CA9"
          />
        </Environment>

        <Zipper
          scrollProgressRef={scrollProgressRef}
          isMobile={isMobile}
          isDark={isDark}
        />

        <Button3D
          scrollProgressRef={scrollProgressRef}
          isMobile={isMobile}
        />
      </Canvas>
    </div>
  );
}
