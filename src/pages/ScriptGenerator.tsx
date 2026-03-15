import { useState } from "react";
import { Copy, Check, Loader2 } from "lucide-react";

const scriptLengths = ["30 seconds", "1 minute", "2 minutes", "5 minutes"];
const toneStyles = ["Professional", "Casual", "Energetic", "Storytelling", "Educational"];

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
      setOutput(`📹 VIDEO SCRIPT: ${topic}\n⏱ Length: ${length} | 🎭 Tone: ${tone}\n\n---\n\n[HOOK - 0:00]\n"Did you know that ${topic} is changing the way we think about everything?"\n\n[INTRO - 0:05]\nHey everyone! Welcome back to the channel. Today we're diving into ${topic}.\n\n[BODY - 0:15]\nLet's break this down into three key points:\n\n1. First, let's understand why ${topic} matters...\n2. Next, here's how you can leverage it...\n3. Finally, the future of ${topic} looks incredible...\n\n[CTA - End]\nIf you found this valuable, hit that like button and subscribe!\n\n---\nThis is a demo script. Connect Lovable Cloud for real AI generation.`);
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
      <h1 className="text-2xl font-bold tracking-tighter text-foreground mb-6">AI Script Generator</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass rounded-2xl p-6 space-y-5">
          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">Video Topic</label>
            <input value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="What's your video about?" className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all" />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">Script Length</label>
            <div className="flex flex-wrap gap-2">
              {scriptLengths.map((l) => (
                <button key={l} onClick={() => setLength(l)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${length === l ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"}`}>{l}</button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">Tone Style</label>
            <div className="flex flex-wrap gap-2">
              {toneStyles.map((t) => (
                <button key={t} onClick={() => setTone(t)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${tone === t ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"}`}>{t}</button>
              ))}
            </div>
          </div>
          <button onClick={handleGenerate} disabled={isGenerating || !topic.trim()} className="w-full bg-gradient-to-r from-primary to-accent text-primary-foreground font-semibold py-2.5 rounded-xl hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 text-sm disabled:opacity-50 flex items-center justify-center gap-2">
            {isGenerating ? <><Loader2 className="w-4 h-4 animate-spin" /> Writing...</> : "Generate Script"}
          </button>
        </div>

        <div className="glass rounded-2xl p-6 relative">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-foreground">Generated Script</h3>
            {output && (
              <button onClick={copyOutput} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
                {copied ? <Check className="w-3 h-3 text-accent" /> : <Copy className="w-3 h-3" />}
                {copied ? "Copied!" : "Copy"}
              </button>
            )}
          </div>
          {isGenerating ? (
            <div className="space-y-3">
              {[...Array(10)].map((_, i) => <div key={i} className="shimmer h-4 rounded" style={{ width: `${60 + Math.random() * 40}%` }} />)}
            </div>
          ) : output ? (
            <div className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed max-h-[500px] overflow-y-auto">{output}</div>
          ) : (
            <div className="h-64 flex items-center justify-center">
              <p className="text-xs text-muted-foreground">Your script will appear here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ScriptGenerator;
