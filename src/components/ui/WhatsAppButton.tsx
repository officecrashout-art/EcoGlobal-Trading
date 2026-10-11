import React from "react";
import { ArrowUpRight, MessageCircle } from "lucide-react";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

export interface WhatsAppButtonProps {
  /** Custom pre-filled WhatsApp text message. Falls back to default site inquiry message. */
  message?: string;
  /** Visible button text. Defaults to "Contact Us" */
  label?: string;
  /** Accessible aria-label override */
  ariaLabel?: string;
  /** Visual style variant */
  variant?: "primary" | "outline" | "dark" | "subtle";
  /** Size preset */
  size?: "sm" | "md" | "lg";
  /** Expand to full container width */
  fullWidth?: boolean;
  /** Show trailing external arrow icon */
  showArrow?: boolean;
  className?: string;
}

export function WhatsAppButton({
  message,
  label = "Contact Us",
  ariaLabel,
  variant = "primary",
  size = "md",
  fullWidth = false,
  showArrow = true,
  className,
}: WhatsAppButtonProps) {
  const href = buildWhatsAppUrl(message);
  const computedAriaLabel =
    ariaLabel ?? `${label} on WhatsApp (opens in a new tab)`;

  const variantClasses = {
    primary:
      "bg-btn-primary text-btn-primary-text border border-btn-primary hover:bg-btn-primary-hover hover:border-btn-primary-hover shadow-xs",
    dark:
      "bg-charcoal text-canvas border border-charcoal hover:bg-btn-primary hover:border-btn-primary hover:text-btn-primary-text",
    outline:
      "bg-transparent text-charcoal border border-border-strong hover:border-btn-primary hover:bg-btn-primary hover:text-btn-primary-text",
    subtle:
      "bg-forest-subtle text-forest border border-forest/25 hover:bg-btn-primary hover:text-btn-primary-text hover:border-btn-primary",
  };

  const sizeClasses = {
    sm: "px-3.5 py-2.5 text-xs tracking-wider uppercase gap-2 min-h-[38px]",
    md: "px-5 py-3 text-xs tracking-[0.14em] uppercase gap-2.5 min-h-[44px]",
    lg: "px-6 sm:px-7 py-3.5 sm:py-4 text-xs sm:text-sm tracking-[0.16em] uppercase gap-3 min-h-[48px]",
  };

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={computedAriaLabel}
      className={cn(
        "group relative inline-flex items-center justify-center font-medium transition-all duration-300 ease-out select-none",
        "focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-forest",
        "active:translate-y-px",
        variantClasses[variant],
        sizeClasses[size],
        fullWidth && "w-full",
        className
      )}
    >
      <MessageCircle
        className="h-4 w-4 shrink-0 transition-transform duration-300 ease-out group-hover:scale-110"
        aria-hidden="true"
      />
      <span>{label}</span>
      {showArrow && (
        <ArrowUpRight
          className="h-3.5 w-3.5 shrink-0 opacity-80 transition-transform duration-300 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          aria-hidden="true"
        />
      )}
    </a>
  );
}
