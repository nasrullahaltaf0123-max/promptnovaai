import { useState } from "react";
import { Copy, Check, Loader2, Video } from "lucide-react";

const platforms = ["YouTube", "TikTok", "Instagram Reels", "LinkedIn", "Podcast"];
const durations = ["30 seconds", "1 minute", "3 minutes", "5 minutes", "10 minutes"];
const tones = ["Professional", "Casual", "Energetic", "Storytelling", "Educational", "Humorous"];

const OptionButton = ({ selected, onClick, children }: { selected: boolean; onClick: () => void; children: React.ReactNode }) => (
  <button onClick={onClick} className={`px-3 py-1.5 rounded-lg text-micro font-medium transition-all duration-200 ${selected ? "bg-foreground text-background" : "bg-secondary/50 text-muted-foreground hover:text-foreground hover:bg-secondary"}`}>{children}</button>
);

const VideoScriptWriter = () => {
  const [topic, setTopic] = useState("");
  const [platform, setPlatform] = useState(platforms[0]);
  const [duration, setDuration] = useState(durations[2]);
  const [tone, setTone] = useState(tones[0]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);

  const handleGenerate = () => {
    if (!topic.trim()) return;
    setIsGenerating(true);
    setTimeout(() => {
      setOutput(`🎬 VIDEO SCRIPT: ${topic}\n📱 Platform: ${platform} | ⏱ Duration: ${duration} | 🎭 Tone: ${tone}\n\n━━━━━━━━━━━━━━━━━━━━━━\n\n[HOOK — 0:00-0:05]\n"Stop scrolling — ${topic} just changed the game."\n\n[INTRO — 0:05-0:15]\n"Hey everyone! Today we're diving deep into ${topic}.\nI've been researching this for weeks and what I found will surprise you."\n\n[MAIN CONTENT]\n\n📌 Point 1: Why ${topic} matters now\n"Let me start with the most important thing..."\n\n📌 Point 2: The hidden truth about ${topic}\n"What most people don't realize is..."\n\n📌 Point 3: How to take action\n"Here's exactly what you need to do..."\n\n[TRANSITION]\n"Now, here's where it gets really interesting..."\n\n[CONCLUSION — Last 15s]\n"So there you have it — everything you need to know about ${topic}.\nDrop a comment below with your thoughts."\n\n[CTA]\n"If this helped, smash that like button and subscribe for more content like this.\nSee you in the next one! ✌️"\n\n━━━━━━━━━━━━━━━━━━━━━━\n\nDemo script. Connect Lovable Cloud for real AI-generated scripts.`);
      setIsGenerating(false);
    }, 2000);
  };

  const copyOutput = () => { navigator.clipboard.writeText(output); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-heading text-foreground mb-6">Video Script Writer</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="glass-card-highlight rounded-2xl p-6 space-y-5">
          <div>
            <label className="text-caption font-medium text-foreground mb-2 block">Video topic</label>
            <textarea value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="What's your video about?" rows={3} className="w-full bg-secondary/30 border border-border/40 rounded-xl px-4 py-3 text-caption text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none" />
          </div>
          <div>
            <label className="text-caption font-medium text-foreground mb-2 block">Platform</label>
            <div className="flex flex-wrap gap-1.5">{platforms.map((p) => <OptionButton key={p} selected={platform === p} onClick={() => setPlatform(p)}>{p}</OptionButton>)}</div>
          </div>
          <div>
            <label className="text-caption font-medium text-foreground mb-2 block">Duration</label>
            <div className="flex flex-wrap gap-1.5">{durations.map((d) => <OptionButton key={d} selected={duration === d} onClick={() => setDuration(d)}>{d}</OptionButton>)}</div>
          </div>
          <div>
            <label className="text-caption font-medium text-foreground mb-2 block">Tone</label>
            <div className="flex flex-wrap gap-1.5">{tones.map((t) => <OptionButton key={t} selected={tone === t} onClick={() => setTone(t)}>{t}</OptionButton>)}</div>
          </div>
          <button onClick={handleGenerate} disabled={isGenerating || !topic.trim()} className="w-full bg-foreground text-background font-medium py-2.5 rounded-xl hover:bg-foreground/90 transition-all duration-200 text-caption disabled:opacity-30 flex items-center justify-center gap-2">
            {isGenerating ? <><Loader2 className="w-4 h-4 animate-spin" /> Writing script...</> : <><Video className="w-4 h-4" /> Generate script</>}
          </button>
        </div>
        <div className="glass-card rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-caption font-medium text-foreground">Output</h3>
            {output && <button onClick={copyOutput} className="flex items-center gap-1.5 text-micro text-muted-foreground hover:text-foreground transition-colors">{copied ? <Check className="w-3 h-3 text-accent" /> : <Copy className="w-3 h-3" />}{copied ? "Copied" : "Copy"}</button>}
          </div>
          {isGenerating ? (
            <div className="space-y-3">{[...Array(12)].map((_, i) => <div key={i} className="shimmer h-3.5 rounded" style={{ width: `${50 + Math.random() * 50}%` }} />)}</div>
          ) : output ? (
            <div className="text-caption text-muted-foreground whitespace-pre-wrap leading-relaxed max-h-[500px] overflow-y-auto">{output}</div>
          ) : (
            <div className="h-64 flex items-center justify-center"><p className="text-micro text-muted-foreground/40">Your video script will appear here</p></div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoScriptWriter;
