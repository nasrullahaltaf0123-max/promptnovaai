import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/lib/auth";
import { generateContent } from "@/lib/ai";
import { incrementUsage, getDailyUsage, getLimit, saveToHistory } from "@/lib/usage";
import { toast } from "@/hooks/use-toast";
import ThumbnailPreview from "@/components/thumbnail/ThumbnailPreview";
import { PLATFORMS, type ThumbnailConfig } from "@/components/thumbnail/types";
import { detectContentType, getThemeStyle } from "@/components/thumbnail/ThumbnailCanvas";
import BlueprintInputForm from "@/components/thumbnail/BlueprintInputForm";
import BlueprintOutputCards from "@/components/thumbnail/BlueprintOutputCards";

export type StyleOption = "documentary" | "marketing";

export interface BlueprintData {
  background: string;
  effects: string;
  colorPalette: string;
  font: string;
  shapes: string;
  filters: string;
  referenceIntegration?: string;
}

export interface CharacterPrompt {
  prompt: string;
}

function autoConfigFromTitle(title: string, hasSubject: boolean): Partial<ThumbnailConfig> {
  const type = detectContentType(title);
  const autoEffects: Record<string, Partial<ThumbnailConfig>> = {
    news: { textEffect: "none", enableGlow: true, enableStroke: true, shapeOverlay: "none", textColor: "white" },
    money: { textEffect: "gradient", enableGlow: true, enableStroke: true, shapeOverlay: "glow-lines", textColor: "yellow" },
    tech: { textEffect: "gradient", enableGlow: true, enableStroke: false, shapeOverlay: "glow-lines", textColor: "cyan" },
    emotional: { textEffect: "none", enableGlow: false, enableStroke: true, shapeOverlay: "none", textColor: "white" },
    default: { textEffect: "none", enableGlow: true, enableStroke: true, shapeOverlay: "none", textColor: "white" },
  };
  return { ...autoEffects[type], textPosition: hasSubject ? "left" : "center", textSize: hasSubject ? 95 : 100 };
}

