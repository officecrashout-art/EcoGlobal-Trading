import React from "react";

/**
 * Static CSS/SVG architectural fallback rendered before WebGL initializes,
 * when prefers-reduced-motion is active, or on low-end/non-WebGL devices.
 */
export function SceneFallback() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden select-none opacity-45"
    >
      {/* Subtle architectural center-right seam & zipper illustration */}
      <div className="mx-auto h-full max-w-[1360px] relative">
        <svg
          viewBox="0 0 400 1000"
          fill="none"
          className="absolute right-[6%] lg:right-[14%] top-0 h-full w-64 sm:w-80 stroke-charcoal/25"
          preserveAspectRatio="xMidYMid slice"
        >
          {/* Left & Right Fabric Tape Lines */}
          <path
            d="M 120 0 C 120 220, 175 340, 184 440 L 184 1000"
            strokeWidth="1.2"
            strokeDasharray="4 4"
          />
          <path
            d="M 280 0 C 280 220, 225 340, 216 440 L 216 1000"
            strokeWidth="1.2"
            strokeDasharray="4 4"
          />
          <path
            d="M 155 0 C 155 220, 190 340, 196 440 L 196 1000"
            strokeWidth="1.5"
          />
          <path
            d="M 245 0 C 245 220, 210 340, 204 440 L 204 1000"
            strokeWidth="1.5"
          />

          {/* Closed teeth below slider (Y = 450..960) */}
          {Array.from({ length: 28 }).map((_, i) => {
            const y = 460 + i * 18;
            return (
              <g key={`closed-${i}`}>
                <rect
                  x="188"
                  y={y}
                  width="12"
                  height="5"
                  rx="1"
                  className="fill-border-strong/55 stroke-charcoal/30"
                  strokeWidth="0.8"
                />
                <rect
                  x="200"
                  y={y + 9}
                  width="12"
                  height="5"
                  rx="1"
                  className="fill-border-strong/55 stroke-charcoal/30"
                  strokeWidth="0.8"
                />
              </g>
            );
          })}

          {/* Slider & Puller at Y = 420 */}
          <g transform="translate(178, 405)">
            <rect
              x="0"
              y="0"
              width="44"
              height="52"
              rx="6"
              className="fill-surface stroke-forest/65"
              strokeWidth="1.5"
            />
            <rect
              x="12"
              y="34"
              width="20"
              height="44"
              rx="4"
              className="fill-paper stroke-forest"
              strokeWidth="1.5"
            />
            <circle
              cx="22"
              cy="64"
              r="5"
              className="fill-canvas stroke-forest"
              strokeWidth="1.2"
            />
          </g>

          {/* Architectural Button Outline Accent */}
          <g transform="translate(80, 680)" className="stroke-forest/30">
            <circle cx="0" cy="0" r="44" strokeWidth="1.2" />
            <circle cx="0" cy="0" r="34" strokeWidth="0.9" />
            <circle cx="-10" cy="-10" r="4.5" strokeWidth="1.1" />
            <circle cx="10" cy="-10" r="4.5" strokeWidth="1.1" />
            <circle cx="-10" cy="10" r="4.5" strokeWidth="1.1" />
            <circle cx="10" cy="10" r="4.5" strokeWidth="1.1" />
          </g>
        </svg>
      </div>
    </div>
  );
}
