import { useState, useEffect } from "react";
import { Copy, Check, Loader2, Wand2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { useAuth } from "@/lib/auth";
import { generateContent } from "@/lib/ai";
import { incrementUsage, getDailyUsage, getLimit, saveToHistory } from "@/lib/usage";
import { toast } from "@/hooks/use-toast";

const categories = ["Marketing", "Coding", "Writing", "Design", "Business", "Social Media"];
const complexities = ["Simple", "Detailed", "Expert"];

const OptionButton = ({ selected, onClick, children }: { selected: boolean; onClick: () => void; children: React.ReactNode }) => (
  <button onClick={onClick} className={`px-3 py-1.5 rounded-lg text-micro font-medium transition-all duration-200 ${selected ? "bg-foreground text-background" : "bg-secondary/50 text-muted-foreground hover:text-foreground hover:bg-secondary"}`}>{children}</button>
);

const PromptGenerator = () => {
  const { user, profile } = useAuth();
  const isAdmin = profile?.role === "admin";
  const [idea, setIdea] = useState("");
  const [category, setCategory] = useState(categories[0]);
  const [complexity, setComplexity] = useState(complexities[1]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);
  const [usage, setUsage] = useState(0);
  const limit = getLimit("prompt");

  useEffect(() => {
    if (user) getDailyUsage(user.id, "prompt").then(setUsage);
  }, [user]);

  const handleGenerate = async () => {
    if (!idea.trim() || !user) return;
    if (!isAdmin && usage >= limit) {
      toast({ title: "Daily limit reached", variant: "destructive" });
      return;
    }
    setIsGenerating(true);
    await incrementUsage(user.id, "prompt", isAdmin);
    setUsage((u) => u + 1);

    const { result, error } = await generateContent("prompt", idea, { category, complexity });
    setIsGenerating(false);
    if (error) { toast({ title: "Error", description: error, variant: "destructive" }); return; }
    setOutput(result || "");
    await saveToHistory(user.id, "prompt", idea, `${category}, ${complexity}`, result || "");
  };

  const copyOutput = () => { navigator.clipboard.writeText(output); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-heading text-foreground">Prompt Generator</h1>
        {!isAdmin && <span className="text-micro text-muted-foreground bg-secondary/50 px-3 py-1 rounded-lg">{usage}/{limit} today</span>}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="glass-card-highlight rounded-2xl p-6 space-y-5">
          <div>
            <label className="text-caption font-medium text-foreground mb-2 block">Your idea</label>
            <textarea value={idea} onChange={(e) => setIdea(e.target.value)} placeholder="Describe what you want to achieve..." rows={3} className="w-full bg-secondary/30 border border-border/40 rounded-xl px-4 py-3 text-caption text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none" />
          </div>
          <div>
            <label className="text-caption font-medium text-foreground mb-2 block">Category</label>
            <div className="flex flex-wrap gap-1.5">{categories.map((c) => <OptionButton key={c} selected={category === c} onClick={() => setCategory(c)}>{c}</OptionButton>)}</div>
          </div>
          <div>
            <label className="text-caption font-medium text-foreground mb-2 block">Complexity</label>
            <div className="flex gap-1.5">{complexities.map((c) => <OptionButton key={c} selected={complexity === c} onClick={() => setComplexity(c)}>{c}</OptionButton>)}</div>
          </div>
          <button onClick={handleGenerate} disabled={isGenerating || !idea.trim()} className="w-full bg-foreground text-background font-medium py-2.5 rounded-xl hover:bg-foreground/90 transition-all duration-200 text-caption disabled:opacity-30 flex items-center justify-center gap-2">
            {isGenerating ? <><Loader2 className="w-4 h-4 animate-spin" /> Generating...</> : <><Wand2 className="w-4 h-4" /> Generate prompt</>}
          </button>
        </div>
        <div className="glass-card rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-caption font-medium text-foreground">Output</h3>
            {output && <button onClick={copyOutput} className="flex items-center gap-1.5 text-micro text-muted-foreground hover:text-foreground transition-colors">{copied ? <Check className="w-3 h-3 text-accent" /> : <Copy className="w-3 h-3" />}{copied ? "Copied" : "Copy"}</button>}
          </div>
          {isGenerating ? (
            <div className="space-y-3">{[...Array(8)].map((_, i) => <div key={i} className="shimmer h-3.5 rounded" style={{ width: `${55 + Math.random() * 45}%` }} />)}</div>
          ) : output ? (
            <div className="text-caption text-muted-foreground leading-relaxed max-h-[500px] overflow-y-auto prose prose-sm prose-invert max-w-none">
              <ReactMarkdown>{output}</ReactMarkdown>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center"><p className="text-micro text-muted-foreground/40">Your generated prompt will appear here</p></div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PromptGenerator;
