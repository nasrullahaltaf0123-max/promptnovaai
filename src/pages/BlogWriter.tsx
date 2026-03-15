import { useState } from "react";
import { Copy, Check, Loader2 } from "lucide-react";

const tones = ["Professional", "Casual", "Humorous", "Academic", "Persuasive"];
const wordCounts = ["300", "500", "800", "1200"];

const OptionButton = ({ selected, onClick, children }: { selected: boolean; onClick: () => void; children: React.ReactNode }) => (
  <button onClick={onClick} className={`px-3 py-1.5 rounded-lg text-micro font-medium transition-all duration-200 ${selected ? "bg-foreground text-background" : "bg-secondary/50 text-muted-foreground hover:text-foreground hover:bg-secondary"}`}>{children}</button>
);

const BlogWriter = () => {
  const [topic, setTopic] = useState("");
  const [tone, setTone] = useState(tones[0]);
  const [wordCount, setWordCount] = useState(wordCounts[1]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);

  const handleGenerate = () => {
    if (!topic.trim()) return;
    setIsGenerating(true);
    setTimeout(() => {
      setOutput(`# ${topic}\n\nA ${tone.toLowerCase()} article about "${topic}".\n\n## Introduction\n\nThis is a demo article. Connect Lovable Cloud for real AI-generated content.\n\n## Key Takeaways\n\n1. First insight about ${topic}\n2. Second perspective worth exploring\n3. Third actionable takeaway\n\n## Conclusion\n\n${topic} is a subject that deserves attention and deeper exploration.`);
      setIsGenerating(false);
    }, 2000);
  };

  const copyOutput = () => { navigator.clipboard.writeText(output); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-heading text-foreground mb-6">Blog Writer</h1>
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
            <div className="text-caption text-muted-foreground whitespace-pre-wrap leading-relaxed max-h-[500px] overflow-y-auto">{output}</div>
          ) : (
            <div className="h-64 flex items-center justify-center"><p className="text-micro text-muted-foreground/40">Your article will appear here</p></div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogWriter;
