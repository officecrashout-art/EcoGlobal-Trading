"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { Menu, X } from "lucide-react";
import { siteConfig } from "@/content/site";
import { Container } from "@/components/layout/Container";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { cn } from "@/lib/utils";

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const toggleBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 18);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!mobileMenuOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileMenuOpen(false);
        toggleBtnRef.current?.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [mobileMenuOpen]);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname?.startsWith(href.replace(/\/$/, "")) ?? false;
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-colors duration-300",
        scrolled || mobileMenuOpen
          ? "border-b border-border-warm bg-canvas/94 backdrop-blur-md"
          : "border-b border-border-warm/60 bg-canvas/80 backdrop-blur-xs"
      )}
    >
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-4 focus:z-50 focus:bg-btn-primary focus:px-4 focus:py-2 focus:text-xs focus:font-medium focus:uppercase focus:tracking-widest focus:text-btn-primary-text"
      >
        Skip to main content
      </a>

      <Container className="flex h-16 sm:h-20 items-center justify-between gap-2 sm:gap-4 px-4 sm:px-8 lg:px-12">
        {/* Official Brand Logo */}
        <Link
          href="/"
          aria-label={`${siteConfig.companyName} — Home`}
          className="group flex items-center shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-forest"
        >
          <BrandLogo
            variant="full"
            size="md"
            className="max-w-[144px] xs:max-w-[170px] sm:max-w-none"
          />
        </Link>

        {/* Desktop Navigation */}
        <nav
          aria-label="Primary Navigation"
          className="hidden md:flex items-center gap-8 lg:gap-10"
        >
          {siteConfig.navigation.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "relative py-1 text-xs font-semibold uppercase tracking-[0.16em] transition-colors duration-200",
                  active
                    ? "text-forest"
                    : "text-muted hover:text-charcoal"
                )}
              >
                {item.label}
                {active && (
                  <motion.span
                    layoutId="navbar-active-indicator"
                    className="absolute inset-x-0 -bottom-1 h-[2px] bg-forest"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Desktop Theme Toggle & WhatsApp CTA */}
        <div className="hidden md:flex items-center gap-3">
          <ThemeToggle />
          <WhatsAppButton
            label="Contact Us"
            size="sm"
            variant="primary"
            ariaLabel="Contact Eco Global BD on WhatsApp"
          />
        </div>

        {/* Mobile Controls (Theme Toggle + Contact Us + Menu Trigger) */}
        <div className="flex items-center gap-1.5 sm:gap-2 md:hidden">
          <ThemeToggle />
          <WhatsAppButton
            label="Contact Us"
            size="sm"
            variant="primary"
            showArrow={false}
            className="px-2.5 py-2 text-[10px] tracking-wider min-h-[36px]"
          />
          <button
            ref={toggleBtnRef}
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation-drawer"
            aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center border border-border-warm bg-surface text-charcoal transition-colors hover:border-forest hover:text-forest"
          >
            {mobileMenuOpen ? (
              <X className="h-4.5 w-4.5" aria-hidden="true" />
            ) : (
              <Menu className="h-4.5 w-4.5" aria-hidden="true" />
            )}
          </button>
        </div>
      </Container>

      {/* Accessible Mobile Navigation Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            id="mobile-navigation-drawer"
            role="region"
            aria-label="Mobile Navigation Menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-t border-border-warm bg-canvas md:hidden"
          >
            <Container className="py-5 px-4 sm:px-8 flex flex-col gap-5">
              <nav aria-label="Mobile Navigation" className="flex flex-col divide-y divide-border-warm">
                {siteConfig.navigation.map((item, idx) => {
                  const active = isActive(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn(
                        "flex items-center justify-between py-3.5 font-serif text-2xl transition-colors",
                        active ? "text-forest font-semibold" : "text-charcoal hover:text-forest"
                      )}
                    >
                      <span>{item.label}</span>
                      <span className="font-mono text-xs uppercase tracking-[0.2em] text-soft-gray">
                        0{idx + 1}
                      </span>
                    </Link>
                  );
                })}
              </nav>

              <div className="space-y-4 border-t border-border-warm pt-4">
                <div className="flex items-center gap-3">
                  <BrandLogo variant="mark" size="sm" />
                  <p className="text-xs leading-relaxed text-muted">
                    <span className="block font-semibold uppercase tracking-[0.14em] text-charcoal">
                      Office Address
                    </span>
                    {siteConfig.address.full}
                  </p>
                </div>
                <WhatsAppButton
                  label="Contact Us on WhatsApp"
                  size="md"
                  variant="primary"
                  fullWidth
                />
              </div>
            </Container>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
