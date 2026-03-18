export interface Platform {
  label: string;
  width: number;
  height: number;
  ratio: string;
  icon: string;
}

export const PLATFORMS: Platform[] = [
  { label: "YouTube Thumbnail", width: 1280, height: 720, ratio: "16:9", icon: "▶️" },
  { label: "Instagram Post", width: 1080, height: 1080, ratio: "1:1", icon: "📸" },
  { label: "Reels / Shorts", width: 1080, height: 1920, ratio: "9:16", icon: "📱" },
  { label: "Social Media", width: 1200, height: 675, ratio: "16:9", icon: "🌐" },
];

export type TextPosition = "left" | "center" | "bottom-left";
export type FontPreset = "siyam" | "hind" | "noto";
export type TextColor = "yellow" | "white" | "cyan";
export type TextEffect = "none" | "3d" | "gradient" | "highlight";
export type ShapeOverlay = "none" | "arrow" | "circle" | "glow-lines";

export interface ThumbnailConfig {
  title: string;
  subtitle: string;
  platform: Platform;
  textPosition: TextPosition;
  fontPreset: FontPreset;
  textColor: TextColor;
  textEffect: TextEffect;
  textSize: number; // 60-150 as percentage scale
  enableGlow: boolean;
  enableStroke: boolean;
  subjectImage: string | null;
  subjectScale: number;
  subjectFlip: boolean;
  backgroundImage: string | null;
  backgroundBlur: number; // 0-20
  shapeOverlay: ShapeOverlay;
}

export const FONT_PRESETS: Record<FontPreset, { label: string; titleFont: string; subtitleFont: string }> = {
  siyam: { label: "Siyam Rupali", titleFont: "'SiyamRupali', 'Hind Siliguri', sans-serif", subtitleFont: "'Noto Sans Bengali', sans-serif" },
  hind: { label: "Hind Siliguri", titleFont: "'Hind Siliguri', 'Noto Sans Bengali', sans-serif", subtitleFont: "'Noto Sans Bengali', sans-serif" },
  noto: { label: "Noto Sans", titleFont: "'Noto Sans Bengali', 'Hind Siliguri', sans-serif", subtitleFont: "'Hind Siliguri', sans-serif" },
};

export const TEXT_COLORS: Record<TextColor, { label: string; class: string }> = {
  yellow: { label: "🟡 Yellow Gold", class: "thumb-color-yellow" },
  white: { label: "⚪ Pure White", class: "thumb-color-white" },
  cyan: { label: "🔵 Cyan Glow", class: "thumb-color-cyan" },
};

export const TEXT_EFFECTS: Record<TextEffect, { label: string }> = {
  none: { label: "None" },
  "3d": { label: "3D Text" },
  gradient: { label: "Gradient" },
  highlight: { label: "Highlight Box" },
};

export const SHAPE_OVERLAYS: Record<ShapeOverlay, { label: string }> = {
  none: { label: "None" },
  arrow: { label: "→ Arrow" },
  circle: { label: "◯ Circle" },
  "glow-lines": { label: "✦ Glow Lines" },
};
