import { useState, useEffect } from "react";
import { Copy, Check, Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { useAuth } from "@/lib/auth";
import { generateContent } from "@/lib/ai";
import { incrementUsage, getDailyUsage, getLimit, saveToHistory } from "@/lib/usage";
import { toast } from "@/hooks/use-toast";

const scriptLengths = ["30 seconds", "1 minute", "2 minutes", "5 minutes"];
const toneStyles = ["Professional", "Casual", "Energetic", "Storytelling", "Educational"];

const OptionButton = ({ selected, onClick, children }: { selected: boolean; onClick: () => void; children: React.ReactNode }) => (
  <button onClick={onClick} className={`px-3 py-1.5 rounded-lg text-micro font-medium transition-all duration-200 ${selected ? "bg-foreground text-background" : "bg-secondary/50 text-muted-foreground hover:text-foreground hover:bg-secondary"}`}>{children}</button>
);

const ScriptGenerator = () => {
  const { user } = useAuth();
  const [topic, setTopic] = useState("");
  const [length, setLength] = useState(scriptLengths[1]);
  const [tone, setTone] = useState(toneStyles[0]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);
  const [usage, setUsage] = useState(0);
  const limit = getLimit("script");

  useEffect(() => {
    if (user) getDailyUsage(user.id, "script").then(setUsage);
  }, [user]);

  const handleGenerate = async () => {
    if (!topic.trim() || !user) return;
    if (usage >= limit) {
      toast({ title: "Daily limit reached", variant: "destructive" });
      return;
    }
    setIsGenerating(true);
    await incrementUsage(user.id, "script");
    setUsage((u) => u + 1);

    const { result, error } = await generateContent("script", topic, { length, tone });
    setIsGenerating(false);
    if (error) { toast({ title: "Error", description: error, variant: "destructive" }); return; }
    setOutput(result || "");
    await saveToHistory(user.id, "script", topic, `${length}, ${tone}`, result || "");
  };

  const copyOutput = () => { navigator.clipboard.writeText(output); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-heading text-foreground">Script Generator</h1>
        <span className="text-micro text-muted-foreground bg-secondary/50 px-3 py-1 rounded-lg">{usage}/{limit} today</span>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="glass-card-highlight rounded-2xl p-6 space-y-5">
          <div>
            <label className="text-caption font-medium text-foreground mb-2 block">Video topic</label>
            <input value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="What's your video about?" className="w-full bg-secondary/30 border border-border/40 rounded-xl px-4 py-2.5 text-caption text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all" />
          </div>
          <div>
            <label className="text-caption font-medium text-foreground mb-2 block">Length</label>
            <div className="flex flex-wrap gap-1.5">{scriptLengths.map((l) => <OptionButton key={l} selected={length === l} onClick={() => setLength(l)}>{l}</OptionButton>)}</div>
          </div>
          <div>
            <label className="text-caption font-medium text-foreground mb-2 block">Tone</label>
            <div className="flex flex-wrap gap-1.5">{toneStyles.map((t) => <OptionButton key={t} selected={tone === t} onClick={() => setTone(t)}>{t}</OptionButton>)}</div>
          </div>
          <button onClick={handleGenerate} disabled={isGenerating || !topic.trim()} className="w-full bg-foreground text-background font-medium py-2.5 rounded-xl hover:bg-foreground/90 transition-all duration-200 text-caption disabled:opacity-30 flex items-center justify-center gap-2">
            {isGenerating ? <><Loader2 className="w-4 h-4 animate-spin" /> Writing...</> : "Generate script"}
          </button>
        </div>
        <div className="glass-card rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-caption font-medium text-foreground">Output</h3>
            {output && <button onClick={copyOutput} className="flex items-center gap-1.5 text-micro text-muted-foreground hover:text-foreground transition-colors">{copied ? <Check className="w-3 h-3 text-accent" /> : <Copy className="w-3 h-3" />}{copied ? "Copied" : "Copy"}</button>}
          </div>
          {isGenerating ? (
            <div className="space-y-3">{[...Array(10)].map((_, i) => <div key={i} className="shimmer h-3.5 rounded" style={{ width: `${55 + Math.random() * 45}%` }} />)}</div>
          ) : output ? (
            <div className="text-caption text-muted-foreground leading-relaxed max-h-[500px] overflow-y-auto prose prose-sm prose-invert max-w-none">
              <ReactMarkdown>{output}</ReactMarkdown>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center"><p className="text-micro text-muted-foreground/40">Your script will appear here</p></div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ScriptGenerator;
