import { useState } from "react";
import { Palette, Download, Loader2 } from "lucide-react";

const industries = ["Technology", "Food & Beverage", "Fashion", "Healthcare", "Education", "Finance"];
const logoStyles = ["Minimal", "Abstract", "Lettermark", "Emblem", "Mascot", "Wordmark"];

const OptionButton = ({ selected, onClick, children }: { selected: boolean; onClick: () => void; children: React.ReactNode }) => (
  <button onClick={onClick} className={`px-3 py-1.5 rounded-lg text-micro font-medium transition-all duration-200 ${selected ? "bg-foreground text-background" : "bg-secondary/50 text-muted-foreground hover:text-foreground hover:bg-secondary"}`}>{children}</button>
);

const LogoGenerator = () => {
  const [brandName, setBrandName] = useState("");
  const [industry, setIndustry] = useState(industries[0]);
  const [logoStyle, setLogoStyle] = useState(logoStyles[0]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);

  const handleGenerate = () => {
    if (!brandName.trim()) return;
    setIsGenerating(true);
    setTimeout(() => { setIsGenerating(false); setGenerated(true); }, 2000);
  };

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-heading text-foreground mb-6">Logo Generator</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="glass-card-highlight rounded-2xl p-6 space-y-5">
          <div>
            <label className="text-caption font-medium text-foreground mb-2 block">Brand name</label>
            <input value={brandName} onChange={(e) => setBrandName(e.target.value)} placeholder="Enter your brand name" className="w-full bg-secondary/30 border border-border/40 rounded-xl px-4 py-2.5 text-caption text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all" />
          </div>
          <div>
            <label className="text-caption font-medium text-foreground mb-2 block">Industry</label>
            <div className="flex flex-wrap gap-1.5">{industries.map((ind) => <OptionButton key={ind} selected={industry === ind} onClick={() => setIndustry(ind)}>{ind}</OptionButton>)}</div>
          </div>
          <div>
            <label className="text-caption font-medium text-foreground mb-2 block">Style</label>
            <div className="flex flex-wrap gap-1.5">{logoStyles.map((ls) => <OptionButton key={ls} selected={logoStyle === ls} onClick={() => setLogoStyle(ls)}>{ls}</OptionButton>)}</div>
          </div>
          <button onClick={handleGenerate} disabled={isGenerating || !brandName.trim()} className="w-full bg-foreground text-background font-medium py-2.5 rounded-xl hover:bg-foreground/90 transition-all duration-200 text-caption disabled:opacity-30 flex items-center justify-center gap-2">
            {isGenerating ? <><Loader2 className="w-4 h-4 animate-spin" /> Designing...</> : "Generate logos"}
          </button>
        </div>
        <div className="glass-card rounded-2xl p-6">
          <h3 className="text-caption font-medium text-foreground mb-4">Concepts</h3>
          {generated ? (
            <div className="grid grid-cols-2 gap-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="relative group aspect-square rounded-xl bg-gradient-to-br from-primary/5 to-accent/5 flex items-center justify-center overflow-hidden border border-border/20">
                  <div className="text-center"><Palette className="w-7 h-7 text-primary/40 mx-auto mb-1.5" /><span className="text-micro font-semibold text-foreground/60">{brandName}</span></div>
                  <div className="absolute inset-0 bg-background/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center"><button className="bg-foreground text-background p-2.5 rounded-xl"><Download className="w-4 h-4" /></button></div>
                </div>
              ))}
            </div>
          ) : isGenerating ? (
            <div className="grid grid-cols-2 gap-3">{[1, 2, 3, 4].map((i) => <div key={i} className="aspect-square rounded-xl shimmer" />)}</div>
          ) : (
            <div className="aspect-square rounded-xl bg-secondary/20 border border-border/20 flex items-center justify-center"><div className="text-center"><Palette className="w-10 h-10 text-muted-foreground/15 mx-auto mb-3" /><p className="text-micro text-muted-foreground/40">Your logos will appear here</p></div></div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LogoGenerator;
