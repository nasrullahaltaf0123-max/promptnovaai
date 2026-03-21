import { forwardRef } from "react";
import { type ThumbnailConfig, FONT_PRESETS } from "./types";

interface Props {
  config: ThumbnailConfig;
  id?: string;
}

export type ContentType = "money" | "news" | "emotional" | "tech" | "default";

export interface ThemeStyle {
  filter: string;
  overlay: string;
  text: string;
  glow: string;
  subtitleColor: string;
  vignette: string;
}

export function detectContentType(title: string): ContentType {
  const t = (title || "").toLowerCase();
  if (/টাকা|money|income|earn|million|dollar|profit|revenue|rich|ধনী|আয়|লাভ|কোটি|ব্যবসা|marketing|sell/i.test(t)) return "money";
  if (/ইরান|iran|israel|war|attack|protest|breaking|politics|election|যুদ্ধ|হামলা|আক্রমণ|রাজনীতি|নির্বাচন|সংঘর্ষ|মৃত্যু|kill|dead|bomb|crisis/i.test(t)) return "news";
  if (/secret|truth|why|emotional|sad|cry|story|life|কেন|গোপন|কাহিনী|জীবন|কষ্ট|ভালোবাসা|হৃদয়|love|miss/i.test(t)) return "emotional";
  if (/ai|tech|code|software|robot|future|digital|প্রযুক্তি|ডিজিটাল|কৃত্রিম|বুদ্ধিমত্তা|hack|app|phone/i.test(t)) return "tech";
  return "default";
}

