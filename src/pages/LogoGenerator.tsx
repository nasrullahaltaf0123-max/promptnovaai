import { useState } from "react";
import { Palette, Download, Loader2 } from "lucide-react";

const industries = ["Technology", "Food & Beverage", "Fashion", "Healthcare", "Education", "Finance"];
const logoStyles = ["Minimal", "Abstract", "Lettermark", "Emblem", "Mascot", "Wordmark"];

const LogoGenerator = () => {
  const [brandName, setBrandName] = useState("");
  const [industry, setIndustry] = useState(industries[0]);
  const [logoStyle, setLogoStyle] = useState(logoStyles[0]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);

  const handleGenerate = () => {
    if (!brandName.trim()) return;
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setGenerated(true);
    }, 2000);
  };

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold tracking-tighter text-foreground mb-6">AI Logo Generator</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass rounded-2xl p-6 space-y-5">
          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">Brand Name</label>
            <input value={brandName} onChange={(e) => setBrandName(e.target.value)} placeholder="Enter your brand name..." className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all" />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">Industry</label>
            <div className="flex flex-wrap gap-2">
              {industries.map((ind) => (
                <button key={ind} onClick={() => setIndustry(ind)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${industry === ind ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"}`}>{ind}</button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">Logo Style</label>
            <div className="flex flex-wrap gap-2">
              {logoStyles.map((ls) => (
                <button key={ls} onClick={() => setLogoStyle(ls)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${logoStyle === ls ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"}`}>{ls}</button>
              ))}
            </div>
          </div>
          <button onClick={handleGenerate} disabled={isGenerating || !brandName.trim()} className="w-full bg-gradient-to-r from-primary to-accent text-primary-foreground font-semibold py-2.5 rounded-xl hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 text-sm disabled:opacity-50 flex items-center justify-center gap-2">
            {isGenerating ? <><Loader2 className="w-4 h-4 animate-spin" /> Designing...</> : "Generate Logos"}
          </button>
        </div>

        <div className="glass rounded-2xl p-6">
          <h3 className="text-sm font-medium text-foreground mb-4">Logo Concepts</h3>
          {generated ? (
            <div className="grid grid-cols-2 gap-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="relative group aspect-square rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center overflow-hidden border border-border/30">
                  <div className="text-center">
                    <Palette className="w-8 h-8 text-primary mx-auto mb-1" />
                    <span className="text-xs font-semibold text-foreground">{brandName}</span>
                  </div>
                  <div className="absolute inset-0 bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button className="bg-primary text-primary-foreground p-2 rounded-lg"><Download className="w-4 h-4" /></button>
                  </div>
                </div>
              ))}
            </div>
          ) : isGenerating ? (
            <div className="grid grid-cols-2 gap-3">
              {[1, 2, 3, 4].map((i) => <div key={i} className="aspect-square rounded-xl shimmer" />)}
            </div>
          ) : (
            <div className="aspect-square rounded-xl bg-secondary/30 flex items-center justify-center">
              <div className="text-center">
                <Palette className="w-10 h-10 text-muted-foreground/30 mx-auto mb-2" />
                <p className="text-xs text-muted-foreground">Your logos will appear here</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LogoGenerator;
