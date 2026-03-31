import { memo } from "react";

/**
 * Lightweight CSS-only gradient mesh — replaces the expensive canvas version.
 * Uses GPU-composited transforms + opacity only for 60fps on budget devices.
 */
const GradientMeshBackground = memo(() => (
  <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
    {/* Base deep gradient */}
    <div
      className="absolute inset-0"
      style={{
        background:
          "linear-gradient(135deg, hsl(225 20% 4%) 0%, hsl(240 18% 6%) 40%, hsl(225 15% 5%) 100%)",
      }}
    />

    {/* Orb 1 — violet, top-left drift */}
    <div
      className="absolute rounded-full will-change-transform"
      style={{
        width: "min(55vw, 600px)",
        height: "min(55vw, 600px)",
        left: "10%",
        top: "15%",
        background:
          "radial-gradient(circle, hsl(250 80% 60% / 0.12) 0%, hsl(250 80% 60% / 0.04) 50%, transparent 70%)",
        animation: "mesh-drift-1 18s ease-in-out infinite",
      }}
    />

    {/* Orb 2 — cyan, right drift */}
    <div
      className="absolute rounded-full will-change-transform"
      style={{
        width: "min(45vw, 500px)",
        height: "min(45vw, 500px)",
        right: "5%",
        top: "30%",
        background:
          "radial-gradient(circle, hsl(200 90% 50% / 0.09) 0%, hsl(200 90% 50% / 0.03) 50%, transparent 70%)",
        animation: "mesh-drift-2 22s ease-in-out infinite",
      }}
    />

    {/* Orb 3 — blue, center pulse */}
    <div
      className="absolute rounded-full will-change-transform"
      style={{
        width: "min(35vw, 400px)",
        height: "min(35vw, 400px)",
        left: "30%",
        top: "10%",
        background:
          "radial-gradient(circle, hsl(220 80% 56% / 0.08) 0%, transparent 60%)",
        animation: "mesh-drift-3 15s ease-in-out infinite",
      }}
    />

    {/* Core glow — center spotlight */}
    <div
      className="absolute left-1/2 -translate-x-1/2 will-change-transform"
      style={{
        width: "min(60vw, 500px)",
        height: "min(40vh, 350px)",
        top: "25%",
        background:
          "radial-gradient(ellipse 100% 100% at 50% 50%, hsl(250 70% 60% / 0.1) 0%, transparent 70%)",
        animation: "mesh-pulse 6s ease-in-out infinite",
      }}
    />

    {/* Subtle particles — CSS only, no canvas */}
    {[...Array(12)].map((_, i) => (
      <div
        key={i}
        className="absolute rounded-full will-change-transform"
        style={{
          width: `${1 + (i % 3)}px`,
          height: `${1 + (i % 3)}px`,
          left: `${8 + i * 7.5}%`,
          top: `${15 + (i * 17) % 70}%`,
          background:
            i % 3 === 0
              ? "hsl(200 90% 70% / 0.4)"
              : i % 3 === 1
              ? "hsl(250 80% 75% / 0.35)"
              : "hsl(220 70% 65% / 0.3)",
          animation: `particle-css-${(i % 3) + 1} ${10 + i * 2}s ease-in-out infinite`,
          animationDelay: `${i * 0.8}s`,
        }}
      />
    ))}
  </div>
));

GradientMeshBackground.displayName = "GradientMeshBackground";

export default GradientMeshBackground;