const ThumbnailGenerator = () => {
  const { user, profile } = useAuth();
  const isAdmin = profile?.role === "admin";
  const [usage, setUsage] = useState(0);
  const limit = getLimit("image");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");

  // Blueprint form state
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [style, setStyle] = useState<StyleOption>("documentary");
  const [referenceImage, setReferenceImage] = useState<string | null>(null);
  const [autoCharacter, setAutoCharacter] = useState(true);

  // Output state
  const [blueprint, setBlueprint] = useState<BlueprintData | null>(null);
  const [characterPrompt, setCharacterPrompt] = useState<CharacterPrompt | null>(null);
  const [hasGenerated, setHasGenerated] = useState(false);

  // Canvas config
  const [config, setConfig] = useState<ThumbnailConfig>({
    title: "",
    subtitle: "",
    platform: PLATFORMS[0],
    textPosition: "left",
    fontPreset: "siyam",
    textColor: "yellow",
    textEffect: "none",
    textSize: 100,
    enableGlow: true,
    enableStroke: true,
    subjectImage: null,
    subjectScale: 85,
    subjectFlip: false,
    backgroundImage: null,
    backgroundBlur: 0,
    shapeOverlay: "none",
    themeColor: null,
    blendPreset: null,
  });

  useEffect(() => {
    if (user) getDailyUsage(user.id, "image").then(setUsage);
  }, [user]);

  const updateConfig = (partial: Partial<ThumbnailConfig>) => {
    setConfig((prev) => ({ ...prev, ...partial }));
  };

  const handleReferenceUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      setReferenceImage(dataUrl);
      updateConfig({ subjectImage: dataUrl });
    };
    reader.readAsDataURL(file);
  };

  const generateBlueprint = (contentType: string, titleText: string, subtitleText: string, selectedStyle: string, hasRef: boolean): BlueprintData => {
    const theme = getThemeStyle(contentType as any);
    const styleLabel = selectedStyle === "documentary" ? "Geopolitical/Documentary" : "High-Energy Marketing";

    const backgrounds: Record<string, string> = {
      news: "Split-screen: Left — dark grungy war-zone with smoke, debris, muted tones. Right — sharp red alert zone with breaking news energy. Overall dark with red cinematic gradient overlay.",
      money: "Radial gradient: center golden burst outward to deep black. Floating currency symbols, stock chart rising sharply in background. Gold particle haze.",
      tech: "Deep midnight blue with cyan neon circuit-board patterns. Holographic grid floor fading into darkness. Floating data streams and glowing nodes.",
      emotional: "Dark vignette-heavy composition. Soft moody lighting from single source. Muted desaturated background with subtle bokeh light orbs.",
      default: "Cinematic dark gradient. Volumetric god rays from top-right. Atmospheric haze with subtle warm/cool split toning.",
    };

    const effects: Record<string, string> = {
      news: "Red censor bars on key elements, glowing red rim light on subject, heavy drop shadow, dramatic vignette, slight lens flare from explosion light.",
      money: "Golden glow outline on subject, 3D text extrusion with gold-to-orange gradient, sparkle particles, high saturation boost, money rain effect.",
      tech: "Cyan neon glow outline, holographic lens flare, digital glitch artifacts on edges, matrix-style data overlay at 10% opacity, electric blue rim light.",
      emotional: "Soft gaussian glow on subject, heavy vignette (80%), subtle film grain, warm backlight halo, tear/rain streak light effects.",
      default: "Strong drop shadow on subject, rim light separation, subtle lens flare, atmospheric depth haze, cinematic vignette.",
    };

    const palettes: Record<string, string> = {
      news: "Primary: #FF3B3B (Danger Red) on #0A0A0A (Deep Black). Accent: #FFD700 (Alert Gold). Emotional coding: Red = danger/urgency, Dark = severity. High contrast mandatory.",
      money: "Primary: #FFD700 (Gold) on #1A1200 (Rich Black). Accent: #00FF88 (Money Green). Emotional coding: Gold = wealth, Green = growth. Luxury feel.",
      tech: "Primary: #00E5FF (Cyan) on #001520 (Tech Black). Accent: #7C3AED (Electric Purple). Emotional coding: Blue = innovation, Purple = future. Neon contrast.",
      emotional: "Primary: #FFFFFF (Pure White) on #0F0F0F (Void Black). Accent: #94A3B8 (Muted Silver). Emotional coding: White = truth, Dark = weight. Minimal palette.",
      default: "Primary: #FFFFFF (White) on #0A0A0A (Black). Accent: #F59E0B (Amber). High contrast complementary scheme for maximum CTR.",
    };

    return {
      background: backgrounds[contentType] || backgrounds.default,
      effects: effects[contentType] || effects.default,
      colorPalette: palettes[contentType] || palettes.default,
      font: `Heavy Condensed Sans-Serif (e.g., Impact, Bebas Neue, Anton). 100% UPPERCASE. ${selectedStyle === "marketing" ? "Italic for motion energy." : "Straight for authority."} Double stroke border: inner white/gold, outer black. Letter-spacing: -2%. Line height: 0.95. Must be readable at 120px thumbnail size.`,
      shapes: contentType === "news"
        ? "Thick red bar behind headline (semi-transparent). Directional arrow pointing at subject. Dark gradient rectangle (left 60%) for text readability zone."
        : contentType === "money"
          ? "Upward-curving golden arrow. Split-screen frame divider (poverty vs wealth). Glowing diamond shape accent behind key number."
          : "Dark semi-transparent rectangle behind text area. Subtle directional arrow or highlight circle on subject face. Clean geometric framing.",
      filters: `High Clarity/HDR effect on face (+40). Dodge eyes and teeth for pop. ${contentType === "news" ? "Heavy edge vignette (dark red)." : "Strong edge vignette (black)."} Sharpening on subject face. Slight grain for cinema feel. Color grade: ${selectedStyle === "documentary" ? "Teal shadows + orange highlights (Hollywood split)" : "Hyper-saturated, vibrant, clean HDR"}`,
      referenceIntegration: hasRef
        ? "Extract subject from uploaded image using clean cutout. Apply outer glow matching theme color. Color-grade subject to match selected style lighting. Add rim light edge matching the dominant accent color. Ensure face is largest element with enhanced eye/teeth detail."
        : undefined,
    };
  };

  const generateCharacterPromptText = (contentType: string, titleText: string, subtitleText: string, selectedStyle: string): string => {
    const emotions: Record<string, string> = {
      news: "extremely shocked and alarmed, eyes wide with disbelief, mouth slightly open, intense serious stare",
      money: "SHOCKED and EXCITED, eyes extremely wide, jaw dropped in amazement, pointing at camera with one hand",
      tech: "awe-struck and fascinated, eyes wide reflecting blue light, slight wonder expression, futuristic genius look",
      emotional: "deeply moved, eyes glistening with emotion, vulnerable yet powerful expression, authentic human moment",
      default: "dramatic intense expression, strong eye contact directly at camera, charismatic presence, commanding attention",
    };

    const lighting: Record<string, string> = {
      news: "harsh red rim light from left side, dramatic studio flash from above-right, dark moody backlight with red glow",
      money: "vibrant golden rim light from both sides, warm studio key light, glowing backlight creating wealth aura",
      tech: "vibrant cyan rim light on the left, cool blue fill light, electric purple backlight, holographic ambient glow",
      emotional: "soft warm key light from above, subtle rim light, gentle backlight creating ethereal halo effect",
      default: "dramatic 3-point lighting, strong key light from right, colored rim light from left, subtle fill",
    };

    const emotion = emotions[contentType] || emotions.default;
    const light = lighting[contentType] || lighting.default;
    const context = `${titleText}${subtitleText ? ` — ${subtitleText}` : ""}`;
    const styleDesc = selectedStyle === "documentary" ? "cinematic documentary style, gritty realism" : "hyper-saturated viral YouTube style, vibrant and punchy";

    return `A South Asian male content creator reacting to "${context}", ${emotion}, looking directly at the viewer, ${light}, 14mm wide-angle lens distortion, extreme close-up portrait, chest up framing, 8K resolution, hyperrealistic, HDR rendering, exaggerated YouTube thumbnail style, ${styleDesc}, isolated on a solid dark background (#0A0A0A) for easy background removal, professional studio photography quality`;
  };

  const handleGenerate = async () => {
    if (!title.trim() || !user) return;
    if (!isAdmin && usage >= limit) {
      toast({ title: "Daily limit reached", variant: "destructive" });
      return;
    }

    setIsGenerating(true);
    setError("");
    setHasGenerated(false);
    setBlueprint(null);
    setCharacterPrompt(null);

    // Auto-configure canvas
    const contentType = detectContentType(title);
    const autoConfig = autoConfigFromTitle(title, !!referenceImage);
    updateConfig({ ...autoConfig, title, subtitle, subjectImage: referenceImage });

    // Generate blueprint locally (instant)
    const bp = generateBlueprint(contentType, title, subtitle, style, !!referenceImage);
    setBlueprint(bp);

    // Generate character prompt if toggled
    if (autoCharacter) {
      const cp = generateCharacterPromptText(contentType, title, subtitle, style);
      setCharacterPrompt({ prompt: cp });
    }

    // Increment usage
    const ok = await incrementUsage(user.id, "image", isAdmin);
    if (!ok) {
      setIsGenerating(false);
      toast({ title: "Limit reached", variant: "destructive" });
      return;
    }
    setUsage((u) => u + 1);

    // Generate AI background via edge function
    try {
      const { result, error: genError } = await generateContent("thumbnail", title, {
        style: style === "documentary" ? "Cinematic" : "Viral",
        colorScheme: "Dark & Bold",
        width: String(config.platform.width),
        height: String(config.platform.height),
      });

      if (genError) {
        setIsGenerating(false);
        setError(genError);
        setHasGenerated(true);
        toast({ title: "AI generation warning", description: genError, variant: "destructive" });
        return;
      }

      if (result) {
        try {
          const cleanJson = result.replace(/```json/gi, "").replace(/```/g, "").trim();
          const parsed = JSON.parse(cleanJson);
          updateConfig({
            title: parsed.text_layers?.bangla_hook || title,
            subtitle: parsed.text_layers?.english_subtitle || subtitle,
            themeColor: parsed.visual_intelligence?.environmental_lighting_color || null,
            blendPreset: parsed.visual_intelligence?.css_blend_preset || null,
          });

          const bgPrompt = parsed.generation_prompts?.background_plate;
          if (bgPrompt) {
            const { images, error: imgError } = await generateContent("thumbnail-image", bgPrompt, {
              style: "Cinematic",
              colorScheme: "Dark & Bold",
              width: String(config.platform.width),
              height: String(config.platform.height),
            });

            if (!imgError && images && images.length > 0) {
              updateConfig({ backgroundImage: images[0] });
              if (user) {
                await saveToHistory(user.id, "image", title, `Thumbnail: ${config.platform.label}`, `[thumbnail generated]`);
              }
            } else {
              // Try fallback
              const fallback = await generateContent("thumbnail-image", "Cinematic dark YouTube thumbnail background, high contrast, dramatic lighting, 16:9, ultra detailed", {
                style: "Cinematic",
                width: String(config.platform.width),
                height: String(config.platform.height),
              });
              if (fallback.images?.length) {
                updateConfig({ backgroundImage: fallback.images[0] });
              }
            }
          }
        } catch {
          // Parse failed but blueprint is still generated
          setError("AI background parse failed, but blueprint is ready.");
        }
      }
    } catch (e) {
      setError("Generation failed. Blueprint is still available.");
    }

    setIsGenerating(false);
    setHasGenerated(true);
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground tracking-tight">Thumbnail Blueprint AI</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Generate high-converting thumbnail recipes & AI character assets.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-5">
        {/* Left: Input + Output Cards */}
        <div className="space-y-5 overflow-y-auto max-h-[85vh] pr-1">
          <BlueprintInputForm
            title={title}
            subtitle={subtitle}
            style={style}
            referenceImage={referenceImage}
            autoCharacter={autoCharacter}
            isGenerating={isGenerating}
            usage={usage}
            limit={limit}
            isAdmin={isAdmin}
            onTitleChange={setTitle}
            onSubtitleChange={setSubtitle}
            onStyleChange={setStyle}
            onReferenceUpload={handleReferenceUpload}
            onReferenceRemove={() => { setReferenceImage(null); updateConfig({ subjectImage: null }); }}
            onAutoCharacterToggle={setAutoCharacter}
            onGenerate={handleGenerate}
          />

          {hasGenerated && (
            <BlueprintOutputCards
              blueprint={blueprint}
              characterPrompt={autoCharacter ? characterPrompt : null}
            />
          )}
        </div>

        {/* Right: Canvas Preview */}
        <ThumbnailPreview config={config} isGenerating={isGenerating} error={error} />
      </div>
    </div>
  );
};

export default ThumbnailGenerator;
