import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { generateContent } from "@/lib/ai";
import { incrementUsage, getDailyUsage, getLimit, saveToHistory } from "@/lib/usage";
import { toast } from "@/hooks/use-toast";
import ThumbnailControls from "@/components/thumbnail/ThumbnailControls";
import ThumbnailPreview from "@/components/thumbnail/ThumbnailPreview";
import { PLATFORMS, type ThumbnailConfig } from "@/components/thumbnail/types";
import { detectContentType, getThemeStyle } from "@/components/thumbnail/ThumbnailCanvas";

function autoConfigFromTitle(title: string, hasSubject: boolean): Partial<ThumbnailConfig> {
  const type = detectContentType(title);
  const theme = getThemeStyle(type);

  // Auto-select best text effect and visual config per content type
  const autoEffects: Record<string, Partial<ThumbnailConfig>> = {
    news: {
      textEffect: "none",
      enableGlow: true,
      enableStroke: true,
      shapeOverlay: "none",
      textColor: "white",
    },
    money: {
      textEffect: "gradient",
      enableGlow: true,
      enableStroke: true,
      shapeOverlay: "glow-lines",
      textColor: "yellow",
    },
    tech: {
      textEffect: "gradient",
      enableGlow: true,
      enableStroke: false,
      shapeOverlay: "glow-lines",
      textColor: "cyan",
    },
    emotional: {
      textEffect: "none",
      enableGlow: false,
      enableStroke: true,
      shapeOverlay: "none",
      textColor: "white",
    },
    default: {
      textEffect: "none",
      enableGlow: true,
      enableStroke: true,
      shapeOverlay: "none",
      textColor: "white",
    },
  };

  return {
    ...autoEffects[type],
    textPosition: hasSubject ? "left" : "center",
    textSize: hasSubject ? 95 : 100,
  };
}

const ThumbnailGenerator = () => {
  const { user, profile } = useAuth();
  const isAdmin = profile?.role === "admin";
  const [usage, setUsage] = useState(0);
  const limit = getLimit("image");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");
  const [headlines, setHeadlines] = useState<string[]>([]);
  const [isLoadingHeadlines, setIsLoadingHeadlines] = useState(false);

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

  const handleFileUpload = (file: File, key: "subjectImage" | "backgroundImage") => {
    const reader = new FileReader();
    reader.onload = (e) => updateConfig({ [key]: e.target?.result as string });
    reader.readAsDataURL(file);
  };

  const fetchHeadlines = async (topic: string) => {
    if (!topic.trim()) return;
    setIsLoadingHeadlines(true);
    try {
      const { result } = await generateContent("thumbnail-headlines", topic);
      if (result) {
        const match = result.match(/\[[\s\S]*?\]/);
        if (match) {
          const parsed = JSON.parse(match[0]);
          if (Array.isArray(parsed)) setHeadlines(parsed.slice(0, 3));
        }
      }
    } catch {
      // Headlines are optional
    }
    setIsLoadingHeadlines(false);
  };

  const generateBackgroundImage = async (bgPrompt: string) => {
    const tryGenerate = async (prompt: string) => {
      return await generateContent("thumbnail-image", prompt, {
        style: "Cinematic",
        colorScheme: "Dark & Bold",
        width: String(config.platform.width),
        height: String(config.platform.height),
      });
    };

    let { images, error: genError } = await tryGenerate(bgPrompt);

    if (!genError && (!images || images.length === 0)) {
      const fallback = await tryGenerate(
        "A cinematic YouTube thumbnail background, high contrast, dramatic lighting, 16:9, ultra detailed, dark moody atmosphere"
      );
      images = fallback.images;
      genError = fallback.error;
    }

    setIsGenerating(false);

    if (genError) {
      setError(genError);
      toast({ title: "Image generation failed", description: genError, variant: "destructive" });
      return;
    }

    if (images && images.length > 0) {
      updateConfig({ backgroundImage: images[0] });
      if (user) {
        await saveToHistory(user.id, "image", config.title, `Thumbnail: ${config.platform.label}`, `[thumbnail generated]`);
      }
    } else {
      const msg = "No background generated — the API returned no images after retry.";
      setError(msg);
      toast({ title: "Image generation failed", description: msg, variant: "destructive" });
    }
  };

  const handleGenerate = async () => {
    if (!config.title.trim() || !user) return;
    if (!isAdmin && usage >= limit) {
      toast({ title: "Daily limit reached", variant: "destructive" });
      return;
    }
    setIsGenerating(true);
    setError("");

    // Step 0: Auto-configure based on content type detection
    const autoConfig = autoConfigFromTitle(config.title, !!config.subjectImage);
    updateConfig(autoConfig);

    const ok = await incrementUsage(user.id, "image", isAdmin);
    if (!ok) {
      setIsGenerating(false);
      toast({ title: "Limit reached", variant: "destructive" });
      return;
    }
    setUsage((u) => u + 1);

    // Fetch headlines in parallel
    fetchHeadlines(config.title);

    // Step 1: Get structured AI response
    const { result, error: genError } = await generateContent("thumbnail", config.title, {
      style: "Cinematic",
      colorScheme: "Dark & Bold",
      width: String(config.platform.width),
      height: String(config.platform.height),
    });

    if (genError) {
      setIsGenerating(false);
      setError(genError);
      toast({ title: "Generation failed", description: genError, variant: "destructive" });
      return;
    }

    if (!result) {
      setIsGenerating(false);
      setError("No AI response received. Try again.");
      return;
    }

    // Step 2: Parse AI JSON
    try {
      const cleanJsonString = result.replace(/```json/gi, "").replace(/```/g, "").trim();
      const parsedData = JSON.parse(cleanJsonString);

      updateConfig({
        title: parsedData.text_layers?.bangla_hook || config.title,
        subtitle: parsedData.text_layers?.english_subtitle || config.subtitle,
        themeColor: parsedData.visual_intelligence?.environmental_lighting_color || null,
        blendPreset: parsedData.visual_intelligence?.css_blend_preset || null,
      });

      // Step 3: Generate background
      const bgPrompt = parsedData.generation_prompts?.background_plate;
      if (bgPrompt) {
        await generateBackgroundImage(bgPrompt);
      } else {
        setIsGenerating(false);
        setError("No background prompt in AI response.");
      }
    } catch {
      setIsGenerating(false);
      setError("Failed to parse AI structure.");
      toast({ title: "Parse error", description: "Failed to parse AI structure.", variant: "destructive" });
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-xl font-bold text-foreground">Thumbnail Generator</h1>
        <span className="text-xs text-muted-foreground bg-secondary/50 px-3 py-1 rounded-lg">
          {config.platform.width}×{config.platform.height}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-5">
        <ThumbnailControls
          config={config}
          onChange={updateConfig}
          onGenerate={handleGenerate}
          onSubjectUpload={(f) => handleFileUpload(f, "subjectImage")}
          onBgUpload={(f) => handleFileUpload(f, "backgroundImage")}
          isGenerating={isGenerating}
          usage={usage}
          limit={limit}
          isAdmin={isAdmin}
          headlines={headlines}
          isLoadingHeadlines={isLoadingHeadlines}
          onSelectHeadline={(h) => updateConfig({ title: h })}
        />
        <ThumbnailPreview config={config} isGenerating={isGenerating} error={error} />
      </div>
    </div>
  );
};

export default ThumbnailGenerator;
