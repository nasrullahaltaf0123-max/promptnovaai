import { useState, useEffect } from "react";
import { Copy, Check, Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { useAuth } from "@/lib/auth";
import { generateContent } from "@/lib/ai";
import { incrementUsage, getDailyUsage, getLimit, saveToHistory } from "@/lib/usage";
import { toast } from "@/hooks/use-toast";

const tones = ["Professional", "Casual", "Humorous", "Academic", "Persuasive"];
const wordCounts = ["300", "500", "800", "1200"];

const OptionButton = ({ selected, onClick, children }: { selected: boolean; onClick: () => void; children: React.ReactNode }) => (
  <button onClick={onClick} className={`px-3 py-1.5 rounded-lg text-micro font-medium transition-all duration-200 ${selected ? "bg-foreground text-background" : "bg-secondary/50 text-muted-foreground hover:text-foreground hover:bg-secondary"}`}>{children}</button>
);

const BlogWriter = () => {
  const { user } = useAuth();
  const [topic, setTopic] = useState("");
  const [tone, setTone] = useState(tones[0]);
  const [wordCount, setWordCount] = useState(wordCounts[1]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);
  const [usage, setUsage] = useState(0);
  const limit = getLimit("blog");

  useEffect(() => {
    if (user) getDailyUsage(user.id, "blog").then(setUsage);
  }, [user]);

  const handleGenerate = async () => {
    if (!topic.trim() || !user) return;
    if (usage >= limit) {
      toast({ title: "Daily limit reached", description: `You've used all ${limit} blog generations for today.`, variant: "destructive" });
      return;
    }
    setIsGenerating(true);
    const ok = await incrementUsage(user.id, "blog");
    if (!ok) { setIsGenerating(false); toast({ title: "Limit reached", variant: "destructive" }); return; }
    setUsage((u) => u + 1);

    const { result, error } = await generateContent("blog", topic, { tone, wordCount });
    setIsGenerating(false);
    if (error) { toast({ title: "Error", description: error, variant: "destructive" }); return; }
    setOutput(result || "");
    await saveToHistory(user.id, "blog", topic, `${tone}, ${wordCount} words`, result || "");
  };

  const copyOutput = () => { navigator.clipboard.writeText(output); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-heading text-foreground">Blog Writer</h1>
        <span className="text-micro text-muted-foreground bg-secondary/50 px-3 py-1 rounded-lg">{usage}/{limit} today</span>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="glass-card-highlight rounded-2xl p-6 space-y-5">
          <div>
            <label className="text-caption font-medium text-foreground mb-2 block">Topic</label>
            <input value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="What should the article be about?" className="w-full bg-secondary/30 border border-border/40 rounded-xl px-4 py-2.5 text-caption text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all" />
          </div>
          <div>
            <label className="text-caption font-medium text-foreground mb-2 block">Tone</label>
            <div className="flex flex-wrap gap-1.5">{tones.map((t) => <OptionButton key={t} selected={tone === t} onClick={() => setTone(t)}>{t}</OptionButton>)}</div>
          </div>
          <div>
            <label className="text-caption font-medium text-foreground mb-2 block">Word count</label>
            <div className="flex gap-1.5">{wordCounts.map((w) => <OptionButton key={w} selected={wordCount === w} onClick={() => setWordCount(w)}>{w}</OptionButton>)}</div>
          </div>
          <button onClick={handleGenerate} disabled={isGenerating || !topic.trim()} className="w-full bg-foreground text-background font-medium py-2.5 rounded-xl hover:bg-foreground/90 transition-all duration-200 text-caption disabled:opacity-30 flex items-center justify-center gap-2">
            {isGenerating ? <><Loader2 className="w-4 h-4 animate-spin" /> Writing...</> : "Generate article"}
          </button>
        </div>
        <div className="glass-card rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-caption font-medium text-foreground">Output</h3>
            {output && <button onClick={copyOutput} className="flex items-center gap-1.5 text-micro text-muted-foreground hover:text-foreground transition-colors">{copied ? <Check className="w-3 h-3 text-accent" /> : <Copy className="w-3 h-3" />}{copied ? "Copied" : "Copy"}</button>}
          </div>
          {isGenerating ? (
            <div className="space-y-3">{[...Array(8)].map((_, i) => <div key={i} className="shimmer h-3.5 rounded" style={{ width: `${65 + Math.random() * 35}%` }} />)}</div>
          ) : output ? (
            <div className="text-caption text-muted-foreground leading-relaxed max-h-[500px] overflow-y-auto prose prose-sm prose-invert max-w-none">
              <ReactMarkdown>{output}</ReactMarkdown>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center"><p className="text-micro text-muted-foreground/40">Your article will appear here</p></div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogWriter;
