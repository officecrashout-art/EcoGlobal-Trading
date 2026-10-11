"use client";

import React, { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { Box, Image as ImageIcon } from "lucide-react";
import type {
  AccessoryCategory,
  AccessoryImagePlaceholder,
} from "@/content/accessories";
import { cn } from "@/lib/utils";

const AccessoryModelViewer = dynamic(
  () => import("@/components/scenes/AccessoryModelViewer"),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full w-full items-center justify-center bg-[#091822] text-xs font-mono uppercase tracking-[0.16em] text-[#5AC5E5]">
        Loading 3D Asset...
      </div>
    ),
  }
);

interface AccessoryPlaceholderPlateProps {
  motif: AccessoryCategory["motif"];
  index: string;
  placeholder: AccessoryImagePlaceholder;
  className?: string;
  defaultView?: "photo" | "3d";
}

export function AccessoryPlaceholderPlate({
  motif,
  index,
  placeholder,
  className,
  defaultView = "photo",
}: AccessoryPlaceholderPlateProps) {
  const aspectClass = {
    "4:3": "aspect-4/3",
    "1:1": "aspect-square",
    "16:10": "aspect-16/10",
  }[placeholder.aspectRatio];

  // Build candidate image URLs so renaming to .png, .jpg, .jpeg, or .webp works automatically
  const candidateUrls = useMemo(() => {
    const urls: string[] = [];
    if (placeholder.src) {
      urls.push(placeholder.src);
    }
    if (placeholder.assetKey) {
      for (const ext of [".png", ".jpg", ".jpeg", ".webp"]) {
        const candidate = `/assets/images/${placeholder.assetKey}${ext}`;
        if (!urls.includes(candidate)) {
          urls.push(candidate);
        }
      }
    }
    return urls;
  }, [placeholder.src, placeholder.assetKey]);

  const [urlIndex, setUrlIndex] = useState(0);
  const [allImagesFailed, setAllImagesFailed] = useState(
    candidateUrls.length === 0
  );
  const [viewMode, setViewMode] = useState<"photo" | "3d">(
    defaultView === "3d" && placeholder.modelSrc ? "3d" : "photo"
  );

  const currentImageSrc = !allImagesFailed ? candidateUrls[urlIndex] : undefined;

  const handleImageError = () => {
    if (urlIndex + 1 < candidateUrls.length) {
      setUrlIndex((prev) => prev + 1);
    } else {
      setAllImagesFailed(true);
    }
  };

  const handleToggleMode = (
    e: React.MouseEvent<HTMLButtonElement>,
    mode: "photo" | "3d"
  ) => {
    e.preventDefault();
    e.stopPropagation();
    setViewMode(mode);
  };

  return (
    <div
      className={cn(
        "relative overflow-hidden border border-border-warm bg-surface select-none",
        aspectClass,
        className
      )}
    >
      {/* Top Bar: Specimen Index + Interactive Photo / 3D Switcher */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex items-center justify-between gap-2 bg-gradient-to-b from-black/65 via-black/25 to-transparent p-3">
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/90 drop-shadow-xs">
          SPECIMEN / {index}
        </span>

        {placeholder.modelSrc && (
          <div
            role="group"
            aria-label="Switch between Studio Photo and Interactive 3D Model"
            className="pointer-events-auto inline-flex items-center border border-white/25 bg-black/65 p-0.5 backdrop-blur-md"
          >
            <button
              type="button"
              onClick={(e) => handleToggleMode(e, "photo")}
              aria-pressed={viewMode === "photo"}
              className={cn(
                "inline-flex items-center gap-1 px-2 py-1 text-[10px] font-mono uppercase tracking-wider transition-colors",
                viewMode === "photo"
                  ? "bg-[#167186] text-white font-semibold"
                  : "text-slate-300 hover:text-white"
              )}
            >
              <ImageIcon className="h-3 w-3" aria-hidden="true" />
              <span>Photo</span>
            </button>
            <button
              type="button"
              onClick={(e) => handleToggleMode(e, "3d")}
              aria-pressed={viewMode === "3d"}
              className={cn(
                "inline-flex items-center gap-1 px-2 py-1 text-[10px] font-mono uppercase tracking-wider transition-colors",
                viewMode === "3d"
                  ? "bg-[#167186] text-white font-semibold"
                  : "text-slate-300 hover:text-white"
              )}
            >
              <Box className="h-3 w-3" aria-hidden="true" />
              <span>3D View</span>
            </button>
          </div>
        )}
      </div>

      {/* Main Content: 3D GLB Viewer, Studio Image, or Blueprint SVG Fallback */}
      {viewMode === "3d" && placeholder.modelSrc ? (
        <div
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          className="h-full w-full"
        >
          <AccessoryModelViewer
            modelSrc={placeholder.modelSrc}
            title={placeholder.label}
          />
        </div>
      ) : currentImageSrc ? (
        <div className="relative h-full w-full">
          <img
            src={currentImageSrc}
            alt={placeholder.alt}
            loading="lazy"
            onError={handleImageError}
            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-103"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 bg-gradient-to-t from-black/75 via-black/35 to-transparent px-3.5 py-2 text-[11px] text-slate-100"
          >
            <span className="truncate font-medium">
              {placeholder.label.replace(" — Image Placeholder", "").replace(" — Photo Placeholder", "")}
            </span>
            <span className="shrink-0 font-mono text-[10px] uppercase tracking-wider text-[#5AC5E5]">
              ECO GLOBAL
            </span>
          </div>
        </div>
      ) : (
        <div
          role="img"
          aria-label={placeholder.alt}
          className="relative flex h-full w-full flex-col justify-between bg-surface/85 p-4 sm:p-5"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-35"
            style={{
              backgroundImage:
                "linear-gradient(to right, var(--border-subtle) 1px, transparent 1px), linear-gradient(to bottom, var(--border-subtle) 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
          />

          <div className="h-5" aria-hidden="true" />

          <div
            aria-hidden="true"
            className="relative z-10 my-auto flex items-center justify-center py-2 text-charcoal transition-transform duration-500 ease-out group-hover:scale-105"
          >
            <MotifIllustration motif={motif} />
          </div>

          <div
            aria-hidden="true"
            className="relative z-10 flex items-center justify-between gap-2 border-t border-border-warm/90 pt-2.5 text-[11px] text-muted"
          >
            <span className="truncate font-medium">{placeholder.label}</span>
            <span className="shrink-0 font-mono text-[10px] uppercase tracking-wider text-forest">
              ECO GLOBAL
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

function MotifIllustration({ motif }: { motif: AccessoryCategory["motif"] }) {
  switch (motif) {
    case "label":
      return (
        <svg viewBox="0 0 180 100" className="h-24 w-40 stroke-current" fill="none">
          <rect x="22" y="18" width="136" height="64" strokeWidth="1.25" className="fill-canvas/80" />
          <line x1="28" y1="22" x2="28" y2="78" strokeWidth="1" strokeDasharray="3 3" className="stroke-forest" />
          <line x1="152" y1="22" x2="152" y2="78" strokeWidth="1" strokeDasharray="3 3" className="stroke-forest" />
          <rect x="46" y="34" width="88" height="14" strokeWidth="1" />
          <line x1="56" y1="60" x2="124" y2="60" strokeWidth="1" className="stroke-soft-gray" />
          <line x1="68" y1="68" x2="112" y2="68" strokeWidth="1" className="stroke-soft-gray" />
        </svg>
      );
    case "sticker":
      return (
        <svg viewBox="0 0 180 100" className="h-24 w-40 stroke-current" fill="none">
          <rect x="34" y="16" width="112" height="68" rx="8" strokeWidth="1.25" className="fill-canvas/80" />
          <path d="M122 84 L146 60 L122 60 Z" strokeWidth="1.2" className="fill-surface stroke-forest" />
          <line x1="50" y1="36" x2="110" y2="36" strokeWidth="1.2" />
          <line x1="50" y1="48" x2="96" y2="48" strokeWidth="1" className="stroke-soft-gray" />
          <g className="stroke-charcoal">
            <line x1="50" y1="60" x2="50" y2="72" strokeWidth="1.5" />
            <line x1="55" y1="60" x2="55" y2="72" strokeWidth="1" />
            <line x1="60" y1="60" x2="60" y2="72" strokeWidth="2" />
            <line x1="66" y1="60" x2="66" y2="72" strokeWidth="1" />
            <line x1="71" y1="60" x2="71" y2="72" strokeWidth="1.5" />
            <line x1="77" y1="60" x2="77" y2="72" strokeWidth="1" />
            <line x1="82" y1="60" x2="82" y2="72" strokeWidth="2" />
          </g>
        </svg>
      );
    case "heat-transfer":
      return (
        <svg viewBox="0 0 180 100" className="h-24 w-40 stroke-current" fill="none">
          <rect x="38" y="24" width="104" height="58" strokeWidth="1" strokeDasharray="4 3" className="stroke-soft-gray" />
          <rect x="46" y="16" width="104" height="58" strokeWidth="1.25" className="fill-canvas/85" />
          <circle cx="98" cy="38" r="10" strokeWidth="1.2" className="stroke-forest" />
          <line x1="74" y1="56" x2="122" y2="56" strokeWidth="1.2" />
          <line x1="82" y1="63" x2="114" y2="63" strokeWidth="1" className="stroke-soft-gray" />
        </svg>
      );
    case "offset":
      return (
        <svg viewBox="0 0 180 100" className="h-24 w-40 stroke-current" fill="none">
          <path d="M58 14 L112 14 L126 28 L126 86 L58 86 Z" strokeWidth="1.25" className="fill-canvas/85" />
          <circle cx="92" cy="26" r="4" strokeWidth="1.2" className="stroke-forest" />
          <line x1="70" y1="46" x2="114" y2="46" strokeWidth="1.2" />
          <line x1="70" y1="56" x2="114" y2="56" strokeWidth="1" className="stroke-soft-gray" />
          <line x1="70" y1="66" x2="98" y2="66" strokeWidth="1" className="stroke-soft-gray" />
        </svg>
      );
    case "patch":
      return (
        <svg viewBox="0 0 180 100" className="h-24 w-40 stroke-current" fill="none">
          <rect x="28" y="20" width="124" height="60" rx="6" strokeWidth="1.5" className="fill-canvas/85" />
          <rect x="33" y="25" width="114" height="50" rx="4" strokeWidth="1" strokeDasharray="3 2.5" className="stroke-forest" />
          <rect x="56" y="40" width="68" height="20" rx="2" strokeWidth="1.2" />
        </svg>
      );
    case "narrow-fabric":
      return (
        <svg viewBox="0 0 180 100" className="h-24 w-40 stroke-current" fill="none">
          <rect x="18" y="22" width="144" height="18" strokeWidth="1.2" className="fill-canvas/85" />
          <path d="M24 22 L32 40 M36 22 L44 40 M48 22 L56 40 M60 22 L68 40 M72 22 L80 40 M84 22 L92 40 M96 22 L104 40 M108 22 L116 40 M120 22 L128 40 M132 22 L140 40 M144 22 L152 40" strokeWidth="0.9" className="stroke-soft-gray" />
          <rect x="18" y="50" width="144" height="14" strokeWidth="1.2" className="fill-canvas/85" />
          <circle cx="42" cy="57" r="2.5" className="stroke-forest" />
          <circle cx="90" cy="57" r="2.5" className="stroke-forest" />
          <circle cx="138" cy="57" r="2.5" className="stroke-forest" />
          <path d="M24 76 Q 60 68, 90 76 T 156 76" strokeWidth="2" className="stroke-forest" />
        </svg>
      );
    case "gum-tape":
      return (
        <svg viewBox="0 0 180 100" className="h-24 w-40 stroke-current" fill="none">
          <ellipse cx="72" cy="50" rx="34" ry="26" strokeWidth="1.25" className="fill-canvas/85" />
          <ellipse cx="72" cy="50" rx="14" ry="11" strokeWidth="1.2" className="stroke-forest fill-surface" />
          <path d="M72 76 L148 76 L148 52 L105 52" strokeWidth="1.25" className="fill-canvas/70" />
          <line x1="112" y1="64" x2="140" y2="64" strokeWidth="1" strokeDasharray="3 2" className="stroke-forest" />
        </svg>
      );
    case "carton":
      return (
        <svg viewBox="0 0 180 100" className="h-24 w-40 stroke-current" fill="none">
          <polygon points="90,18 142,36 142,74 90,90 38,74 38,36" strokeWidth="1.25" className="fill-canvas/85" />
          <polyline points="38,36 90,52 142,36" strokeWidth="1.2" />
          <line x1="90" y1="52" x2="90" y2="90" strokeWidth="1.2" />
          <line x1="64" y1="27" x2="116" y2="44" strokeWidth="1.2" className="stroke-forest" />
        </svg>
      );
    case "button":
      return (
        <svg viewBox="0 0 180 100" className="h-24 w-40 stroke-current" fill="none">
          <circle cx="64" cy="50" r="28" strokeWidth="1.4" className="fill-canvas/90" />
          <circle cx="64" cy="50" r="21" strokeWidth="1" className="stroke-soft-gray" />
          <circle cx="57" cy="43" r="3" strokeWidth="1.2" className="stroke-forest" />
          <circle cx="71" cy="43" r="3" strokeWidth="1.2" className="stroke-forest" />
          <circle cx="57" cy="57" r="3" strokeWidth="1.2" className="stroke-forest" />
          <circle cx="71" cy="57" r="3" strokeWidth="1.2" className="stroke-forest" />
          <line x1="57" y1="43" x2="71" y2="57" strokeWidth="1" className="stroke-forest" />
          <line x1="71" y1="43" x2="57" y2="57" strokeWidth="1" className="stroke-forest" />
          <circle cx="122" cy="50" r="22" strokeWidth="1.25" className="fill-canvas/75" />
          <circle cx="122" cy="50" r="7" strokeWidth="1.2" className="stroke-forest" />
        </svg>
      );
    case "zipper":
      return (
        <svg viewBox="0 0 180 100" className="h-24 w-40 stroke-current" fill="none">
          <line x1="76" y1="10" x2="76" y2="90" strokeWidth="1.2" />
          <line x1="104" y1="10" x2="104" y2="90" strokeWidth="1.2" />
          {[18, 26, 34, 62, 70, 78].map((y, idx) => (
            <React.Fragment key={y}>
              <rect x="76" y={y} width="14" height="4" strokeWidth="1" className="fill-canvas" />
              <rect x="90" y={y + (idx % 2 === 0 ? 4 : -4)} width="14" height="4" strokeWidth="1" className="fill-canvas" />
            </React.Fragment>
          ))}
          <rect x="79" y="40" width="22" height="18" rx="2" strokeWidth="1.4" className="fill-canvas stroke-forest" />
          <rect x="85" y="54" width="10" height="16" rx="2" strokeWidth="1.3" className="fill-surface stroke-forest" />
        </svg>
      );
    case "collar":
      return (
        <svg viewBox="0 0 180 100" className="h-24 w-40 stroke-current" fill="none">
          <path d="M32 58 C32 30, 148 30, 148 58 C148 70, 120 74, 90 74 C60 74, 32 70, 32 58 Z" strokeWidth="1.25" className="fill-canvas/85" />
          <polygon points="90,46 112,34 112,62 90,50 68,62 68,34" strokeWidth="1.2" className="fill-surface stroke-forest" />
        </svg>
      );
    case "lock-string":
      return (
        <svg viewBox="0 0 180 100" className="h-24 w-40 stroke-current" fill="none">
          <path d="M52 48 C52 18, 118 18, 118 48 C118 76, 70 76, 70 52" strokeWidth="1.3" />
          <rect x="42" y="48" width="20" height="30" rx="3" strokeWidth="1.3" className="fill-canvas stroke-forest" />
          <circle cx="52" cy="68" r="3" strokeWidth="1" className="stroke-forest" />
          <rect x="116" y="36" width="22" height="38" rx="4" strokeWidth="1.25" className="fill-canvas/85" />
          <circle cx="127" cy="46" r="3.5" strokeWidth="1.2" />
        </svg>
      );
    case "desiccant":
      return (
        <svg viewBox="0 0 180 100" className="h-24 w-40 stroke-current" fill="none">
          <rect x="48" y="16" width="84" height="68" strokeWidth="1.25" className="fill-canvas/85" />
          <line x1="48" y1="24" x2="132" y2="24" strokeWidth="1" strokeDasharray="2 2" className="stroke-forest" />
          <line x1="48" y1="76" x2="132" y2="76" strokeWidth="1" strokeDasharray="2 2" className="stroke-forest" />
          <circle cx="76" cy="46" r="3" className="stroke-forest" />
          <circle cx="90" cy="42" r="3" className="stroke-forest" />
          <circle cx="104" cy="48" r="3" className="stroke-forest" />
          <circle cx="82" cy="58" r="3" className="stroke-forest" />
          <circle cx="98" cy="58" r="3" className="stroke-forest" />
        </svg>
      );
  }
}
