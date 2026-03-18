import { useState, useEffect } from "react";
import { Download, Loader2, ImageIcon, Sparkles, X, ZoomIn, Type } from "lucide-react";
import ShareButton from "@/components/ShareButton";
import { useAuth } from "@/lib/auth";
import { generateContent } from "@/lib/ai";
import { incrementUsage, getDailyUsage, getLimit, saveToHistory } from "@/lib/usage";
import { toast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";

const thumbnailStyles = ["YouTube", "Blog Header", "Social Media", "Podcast Cover", "Course Thumbnail"];
const colorSchemes = ["Vibrant", "Dark & Bold", "Minimal", "Gradient", "Neon"];
const textGradients = [
  { label: "Yellow → White", class: "thumb-gradient-yellow" },
  { label: "Cyan → White", class: "thumb-gradient-cyan" },
  { label: "Neon Purple", class: "thumb-gradient-neon" },
  { label: "Pure White", class: "" },
];

function isBangla(text: string): boolean {
  return /[\u0980-\u09FF]/.test(text);
}

const OptionButton = ({ selected, onClick, children }: { selected: boolean; onClick: () => void; children: React.ReactNode }) => (
  <button onClick={onClick} className={`px-3 py-1.5 rounded-lg text-micro font-medium transition-all duration-200 ${selected ? "bg-foreground text-background" : "bg-secondary/50 text-muted-foreground hover:text-foreground hover:bg-secondary"}`}>{children}</button>
);

const ThumbnailGenerator = () => {
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [style, setStyle] = useState(thumbnailStyles[0]);
  const [colorScheme, setColorScheme] = useState(colorSchemes[0]);
  const [textGradient, setTextGradient] = useState(textGradients[0]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [usage, setUsage] = useState(0);
  const limit = getLimit("image");

  useEffect(() => {
    if (user) getDailyUsage(user.id, "image").then(setUsage);
  }, [user]);

  const bangla = isBangla(title) || isBangla(subtitle);

  const handleGenerate = async () => {
    if (!title.trim() || !user) return;
    if (usage >= limit) {
      toast({ title: "Daily limit reached", variant: "destructive" });
      return;
    }
    setIsGenerating(true);
    setError("");
    setImages([]);

    const ok = await incrementUsage(user.id, "image");
    if (!ok) { setIsGenerating(false); toast({ title: "Limit reached", variant: "destructive" }); return; }
    setUsage((u) => u + 1);

    // Pass a simplified prompt — text will be overlaid via HTML
    const { images: generated, error: genError } = await generateContent("thumbnail", title, { style, colorScheme });
    setIsGenerating(false);

    if (genError) {
      setError(genError);
      toast({ title: "Generation failed", description: genError, variant: "destructive" });
      return;
    }

    if (generated && generated.length > 0) {
      setImages(generated);
      await saveToHistory(user.id, "image", title, `Thumbnail: ${style}, ${colorScheme}`, `[${generated.length} thumbnail(s) generated]`);
    } else {
      setError("No thumbnails were generated. Try a different title.");
    }
  };

  const downloadThumbnail = (index: number) => {
    const container = document.getElementById(`thumb-composite-${index}`);
    if (!container) return;
    // Use canvas to composite
    import("html2canvas").then(({ default: html2canvas }) => {
      html2canvas(container, { useCORS: true, scale: 2, backgroundColor: null }).then((canvas) => {
        const link = document.createElement("a");
        link.href = canvas.toDataURL("image/png");
        link.download = `promptnova-thumbnail-${index + 1}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      });
    }).catch(() => {
      // Fallback: download just the image
      const img = images[index];
      if (img) {
        const link = document.createElement("a");
        link.href = img;
        link.download = `promptnova-thumbnail-${index + 1}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    });
  };

  const titleClass = bangla ? "thumb-title-bn" : "thumb-title-en";
  const subtitleClass = bangla ? "thumb-subtitle-bn" : "thumb-subtitle-en";

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-heading text-foreground">Thumbnail Generator</h1>
        <span className="text-micro text-muted-foreground bg-secondary/50 px-3 py-1 rounded-lg">{usage}/{limit} today</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Controls */}
        <div className="glass-card-highlight rounded-2xl p-6 space-y-4">
          <div>
            <label className="text-caption font-medium text-foreground mb-2 block">
              <Type className="w-3.5 h-3.5 inline mr-1.5 opacity-60" />
              Title text (shown on thumbnail)
            </label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Enter title — English or বাংলা..." className="w-full bg-secondary/30 border border-border/40 rounded-xl px-4 py-2.5 text-caption text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all" />
          </div>
          <div>
            <label className="text-caption font-medium text-foreground mb-2 block">Subtitle (optional)</label>
            <input value={subtitle} onChange={(e) => setSubtitle(e.target.value)} placeholder="Add a subtitle..." className="w-full bg-secondary/30 border border-border/40 rounded-xl px-4 py-2.5 text-caption text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all" />
          </div>
          <div>
            <label className="text-caption font-medium text-foreground mb-2 block">Style</label>
            <div className="flex flex-wrap gap-1.5">{thumbnailStyles.map((s) => <OptionButton key={s} selected={style === s} onClick={() => setStyle(s)}>{s}</OptionButton>)}</div>
          </div>
          <div>
            <label className="text-caption font-medium text-foreground mb-2 block">Color scheme</label>
            <div className="flex flex-wrap gap-1.5">{colorSchemes.map((c) => <OptionButton key={c} selected={colorScheme === c} onClick={() => setColorScheme(c)}>{c}</OptionButton>)}</div>
          </div>
          <div>
            <label className="text-caption font-medium text-foreground mb-2 block">Text color</label>
            <div className="flex flex-wrap gap-1.5">{textGradients.map((g) => <OptionButton key={g.label} selected={textGradient.label === g.label} onClick={() => setTextGradient(g)}>{g.label}</OptionButton>)}</div>
          </div>
          <button onClick={handleGenerate} disabled={isGenerating || !title.trim()} className="w-full bg-foreground text-background font-medium py-2.5 rounded-xl hover:bg-foreground/90 transition-all duration-200 text-caption disabled:opacity-30 flex items-center justify-center gap-2">
            {isGenerating ? <><Loader2 className="w-4 h-4 animate-spin" /> Generating...</> : <><Sparkles className="w-4 h-4" /> Generate Thumbnails</>}
          </button>
        </div>

        {/* Output */}
        <div className="glass-card rounded-2xl p-6">
          <h3 className="text-caption font-medium text-foreground mb-4">Output</h3>
          <AnimatePresence mode="wait">
            {isGenerating && (
              <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center py-12 gap-4">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
                  <Sparkles className="w-6 h-6 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                </div>
                <p className="text-caption text-muted-foreground">Crafting your thumbnails...</p>
                <div className="flex gap-1">
                  {[0, 1, 2].map((i) => (
                    <motion.div key={i} className="w-2 h-2 rounded-full bg-primary/60" animate={{ scale: [1, 1.4, 1], opacity: [0.4, 1, 0.4] }} transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }} />
                  ))}
                </div>
              </motion.div>
            )}

            {!isGenerating && error && (
              <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center py-10">
                <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center mb-3">
                  <ImageIcon className="w-6 h-6 text-destructive" />
                </div>
                <p className="text-caption text-muted-foreground">{error}</p>
              </motion.div>
            )}

            {!isGenerating && !error && images.length > 0 && (
              <motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
                {images.map((img, i) => (
                  <motion.div key={i} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 }}>
                    {/* Composite thumbnail with text overlay */}
                    <div
                      id={`thumb-composite-${i}`}
                      className="group relative aspect-video rounded-xl overflow-hidden border border-border/20"
                    >
                      {/* Background image */}
                      <img src={img} alt={`Thumbnail ${i + 1}`} className="w-full h-full object-cover" crossOrigin="anonymous" />

                      {/* Readability overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent pointer-events-none" />
                      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-transparent pointer-events-none" />

                      {/* Text overlay */}
                      <div className="absolute inset-0 flex flex-col items-center justify-center p-4 pointer-events-none select-none">
                        <h2 className={`${titleClass} ${textGradient.class} text-2xl sm:text-3xl lg:text-4xl text-center text-white max-w-[90%] drop-shadow-2xl`}>
                          {title}
                        </h2>
                        {subtitle && (
                          <p className={`${subtitleClass} text-sm sm:text-base lg:text-lg text-center text-white/90 mt-2 max-w-[80%]`}>
                            {subtitle}
                          </p>
                        )}
                      </div>

                      {/* Hover actions */}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-between p-3 pointer-events-auto">
                        <button onClick={() => setPreviewImage(img)} className="bg-white/20 backdrop-blur-sm text-white p-1.5 rounded-lg hover:bg-white/30 transition-colors">
                          <ZoomIn className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => downloadThumbnail(i)} className="flex items-center gap-1 bg-white/20 backdrop-blur-sm text-white text-micro px-2.5 py-1.5 rounded-lg hover:bg-white/30 transition-colors">
                          <Download className="w-3.5 h-3.5" /> Download
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {!isGenerating && !error && images.length === 0 && (
              <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="aspect-video rounded-xl bg-secondary/20 border border-border/20 flex items-center justify-center">
                <div className="text-center"><ImageIcon className="w-10 h-10 text-muted-foreground/15 mx-auto mb-3" /><p className="text-micro text-muted-foreground/40">Your thumbnails will appear here</p></div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Preview Modal */}
      <AnimatePresence>
        {previewImage && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setPreviewImage(null)}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="relative max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
              <button onClick={() => setPreviewImage(null)} className="absolute -top-10 right-0 text-white/70 hover:text-white transition-colors">
                <X className="w-6 h-6" />
              </button>
              <div className="relative aspect-video rounded-2xl overflow-hidden">
                <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-transparent" />
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 select-none">
                  <h2 className={`${titleClass} ${textGradient.class} text-4xl sm:text-5xl lg:text-6xl text-center text-white drop-shadow-2xl`}>
                    {title}
                  </h2>
                  {subtitle && (
                    <p className={`${subtitleClass} text-lg sm:text-xl lg:text-2xl text-center text-white/90 mt-3`}>
                      {subtitle}
                    </p>
                  )}
                </div>
              </div>
              <div className="absolute bottom-4 right-4">
                <button onClick={() => downloadThumbnail(0)} className="flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-xl hover:bg-white/30 transition-colors">
                  <Download className="w-4 h-4" /> Download
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ThumbnailGenerator;
