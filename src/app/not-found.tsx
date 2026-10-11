import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";

export default function NotFound() {
  return (
    <section className="flex flex-1 items-center py-24 sm:py-36">
      <Container size="narrow" className="text-center">
        <p className="text-xs font-medium uppercase tracking-[0.22em] text-forest">
          Error 404 / Page Not Found
        </p>
        <h1 className="mt-4 font-serif text-4xl sm:text-6xl font-medium tracking-tight text-charcoal">
          This pattern piece could not be located.
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-muted">
          The page you are looking for may have moved or does not exist. Explore
          our 13 garment accessory categories or reach us directly on WhatsApp.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2.5 border border-btn-primary bg-btn-primary px-6 py-3.5 text-xs font-medium uppercase tracking-[0.14em] text-btn-primary-text transition-colors hover:bg-btn-primary-hover hover:border-btn-primary-hover"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            <span>Back to Home</span>
          </Link>
          <Link
            href="/accessories/"
            className="inline-flex items-center gap-2 border border-charcoal/25 bg-transparent px-6 py-3.5 text-xs font-medium uppercase tracking-[0.14em] text-charcoal transition-colors hover:border-charcoal"
          >
            <span>Explore Accessories</span>
          </Link>
          <WhatsAppButton
            label="Contact Us"
            variant="subtle"
            size="md"
          />
        </div>
      </Container>
    </section>
  );
}
