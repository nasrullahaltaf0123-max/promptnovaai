import { forwardRef } from "react";
import { type ThumbnailConfig, FONT_PRESETS } from "./types";

interface Props {
  config: ThumbnailConfig;
  id?: string;
}

type ContentType = "money" | "news" | "emotional" | "tech" | "default";

interface ThemeStyle {
  filter: string;
  overlay: string;
  text: string;
  glow: string;
}

function detectContentType(title: string): ContentType {
  const t = title.toLowerCase();
  if (/money|income|earn|million|dollar|profit|revenue|rich/i.test(t)) return "money";
  if (/iran|israel|war|attack|protest|breaking|politics|election/i.test(t)) return "news";
  if (/secret|truth|why|emotional|sad|cry|story|life/i.test(t)) return "emotional";
  if (/ai|tech|code|software|robot|future|digital/i.test(t)) return "tech";
  return "default";
}

function getThemeStyle(type: ContentType): ThemeStyle {
  switch (type) {
    case "money":
      return {
        filter: "brightness(0.75) contrast(1.3) saturate(1.5)",
        overlay: "linear-gradient(135deg, rgba(0,0,0,0.6) 0%, rgba(255,215,0,0.25) 100%)",
        text: "#FFD700",
        glow: "rgba(255,215,0,0.35)",
      };
    case "news":
      return {
        filter: "brightness(0.55) contrast(1.25) saturate(1.2)",
        overlay: "linear-gradient(to right, rgba(0,0,0,0.85), rgba(255,0,0,0.4))",
        text: "#FF3B3B",
        glow: "rgba(255,0,0,0.3)",
      };
    case "emotional":
      return {
        filter: "brightness(0.6) contrast(1.15) saturate(0.9)",
        overlay: "radial-gradient(ellipse at center, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.7) 100%)",
        text: "#FFFFFF",
        glow: "rgba(255,255,255,0.15)",
      };
    case "tech":
      return {
        filter: "brightness(0.7) contrast(1.2) saturate(1.3) hue-rotate(10deg)",
        overlay: "linear-gradient(135deg, rgba(0,0,0,0.7) 0%, rgba(0,255,255,0.2) 100%)",
        text: "#00FFFF",
        glow: "rgba(0,255,255,0.3)",
      };
    default:
      return {
        filter: "brightness(0.75) contrast(1.15)",
        overlay: "linear-gradient(to right, rgba(0,0,0,0.7), rgba(0,0,0,0.2))",
        text: "#FFFFFF",
        glow: "rgba(255,255,255,0.1)",
      };
  }
}

