import { useState } from "react";
import { Image as ImageIcon, Download, Loader2 } from "lucide-react";

const thumbnailStyles = ["YouTube", "Blog Header", "Social Media", "Podcast Cover", "Course Thumbnail"];
const colorSchemes = ["Vibrant", "Dark & Bold", "Minimal", "Gradient", "Neon"];

const OptionButton = ({ selected, onClick, children }: { selected: boolean; onClick: () => void; children: React.ReactNode }) => (
  <button onClick={onClick} className={`px-3 py-1.5 rounded-lg text-micro font-medium transition-all duration-200 ${selected ? "bg-foreground text-background" : "bg-secondary/50 text-muted-foreground hover:text-foreground hover:bg-secondary"}`}>{children}</button>
);

const ThumbnailGenerator = () => {
  const [title, setTitle] = useState("");
  const [style, setStyle] = useState(thumbnailStyles[0]);
  const [colorScheme, setColorScheme] = useState(colorSchemes[0]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);

  const handleGenerate = () => {
    if (!title.trim()) return;
    setIsGenerating(true);
    setTimeout(() => { setIsGenerating(false); setGenerated(true); }, 2000);
  };

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-heading text-foreground mb-6">Thumbnail Generator</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="glass-card-highlight rounded-2xl p-6 space-y-5">
          <div>
            <label className="text-caption font-medium text-foreground mb-2 block">Thumbnail title / topic</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Enter your video or blog title..." className="w-full bg-secondary/30 border border-border/40 rounded-xl px-4 py-2.5 text-caption text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all" />
          </div>
          <div>
            <label className="text-caption font-medium text-foreground mb-2 block">Style</label>
            <div className="flex flex-wrap gap-1.5">{thumbnailStyles.map((s) => <OptionButton key={s} selected={style === s} onClick={() => setStyle(s)}>{s}</OptionButton>)}</div>
          </div>
          <div>
            <label className="text-caption font-medium text-foreground mb-2 block">Color scheme</label>
            <div className="flex flex-wrap gap-1.5">{colorSchemes.map((c) => <OptionButton key={c} selected={colorScheme === c} onClick={() => setColorScheme(c)}>{c}</OptionButton>)}</div>
          </div>
          <button onClick={handleGenerate} disabled={isGenerating || !title.trim()} className="w-full bg-foreground text-background font-medium py-2.5 rounded-xl hover:bg-foreground/90 transition-all duration-200 text-caption disabled:opacity-30 flex items-center justify-center gap-2">
            {isGenerating ? <><Loader2 className="w-4 h-4 animate-spin" /> Generating...</> : "Generate thumbnails"}
          </button>
        </div>
        <div className="glass-card rounded-2xl p-6">
          <h3 className="text-caption font-medium text-foreground mb-4">Output</h3>
          {generated ? (
            <div className="grid grid-cols-2 gap-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="relative group aspect-video rounded-xl bg-gradient-to-br from-primary/10 via-secondary to-accent/10 flex items-center justify-center overflow-hidden border border-border/20">
                  <div className="text-center p-3">
                    <ImageIcon className="w-6 h-6 text-muted-foreground/30 mx-auto mb-1" />
                    <span className="text-micro text-foreground/50 line-clamp-2">{title}</span>
                  </div>
                  <div className="absolute inset-0 bg-background/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
                    <button className="bg-foreground text-background p-2.5 rounded-xl"><Download className="w-4 h-4" /></button>
                  </div>
                </div>
              ))}
            </div>
          ) : isGenerating ? (
            <div className="grid grid-cols-2 gap-3">{[1, 2, 3, 4].map((i) => <div key={i} className="aspect-video rounded-xl shimmer" />)}</div>
          ) : (
            <div className="aspect-video rounded-xl bg-secondary/20 border border-border/20 flex items-center justify-center">
              <div className="text-center"><ImageIcon className="w-10 h-10 text-muted-foreground/15 mx-auto mb-3" /><p className="text-micro text-muted-foreground/40">Your thumbnails will appear here</p></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ThumbnailGenerator;
