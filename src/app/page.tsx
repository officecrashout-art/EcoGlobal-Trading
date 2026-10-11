import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/seo";
import { HomeSceneStage } from "@/components/scenes/HomeSceneStage";
import { HomeHeroSection } from "@/components/sections/HomeHeroSection";
import { HomeUnzipSection } from "@/components/sections/HomeUnzipSection";
import { HomeButtonShowcaseSection } from "@/components/sections/HomeButtonShowcaseSection";
import { HomeCategoriesSection } from "@/components/sections/HomeCategoriesSection";

export const metadata: Metadata = createPageMetadata({
  path: "/",
});

export default function HomePage() {
  return (
    <div id="home-scroll-stage" className="relative flex flex-col">
      {/* Fixed 3D Scroll-Scrubbed Canvas */}
      <HomeSceneStage />

      <HomeHeroSection />
      <HomeUnzipSection />
      <HomeButtonShowcaseSection />
      <HomeCategoriesSection />
    </div>
  );
}
