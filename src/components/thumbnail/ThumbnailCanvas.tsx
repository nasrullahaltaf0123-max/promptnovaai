import { forwardRef } from "react";
import { type ThumbnailConfig, FONT_PRESETS, TEXT_COLORS } from "./types";

interface Props {
  config: ThumbnailConfig;
  id?: string;
}

function isBangla(text: string): boolean {
  return /[\u0980-\u09FF]/.test(text);
}

/**
 * The compositable canvas element that html2canvas will capture.
 * Renders at a scaled-down preview size but keeps the same aspect ratio.
 */
const ThumbnailCanvas = forwardRef<HTMLDivElement, Props>(({ config, id }, ref) => {
  const { title, subtitle, platform, textPosition, fontPreset, textColor, enableGlow, enableStroke, subjectImage, subjectScale, backgroundImage } = config;
  const bangla = isBangla(title) || isBangla(subtitle);
  const fonts = FONT_PRESETS[fontPreset];
  const color = TEXT_COLORS[textColor];
  const aspectRatio = `${platform.width} / ${platform.height}`;
  const isVertical = platform.height > platform.width;
  const isSquare = platform.width === platform.height;

  // Text alignment classes based on position & platform
  const textContainerClass = (() => {
    if (isVertical) return "items-center justify-end pb-[15%] px-[8%] text-center";
    if (textPosition === "center") return "items-center justify-center px-[8%] text-center";
    if (textPosition === "bottom-left") return "items-start justify-end pb-[8%] pl-[5%] pr-[40%] text-left";
    // left (default for YT style)
    return "items-start justify-center pl-[5%] pr-[45%] text-left";
  })();

  // Title size based on platform
  const titleSize = isVertical
    ? "text-[clamp(1.5rem,6vw,3rem)]"
    : isSquare
    ? "text-[clamp(1.5rem,5vw,2.8rem)]"
    : "text-[clamp(1.2rem,4.5vw,3.2rem)]";

  const subtitleSize = isVertical
    ? "text-[clamp(0.8rem,3vw,1.4rem)]"
    : "text-[clamp(0.7rem,2vw,1.2rem)]";

  return (
    <div
      ref={ref}
      id={id}
      className="relative w-full overflow-hidden rounded-xl"
      style={{ aspectRatio, maxWidth: "100%" }}
    >
      {/* Background */}
      {backgroundImage ? (
        <img src={backgroundImage} alt="" className="absolute inset-0 w-full h-full object-cover" crossOrigin="anonymous" />
      ) : (
        <div className="absolute inset-0 thumb-bg-cinematic" />
      )}

      {/* Cinematic overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/20 to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20 pointer-events-none" />

      {/* Subject image on right */}
      {subjectImage && !isVertical && (
        <div className="absolute right-0 bottom-0 pointer-events-none" style={{ height: `${subjectScale}%`, width: "auto" }}>
          <div className="relative h-full">
            <img
              src={subjectImage}
              alt="Subject"
              className="h-full w-auto object-contain drop-shadow-[0_0_30px_rgba(255,200,0,0.3)]"
              style={{ filter: "drop-shadow(0 8px 24px rgba(0,0,0,0.6))" }}
            />
          </div>
        </div>
      )}
      {subjectImage && isVertical && (
        <div className="absolute bottom-[35%] left-1/2 -translate-x-1/2 pointer-events-none" style={{ height: `${subjectScale * 0.6}%` }}>
          <img
            src={subjectImage}
            alt="Subject"
            className="h-full w-auto object-contain"
            style={{ filter: "drop-shadow(0 8px 24px rgba(0,0,0,0.6)) drop-shadow(0 0 30px rgba(255,200,0,0.2))" }}
          />
        </div>
      )}

      {/* Text overlay with safe area padding */}
      <div className={`absolute inset-0 flex flex-col ${textContainerClass} pointer-events-none select-none z-10`}>
        {/* Text backdrop blur for readability */}
        <div className="relative">
          {title && (
            <h2
              className={`${titleSize} font-black leading-[1.05] ${color.class} ${enableStroke ? "thumb-stroke-heavy" : ""} ${enableGlow ? "thumb-glow-active" : ""}`}
              style={{ fontFamily: fonts.titleFont }}
            >
              {title}
            </h2>
          )}
          {subtitle && (
            <p
              className={`${subtitleSize} font-semibold mt-1 text-white/90`}
              style={{
                fontFamily: fonts.subtitleFont,
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
