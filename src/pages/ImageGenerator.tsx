import { useState, useEffect } from "react";
import { Image as ImageIcon, Download, Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { useAuth } from "@/lib/auth";
import { generateContent } from "@/lib/ai";
import { incrementUsage, getDailyUsage, getLimit, saveToHistory } from "@/lib/usage";
import { toast } from "@/hooks/use-toast";

const styles = ["Photorealistic", "Digital Art", "Anime", "Oil Painting", "Watercolor", "3D Render"];
const resolutions = ["512×512", "768×768", "1024×1024"];

const OptionButton = ({ selected, onClick, children }: { selected: boolean; onClick: () => void; children: React.ReactNode }) => (
  <button onClick={onClick} className={`px-3 py-1.5 rounded-lg text-micro font-medium transition-all duration-200 ${selected ? "bg-foreground text-background" : "bg-secondary/50 text-muted-foreground hover:text-foreground hover:bg-secondary"}`}>{children}</button>
);

const ImageGenerator = () => {
  const { user } = useAuth();
  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState(styles[0]);
  const [resolution, setResolution] = useState(resolutions[0]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [output, setOutput] = useState("");
  const [usage, setUsage] = useState(0);
  const limit = getLimit("image");

  useEffect(() => {
    if (user) getDailyUsage(user.id, "image").then(setUsage);
  }, [user]);

  const handleGenerate = async () => {
    if (!prompt.trim() || !user) return;
    if (usage >= limit) {
      toast({ title: "Daily limit reached", description: `You've used all ${limit} image generations for today.`, variant: "destructive" });
      return;
    }
    setIsGenerating(true);
    const ok = await incrementUsage(user.id, "image");
    if (!ok) { setIsGenerating(false); toast({ title: "Limit reached", variant: "destructive" }); return; }
    setUsage((u) => u + 1);

    const { result, error } = await generateContent("image", prompt, { style, resolution });
    setIsGenerating(false);
    if (error) { toast({ title: "Error", description: error, variant: "destructive" }); return; }
    setOutput(result || "");
    await saveToHistory(user.id, "image", prompt, `${style}, ${resolution}`, result || "");
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-heading text-foreground">Image Generator</h1>
        <span className="text-micro text-muted-foreground bg-secondary/50 px-3 py-1 rounded-lg">{usage}/{limit} today</span>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="glass-card-highlight rounded-2xl p-6 space-y-5">
          <div>
            <label className="text-caption font-medium text-foreground mb-2 block">Prompt</label>
            <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="Describe the image you want to create..." rows={4} className="w-full bg-secondary/30 border border-border/40 rounded-xl px-4 py-3 text-caption text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none" />
          </div>
          <div>
            <label className="text-caption font-medium text-foreground mb-2 block">Style</label>
            <div className="flex flex-wrap gap-1.5">{styles.map((s) => <OptionButton key={s} selected={style === s} onClick={() => setStyle(s)}>{s}</OptionButton>)}</div>
          </div>
          <div>
            <label className="text-caption font-medium text-foreground mb-2 block">Resolution</label>
            <div className="flex gap-1.5">{resolutions.map((r) => <OptionButton key={r} selected={resolution === r} onClick={() => setResolution(r)}>{r}</OptionButton>)}</div>
          </div>
          <button onClick={handleGenerate} disabled={isGenerating || !prompt.trim()} className="w-full bg-foreground text-background font-medium py-2.5 rounded-xl hover:bg-foreground/90 transition-all duration-200 text-caption disabled:opacity-30 flex items-center justify-center gap-2">
            {isGenerating ? <><Loader2 className="w-4 h-4 animate-spin" /> Generating...</> : "Generate image concepts"}
          </button>
        </div>

        <div className="glass-card rounded-2xl p-6">
          <h3 className="text-caption font-medium text-foreground mb-4">Output</h3>
          {isGenerating ? (
            <div className="space-y-3">{[...Array(6)].map((_, i) => <div key={i} className="shimmer h-3.5 rounded" style={{ width: `${55 + Math.random() * 45}%` }} />)}</div>
          ) : output ? (
            <div className="text-caption text-muted-foreground leading-relaxed max-h-[500px] overflow-y-auto prose prose-sm prose-invert max-w-none">
              <ReactMarkdown>{output}</ReactMarkdown>
            </div>
          ) : (
            <div className="aspect-square rounded-xl bg-secondary/20 border border-border/20 flex items-center justify-center">
              <div className="text-center"><ImageIcon className="w-10 h-10 text-muted-foreground/20 mx-auto mb-3" /><p className="text-micro text-muted-foreground/50">AI image concepts will appear here</p></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageGenerator;
