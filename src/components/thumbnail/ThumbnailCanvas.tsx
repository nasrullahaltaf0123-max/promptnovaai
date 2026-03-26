import { forwardRef, useState } from "react";
import {
  type ThumbnailConfig,
  FONT_PRESETS,
  TEXT_COLORS,
  FONT_STYLES,
  TOPIC_THEMES,
  detectTopicFromTitle,
} from "./types";

interface Props {
  config: ThumbnailConfig;
  id?: string;
}

const ThumbnailCanvas = forwardRef<HTMLDivElement, Props>(({ config, id }, ref) => {
  const {
    title, subtitle, platform, textPosition, fontPreset, textColor, textEffect,
    textSize, enableGlow, enableStroke, subjectImage, subjectScale, subjectFlip,
    backgroundImage, backgroundBlur, shapeOverlay, fontStyle, colorStyle,
    customColor, bgMode, bgSolidColor, bgGradient1, bgGradient2, removeBg,
    imageBorder, textStyles,
  } = config;

  // Dynamic topic detection
  const topic = detectTopicFromTitle(title);
  const theme = TOPIC_THEMES[topic] || TOPIC_THEMES.default;

  // Topic-based overlay intensity (dark topics get heavier overlays)
  const isDarkTopic = ["horror", "crime", "news", "emotional"].includes(topic);
  const isBrightTopic = ["education", "food", "travel", "fashion", "motivation"].includes(topic);
  const overlayIntensity = isDarkTopic ? 0.7 : isBrightTopic ? 0.25 : 0.4;

  const fonts = FONT_PRESETS[fontPreset];
  const fontStyleConfig = FONT_STYLES[fontStyle];
  const color = TEXT_COLORS[textColor];
  const aspectRatio = `${platform.width} / ${platform.height}`;
  const isVertical = platform.height > platform.width;
  const isSquare = platform.width === platform.height;
  const sizeScale = textSize / 100;

  // Resolve text color: auto uses topic theme, custom uses picker
  const resolvedTextColor = colorStyle === "custom" ? customColor : theme.textColor;

  // Text container positioning
  const textContainerClass = (() => {
    if (isVertical) return "items-center justify-end pb-[15%] px-[8%] text-center";
    if (textPosition === "center") return "items-center justify-center px-[8%] text-center";
    if (textPosition === "bottom-left") return "items-start justify-end pb-[8%] pl-[5%] pr-[40%] text-left";
    return "items-start justify-center pl-[5%] pr-[45%] text-left";
  })();

  const baseTitleRem = isVertical ? 2.8 : isSquare ? 2.4 : 3;
  const baseSubRem = isVertical ? 1.2 : 1;
  const titleFontSize = `${baseTitleRem * sizeScale}rem`;
  const subtitleFontSize = `${baseSubRem * sizeScale}rem`;

  // Text effect inline styles
  const titleEffectStyle = (() => {
    switch (textEffect) {
      case "3d":
        return {
          textShadow: `2px 2px 0 rgba(0,0,0,0.8), 4px 4px 0 rgba(0,0,0,0.6), 6px 6px 0 rgba(0,0,0,0.4), 8px 8px 16px rgba(0,0,0,0.5)`,
        };
      case "gradient":
        return {
          background: colorStyle === "custom"
            ? `linear-gradient(180deg, ${customColor} 0%, ${customColor}99 100%)`
            : `linear-gradient(180deg, ${theme.textColor} 0%, ${theme.accentColor} 100%)`,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          filter: enableGlow ? `drop-shadow(0 0 16px ${resolvedTextColor}66)` : undefined,
        } as React.CSSProperties;
      default:
        return {};
    }
  })();

  // Build text shadow from textStyles array
  const textShadowParts: string[] = [];
  if (textStyles.includes("shadow")) textShadowParts.push("0 4px 16px rgba(0,0,0,0.9)");
  if (textStyles.includes("glow")) textShadowParts.push(`0 0 20px ${resolvedTextColor}99, 0 0 40px ${resolvedTextColor}44`);
  const extraTextShadow = textShadowParts.length > 0 ? textShadowParts.join(", ") : undefined;

  const highlightActive = textEffect === "highlight";

  // Image border style
  const imageBorderStyle = (() => {
    switch (imageBorder) {
      case "glow": return { boxShadow: `0 0 30px ${theme.accentColor}66, 0 0 60px ${theme.accentColor}33` };
      case "neon": return { border: `3px solid ${theme.accentColor}`, boxShadow: `0 0 15px ${theme.accentColor}88, inset 0 0 15px ${theme.accentColor}22` };
      case "rounded": return { borderRadius: "1.5rem", overflow: "hidden" as const };
      default: return {};
    }
  })();

  // Background rendering
  const bgStyle = (() => {
    if (bgMode === "solid") return { background: bgSolidColor };
    if (bgMode === "gradient") return { background: `linear-gradient(135deg, ${bgGradient1}, ${bgGradient2})` };
    if (!backgroundImage) return { background: theme.bgGradient };
    return {};
  })();

  const [snapGuide, setSnapGuide] = useState<null | "center" | "left" | "right">(null);
  const [textPos, setTextPos] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);

  const handleMouseDown = () => setDragging(true);
  const handleMouseUp = () => { setDragging(false); setSnapGuide(null); };
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragging) return;
    const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
    const x = e.clientX - rect.left;
    if (x < rect.width * 0.3) setSnapGuide("left");
    else if (x > rect.width * 0.7) setSnapGuide("right");
    else setSnapGuide("center");
    setTextPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <div
      ref={ref}
      id={id}
      className="relative w-full overflow-hidden rounded-xl"
      style={{ aspectRatio, maxWidth: "100%" }}
    >
      {/* Background */}
      {backgroundImage && (bgMode === "ai" || bgMode === "upload") ? (
        <>
          <img
            src={backgroundImage}
            className="w-full h-full object-cover scale-105"
            style={{
              filter: `${theme.filter}${backgroundBlur > 0 ? ` blur(${backgroundBlur}px)` : ""}`,
            }}
          />
          <div className="absolute inset-0" style={{ background: theme.overlay }} />
        </>
      ) : (
        <div className="absolute inset-0" style={bgStyle} />
      )}

      {/* Cinematic overlays — intensity varies by topic */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: `linear-gradient(to right, rgba(0,0,0,${overlayIntensity}), rgba(0,0,0,${overlayIntensity * 0.3}), transparent)` }} />
      <div className="absolute inset-0 pointer-events-none" style={{ background: `linear-gradient(to top, rgba(0,0,0,${overlayIntensity * 0.65}), transparent, rgba(0,0,0,${overlayIntensity * 0.25}))` }} />

      {/* Snap guides */}
      {snapGuide && (
        <div className="absolute inset-0 pointer-events-none z-50">
          {snapGuide === "center" && <div className="absolute left-1/2 top-0 h-full w-[2px] bg-yellow-400/70" />}
          {snapGuide === "left" && <div className="absolute left-[30%] top-0 h-full w-[2px] bg-yellow-400/50" />}
          {snapGuide === "right" && <div className="absolute right-[30%] top-0 h-full w-[2px] bg-yellow-400/50" />}
        </div>
      )}

      {/* Shape overlays */}
      {shapeOverlay === "arrow" && (
        <div className="absolute z-20 pointer-events-none"
          style={isVertical ? { bottom: "52%", left: "50%", transform: "translateX(-50%)" } : { top: "50%", left: "42%", transform: "translateY(-50%)" }}>
          <svg width="80" height="60" viewBox="0 0 80 60" fill="none">
            <path d="M10 30 L55 30 L45 15 L70 30 L45 45 L55 30" stroke={theme.accentColor} strokeWidth="4" fill={theme.accentColor} opacity="0.9" />
          </svg>
        </div>
      )}
      {shapeOverlay === "circle" && subjectImage && (
        <div className="absolute z-[5] rounded-full pointer-events-none"
          style={{
            border: `4px solid ${theme.accentColor}99`,
            boxShadow: `0 0 30px ${theme.accentColor}44, inset 0 0 30px ${theme.accentColor}11`,
            ...(isVertical
              ? { bottom: "30%", left: "50%", transform: "translateX(-50%)", width: "55%", height: "auto", aspectRatio: "1" }
              : { right: "2%", top: "10%", width: "40%", height: "80%" }),
          }}
        />
      )}
      {shapeOverlay === "glow-lines" && (
        <div className="absolute inset-0 z-[5] pointer-events-none overflow-hidden">
          <div className="absolute top-0 left-1/4 w-px h-full" style={{ background: `linear-gradient(to bottom, transparent, ${theme.accentColor}44, transparent)` }} />
          <div className="absolute top-0 right-1/3 w-px h-full" style={{ background: `linear-gradient(to bottom, transparent, ${theme.textColor}33, transparent)` }} />
          <div className="absolute top-1/3 left-0 w-full h-px" style={{ background: `linear-gradient(to right, transparent, ${theme.accentColor}33, transparent)` }} />
        </div>
      )}
      <div className="absolute inset-0 z-10 pointer-events-none" style={{ background: `linear-gradient(to right, rgba(0,0,0,${overlayIntensity * 0.85}), transparent)` }} />

      {/* Subject image */}
      {subjectImage && !isVertical && (
        <img
          src={subjectImage}
          alt="Subject"
          className="absolute right-0 bottom-0 h-full max-w-[52%] translate-x-[-5%] object-contain z-20"
          style={{
            transform: subjectFlip ? "scaleX(-1)" : "none",
            filter: removeBg ? "drop-shadow(0 0 0 transparent)" : "drop-shadow(0 0 40px rgba(0,0,0,0.8))",
            ...imageBorderStyle,
          }}
        />
      )}
      {subjectImage && isVertical && (
        <div className="absolute bottom-[35%] left-1/2 -translate-x-1/2 pointer-events-none z-10"
          style={{
            height: `${subjectScale * 0.6}%`,
            transform: subjectFlip ? "translateX(-50%) scaleX(-1)" : undefined,
          }}>
          <img
            src={subjectImage}
            alt="Subject"
            className="h-full w-auto object-contain"
            style={{
              filter: `drop-shadow(0 8px 24px rgba(0,0,0,0.7)) drop-shadow(0 0 30px ${theme.accentColor}33)`,
              ...imageBorderStyle,
            }}
          />
        </div>
      )}

      {/* Text overlay */}
      <div
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        className={`absolute top-0 h-full p-6 z-30 flex flex-col justify-center transition-all duration-200
          ${snapGuide === "left" ? "left-0 w-[55%]" : ""}
          ${snapGuide === "center" ? "left-1/2 -translate-x-1/2 w-[60%] text-center items-center" : ""}
          ${snapGuide === "right" ? "right-0 w-[55%] text-right items-end" : ""}
        `}
        style={{ transform: `translate(${textPos.x * 0.02}px, ${textPos.y * 0.02}px)` }}
      >
        <div className="relative max-w-full">
          {title && (
            <h2
              className={`leading-[1.05] ${textEffect !== "gradient" ? color.class : ""} ${textStyles.includes("stroke") || enableStroke ? "thumb-stroke-heavy" : ""} ${enableGlow && textEffect !== "gradient" ? "thumb-glow-active" : ""}`}
              style={{
                fontFamily: fonts.titleFont,
                fontSize: titleFontSize,
                fontWeight: fontStyleConfig.weight,
                letterSpacing: fontStyleConfig.letterSpacing,
                textTransform: (fontStyleConfig.transform as any) || "none",
                color: textEffect !== "gradient" ? resolvedTextColor : undefined,
                textShadow: extraTextShadow,
                ...titleEffectStyle,
              }}
            >
              {highlightActive ? (
                <span style={{
                  background: `${resolvedTextColor}E6`,
                  color: "#000",
                  padding: "0.05em 0.3em",
                  borderRadius: "0.15em",
                  boxDecorationBreak: "clone",
                  WebkitBoxDecorationBreak: "clone",
                  textShadow: "none",
                  WebkitTextStroke: "0",
                }}>
                  {title}
                </span>
              ) : title}
            </h2>
          )}
          {subtitle && (
            <p className="font-semibold mt-1 text-white/90"
              style={{
                fontFamily: fonts.subtitleFont,
                fontSize: subtitleFontSize,
                textShadow: "0 2px 8px rgba(0,0,0,0.9), 0 0 16px rgba(0,0,0,0.5)",
              }}>
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
