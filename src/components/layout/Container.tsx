import React from "react";
import { cn } from "@/lib/utils";

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "section" | "header" | "footer" | "article";
  size?: "default" | "narrow" | "wide";
}

export function Container({
  children,
  className,
  as: Component = "div",
  size = "default",
}: ContainerProps) {
  const maxWidthClass = {
    narrow: "max-w-4xl",
    default: "max-w-[1360px]",
    wide: "max-w-[1520px]",
  }[size];

  return (
    <Component
      className={cn(
        "mx-auto w-full px-5 sm:px-8 lg:px-12",
        maxWidthClass,
        className
      )}
    >
      {children}
    </Component>
  );
}
