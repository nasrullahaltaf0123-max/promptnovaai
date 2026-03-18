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

    const { images, error: genError } = await generateContent("thumbnail", config.title, {
      style: "Cinematic",
      colorScheme: "Dark & Bold",
      width: String(config.platform.width),
      height: String(config.platform.height),
    });

    setIsGenerating(false);

    if (genError) {
      setError(genError);
      toast({ title: "Generation failed", description: genError, variant: "destructive" });
      return;
    }

    if (images && images.length > 0) {
      updateConfig({ backgroundImage: images[0] });
      await saveToHistory(user.id, "image", config.title, `Thumbnail: ${config.platform.label}`, `[thumbnail generated]`);
    } else {
      setError("No background generated. Try again.");
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
        />
        <ThumbnailPreview config={config} isGenerating={isGenerating} error={error} />
      </div>
    </div>
  );
};

export default ThumbnailGenerator;
