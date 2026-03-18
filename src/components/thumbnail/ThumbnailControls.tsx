import { Upload, Type, Sparkles, Loader2 } from "lucide-react";
import { PLATFORMS, FONT_PRESETS, TEXT_COLORS, type ThumbnailConfig, type Platform, type FontPreset, type TextColor, type TextPosition } from "./types";

interface Props {
  config: ThumbnailConfig;
  onChange: (partial: Partial<ThumbnailConfig>) => void;
  onGenerate: () => void;
  onSubjectUpload: (file: File) => void;
  isGenerating: boolean;
  usage: number;
  limit: number;
}

const Chip = ({ selected, onClick, children }: { selected: boolean; onClick: () => void; children: React.ReactNode }) => (
  <button onClick={onClick} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${selected ? "bg-foreground text-background" : "bg-secondary/50 text-muted-foreground hover:text-foreground hover:bg-secondary"}`}>
    {children}
  </button>
);

const positions: { value: TextPosition; label: string }[] = [
  { value: "left", label: "Left" },
  { value: "center", label: "Center" },
  { value: "bottom-left", label: "Bottom Left" },
];

export default function ThumbnailControls({ config, onChange, onGenerate, onSubjectUpload, isGenerating, usage, limit }: Props) {
  return (
    <div className="glass-card-highlight rounded-2xl p-5 space-y-4 overflow-y-auto max-h-[80vh]">
      {/* Platform */}
      <Section label="Platform">
        <div className="grid grid-cols-2 gap-1.5">
          {PLATFORMS.map((p) => (
            <Chip key={p.label} selected={config.platform.label === p.label} onClick={() => onChange({ platform: p })}>
              {p.icon} {p.label}
              <span className="block text-[10px] opacity-60">{p.width}×{p.height}</span>
            </Chip>
          ))}
        </div>
      </Section>

      {/* Title */}
      <Section label="Title Text" icon={<Type className="w-3.5 h-3.5 inline mr-1 opacity-60" />}>
        <input value={config.title} onChange={(e) => onChange({ title: e.target.value })} placeholder="বাংলা বা English টাইটেল..." className="w-full bg-secondary/30 border border-border/40 rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/20" />
      </Section>

      {/* Subtitle */}
      <Section label="Subtitle">
        <input value={config.subtitle} onChange={(e) => onChange({ subtitle: e.target.value })} placeholder="Optional subtitle..." className="w-full bg-secondary/30 border border-border/40 rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/20" />
      </Section>

      {/* Font */}
      <Section label="Font">
        <div className="flex flex-wrap gap-1.5">
          {(Object.entries(FONT_PRESETS) as [FontPreset, typeof FONT_PRESETS["siyam"]][]).map(([key, f]) => (
            <Chip key={key} selected={config.fontPreset === key} onClick={() => onChange({ fontPreset: key })}>{f.label}</Chip>
          ))}
        </div>
      </Section>

      {/* Text Color */}
      <Section label="Text Color">
        <div className="flex flex-wrap gap-1.5">
          {(Object.entries(TEXT_COLORS) as [TextColor, typeof TEXT_COLORS["yellow"]][]).map(([key, c]) => (
            <Chip key={key} selected={config.textColor === key} onClick={() => onChange({ textColor: key })}>{c.label}</Chip>
          ))}
        </div>
      </Section>

      {/* Text Position */}
      <Section label="Text Position">
        <div className="flex flex-wrap gap-1.5">
          {positions.map((p) => (
            <Chip key={p.value} selected={config.textPosition === p.value} onClick={() => onChange({ textPosition: p.value })}>{p.label}</Chip>
          ))}
        </div>
      </Section>

      {/* Toggles */}
      <div className="flex gap-3">
        <Toggle label="Glow" checked={config.enableGlow} onChange={(v) => onChange({ enableGlow: v })} />
        <Toggle label="Stroke" checked={config.enableStroke} onChange={(v) => onChange({ enableStroke: v })} />
      </div>

      {/* Subject Upload */}
      <Section label="Subject Image">
        <label className="flex items-center gap-2 cursor-pointer bg-secondary/30 border border-border/40 rounded-xl px-4 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-all">
          <Upload className="w-4 h-4" />
          {config.subjectImage ? "Change Image" : "Upload Face / Subject"}
          <input type="file" accept="image/*" className="hidden" onChange={(e) => { if (e.target.files?.[0]) onSubjectUpload(e.target.files[0]); }} />
        </label>
        {config.subjectImage && (
          <div className="mt-2 space-y-2">
            <div className="flex items-center gap-2">
              <img src={config.subjectImage} alt="Subject" className="w-12 h-12 rounded-lg object-cover border border-border/30" />
              <button onClick={() => onChange({ subjectImage: null })} className="text-xs text-destructive hover:underline">Remove</button>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Size</span>
              <input type="range" min={30} max={100} value={config.subjectScale} onChange={(e) => onChange({ subjectScale: Number(e.target.value) })} className="flex-1 accent-primary" />
              <span className="text-xs text-muted-foreground w-8">{config.subjectScale}%</span>
            </div>
          </div>
        )}
      </Section>

      {/* Generate */}
      <button onClick={onGenerate} disabled={isGenerating || !config.title.trim()} className="w-full bg-foreground text-background font-semibold py-3 rounded-xl hover:bg-foreground/90 transition-all duration-200 text-sm disabled:opacity-30 flex items-center justify-center gap-2">
        {isGenerating ? <><Loader2 className="w-4 h-4 animate-spin" /> Generating...</> : <><Sparkles className="w-4 h-4" /> Generate Thumbnail</>}
      </button>
      <p className="text-center text-xs text-muted-foreground">{usage}/{limit} today</p>
    </div>
  );
}

function Section({ label, icon, children }: { label: string; icon?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-xs font-medium text-foreground mb-1.5 block">{icon}{label}</label>
      {children}
    </div>
  );
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button onClick={() => onChange(!checked)} className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all ${checked ? "bg-primary/20 text-primary border border-primary/30" : "bg-secondary/30 text-muted-foreground border border-border/30"}`}>
      <div className={`w-3 h-3 rounded-full border-2 transition-all ${checked ? "bg-primary border-primary" : "border-muted-foreground/40"}`} />
      {label}
    </button>
  );
}