export function getThemeStyle(type: ContentType): ThemeStyle {
  switch (type) {
    case "money":
      return {
        filter: "brightness(0.7) contrast(1.35) saturate(1.6)",
        overlay: "linear-gradient(135deg, rgba(0,0,0,0.7) 0%, rgba(255,180,0,0.3) 100%)",
        text: "#FFD700",
        glow: "rgba(255,215,0,0.4)",
        subtitleColor: "rgba(255,255,220,0.9)",
        vignette: "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.6) 100%)",
      };
    case "news":
      return {
        filter: "brightness(0.5) contrast(1.3) saturate(1.25)",
        overlay: "linear-gradient(to right, rgba(0,0,0,0.9), rgba(180,0,0,0.45))",
        text: "#FF3B3B",
        glow: "rgba(255,50,50,0.35)",
        subtitleColor: "rgba(255,200,200,0.9)",
        vignette: "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.7) 100%)",
      };
    case "emotional":
      return {
        filter: "brightness(0.55) contrast(1.15) saturate(0.85)",
        overlay: "radial-gradient(ellipse at center, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.75) 100%)",
        text: "#FFFFFF",
        glow: "rgba(255,255,255,0.12)",
        subtitleColor: "rgba(255,255,255,0.75)",
        vignette: "radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.8) 100%)",
      };
    case "tech":
      return {
        filter: "brightness(0.65) contrast(1.25) saturate(1.35) hue-rotate(10deg)",
        overlay: "linear-gradient(135deg, rgba(0,0,0,0.75) 0%, rgba(0,200,255,0.25) 100%)",
        text: "#00E5FF",
        glow: "rgba(0,229,255,0.35)",
        subtitleColor: "rgba(200,240,255,0.9)",
        vignette: "radial-gradient(ellipse at center, transparent 50%, rgba(0,20,40,0.6) 100%)",
      };
    default:
      return {
        filter: "brightness(0.7) contrast(1.2)",
        overlay: "linear-gradient(to right, rgba(0,0,0,0.75), rgba(0,0,0,0.15))",
        text: "#FFFFFF",
        glow: "rgba(255,255,255,0.1)",
        subtitleColor: "rgba(255,255,255,0.85)",
        vignette: "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.5) 100%)",
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
    subjectScale,
    backgroundImage,
    backgroundBlur,
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
  const subjectSizePercent = subjectScale || 85;

  // Auto layout
  const textAlign = hasSubject ? "left" : "center";

  // Dynamic font sizes
  const baseTitleRem = isVertical ? 2.6 : isSquare ? 2.2 : 3.0;
  const baseSubRem = isVertical ? 1.1 : 1.0;
  const titleFontSize = `${baseTitleRem * sizeScale}rem`;
  const subtitleFontSize = `${baseSubRem * sizeScale}rem`;

  // Text effect styles — color always from theme
  const titleEffectStyle = ((): React.CSSProperties => {
    const base: React.CSSProperties = {
      color: theme.text,
      textShadow: `0 4px 24px rgba(0,0,0,1), 0 2px 8px rgba(0,0,0,0.95), 0 0 2px rgba(0,0,0,1)`,
    };

    if (enableGlow) {
      base.textShadow += `, 0 0 40px ${theme.glow}, 0 0 80px ${theme.glow}`;
    }

    switch (textEffect) {
      case "3d":
        base.textShadow = `
          2px 2px 0 rgba(0,0,0,0.95),
          4px 4px 0 rgba(0,0,0,0.75),
          6px 6px 0 rgba(0,0,0,0.55),
          8px 8px 24px rgba(0,0,0,0.85)
        `;
        break;
      case "gradient":
        return {
          background:
            contentType === "money"
              ? "linear-gradient(180deg, #FFD700 0%, #FF8C00 100%)"
              : contentType === "tech"
                ? "linear-gradient(180deg, #00E5FF 0%, #3b82f6 100%)"
                : contentType === "news"
                  ? "linear-gradient(180deg, #FF3B3B 0%, #FF6B6B 100%)"
                  : "linear-gradient(180deg, #FFFFFF 0%, #94a3b8 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          filter: enableGlow ? `drop-shadow(0 0 24px ${theme.glow})` : undefined,
          textShadow: "none",
        };
      case "highlight":
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
          style={{
            filter: `${theme.filter}${backgroundBlur > 0 ? ` blur(${backgroundBlur}px)` : ""}`,
          }}
        />
      ) : (
        <div
          className="absolute inset-0"
          style={{
            background: contentType === "news"
              ? "linear-gradient(135deg, #1a0000 0%, #0a0a0a 50%, #1a0000 100%)"
              : contentType === "money"
                ? "linear-gradient(135deg, #1a1200 0%, #0a0a0a 50%, #1a1500 100%)"
                : contentType === "tech"
                  ? "linear-gradient(135deg, #001520 0%, #0a0a0a 50%, #001a2e 100%)"
                  : "linear-gradient(135deg, #0f0f1a 0%, #0a0a0a 100%)",
          }}
        />
      )}

      {/* Layer 2: Theme Overlay */}
      <div className="absolute inset-0 z-[1]" style={{ background: theme.overlay }} />

      {/* Layer 3: Vignette */}
      <div className="absolute inset-0 z-[2] pointer-events-none" style={{ background: theme.vignette }} />

      {/* Layer 4: Cinematic gradients (soft) */}
      <div className="absolute inset-0 z-[3] pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            background: hasSubject
              ? "linear-gradient(to right, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.1) 50%, transparent 100%)"
              : "linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.35) 100%)",
            opacity: 0.3,
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 35%)",
            opacity: 0.25,
          }}
        />
      </div>

      {/* Shape overlays */}
      {shapeOverlay === "arrow" && (
        <div
          className="absolute z-[5] pointer-events-none"
          style={
            isVertical
              ? { bottom: "52%", left: "50%", transform: "translateX(-50%)" }
              : { top: "50%", left: "42%", transform: "translateY(-50%)" }
          }
        >
          <svg width="80" height="60" viewBox="0 0 80 60" fill="none">
            <path d="M10 30 L55 30 L45 15 L70 30 L45 45 L55 30" stroke={theme.text} strokeWidth="4" fill={theme.text} opacity="0.9" />
          </svg>
        </div>
      )}
      {shapeOverlay === "circle" && hasSubject && (
        <div
          className="absolute z-[5] rounded-full pointer-events-none"
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
        <div className="absolute inset-0 z-[5] pointer-events-none overflow-hidden">
          <div className="absolute top-0 left-1/4 w-px h-full" style={{ background: `linear-gradient(to bottom, transparent, ${theme.glow}, transparent)` }} />
          <div className="absolute top-0 right-1/3 w-px h-full" style={{ background: `linear-gradient(to bottom, transparent, ${theme.glow}, transparent)`, opacity: 0.5 }} />
          <div className="absolute top-1/3 left-0 w-full h-px" style={{ background: `linear-gradient(to right, transparent, ${theme.glow}, transparent)`, opacity: 0.4 }} />
        </div>
      )}

      {/* Layer 5: Subject Image — auto positioned RIGHT (landscape) or CENTER-BOTTOM (vertical) */}
      {hasSubject && !isVertical && (
        <div
          className="absolute right-0 bottom-0 z-[10] flex items-end justify-end"
          style={{ width: "50%", height: "100%" }}
        >
          {/* Glow behind subject */}
          <div
            className="absolute rounded-full blur-3xl"
            style={{
              bottom: "10%",
              right: "12%",
              width: "65%",
              height: "65%",
              background: theme.glow,
              opacity: 0.5,
            }}
          />
          <img
            src={subjectImage!}
            alt="Subject"
            className="relative object-contain"
            style={{
              height: `${subjectSizePercent}%`,
              maxWidth: "100%",
              transform: subjectFlip ? "scaleX(-1)" : "none",
              filter: `drop-shadow(0 8px 35px rgba(0,0,0,0.95)) drop-shadow(0 0 60px rgba(0,0,0,0.5)) drop-shadow(0 0 15px ${theme.glow})`,
            }}
          />
        </div>
      )}
      {hasSubject && (isVertical || isSquare) && (
        <div
          className="absolute left-1/2 -translate-x-1/2 z-[10] pointer-events-none"
          style={{
            bottom: isVertical ? "28%" : "5%",
            height: `${subjectSizePercent * 0.55}%`,
          }}
        >
          <div
            className="absolute inset-0 rounded-full blur-3xl -z-10"
            style={{ background: theme.glow, opacity: 0.35, transform: "scale(1.4)" }}
          />
          <img
            src={subjectImage!}
            alt="Subject"
            className="h-full w-auto object-contain"
            style={{
              transform: subjectFlip ? "scaleX(-1)" : undefined,
              filter: `drop-shadow(0 8px 28px rgba(0,0,0,0.9)) drop-shadow(0 0 40px rgba(0,0,0,0.4)) drop-shadow(0 0 12px ${theme.glow})`,
            }}
          />
        </div>
      )}

      {/* Layer 6: Text — auto positioned LEFT (with subject) or CENTER */}
      <div
        className={`absolute inset-0 z-[20] flex flex-col p-6 ${
          isVertical
            ? "items-center justify-end pb-[10%] text-center"
            : textAlign === "center"
              ? "items-center justify-center text-center px-[8%]"
              : "items-start justify-center pl-[5%] pr-[52%] text-left"
        }`}
      >
        <div className="relative max-w-full">
          {title && (
            <h2
              className={`font-black leading-[1.05] ${enableStroke ? "thumb-stroke-heavy" : ""}`}
              style={{
                fontFamily: fonts.titleFont,
                fontSize: titleFontSize,
                letterSpacing: "-0.01em",
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
                color: theme.subtitleColor,
                textShadow: "0 2px 12px rgba(0,0,0,1), 0 0 24px rgba(0,0,0,0.7)",
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
