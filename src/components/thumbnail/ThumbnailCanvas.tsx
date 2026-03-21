import { forwardRef, useState } from "react";
import { type ThumbnailConfig, FONT_PRESETS, TEXT_COLORS } from "./types";

interface Props {
  config: ThumbnailConfig;
  id?: string;
}

const ThumbnailCanvas = forwardRef<HTMLDivElement, Props>(({ config, id }, ref) => {
  const {
    title,
    subtitle,
    platform,
    textPosition,
    fontPreset,
    textColor,
    textEffect,
    textSize,
    enableGlow,
    enableStroke,
    subjectImage,
    subjectScale,
    subjectFlip,
    backgroundImage,
    backgroundBlur,
    shapeOverlay,
  } = config;

  const theme = detectTheme(title);
  const themeStyle = getThemeStyle(type);

  console.log("TYPE:", type);
  function detectContentType(title: string) {
    const t = title.toLowerCase();

    if (
      t.includes("money") ||
      t.includes("income") ||
      t.includes("earn") ||
      t.includes("million") ||
      t.includes("dollar")
    )
      return "money";

    if (
      t.includes("iran") ||
      t.includes("israel") ||
      t.includes("war") ||
      t.includes("attack") ||
      t.includes("protest")
    )
      return "news";

    if (t.includes("secret") || t.includes("truth") || t.includes("why")) return "emotional";

    if (t.includes("ai") || t.includes("tech")) return "tech";

    return "default";
  }
  function getThemeStyle(type: string) {
    switch (type) {
      case "money":
        return {
          filter: "brightness(0.75) contrast(1.3) saturate(1.4)",
          overlay: "rgba(255, 215, 0, 0.15)",
          text: "#FFD700",
        };

      case "news":
        return {
          filter: "brightness(0.6) contrast(1.2) saturate(1.2)",
          overlay: "rgba(255, 0, 0, 0.25)",
          text: "#FF3B3B",
        };

      case "emotional":
        return {
          filter: "brightness(0.7) contrast(1.1)",
          overlay: "rgba(0,0,0,0.4)",
          text: "#FFFFFF",
        };

      case "tech":
        return {
          filter: "brightness(0.8) contrast(1.2) hue-rotate(180deg)",
          overlay: "rgba(0, 255, 255, 0.15)",
          text: "#00FFFF",
        };

      default:
        return {
          filter: "brightness(0.9)",
          overlay: "rgba(0,0,0,0.2)",
          text: "#FFFFFF",
        };
    }
  }

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
          background:
            textColor === "yellow"
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
  const [snapGuide, setSnapGuide] = useState<null | "center" | "left" | "right">(null);
  const [textPos, setTextPos] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const handleMouseDown = () => {
    setDragging(true);
  };

  const handleMouseUp = () => {
    setDragging(false);
    setSnapGuide(null);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragging) return;

    const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // SNAP LOGIC
    if (x < rect.width * 0.3) {
      setSnapGuide("left");
    } else if (x > rect.width * 0.7) {
      setSnapGuide("right");
    } else {
      setSnapGuide("center");
    }

    setTextPos({ x, y });
  };
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
          className="w-full h-full object-cover scale-105"
          style={{
            filter: getThemeFilter(theme),
          }}
        />
      ) : (
        <div className="absolute inset-0 thumb-bg-cinematic" />
      )}

      {/* Cinematic overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/20 to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20 pointer-events-none" />
      <div className="absolute right-0 top-0 w-[45%] h-full bg-gradient-to-l from-transparent via-black/20 to-black/40 z-10" />
      {/* ✅ SNAP GUIDE — EXACT HERE */}
      {snapGuide && (
        <div className="absolute inset-0 pointer-events-none z-50">
          {snapGuide === "center" && <div className="absolute left-1/2 top-0 h-full w-[2px] bg-yellow-400/70" />}
          {snapGuide === "left" && <div className="absolute left-[30%] top-0 h-full w-[2px] bg-yellow-400/50" />}
          {snapGuide === "right" && <div className="absolute right-[30%] top-0 h-full w-[2px] bg-yellow-400/50" />}
        </div>
      )}
      {/* Shape overlays */}
      {shapeOverlay === "arrow" && (
        <div
          className="absolute z-20 pointer-events-none"
          style={
            isVertical
              ? { bottom: "52%", left: "50%", transform: "translateX(-50%)" }
              : { top: "50%", left: "42%", transform: "translateY(-50%)" }
          }
        >
          <svg width="80" height="60" viewBox="0 0 80 60" fill="none">
            <path
              d="M10 30 L55 30 L45 15 L70 30 L45 45 L55 30"
              stroke="#FFD700"
              strokeWidth="4"
              fill="#FFD700"
              opacity="0.9"
            />
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
              ? {
                  bottom: "30%",
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: "55%",
                  height: "auto",
                  aspectRatio: "1",
                }
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
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent z-10" />

      {/* Subject image */}
      {subjectImage && !isVertical && (
        <img
          src={subjectImage}
          alt="Subject"
          className="
      absolute
      right-0
      bottom-0
      h-full
      max-w-[52%]
translate-x-[-5%]
      object-contain
      z-20
      drop-shadow-[0_0_40px_rgba(0,0,0,0.8)]
    "
          style={{
            transform: subjectFlip ? "scaleX(-1)" : "none",
          }}
        />
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
      <div
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        className={`
    absolute top-0 h-full p-6 z-30 flex flex-col justify-center transition-all duration-200
    ${snapGuide === "left" ? "left-0 w-[55%]" : ""}
    ${snapGuide === "center" ? "left-1/2 -translate-x-1/2 w-[60%] text-center items-center" : ""}
    ${snapGuide === "right" ? "right-0 w-[55%] text-right items-end" : ""}
  `}
        style={{
          transform: `translate(${textPos.x * 0.02}px, ${textPos.y * 0.02}px)`,
        }}
      >
        <div className="relative max-w-full">
          {title && (
            <h2
              className={`font-black leading-[1.05] ${textEffect !== "gradient" ? color.class : ""} ${enableStroke ? "thumb-stroke-heavy" : ""} ${enableGlow && textEffect !== "gradient" ? "thumb-glow-active" : ""}`}
              style={{
                fontFamily: fonts.titleFont,
                fontSize: titleFontSize,
                color: themeStyle.text,
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
