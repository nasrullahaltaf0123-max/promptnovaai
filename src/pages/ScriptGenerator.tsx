import { useState } from "react";
import { Copy, Check, Loader2 } from "lucide-react";

const scriptLengths = ["30 seconds", "1 minute", "2 minutes", "5 minutes"];
const toneStyles = ["Professional", "Casual", "Energetic", "Storytelling", "Educational"];

const OptionButton = ({ selected, onClick, children }: { selected: boolean; onClick: () => void; children: React.ReactNode }) => (
  <button onClick={onClick} className={`px-3 py-1.5 rounded-lg text-micro font-medium transition-all duration-200 ${selected ? "bg-foreground text-background" : "bg-secondary/50 text-muted-foreground hover:text-foreground hover:bg-secondary"}`}>{children}</button>
);

const ScriptGenerator = () => {
  const [topic, setTopic] = useState("");
  const [length, setLength] = useState(scriptLengths[1]);
  const [tone, setTone] = useState(toneStyles[0]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);

  const handleGenerate = () => {
    if (!topic.trim()) return;
    setIsGenerating(true);
    setTimeout(() => {
      setOutput(`📹 ${topic.toUpperCase()}\n⏱ ${length} · ${tone}\n\n[HOOK]\n"${topic} is about to change everything."\n\n[INTRO]\nHey everyone — today we're breaking down ${topic}.\n\n[BODY]\n1. Why ${topic} matters right now\n2. How to get started\n3. What the future holds\n\n[CTA]\nLike, subscribe, and let me know your thoughts.\n\n—\nDemo script. Connect Lovable Cloud for real AI.`);
      setIsGenerating(false);
    }, 2000);
  };

  const copyOutput = () => { navigator.clipboard.writeText(output); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-heading text-foreground mb-6">Script Generator</h1>
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
            <div className="text-caption text-muted-foreground whitespace-pre-wrap leading-relaxed max-h-[500px] overflow-y-auto">{output}</div>
          ) : (
            <div className="h-64 flex items-center justify-center"><p className="text-micro text-muted-foreground/40">Your script will appear here</p></div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ScriptGenerator;
