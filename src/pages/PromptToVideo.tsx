import { useState } from "react";
import { motion } from "framer-motion";
import { Film, Sparkles, Loader2, Copy, Check, Video, Image, Clapperboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth";
import { generateContent } from "@/lib/ai";
import { incrementUsage, saveToHistory } from "@/lib/usage";
import ReactMarkdown from "react-markdown";

const videoStyles = [
  { id: "cinematic", label: "Cinematic", icon: Film, desc: "Hollywood-style cinematic video prompts" },
  { id: "animation", label: "Animation", icon: Image, desc: "Animated / motion graphics style" },
  { id: "short-form", label: "Short Form", icon: Clapperboard, desc: "TikTok / Reels / Shorts style" },
];

const PromptToVideo = () => {
  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState("cinematic");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast({ title: "Please enter a prompt", variant: "destructive" });
      return;
    }
    if (!user) {
      toast({ title: "Please log in", variant: "destructive" });
      return;
    }

    setLoading(true);
    setResult("");

    const allowed = await incrementUsage(user.id, "videoscript");
    if (!allowed) {
      toast({ title: "Daily limit reached", description: "Upgrade to Pro for more.", variant: "destructive" });
      setLoading(false);
      return;
    }

    const styleLabel = videoStyles.find((s) => s.id === style)?.label || "Cinematic";

    const systemPrompt = `You are an expert AI Video Prompt Engineer. Convert the user's idea into a highly detailed, professional video generation prompt optimized for AI video tools (Runway, Sora, Kling, Pika, etc.).

Style: ${styleLabel}

Your output MUST include:
1. **Video Title** — A catchy title for the video
2. **Overall Description** — 2-3 sentences describing the complete video concept
3. **Scene Breakdown** — 4-6 detailed scenes, each with:
   - Scene number and duration (e.g., "Scene 1 (0:00-0:05)")
   - Detailed visual description (camera angle, movement, lighting, colors)
   - Subject/character actions and expressions
   - Background/environment details
   - Mood and atmosphere
4. **Camera Directions** — Specific camera movements (pan, zoom, dolly, tracking shot, etc.)
5. **Color Grading** — Suggested color palette and mood
6. **Music/Sound Suggestion** — Type of background music or sound effects
7. **Copy-Ready Prompt** — A single optimized prompt paragraph ready to paste into AI video generators

Make it extremely detailed, visual, and cinematic. Use professional filmmaking terminology.`;

    const { result: generated, error } = await generateContent("prompt", `${systemPrompt}\n\nUser's idea: ${prompt}`);

    if (error) {
      toast({ title: "Generation failed", description: error, variant: "destructive" });
    } else if (generated) {
      setResult(generated);
      await saveToHistory(user.id, "video-prompt", prompt.slice(0, 50), prompt, generated);
      toast({ title: "Video prompt generated! 🎬" });
    }

    setLoading(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    toast({ title: "Copied to clipboard!" });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-500/20 to-purple-500/20 flex items-center justify-center">
            <Video className="w-6 h-6 text-rose-400" />
          </div>
          <div>
            <h1 className="text-heading text-foreground">Prompt to Video</h1>
            <p className="text-caption text-muted-foreground">Generate detailed AI video prompts from your ideas</p>
          </div>
        </div>

        {/* Style Selector */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {videoStyles.map((s) => (
            <button
              key={s.id}
              onClick={() => setStyle(s.id)}
              className={`glass-card rounded-xl p-4 text-left transition-all duration-200 ${
                style === s.id
                  ? "ring-2 ring-primary bg-primary/10"
                  : "hover:bg-muted/50"
              }`}
            >
              <s.icon className={`w-5 h-5 mb-2 ${style === s.id ? "text-primary" : "text-muted-foreground"}`} />
              <p className="text-caption font-medium text-foreground">{s.label}</p>
              <p className="text-micro text-muted-foreground mt-0.5">{s.desc}</p>
            </button>
          ))}
        </div>

        {/* Input */}
        <div className="glass-card rounded-2xl p-6 mb-6">
          <label className="text-caption font-medium text-foreground mb-2 block">Describe your video idea</label>
          <Textarea
            placeholder="e.g., A futuristic city at sunset with flying cars and neon lights, slow cinematic camera pan..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={4}
            className="bg-background/50 border-border/50 text-foreground resize-none"
          />
          <Button
            onClick={handleGenerate}
            disabled={loading || !prompt.trim()}
            className="mt-4 w-full bg-gradient-to-r from-rose-500 to-purple-600 hover:brightness-110 text-white"
          >
            {loading ? (
              <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Generating...</>
            ) : (
              <><Sparkles className="w-4 h-4 mr-2" /> Generate Video Prompt</>
            )}
          </Button>
        </div>

        {/* Result */}
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-body font-semibold text-foreground flex items-center gap-2">
                <Film className="w-4 h-4 text-rose-400" /> Generated Video Prompt
              </h3>
              <Button variant="outline" size="sm" onClick={handleCopy}>
                {copied ? <Check className="w-3.5 h-3.5 mr-1.5" /> : <Copy className="w-3.5 h-3.5 mr-1.5" />}
                {copied ? "Copied" : "Copy"}
              </Button>
            </div>
            <div className="prose prose-invert prose-sm max-w-none text-muted-foreground">
              <ReactMarkdown>{result}</ReactMarkdown>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default PromptToVideo;
