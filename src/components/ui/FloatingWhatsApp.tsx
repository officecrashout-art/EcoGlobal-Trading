"use client";

import React from "react";
import { MessageCircle } from "lucide-react";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

export function FloatingWhatsApp() {
  const href = buildWhatsAppUrl();

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-5 sm:right-5 z-40 pointer-events-auto">
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with Eco Global BD on WhatsApp (opens in a new tab)"
        className="group flex items-center gap-2.5 rounded-full border border-forest/35 bg-paper/95 px-4 py-3 text-charcoal shadow-md backdrop-blur-md transition-all duration-300 ease-out hover:border-btn-primary hover:bg-btn-primary hover:text-btn-primary-text focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-forest"
      >
        <span className="relative flex h-2 w-2">
          <span className="relative inline-flex h-2 w-2 rounded-full bg-forest group-hover:bg-btn-primary-text transition-colors" />
        </span>
        <MessageCircle
          className="h-4 w-4 text-forest transition-colors group-hover:text-btn-primary-text"
          aria-hidden="true"
        />
        <span className="hidden sm:inline text-[11px] font-medium uppercase tracking-[0.14em]">
          WhatsApp
        </span>
      </a>
    </div>
  );
}
