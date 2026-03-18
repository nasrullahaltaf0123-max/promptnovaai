import { useState, useEffect } from "react";
import { Loader2, Sparkles, Copy, Check } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { generateContent } from "@/lib/ai";
import { incrementUsage, getDailyUsage, getLimit, saveToHistory } from "@/lib/usage";
import { toast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import ShareButton from "@/components/ShareButton";

const platforms = ["Instagram", "TikTok", "Twitter/X", "LinkedIn", "YouTube"];
const tones = ["Funny", "Motivational", "Professional", "Viral", "Emotional"];

const OptionButton = ({ selected, onClick, children }: { selected: boolean; onClick: () => void; children: React.ReactNode }) => (
  <button onClick={onClick} className={`px-3 py-1.5 rounded-lg text-micro font-medium transition-all duration-200 ${selected ? "bg-foreground text-background" : "bg-secondary/50 text-muted-foreground hover:text-foreground hover:bg-secondary"}`}>{children}</button>
);

const CaptionGenerator = () => {
  const { user, profile } = useAuth();
  const isAdmin = profile?.role === "admin";
  const [topic, setTopic] = useState("");
  const [platform, setPlatform] = useState(platforms[0]);
  const [tone, setTone] = useState(tones[0]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [captions, setCaptions] = useState<string[]>([]);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const [usage, setUsage] = useState(0);
  const limit = getLimit("prompt");

  useEffect(() => {
    if (user) getDailyUsage(user.id, "prompt").then(setUsage);
  }, [user]);

  const handleGenerate = async () => {
    if (!topic.trim() || !user) return;
    if (!isAdmin && usage >= limit) {
      toast({ title: "Daily limit reached", variant: "destructive" });
      return;
    }
    setIsGenerating(true);
    setCaptions([]);

    const ok = await incrementUsage(user.id, "prompt", isAdmin);
    if (!ok) { setIsGenerating(false); return; }
    setUsage((u) => u + 1);

    const prompt = `Generate 5 viral ${platform} captions about "${topic}" in a ${tone.toLowerCase()} tone. Each caption should be engaging, include relevant emojis and hashtags. Return ONLY the captions, numbered 1-5, one per line.`;
    const { result, error } = await generateContent("prompt", prompt);
    setIsGenerating(false);

    if (error) {
      toast({ title: "Generation failed", description: error, variant: "destructive" });
      return;
    }

    if (result) {
      const parsed = result.split(/\n/).filter((l) => l.trim()).map((l) => l.replace(/^\d+[\.\)]\s*/, ""));
      setCaptions(parsed);
      await saveToHistory(user.id, "prompt", topic, `Caption: ${platform}, ${tone}`, result);
    }
  };

  const copyCaption = async (text: string, idx: number) => {
    await navigator.clipboard.writeText(text + "\n\nMade with PromptNova AI ✨");
    setCopiedIdx(idx);
    toast({ title: "Caption copied with watermark!" });
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-heading text-foreground">Viral Caption Generator</h1>
        <span className="text-micro text-muted-foreground bg-secondary/50 px-3 py-1 rounded-lg">{usage}/{limit} today</span>
      </div>

      <div className="glass-card-highlight rounded-2xl p-6 space-y-5 mb-6">
        <div>
          <label className="text-caption font-medium text-foreground mb-2 block">What's your post about?</label>
          <input value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="Morning routine, side hustle tips, gym transformation..." className="w-full bg-secondary/30 border border-border/40 rounded-xl px-4 py-2.5 text-caption text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all" />
        </div>
        <div>
          <label className="text-caption font-medium text-foreground mb-2 block">Platform</label>
          <div className="flex flex-wrap gap-1.5">{platforms.map((p) => <OptionButton key={p} selected={platform === p} onClick={() => setPlatform(p)}>{p}</OptionButton>)}</div>
        </div>
        <div>
          <label className="text-caption font-medium text-foreground mb-2 block">Tone</label>
          <div className="flex flex-wrap gap-1.5">{tones.map((t) => <OptionButton key={t} selected={tone === t} onClick={() => setTone(t)}>{t}</OptionButton>)}</div>
        </div>
        <button onClick={handleGenerate} disabled={isGenerating || !topic.trim()} className="w-full bg-foreground text-background font-medium py-2.5 rounded-xl hover:bg-foreground/90 transition-all text-caption disabled:opacity-30 flex items-center justify-center gap-2">
          {isGenerating ? <><Loader2 className="w-4 h-4 animate-spin" /> Generating...</> : <><Sparkles className="w-4 h-4" /> Generate Captions</>}
        </button>
      </div>

      {captions.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-body-lg font-semibold text-foreground">Your Captions</h2>
            <ShareButton title={topic} toolType="caption" />
          </div>
          {captions.map((c, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }} className="glass-card rounded-xl p-4 flex items-start justify-between gap-3 group">
              <p className="text-caption text-foreground flex-1 whitespace-pre-wrap">{c}</p>
              <button onClick={() => copyCaption(c, i)} className="flex-shrink-0 bg-secondary/50 p-2 rounded-lg hover:bg-secondary transition-colors">
                {copiedIdx === i ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5 text-muted-foreground" />}
              </button>
            </motion.div>
          ))}
          <p className="text-[10px] text-muted-foreground/40 text-center">Made with PromptNova AI ✨</p>
        </motion.div>
      )}
    </div>
  );
};

export default CaptionGenerator;
