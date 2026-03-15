import { useState } from "react";
import { Image as ImageIcon, Download, Loader2 } from "lucide-react";

const styles = ["Photorealistic", "Digital Art", "Anime", "Oil Painting", "Watercolor", "3D Render"];
const resolutions = ["512×512", "768×768", "1024×1024"];

const OptionButton = ({ selected, onClick, children }: { selected: boolean; onClick: () => void; children: React.ReactNode }) => (
  <button
    onClick={onClick}
    className={`px-3 py-1.5 rounded-lg text-micro font-medium transition-all duration-200 ${
      selected ? "bg-foreground text-background" : "bg-secondary/50 text-muted-foreground hover:text-foreground hover:bg-secondary"
    }`}
  >
    {children}
  </button>
);

const ImageGenerator = () => {
  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState(styles[0]);
  const [resolution, setResolution] = useState(resolutions[0]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);

  const handleGenerate = () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    setTimeout(() => { setIsGenerating(false); setGenerated(true); }, 2000);
  };

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-heading text-foreground mb-6">Image Generator</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="glass-card-highlight rounded-2xl p-6 space-y-5">
          <div>
            <label className="text-caption font-medium text-foreground mb-2 block">Prompt</label>
            <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="Describe the image you want to create..." rows={4} className="w-full bg-secondary/30 border border-border/40 rounded-xl px-4 py-3 text-caption text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none" />
          </div>
          <div>
            <label className="text-caption font-medium text-foreground mb-2 block">Style</label>
            <div className="flex flex-wrap gap-1.5">{styles.map((s) => <OptionButton key={s} selected={style === s} onClick={() => setStyle(s)}>{s}</OptionButton>)}</div>
          </div>
          <div>
            <label className="text-caption font-medium text-foreground mb-2 block">Resolution</label>
            <div className="flex gap-1.5">{resolutions.map((r) => <OptionButton key={r} selected={resolution === r} onClick={() => setResolution(r)}>{r}</OptionButton>)}</div>
          </div>
          <button onClick={handleGenerate} disabled={isGenerating || !prompt.trim()} className="w-full bg-foreground text-background font-medium py-2.5 rounded-xl hover:bg-foreground/90 transition-all duration-200 text-caption disabled:opacity-30 flex items-center justify-center gap-2">
            {isGenerating ? <><Loader2 className="w-4 h-4 animate-spin" /> Generating...</> : "Generate images"}
          </button>
        </div>

        <div className="glass-card rounded-2xl p-6">
          <h3 className="text-caption font-medium text-foreground mb-4">Output</h3>
          {generated ? (
            <div className="grid grid-cols-2 gap-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="relative group aspect-square rounded-xl bg-gradient-to-br from-primary/10 via-secondary to-accent/10 flex items-center justify-center overflow-hidden border border-border/20">
                  <ImageIcon className="w-8 h-8 text-muted-foreground/30" />
                  <div className="absolute inset-0 bg-background/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
                    <button className="bg-foreground text-background p-2.5 rounded-xl"><Download className="w-4 h-4" /></button>
                  </div>
                </div>
              ))}
            </div>
          ) : isGenerating ? (
            <div className="grid grid-cols-2 gap-3">{[1, 2, 3, 4].map((i) => <div key={i} className="aspect-square rounded-xl shimmer" />)}</div>
          ) : (
            <div className="aspect-square rounded-xl bg-secondary/20 border border-border/20 flex items-center justify-center">
              <div className="text-center"><ImageIcon className="w-10 h-10 text-muted-foreground/20 mx-auto mb-3" /><p className="text-micro text-muted-foreground/50">Your images will appear here</p></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageGenerator;
