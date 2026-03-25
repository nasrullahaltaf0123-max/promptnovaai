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
export type FontStyle = "bold" | "clean" | "youtube" | "gaming" | "minimal";
export type ColorStyle = "auto" | "custom";
export type BgMode = "ai" | "solid" | "gradient" | "upload";
export type ImageBorder = "none" | "glow" | "neon" | "rounded";
export type TextStyleOption = "stroke" | "shadow" | "glow";

export interface ThumbnailConfig {
  title: string;
  subtitle: string;
  platform: Platform;
  textPosition: TextPosition;
  fontPreset: FontPreset;
  textColor: TextColor;
  textEffect: TextEffect;
  textSize: number;
  enableGlow: boolean;
  enableStroke: boolean;
  subjectImage: string | null;
  subjectScale: number;
  subjectFlip: boolean;
  backgroundImage: string | null;
  backgroundBlur: number;
  shapeOverlay: ShapeOverlay;
  themeColor: string | null;
  blendPreset: string | null;
  // New controls
  fontStyle: FontStyle;
  colorStyle: ColorStyle;
  customColor: string;
  bgMode: BgMode;
  bgSolidColor: string;
  bgGradient1: string;
  bgGradient2: string;
  removeBg: boolean;
  imageBorder: ImageBorder;
  textStyles: TextStyleOption[];
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

export const FONT_STYLES: Record<FontStyle, { label: string; weight: number; letterSpacing: string; transform?: string }> = {
  bold: { label: "🔥 Bold", weight: 900, letterSpacing: "-0.02em" },
  clean: { label: "✨ Clean", weight: 600, letterSpacing: "0" },
  youtube: { label: "▶️ YouTube", weight: 900, letterSpacing: "-0.03em", transform: "uppercase" },
  gaming: { label: "🎮 Gaming", weight: 800, letterSpacing: "0.05em", transform: "uppercase" },
  minimal: { label: "◻️ Minimal", weight: 500, letterSpacing: "0.02em" },
};

export const IMAGE_BORDERS: Record<ImageBorder, { label: string }> = {
  none: { label: "None" },
  glow: { label: "✨ Glow" },
  neon: { label: "💡 Neon" },
  rounded: { label: "⬭ Rounded" },
};

// Topic detection for dynamic styling
export type TopicTheme = {
  filter: string;
  overlay: string;
  textColor: string;
  accentColor: string;
  bgGradient: string;
};

const TOPIC_KEYWORDS: Record<string, string[]> = {
  tech: ["ai", "tech", "code", "programming", "software", "app", "robot", "computer", "digital", "cyber", "hack", "data", "machine learning", "blockchain", "crypto"],
  motivation: ["motivat", "inspir", "success", "dream", "goal", "hustle", "grind", "mindset", "believe", "achieve", "winner", "champion"],
  horror: ["horror", "scary", "ghost", "dark", "creepy", "haunted", "nightmare", "demon", "evil", "curse", "blood"],
  gaming: ["gaming", "game", "gamer", "esport", "stream", "twitch", "fortnite", "minecraft", "pubg", "valorant", "cod", "league", "play"],
  education: ["learn", "study", "education", "school", "college", "university", "exam", "course", "class", "tutorial", "lesson", "teacher"],
  money: ["money", "income", "earn", "million", "dollar", "taka", "rich", "wealth", "invest", "business", "profit", "salary", "passive"],
  news: ["news", "breaking", "war", "attack", "protest", "election", "politic", "government", "crisis", "ban", "urgent"],
  food: ["food", "recipe", "cook", "kitchen", "meal", "restaurant", "eat", "delicious", "taste", "chef"],
  travel: ["travel", "tour", "trip", "adventure", "explore", "destination", "beach", "mountain", "flight", "hotel"],
  fitness: ["fitness", "workout", "gym", "exercise", "muscle", "diet", "body", "weight", "health", "yoga"],
  music: ["music", "song", "singer", "rap", "album", "concert", "guitar", "beat", "melody", "dj"],
  fashion: ["fashion", "style", "outfit", "dress", "beauty", "makeup", "trend", "brand", "model", "wear"],
  emotional: ["secret", "truth", "why", "cry", "sad", "heart", "love", "emotional", "feeling", "pain", "life story"],
};

export const TOPIC_THEMES: Record<string, TopicTheme> = {
  tech: {
    filter: "brightness(0.8) contrast(1.2) saturate(1.3)",
    overlay: "rgba(0, 200, 255, 0.12)",
    textColor: "#00E5FF",
    accentColor: "#7B61FF",
    bgGradient: "linear-gradient(135deg, #0a1628 0%, #0d2137 40%, #1a0a3e 100%)",
  },
  motivation: {
    filter: "brightness(0.85) contrast(1.25) saturate(1.4)",
    overlay: "rgba(255, 200, 0, 0.1)",
    textColor: "#FFD700",
    accentColor: "#FF8C00",
    bgGradient: "linear-gradient(135deg, #1a1000 0%, #2a1800 50%, #1a0a00 100%)",
  },
  horror: {
    filter: "brightness(0.5) contrast(1.4) saturate(0.8)",
    overlay: "rgba(180, 0, 0, 0.2)",
    textColor: "#FF1A1A",
    accentColor: "#8B0000",
    bgGradient: "linear-gradient(135deg, #0a0000 0%, #1a0505 50%, #0d0000 100%)",
  },
  gaming: {
    filter: "brightness(0.85) contrast(1.3) saturate(1.6)",
    overlay: "rgba(120, 0, 255, 0.12)",
    textColor: "#A855F7",
    accentColor: "#22D3EE",
    bgGradient: "linear-gradient(135deg, #0a001a 0%, #1a0040 50%, #000a1a 100%)",
  },
  education: {
    filter: "brightness(0.95) contrast(1.1) saturate(1.1)",
    overlay: "rgba(59, 130, 246, 0.08)",
    textColor: "#FFFFFF",
    accentColor: "#3B82F6",
    bgGradient: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)",
  },
  money: {
    filter: "brightness(0.75) contrast(1.3) saturate(1.4)",
    overlay: "rgba(255, 215, 0, 0.15)",
    textColor: "#FFD700",
    accentColor: "#22C55E",
    bgGradient: "linear-gradient(135deg, #0a1a00 0%, #1a2a00 50%, #0a0a00 100%)",
  },
  news: {
    filter: "brightness(0.6) contrast(1.2) saturate(1.2)",
    overlay: "rgba(255, 0, 0, 0.2)",
    textColor: "#FF3B3B",
    accentColor: "#FFFFFF",
    bgGradient: "linear-gradient(135deg, #1a0000 0%, #2a0505 50%, #0a0000 100%)",
  },
  food: {
    filter: "brightness(0.9) contrast(1.15) saturate(1.5)",
    overlay: "rgba(255, 140, 0, 0.1)",
    textColor: "#FFA500",
    accentColor: "#FF6347",
    bgGradient: "linear-gradient(135deg, #1a0f00 0%, #2a1a00 50%, #1a0800 100%)",
  },
  travel: {
    filter: "brightness(0.9) contrast(1.15) saturate(1.3)",
    overlay: "rgba(0, 180, 216, 0.1)",
    textColor: "#00E5FF",
    accentColor: "#48BB78",
    bgGradient: "linear-gradient(135deg, #001a2a 0%, #002a3a 50%, #00101a 100%)",
  },
  fitness: {
    filter: "brightness(0.8) contrast(1.3) saturate(1.2)",
    overlay: "rgba(239, 68, 68, 0.1)",
    textColor: "#EF4444",
    accentColor: "#F59E0B",
    bgGradient: "linear-gradient(135deg, #1a0505 0%, #2a0a0a 50%, #0a0000 100%)",
  },
  music: {
    filter: "brightness(0.8) contrast(1.2) saturate(1.4)",
    overlay: "rgba(168, 85, 247, 0.12)",
    textColor: "#E879F9",
    accentColor: "#EC4899",
    bgGradient: "linear-gradient(135deg, #1a001a 0%, #2a0040 50%, #0a001a 100%)",
  },
  fashion: {
    filter: "brightness(0.85) contrast(1.15) saturate(1.2)",
    overlay: "rgba(236, 72, 153, 0.1)",
    textColor: "#F9A8D4",
    accentColor: "#C084FC",
    bgGradient: "linear-gradient(135deg, #1a0010 0%, #2a0020 50%, #1a000a 100%)",
  },
  emotional: {
    filter: "brightness(0.7) contrast(1.1)",
    overlay: "rgba(0,0,0,0.35)",
    textColor: "#FFFFFF",
    accentColor: "#94A3B8",
    bgGradient: "linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #050505 100%)",
  },
  default: {
    filter: "brightness(0.85) contrast(1.15)",
    overlay: "rgba(0,0,0,0.2)",
    textColor: "#FFFFFF",
    accentColor: "#8B5CF6",
    bgGradient: "linear-gradient(135deg, hsl(0 70% 20%) 0%, hsl(225 60% 15%) 50%, hsl(260 50% 12%) 100%)",
  },
};

export function detectTopicFromTitle(title: string): string {
  const t = title.toLowerCase();
  let bestMatch = "default";
  let bestScore = 0;

  for (const [topic, keywords] of Object.entries(TOPIC_KEYWORDS)) {
    let score = 0;
    for (const kw of keywords) {
      if (t.includes(kw)) score++;
    }
    if (score > bestScore) {
      bestScore = score;
      bestMatch = topic;
    }
  }

  return bestMatch;
}