const ThumbnailCanvas = forwardRef<HTMLDivElement, Props>(({ config, id }, ref) => {
  const {
    title,
    subtitle,
    platform,
    fontPreset,
    textEffect,
    textSize,
    enableGlow,
    enableStroke,
    subjectImage,
    subjectFlip,
    backgroundImage,
    shapeOverlay,
  } = config;

  const contentType = detectContentType(title);
  const theme = getThemeStyle(contentType);
  const fonts = FONT_PRESETS[fontPreset];
  const aspectRatio = `${platform.width} / ${platform.height}`;
  const isVertical = platform.height > platform.width;
  const isSquare = platform.width === platform.height;
  const sizeScale = textSize / 100;
  const hasSubject = !!subjectImage;

  // Auto layout: text left when subject exists, center otherwise
  const textAlign = hasSubject ? "left" : "center";

  // Dynamic font sizes
  const baseTitleRem = isVertical ? 2.8 : isSquare ? 2.4 : 3.2;
  const baseSubRem = isVertical ? 1.2 : 1.1;
  const titleFontSize = `${baseTitleRem * sizeScale}rem`;
  const subtitleFontSize = `${baseSubRem * sizeScale}rem`;

  // Text effect styles
  const titleEffectStyle = ((): React.CSSProperties => {
    const base: React.CSSProperties = {
      color: theme.text,
      textShadow: `0 4px 20px rgba(0,0,0,1), 0 2px 6px rgba(0,0,0,0.9)`,
    };

    if (enableGlow) {
      base.textShadow += `, 0 0 40px ${theme.glow}, 0 0 80px ${theme.glow}`;
    }

    switch (textEffect) {
      case "3d":
        base.textShadow = `
          2px 2px 0 rgba(0,0,0,0.9),
          4px 4px 0 rgba(0,0,0,0.7),
          6px 6px 0 rgba(0,0,0,0.5),
          8px 8px 20px rgba(0,0,0,0.8)
        `;
        break;
      case "gradient":
        return {
          background:
            contentType === "money"
              ? "linear-gradient(180deg, #FFD700 0%, #FF8C00 100%)"
              : contentType === "tech"
                ? "linear-gradient(180deg, #06b6d4 0%, #3b82f6 100%)"
                : contentType === "news"
                  ? "linear-gradient(180deg, #FF3B3B 0%, #FF6B6B 100%)"
                  : "linear-gradient(180deg, #FFFFFF 0%, #94a3b8 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          filter: enableGlow ? `drop-shadow(0 0 20px ${theme.glow})` : undefined,
          textShadow: "none",
        };
      case "highlight":
        // Handled in JSX
        break;
    }

    return base;
  })();

  const highlightActive = textEffect === "highlight";

  return (
    <div
      ref={ref}
      id={id}
      className="relative w-full overflow-hidden rounded-xl"
      style={{ aspectRatio, maxWidth: "100%" }}
    >
      {/* Layer 1: Background Image */}
      {backgroundImage ? (
        <img
          src={backgroundImage}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          style={{ filter: theme.filter }}
        />
      ) : (
        <div className="absolute inset-0 thumb-bg-cinematic" />
      )}

      {/* Layer 2: Theme Overlay */}
      <div
        className="absolute inset-0 z-[1]"
        style={{ background: theme.overlay }}
      />

      {/* Layer 3: Cinematic Gradients (soft, non-conflicting) */}
      <div className="absolute inset-0 z-[2] pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            background: hasSubject
              ? "linear-gradient(to right, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.1) 50%, transparent 100%)"
              : "linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.4) 100%)",
            opacity: 0.35,
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(to top, rgba(0,0,0,0.4) 0%, transparent 40%)",
            opacity: 0.3,
          }}
        />
      </div>

      {/* Shape overlays */}
      {shapeOverlay === "arrow" && (
        <div
          className="absolute z-[3] pointer-events-none"
          style={
            isVertical
              ? { bottom: "52%", left: "50%", transform: "translateX(-50%)" }
              : { top: "50%", left: "42%", transform: "translateY(-50%)" }
          }
        >
          <svg width="80" height="60" viewBox="0 0 80 60" fill="none">
            <path
              d="M10 30 L55 30 L45 15 L70 30 L45 45 L55 30"
              stroke={theme.text}
              strokeWidth="4"
              fill={theme.text}
              opacity="0.9"
            />
          </svg>
        </div>
      )}
      {shapeOverlay === "circle" && hasSubject && (
        <div
          className="absolute z-[3] rounded-full pointer-events-none"
          style={{
            border: `4px solid ${theme.glow}`,
            boxShadow: `0 0 30px ${theme.glow}, inset 0 0 30px ${theme.glow}`,
            ...(isVertical
              ? { bottom: "30%", left: "50%", transform: "translateX(-50%)", width: "55%", aspectRatio: "1" }
              : { right: "2%", top: "10%", width: "40%", height: "80%" }),
          }}
        />
      )}
      {shapeOverlay === "glow-lines" && (
        <div className="absolute inset-0 z-[3] pointer-events-none overflow-hidden">
          <div className="absolute top-0 left-1/4 w-px h-full" style={{ background: `linear-gradient(to bottom, transparent, ${theme.glow}, transparent)` }} />
          <div className="absolute top-0 right-1/3 w-px h-full" style={{ background: `linear-gradient(to bottom, transparent, ${theme.glow}, transparent)`, opacity: 0.5 }} />
          <div className="absolute top-1/3 left-0 w-full h-px" style={{ background: `linear-gradient(to right, transparent, ${theme.glow}, transparent)`, opacity: 0.4 }} />
        </div>
      )}

      {/* Layer 4: Subject Image (RIGHT side, YouTube style) */}
      {hasSubject && !isVertical && (
        <div className="absolute right-0 bottom-0 h-full z-[10] flex items-end justify-end" style={{ width: "50%" }}>
          {/* Glow behind subject */}
          <div
            className="absolute bottom-[10%] right-[15%] w-[70%] h-[70%] rounded-full blur-3xl"
            style={{ background: theme.glow, opacity: 0.4 }}
          />
          <img
            src={subjectImage!}
            alt="Subject"
            className="relative h-full max-w-full object-contain"
            style={{
              transform: subjectFlip ? "scaleX(-1)" : "none",
              filter: "drop-shadow(0 8px 30px rgba(0,0,0,0.9)) drop-shadow(0 0 60px rgba(0,0,0,0.5))",
            }}
          />
        </div>
      )}
      {hasSubject && isVertical && (
        <div
          className="absolute bottom-[30%] left-1/2 -translate-x-1/2 z-[10] pointer-events-none"
          style={{ height: "45%" }}
        >
          <div
            className="absolute inset-0 rounded-full blur-3xl -z-10"
            style={{ background: theme.glow, opacity: 0.3, transform: "scale(1.3)" }}
          />
          <img
            src={subjectImage!}
            alt="Subject"
            className="h-full w-auto object-contain"
            style={{
              transform: subjectFlip ? "scaleX(-1)" : undefined,
              filter: "drop-shadow(0 8px 24px rgba(0,0,0,0.8)) drop-shadow(0 0 40px rgba(0,0,0,0.4))",
            }}
          />
        </div>
      )}

      {/* Layer 5: Text */}
      <div
        className={`absolute inset-0 z-[20] flex flex-col p-6 ${
          isVertical
            ? "items-center justify-end pb-[12%] text-center"
            : textAlign === "center"
              ? "items-center justify-center text-center px-[8%]"
              : "items-start justify-center pl-[5%] pr-[50%] text-left"
        }`}
      >
        <div className="relative max-w-full">
          {title && (
            <h2
              className={`font-black leading-[1.05] ${enableStroke ? "thumb-stroke-heavy" : ""}`}
              style={{
                fontFamily: fonts.titleFont,
                fontSize: titleFontSize,
                ...titleEffectStyle,
              }}
            >
              {highlightActive ? (
                <span
                  style={{
                    background: theme.text,
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
              className="font-semibold mt-2"
              style={{
                fontFamily: fonts.subtitleFont,
                fontSize: subtitleFontSize,
                color: "rgba(255,255,255,0.9)",
                textShadow: "0 2px 10px rgba(0,0,0,1), 0 0 20px rgba(0,0,0,0.6)",
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
