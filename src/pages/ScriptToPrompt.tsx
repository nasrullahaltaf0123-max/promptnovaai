import { useState, useEffect } from "react";
import { Copy, Check, Loader2, Code2, Video, Image } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { useAuth } from "@/lib/auth";
import { generateContent } from "@/lib/ai";
import { incrementUsage, getDailyUsage, getLimit, saveToHistory } from "@/lib/usage";
import { toast } from "@/hooks/use-toast";

const promptTypes = [
  { id: "coding", label: "Coding Prompt", icon: Code2, description: "Convert your script idea into a detailed coding prompt" },
  { id: "video", label: "Video Prompt", icon: Video, description: "Transform your concept into a video generation prompt" },
  { id: "image", label: "Image Prompt", icon: Image, description: "Turn your vision into a detailed image generation prompt" },
];

const ScriptToPrompt = () => {
  const { user, profile } = useAuth();
  const isAdmin = profile?.role === "admin";
  const [script, setScript] = useState("");
  const [selectedType, setSelectedType] = useState("coding");
  const [isGenerating, setIsGenerating] = useState(false);
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);
  const [usage, setUsage] = useState(0);
  const limit = getLimit("prompt");

  useEffect(() => {
    if (user) getDailyUsage(user.id, "prompt").then(setUsage);
  }, [user]);

  const handleGenerate = async () => {
    if (!script.trim() || !user) return;
    if (!isAdmin && usage >= limit) {
      toast({ title: "Daily limit reached", variant: "destructive" });
      return;
    }
    setIsGenerating(true);
    await incrementUsage(user.id, "prompt", isAdmin);
    setUsage((u) => u + 1);

    const typeLabel = promptTypes.find((t) => t.id === selectedType)?.label || selectedType;
    const systemPrompt = `Convert the following script/idea into a highly detailed, professional ${typeLabel}. The output should be a well-structured prompt that can be directly used with AI tools. Be specific, include context, style, tone, and technical details as needed.\n\nScript/Idea:\n${script}`;

    const { result, error } = await generateContent("prompt", systemPrompt, { category: typeLabel, complexity: "Expert" });
    setIsGenerating(false);
    if (error) {
      toast({ title: "Error", description: error, variant: "destructive" });
      return;
    }
    setOutput(result || "");
    await saveToHistory(user.id, "script-to-prompt", script.slice(0, 60), `${typeLabel}`, result || "");
  };

  const copyOutput = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-heading text-foreground">Script to Prompt</h1>
          <p className="text-caption text-muted-foreground mt-1">Convert any script or idea into a powerful AI prompt</p>
        </div>
        {!isAdmin && (
          <span className="text-micro text-muted-foreground bg-secondary/50 px-3 py-1 rounded-lg">
            {usage}/{limit} today
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Input panel */}
        <div className="glass-card-highlight rounded-2xl p-6 space-y-5">
          {/* Prompt type selector */}
          <div>
            <label className="text-caption font-medium text-foreground mb-3 block">Choose prompt type</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {promptTypes.map((type) => {
                const active = selectedType === type.id;
                return (
                  <button
                    key={type.id}
                    onClick={() => setSelectedType(type.id)}
                    className={`relative flex flex-col items-center gap-2 p-4 rounded-xl border transition-all duration-200 text-center ${
                      active
                        ? "bg-primary/10 border-primary/40 text-foreground ring-1 ring-primary/20"
                        : "bg-secondary/30 border-border/40 text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                      active ? "bg-primary/20" : "bg-secondary/50"
                    }`}>
                      <type.icon className={`w-5 h-5 ${active ? "text-primary" : "text-muted-foreground"}`} />
                    </div>
                    <span className="text-micro font-medium">{type.label}</span>
                  </button>
                );
              })}
            </div>
            <p className="text-micro text-muted-foreground/60 mt-2">
              {promptTypes.find((t) => t.id === selectedType)?.description}
            </p>
          </div>

          {/* Script input */}
          <div>
            <label className="text-caption font-medium text-foreground mb-2 block">Your script or idea</label>
            <textarea
              value={script}
              onChange={(e) => setScript(e.target.value)}
              placeholder={
                selectedType === "coding"
                  ? "e.g. Build a todo app with drag-and-drop, dark mode, and local storage..."
                  : selectedType === "video"
                  ? "e.g. A cinematic drone shot flying over a futuristic city at sunset..."
                  : "e.g. A mystical forest with glowing mushrooms and a crystal lake..."
              }
              rows={5}
              className="w-full bg-secondary/30 border border-border/40 rounded-xl px-4 py-3 text-caption text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none"
            />
          </div>

          {/* Generate button */}
          <button
            onClick={handleGenerate}
            disabled={isGenerating || !script.trim()}
            className="w-full bg-foreground text-background font-medium py-2.5 rounded-xl hover:bg-foreground/90 transition-all duration-200 text-caption disabled:opacity-30 flex items-center justify-center gap-2"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Converting...
              </>
            ) : (
              <>
                <Code2 className="w-4 h-4" /> Generate Prompt
              </>
            )}
          </button>
        </div>

        {/* Output panel */}
        <div className="glass-card rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-caption font-medium text-foreground">Generated Prompt</h3>
            {output && (
              <button
                onClick={copyOutput}
                className="flex items-center gap-1.5 text-micro text-muted-foreground hover:text-foreground transition-colors"
              >
                {copied ? <Check className="w-3 h-3 text-accent" /> : <Copy className="w-3 h-3" />}
                {copied ? "Copied" : "Copy"}
              </button>
            )}
          </div>
          {isGenerating ? (
            <div className="space-y-3">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="shimmer h-3.5 rounded" style={{ width: `${55 + Math.random() * 45}%` }} />
              ))}
            </div>
          ) : output ? (
            <div className="text-caption text-muted-foreground leading-relaxed max-h-[500px] overflow-y-auto prose prose-sm prose-invert max-w-none">
              <ReactMarkdown>{output}</ReactMarkdown>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center">
              <p className="text-micro text-muted-foreground/40">Your generated prompt will appear here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ScriptToPrompt;
