import React from "react";
import { siteConfig } from "@/content/site";
import { cn } from "@/lib/utils";

interface BrandLogoProps {
  variant?: "full" | "mark";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function BrandLogo({
  variant = "full",
  size = "md",
  className,
}: BrandLogoProps) {
  if (variant === "mark") {
    const markSizeClasses = {
      sm: "h-8 w-8",
      md: "h-10 w-10",
      lg: "h-14 w-14",
    }[size];

    return (
      <img
        src="/images/logo-mark.png"
        alt={`${siteConfig.companyName} emblem`}
        width={216}
        height={216}
        className={cn(
          "object-contain select-none transition-transform duration-300 dark:brightness-110 dark:contrast-105",
          markSizeClasses,
          className
        )}
      />
    );
  }

  const fullSizeClasses = {
    sm: "h-7 sm:h-8 w-auto",
    md: "h-7 sm:h-9 lg:h-10 w-auto",
    lg: "h-10 sm:h-12 lg:h-14 w-auto",
  }[size];

  return (
    <img
      src="/images/logo-full.png"
      alt={`${siteConfig.companyName} — Textile & Accessories Solution`}
      width={802}
      height={172}
      className={cn(
        "object-contain select-none transition-all duration-300 dark:brightness-115 dark:drop-shadow-[0_0_10px_rgba(76,195,230,0.16)]",
        fullSizeClasses,
        className
      )}
    />
  );
}
