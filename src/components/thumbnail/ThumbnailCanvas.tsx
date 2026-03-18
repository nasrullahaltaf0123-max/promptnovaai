import { forwardRef } from "react";
import { type ThumbnailConfig, FONT_PRESETS, TEXT_COLORS } from "./types";

interface Props {
  config: ThumbnailConfig;
  id?: string;
}

const ThumbnailCanvas = forwardRef<HTMLDivElement, Props>(({ config, id }, ref) => {
  const {
    title, subtitle, platform, textPosition, fontPreset, textColor,
    textEffect, textSize, enableGlow, enableStroke,
    subjectImage, subjectScale, subjectFlip,
    backgroundImage, backgroundBlur, shapeOverlay,
  } = config;

  const fonts = FONT_PRESETS[fontPreset];
  const color = TEXT_COLORS[textColor];
  const aspectRatio = `${platform.width} / ${platform.height}`;
  const isVertical = platform.height > platform.width;
  const isSquare = platform.width === platform.height;
  const sizeScale = textSize / 100;

  // Text container positioning
  const textContainerClass = (() => {
    if (isVertical) return "items-center justify-end pb-[15%] px-[8%] text-center";
    if (textPosition === "center") return "items-center justify-center px-[8%] text-center";
    if (textPosition === "bottom-left") return "items-start justify-end pb-[8%] pl-[5%] pr-[40%] text-left";
    return "items-start justify-center pl-[5%] pr-[45%] text-left";
  })();

  // Dynamic title size based on platform & slider
  const baseTitleRem = isVertical ? 2.8 : isSquare ? 2.4 : 3;
  const baseSubRem = isVertical ? 1.2 : 1;
  const titleFontSize = `${baseTitleRem * sizeScale}rem`;
  const subtitleFontSize = `${baseSubRem * sizeScale}rem`;

  // Text effect inline styles
  const titleEffectStyle = (() => {
    switch (textEffect) {
      case "3d":
        return {
          textShadow: `
            2px 2px 0 rgba(0,0,0,0.8),
            4px 4px 0 rgba(0,0,0,0.6),
            6px 6px 0 rgba(0,0,0,0.4),
            8px 8px 16px rgba(0,0,0,0.5)
          `,
        };
      case "gradient":
        return {
          background: textColor === "yellow"
            ? "linear-gradient(180deg, #FFD700 0%, #FF8C00 100%)"
            : textColor === "cyan"
            ? "linear-gradient(180deg, #06b6d4 0%, #3b82f6 100%)"
            : "linear-gradient(180deg, #FFFFFF 0%, #94a3b8 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          filter: enableGlow ? "drop-shadow(0 0 16px rgba(255,215,0,0.4))" : undefined,
        } as React.CSSProperties;
      default:
        return {};
    }
  })();

  const highlightActive = textEffect === "highlight";

  return (
    <div
      ref={ref}
      id={id}
      className="relative w-full overflow-hidden rounded-xl"
      style={{ aspectRatio, maxWidth: "100%" }}
    >
      {/* Background */}
      {backgroundImage ? (
        <img
          src={backgroundImage}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          style={{ filter: backgroundBlur > 0 ? `blur(${backgroundBlur}px)` : undefined }}
          crossOrigin="anonymous"
        />
      ) : (
        <div className="absolute inset-0 thumb-bg-cinematic" />
      )}

      {/* Cinematic overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/20 to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20 pointer-events-none" />

      {/* Shape overlays */}
      {shapeOverlay === "arrow" && (
        <div className="absolute z-20 pointer-events-none" style={isVertical ? { bottom: "52%", left: "50%", transform: "translateX(-50%)" } : { top: "50%", left: "42%", transform: "translateY(-50%)" }}>
          <svg width="80" height="60" viewBox="0 0 80 60" fill="none">
            <path d="M10 30 L55 30 L45 15 L70 30 L45 45 L55 30" stroke="#FFD700" strokeWidth="4" fill="#FFD700" opacity="0.9" />
          </svg>
        </div>
      )}
      {shapeOverlay === "circle" && subjectImage && (
        <div
          className="absolute z-[5] rounded-full pointer-events-none"
          style={{
            border: "4px solid rgba(255,215,0,0.6)",
            boxShadow: "0 0 30px rgba(255,215,0,0.3), inset 0 0 30px rgba(255,215,0,0.1)",
            ...(isVertical
              ? { bottom: "30%", left: "50%", transform: "translateX(-50%)", width: "55%", height: "auto", aspectRatio: "1" }
              : { right: "2%", top: "10%", width: "40%", height: "80%" }),
          }}
        />
      )}
      {shapeOverlay === "glow-lines" && (
        <div className="absolute inset-0 z-[5] pointer-events-none overflow-hidden">
          <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-yellow-400/30 to-transparent" />
          <div className="absolute top-0 right-1/3 w-px h-full bg-gradient-to-b from-transparent via-cyan-400/20 to-transparent" />
          <div className="absolute top-1/3 left-0 w-full h-px bg-gradient-to-r from-transparent via-yellow-400/20 to-transparent" />
        </div>
      )}

      {/* Subject image */}
      {subjectImage && !isVertical && (
        <div
          className="absolute right-0 bottom-0 pointer-events-none z-10"
          style={{
            height: `${subjectScale}%`,
            transform: subjectFlip ? "scaleX(-1)" : undefined,
          }}
        >
          <img
            src={subjectImage}
            alt="Subject"
            className="h-full w-auto object-contain"
            style={{
              filter: `drop-shadow(0 8px 24px rgba(0,0,0,0.7)) drop-shadow(0 0 40px rgba(255,200,0,0.25))`,
            }}
          />
        </div>
      )}
      {subjectImage && isVertical && (
        <div
          className="absolute bottom-[35%] left-1/2 -translate-x-1/2 pointer-events-none z-10"
          style={{
            height: `${subjectScale * 0.6}%`,
            transform: subjectFlip ? "translateX(-50%) scaleX(-1)" : undefined,
          }}
        >
          <img
            src={subjectImage}
            alt="Subject"
            className="h-full w-auto object-contain"
            style={{
              filter: "drop-shadow(0 8px 24px rgba(0,0,0,0.7)) drop-shadow(0 0 30px rgba(255,200,0,0.2))",
            }}
          />
        </div>
      )}

      {/* Text overlay */}
      <div className={`absolute inset-0 flex flex-col ${textContainerClass} pointer-events-none select-none z-20`}>
        <div className="relative max-w-full">
          {title && (
            <h2
              className={`font-black leading-[1.05] ${textEffect !== "gradient" ? color.class : ""} ${enableStroke ? "thumb-stroke-heavy" : ""} ${enableGlow && textEffect !== "gradient" ? "thumb-glow-active" : ""}`}
              style={{
                fontFamily: fonts.titleFont,
                fontSize: titleFontSize,
                ...titleEffectStyle,
              }}
            >
              {highlightActive ? (
                <span
                  style={{
                    background: "rgba(255,215,0,0.9)",
                    color: "#000",
                    padding: "0.05em 0.3em",
                    borderRadius: "0.15em",
                    boxDecorationBreak: "clone",
                    WebkitBoxDecorationBreak: "clone",
                    textShadow: "none",
                    WebkitTextStroke: "0",
                  }}
                >
                  {title}
                </span>
              ) : (
                title
              )}
            </h2>
          )}
          {subtitle && (
            <p
              className="font-semibold mt-1 text-white/90"
              style={{
                fontFamily: fonts.subtitleFont,
                fontSize: subtitleFontSize,
                textShadow: "0 2px 8px rgba(0,0,0,0.9), 0 0 16px rgba(0,0,0,0.5)",
              }}
            >
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </div>
  );
});

ThumbnailCanvas.displayName = "ThumbnailCanvas";
export default ThumbnailCanvas;
