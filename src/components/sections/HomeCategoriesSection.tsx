import React from "react";
import { FixedScrollCategoriesReveal } from "@/components/sections/FixedScrollCategoriesReveal";

export function HomeCategoriesSection() {
  return (
    <section
      id="categories-teaser-section"
      aria-labelledby="categories-teaser-heading"
      className="relative z-10"
    >
      <FixedScrollCategoriesReveal />
    </section>
  );
}
