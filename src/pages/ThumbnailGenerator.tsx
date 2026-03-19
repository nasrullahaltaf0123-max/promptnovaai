import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { generateContent } from "@/lib/ai";
import { incrementUsage, getDailyUsage, getLimit, saveToHistory } from "@/lib/usage";
import { toast } from "@/hooks/use-toast";
import ThumbnailControls from "@/components/thumbnail/ThumbnailControls";
import ThumbnailPreview from "@/components/thumbnail/ThumbnailPreview";
import { PLATFORMS, type ThumbnailConfig } from "@/components/thumbnail/types";

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
          if (Array.isArray(parsed)) {
            setHeadlines(parsed.slice(0, 3));
          }
        }
      }
    } catch {
      // Silently fail — headlines are optional
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

    // Fallback: retry with a generic prompt if no images returned
    if (!genError && (!images || images.length === 0)) {
      console.warn("No images from primary prompt, retrying with fallback...");
      const fallback = await tryGenerate(
        "A cinematic YouTube thumbnail background, high contrast, dramatic lighting, 16:9, ultra detailed, dark moody atmosphere"
      );
      images = fallback.images;
      genError = fallback.error;
    }

    setIsGenerating(false);

    if (genError) {
      console.error("IMAGE API ERROR PAYLOAD:", genError);
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
      console.error("EMPTY IMAGE RESPONSE:", { images, bgPrompt });
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

    // Step 2: Parse nested JSON from Gemini response (strip markdown fences)
    try {
      const cleanJsonString = result.replace(/```json/gi, '').replace(/```/g, '').trim();
      const parsedData = JSON.parse(cleanJsonString);

      // Map nested fields to UI state
      updateConfig({
        title: parsedData.text_layers?.bangla_hook || config.title,
        subtitle: parsedData.text_layers?.english_subtitle || config.subtitle,
        themeColor: parsedData.visual_intelligence?.environmental_lighting_color || null,
        blendPreset: parsedData.visual_intelligence?.css_blend_preset || null,
      });

      // Step 3: Trigger image generation with the structured background prompt
      const bgPrompt = parsedData.generation_prompts?.background_plate;
      if (bgPrompt) {
        await generateBackgroundImage(bgPrompt);
      } else {
        setIsGenerating(false);
        setError("No background prompt in AI response.");
      }
    } catch (parseErr) {
      console.error("Failed to parse AI structure. Raw response:", result);
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
