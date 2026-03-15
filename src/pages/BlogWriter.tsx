import { useState } from "react";
import { Copy, Check, Loader2 } from "lucide-react";

const tones = ["Professional", "Casual", "Humorous", "Academic", "Persuasive"];
const wordCounts = ["300 words", "500 words", "800 words", "1200 words"];

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
      setOutput(`# ${topic}\n\nThis is a demo blog article about "${topic}" written in a ${tone.toLowerCase()} tone.\n\n## Introduction\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit. This is a placeholder — connect Lovable Cloud for real AI-generated content.\n\n## Key Points\n\n1. First important point about ${topic}\n2. Second insight worth exploring\n3. Third takeaway for readers\n\n## Conclusion\n\nIn summary, ${topic} is a fascinating subject that deserves more attention.`);
      setIsGenerating(false);
    }, 2000);
  };

  const copyOutput = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold tracking-tighter text-foreground mb-6">AI Blog Writer</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass rounded-2xl p-6 space-y-5">
          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">Blog Topic</label>
            <input
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Enter your blog topic..."
              className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">Tone</label>
            <div className="flex flex-wrap gap-2">
              {tones.map((t) => (
                <button key={t} onClick={() => setTone(t)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${tone === t ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"}`}>
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">Word Count</label>
            <div className="flex flex-wrap gap-2">
              {wordCounts.map((w) => (
                <button key={w} onClick={() => setWordCount(w)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${wordCount === w ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"}`}>
                  {w}
                </button>
              ))}
            </div>
          </div>
          <button onClick={handleGenerate} disabled={isGenerating || !topic.trim()} className="w-full bg-gradient-to-r from-primary to-accent text-primary-foreground font-semibold py-2.5 rounded-xl hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 text-sm disabled:opacity-50 flex items-center justify-center gap-2">
            {isGenerating ? <><Loader2 className="w-4 h-4 animate-spin" /> Writing...</> : "Generate Blog"}
          </button>
        </div>

        <div className="glass rounded-2xl p-6 relative">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-foreground">Generated Article</h3>
            {output && (
              <button onClick={copyOutput} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
                {copied ? <Check className="w-3 h-3 text-accent" /> : <Copy className="w-3 h-3" />}
                {copied ? "Copied!" : "Copy"}
              </button>
            )}
          </div>
          {isGenerating ? (
            <div className="space-y-3">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="shimmer h-4 rounded" style={{ width: `${70 + Math.random() * 30}%` }} />
              ))}
            </div>
          ) : output ? (
            <div className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed max-h-[500px] overflow-y-auto">
              {output}
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center">
              <p className="text-xs text-muted-foreground">Your blog article will appear here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogWriter;
