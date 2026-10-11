"use client";

import React, { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

export function ThemeToggle({ className }: { className?: string }) {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const syncFromDom = () => {
      setIsDark(document.documentElement.classList.contains("dark"));
    };
    syncFromDom();
    setMounted(true);

    const onThemeChange = () => syncFromDom();
    window.addEventListener("eco-theme-change", onThemeChange);
    return () => window.removeEventListener("eco-theme-change", onThemeChange);
  }, []);

  const toggleTheme = () => {
    const nextDark = !document.documentElement.classList.contains("dark");
    document.documentElement.classList.toggle("dark", nextDark);
    const nextTheme = nextDark ? "dark" : "light";
    try {
      localStorage.setItem("eco-global-theme", nextTheme);
    } catch {
      // Ignore storage restrictions
    }
    setIsDark(nextDark);
    window.dispatchEvent(
      new CustomEvent("eco-theme-change", { detail: { theme: nextTheme } })
    );
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={
        mounted
          ? isDark
            ? "Switch to light mode"
            : "Switch to dark mode"
          : "Toggle color theme"
      }
      aria-pressed={mounted ? isDark : undefined}
      title={mounted ? (isDark ? "Switch to light mode" : "Switch to dark mode") : "Toggle theme"}
      className={cn(
        "inline-flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center border border-border-warm bg-surface/80 text-charcoal transition-all duration-200 hover:border-forest hover:text-forest focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest",
        className
      )}
    >
      {mounted && isDark ? (
        <Sun className="h-4 w-4 text-forest transition-transform duration-300 rotate-0" aria-hidden="true" />
      ) : (
        <Moon className="h-4 w-4 transition-transform duration-300" aria-hidden="true" />
      )}
    </button>
  );
}
