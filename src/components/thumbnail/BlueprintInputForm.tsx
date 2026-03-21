import { CloudUpload, Sparkles, Loader2, X, Type, Film } from "lucide-react";
import type { StyleOption } from "@/pages/ThumbnailGenerator";

interface Props {
  title: string;
  subtitle: string;
  style: StyleOption;
  referenceImage: string | null;
  autoCharacter: boolean;
  isGenerating: boolean;
  usage: number;
  limit: number;
  isAdmin?: boolean;
  onTitleChange: (v: string) => void;
  onSubtitleChange: (v: string) => void;
  onStyleChange: (v: StyleOption) => void;
  onReferenceUpload: (file: File) => void;
  onReferenceRemove: () => void;
  onAutoCharacterToggle: (v: boolean) => void;
  onGenerate: () => void;
}

export default function BlueprintInputForm({
  title, subtitle, style, referenceImage, autoCharacter,
  isGenerating, usage, limit, isAdmin,
  onTitleChange, onSubtitleChange, onStyleChange,
  onReferenceUpload, onReferenceRemove, onAutoCharacterToggle, onGenerate,
}: Props) {
  return (
    <div className="rounded-2xl border border-border/50 bg-card/60 backdrop-blur-sm p-5 space-y-4">
      {/* Title Input */}
      <div>
        <label className="text-xs font-medium text-foreground mb-1.5 flex items-center gap-1.5">
          <Type className="w-3.5 h-3.5 text-muted-foreground" />
          Main Thumbnail Title
          <span className="text-muted-foreground font-normal">(Max 3-5 words)</span>
        </label>
        <input
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder="ইরানে কি হলো? / What happened?"
          className="w-full bg-secondary/30 border border-border/40 rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
        />
      </div>

      {/* Subtitle Input */}
      <div>
        <label className="text-xs font-medium text-foreground mb-1.5 block">
          Subtitle / Video Context
        </label>
        <input
          value={subtitle}
          onChange={(e) => onSubtitleChange(e.target.value)}
          placeholder="Optional context for better AI results..."
          className="w-full bg-secondary/30 border border-border/40 rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
        />
      </div>

      {/* Style Dropdown */}
      <div>
        <label className="text-xs font-medium text-foreground mb-1.5 flex items-center gap-1.5">
          <Film className="w-3.5 h-3.5 text-muted-foreground" />
          Select Style
        </label>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => onStyleChange("documentary")}
            className={`px-3 py-2.5 rounded-xl text-xs font-medium transition-all duration-200 border ${
              style === "documentary"
                ? "bg-primary/15 border-primary/40 text-primary"
                : "bg-secondary/30 border-border/30 text-muted-foreground hover:text-foreground hover:border-border/60"
            }`}
          >
            🎬 Geopolitical / Documentary
          </button>
          <button
            onClick={() => onStyleChange("marketing")}
            className={`px-3 py-2.5 rounded-xl text-xs font-medium transition-all duration-200 border ${
              style === "marketing"
                ? "bg-primary/15 border-primary/40 text-primary"
                : "bg-secondary/30 border-border/30 text-muted-foreground hover:text-foreground hover:border-border/60"
            }`}
          >
            🔥 High-Energy Marketing
          </button>
        </div>
      </div>

      {/* Image Upload */}
      <div>
        <label className="text-xs font-medium text-foreground mb-1.5 block">
          Upload Reference Photo
          <span className="text-muted-foreground font-normal ml-1">(Optional)</span>
        </label>
        {!referenceImage ? (
          <label className="flex flex-col items-center justify-center gap-2 cursor-pointer border-2 border-dashed border-border/50 rounded-xl px-4 py-6 text-muted-foreground hover:border-primary/30 hover:text-foreground hover:bg-secondary/20 transition-all">
            <CloudUpload className="w-8 h-8 opacity-40" />
            <span className="text-xs text-center">
              Drag & drop or click to upload<br />
              <span className="text-[10px] opacity-60">For color/composition extraction</span>
            </span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => { if (e.target.files?.[0]) onReferenceUpload(e.target.files[0]); }}
            />
          </label>
        ) : (
          <div className="relative rounded-xl overflow-hidden border border-border/30">
            <img src={referenceImage} alt="Reference" className="w-full h-28 object-cover" />
            <button
              onClick={onReferenceRemove}
              className="absolute top-2 right-2 p-1 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Auto Character Toggle */}
      <div
        onClick={() => onAutoCharacterToggle(!autoCharacter)}
        className={`flex items-center justify-between px-4 py-3 rounded-xl cursor-pointer transition-all border ${
          autoCharacter
            ? "bg-primary/10 border-primary/30"
            : "bg-secondary/20 border-border/30"
        }`}
      >
        <div>
          <p className="text-xs font-medium text-foreground">Auto-Generate AI Character Prompt</p>
          <p className="text-[10px] text-muted-foreground mt-0.5">Creates a text-to-image prompt for the perfect thumbnail subject</p>
        </div>
        <div className={`w-10 h-5 rounded-full transition-all relative ${autoCharacter ? "bg-primary" : "bg-muted"}`}>
          <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${autoCharacter ? "left-[22px]" : "left-0.5"}`} />
        </div>
      </div>

      {/* Generate Button */}
      <button
        onClick={onGenerate}
        disabled={isGenerating || !title.trim()}
        className="w-full font-bold py-3.5 rounded-xl text-sm transition-all duration-200 disabled:opacity-30 flex items-center justify-center gap-2"
        style={{
          background: "linear-gradient(135deg, hsl(45, 100%, 55%) 0%, hsl(25, 100%, 55%) 100%)",
          color: "#1a1a1a",
        }}
      >
        {isGenerating ? (
          <><Loader2 className="w-4 h-4 animate-spin" /> Generating Blueprint...</>
        ) : (
          <><Sparkles className="w-4 h-4" /> Generate Blueprint</>
        )}
      </button>

      {!isAdmin && (
        <p className="text-center text-[11px] text-muted-foreground">{usage}/{limit} generations today</p>
      )}
    </div>
  );
}
