import { useState, useEffect } from "react";
import { Loader2, Sparkles, Copy, Check, Film } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { generateContent } from "@/lib/ai";
import { incrementUsage, getDailyUsage, getLimit, saveToHistory } from "@/lib/usage";
import { toast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import ShareButton from "@/components/ShareButton";

const niches = ["Money / Side Hustle", "Fitness", "Tech / AI", "Comedy", "Education", "Lifestyle"];
const formats = ["Hook → Story → CTA", "POV Style", "Tutorial / How-to", "Storytime", "Duet/React"];

const OptionButton = ({ selected, onClick, children }: { selected: boolean; onClick: () => void; children: React.ReactNode }) => (
  <button onClick={onClick} className={`px-3 py-1.5 rounded-lg text-micro font-medium transition-all duration-200 ${selected ? "bg-foreground text-background" : "bg-secondary/50 text-muted-foreground hover:text-foreground hover:bg-secondary"}`}>{children}</button>
);

const TikTokScriptGenerator = () => {
  const { user, profile } = useAuth();
  const isAdmin = profile?.role === "admin";
  const [idea, setIdea] = useState("");
  const [niche, setNiche] = useState(niches[0]);
  const [format, setFormat] = useState(formats[0]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [script, setScript] = useState("");
  const [copied, setCopied] = useState(false);
  const [usage, setUsage] = useState(0);
  const limit = getLimit("script");

  useEffect(() => {
    if (user) getDailyUsage(user.id, "script").then(setUsage);
  }, [user]);

  const handleGenerate = async () => {
    if (!idea.trim() || !user) return;
    if (!isAdmin && usage >= limit) {
      toast({ title: "Daily limit reached", variant: "destructive" });
      return;
    }
    setIsGenerating(true);
    setScript("");

    const ok = await incrementUsage(user.id, "script", isAdmin);
    if (!ok) { setIsGenerating(false); return; }
    setUsage((u) => u + 1);

    const prompt = `Write a viral TikTok/Reels script about "${idea}" in the ${niche} niche using the "${format}" format.

Requirements:
- Strong hook in first 2 seconds
- Keep under 60 seconds speaking time
- Include [VISUAL] cues for what to show on screen
- End with a strong CTA
- Make it feel authentic and engaging
- Add trending audio suggestions if relevant

Format the output clearly with sections: HOOK, BODY, CTA, and VISUAL NOTES.`;

    const { result, error } = await generateContent("script", prompt);
    setIsGenerating(false);

    if (error) {
      toast({ title: "Generation failed", description: error, variant: "destructive" });
      return;
    }

    if (result) {
      setScript(result);
      await saveToHistory(user.id, "script", idea, `TikTok: ${niche}, ${format}`, result);
    }
  };

  const copyScript = async () => {
    await navigator.clipboard.writeText(script + "\n\n— Made with PromptNova AI ✨");
    setCopied(true);
    toast({ title: "Script copied!" });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-heading text-foreground">TikTok Script Generator</h1>
        <span className="text-micro text-muted-foreground bg-secondary/50 px-3 py-1 rounded-lg">{usage}/{limit} today</span>
      </div>

      <div className="glass-card-highlight rounded-2xl p-6 space-y-5 mb-6">
        <div>
          <label className="text-caption font-medium text-foreground mb-2 block">Video idea</label>
          <input value={idea} onChange={(e) => setIdea(e.target.value)} placeholder="How I made $1000 in one week with AI..." className="w-full bg-secondary/30 border border-border/40 rounded-xl px-4 py-2.5 text-caption text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all" />
        </div>
        <div>
          <label className="text-caption font-medium text-foreground mb-2 block">Niche</label>
          <div className="flex flex-wrap gap-1.5">{niches.map((n) => <OptionButton key={n} selected={niche === n} onClick={() => setNiche(n)}>{n}</OptionButton>)}</div>
        </div>
        <div>
          <label className="text-caption font-medium text-foreground mb-2 block">Format</label>
          <div className="flex flex-wrap gap-1.5">{formats.map((f) => <OptionButton key={f} selected={format === f} onClick={() => setFormat(f)}>{f}</OptionButton>)}</div>
        </div>
        <button onClick={handleGenerate} disabled={isGenerating || !idea.trim()} className="w-full bg-foreground text-background font-medium py-2.5 rounded-xl hover:bg-foreground/90 transition-all text-caption disabled:opacity-30 flex items-center justify-center gap-2">
          {isGenerating ? <><Loader2 className="w-4 h-4 animate-spin" /> Writing script...</> : <><Sparkles className="w-4 h-4" /> Generate Script</>}
        </button>
      </div>

      {script && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-body-lg font-semibold text-foreground flex items-center gap-2">
              <Film className="w-4 h-4 text-primary" /> Your Script
            </h2>
            <div className="flex items-center gap-2">
              <ShareButton title={idea} toolType="tiktok-script" />
              <button onClick={copyScript} className="flex items-center gap-1.5 bg-secondary/50 text-foreground text-micro px-3 py-1.5 rounded-lg hover:bg-secondary transition-colors font-medium">
                {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
          </div>
          <div className="prose prose-invert prose-sm max-w-none">
            <pre className="whitespace-pre-wrap text-caption text-foreground/90 leading-relaxed bg-secondary/20 rounded-xl p-4 border border-border/20">{script}</pre>
          </div>
          <p className="text-[10px] text-muted-foreground/40 text-center mt-4">Made with PromptNova AI ✨</p>
        </motion.div>
      )}
    </div>
  );
};

export default TikTokScriptGenerator;
