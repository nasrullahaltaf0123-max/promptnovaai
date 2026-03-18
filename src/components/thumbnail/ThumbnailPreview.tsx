import { Download, ZoomIn, X, ImageIcon, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef } from "react";
import ThumbnailCanvas from "./ThumbnailCanvas";
import type { ThumbnailConfig } from "./types";

interface Props {
  config: ThumbnailConfig;
  isGenerating: boolean;
  error: string;
}

export default function ThumbnailPreview({ config, isGenerating, error }: Props) {
  const [preview, setPreview] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);
  const hasBackground = !!config.backgroundImage;
  const hasContent = hasBackground || config.title.trim();

  const downloadThumbnail = async () => {
    const el = document.getElementById("thumb-canvas-main");
    if (!el) return;
    try {
      const { default: html2canvas } = await import("html2canvas");
      const canvas = await html2canvas(el, {
        useCORS: true,
        scale: Math.max(2, config.platform.width / el.offsetWidth),
        backgroundColor: null,
        width: el.offsetWidth,
        height: el.offsetHeight,
      });
      // Resize to exact platform dimensions
      const out = document.createElement("canvas");
      out.width = config.platform.width;
      out.height = config.platform.height;
      const ctx = out.getContext("2d")!;
      ctx.drawImage(canvas, 0, 0, out.width, out.height);
      const link = document.createElement("a");
      link.href = out.toDataURL("image/png");
      link.download = `thumbnail-${config.platform.width}x${config.platform.height}.png`;
      link.click();
    } catch {
      // fallback
    }
  };

  return (
    <div className="glass-card rounded-2xl p-5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-medium text-foreground">Preview — {config.platform.label} ({config.platform.width}×{config.platform.height})</h3>
        {hasContent && !isGenerating && (
          <div className="flex gap-1.5">
            <button onClick={() => setPreview(true)} className="p-1.5 rounded-lg bg-secondary/50 text-muted-foreground hover:text-foreground transition-colors"><ZoomIn className="w-3.5 h-3.5" /></button>
            <button onClick={downloadThumbnail} className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-secondary/50 text-muted-foreground hover:text-foreground text-xs transition-colors"><Download className="w-3.5 h-3.5" /> Export PNG</button>
          </div>
        )}
      </div>

      <AnimatePresence mode="wait">
        {isGenerating && (
          <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center py-16 gap-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
              <Sparkles className="w-6 h-6 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            </div>
            <p className="text-xs text-muted-foreground">Creating cinematic background...</p>
            <div className="flex gap-1">{[0, 1, 2].map((i) => <motion.div key={i} className="w-2 h-2 rounded-full bg-primary/60" animate={{ scale: [1, 1.4, 1], opacity: [0.4, 1, 0.4] }} transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }} />)}</div>
          </motion.div>
        )}

        {!isGenerating && error && (
          <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center py-12">
            <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center mb-3"><ImageIcon className="w-6 h-6 text-destructive" /></div>
            <p className="text-xs text-muted-foreground">{error}</p>
          </motion.div>
        )}

        {!isGenerating && !error && (
          <motion.div key="canvas" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <ThumbnailCanvas config={config} id="thumb-canvas-main" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Fullscreen preview modal */}
      <AnimatePresence>
        {preview && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setPreview(false)}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="relative w-full max-w-5xl" onClick={(e) => e.stopPropagation()}>
              <button onClick={() => setPreview(false)} className="absolute -top-10 right-0 text-white/70 hover:text-white"><X className="w-6 h-6" /></button>
              <ThumbnailCanvas config={config} />
              <div className="absolute bottom-4 right-4">
                <button onClick={downloadThumbnail} className="flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-xl hover:bg-white/30 transition-colors text-sm">
                  <Download className="w-4 h-4" /> Export {config.platform.width}×{config.platform.height}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
