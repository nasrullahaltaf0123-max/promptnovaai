import { Upload, Type, Sparkles, Loader2, Image as ImageIcon, Zap, Palette, Paintbrush, Frame, Eye, Wand2, Languages, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import {
  PLATFORMS, FONT_PRESETS, TEXT_COLORS, TEXT_EFFECTS, SHAPE_OVERLAYS, FONT_STYLES, IMAGE_BORDERS,
  type ThumbnailConfig, type FontPreset, type TextColor,
  type TextPosition, type TextEffect, type ShapeOverlay, type FontStyle,
  type ImageBorder, type TextStyleOption, type BgMode, type ColorStyle,
  detectTopicFromTitle, TOPIC_THEMES, isBanglaText, getAutoConfig,
} from "./types";

interface Props {
  config: ThumbnailConfig;
  onChange: (partial: Partial<ThumbnailConfig>) => void;
  onGenerate: () => void;
  onSubjectUpload: (file: File) => void;
  onBgUpload: (file: File) => void;
  isGenerating: boolean;
  usage: number;
  limit: number;
  isAdmin?: boolean;
  headlines?: string[];
  isLoadingHeadlines?: boolean;
  onSelectHeadline?: (headline: string) => void;
}

const Chip = ({ selected, onClick, children }: { selected: boolean; onClick: () => void; children: React.ReactNode }) => (
  <button onClick={onClick} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${selected ? "bg-primary text-primary-foreground shadow-md" : "bg-secondary/50 text-muted-foreground hover:text-foreground hover:bg-secondary"}`}>
    {children}
  </button>
);

const positions: { value: TextPosition; label: string }[] = [
  { value: "left", label: "Left" },
  { value: "center", label: "Center" },
  { value: "bottom-left", label: "Bottom Left" },
];

export default function ThumbnailControls({ config, onChange, onGenerate, onSubjectUpload, onBgUpload, isGenerating, usage, limit, isAdmin, headlines, isLoadingHeadlines, onSelectHeadline }: Props) {
  const topic = detectTopicFromTitle(config.title);
  const theme = TOPIC_THEMES[topic] || TOPIC_THEMES.default;
  const bangla = isBanglaText(config.title);

  const toggleTextStyle = (style: TextStyleOption) => {
    const current = config.textStyles;
    if (current.includes(style)) {
      onChange({ textStyles: current.filter((s) => s !== style) });
    } else {
      onChange({ textStyles: [...current, style] });
    }
  };

  const handleAiAutoToggle = (on: boolean) => {
    onChange({ aiAutoMode: on });
    if (on && config.title.trim()) {
      onChange({ ...getAutoConfig(config.title), aiAutoMode: true });
    }
  };

  // When title changes in AI auto mode, auto-update styles
  const handleTitleChange = (title: string) => {
    if (config.aiAutoMode && title.trim()) {
      onChange({ title, ...getAutoConfig(title) });
    } else {
      onChange({ title });
    }
  };

  const banglaFonts = (Object.entries(FONT_PRESETS) as [FontPreset, typeof FONT_PRESETS["siyam"]][]).filter(([, f]) => f.group === "bangla");
  const englishFonts = (Object.entries(FONT_PRESETS) as [FontPreset, typeof FONT_PRESETS["siyam"]][]).filter(([, f]) => f.group === "english");

  return (
    <div className="glass-card-highlight rounded-2xl p-5 space-y-1 overflow-y-auto max-h-[80vh]">
      {/* AI Auto Mode - Master Toggle */}
      <div className="flex items-center justify-between p-3 rounded-xl bg-primary/10 border border-primary/20 mb-2">
        <div className="flex items-center gap-2">
          <Wand2 className="w-4 h-4 text-primary" />
          <div>
            <span className="text-xs font-semibold text-foreground">🤖 AI Auto Mode</span>
            <p className="text-[10px] text-muted-foreground">Auto font, color, effects by topic</p>
          </div>
        </div>
        <Switch checked={config.aiAutoMode} onCheckedChange={handleAiAutoToggle} />
      </div>

      {/* Topic indicator */}
      {config.title.trim() && (
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-secondary/30 border border-border/30">
          <div className="w-3 h-3 rounded-full" style={{ background: theme.textColor }} />
          <span className="text-xs text-muted-foreground">Topic: <strong className="text-foreground capitalize">{topic}</strong></span>
          {bangla && <span className="text-[10px] bg-primary/20 text-primary px-1.5 py-0.5 rounded-md ml-auto">বাংলা</span>}
          {!bangla && config.title.trim() && <span className="text-[10px] bg-secondary/50 text-muted-foreground px-1.5 py-0.5 rounded-md ml-auto">EN</span>}
        </div>
      )}

      {/* Platform */}
      <CollapsibleSection label="Platform" defaultOpen>
        <div className="grid grid-cols-2 gap-1.5">
          {PLATFORMS.map((p) => (
            <Chip key={p.label} selected={config.platform.label === p.label} onClick={() => onChange({ platform: p })}>
              {p.icon} {p.label}
              <span className="block text-[10px] opacity-60">{p.width}×{p.height}</span>
            </Chip>
          ))}
        </div>
      </CollapsibleSection>

      {/* Title */}
      <CollapsibleSection label="✏️ Text" defaultOpen>
        <div className="space-y-3">
          <div>
            <label className="text-[10px] text-muted-foreground mb-1 block">Title</label>
            <input value={config.title} onChange={(e) => handleTitleChange(e.target.value)} placeholder="বাংলা বা English টাইটেল..." className="w-full bg-secondary/30 border border-border/40 rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/20" />
          </div>
          <div>
            <label className="text-[10px] text-muted-foreground mb-1 block">Subtitle</label>
            <input value={config.subtitle} onChange={(e) => onChange({ subtitle: e.target.value })} placeholder="Optional subtitle..." className="w-full bg-secondary/30 border border-border/40 rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/20" />
          </div>
        </div>
      </CollapsibleSection>

      {/* Headline Suggestions */}
      {headlines && headlines.length > 0 && (
        <CollapsibleSection label="🔥 AI Headlines" defaultOpen>
          <div className="space-y-1.5">
            {headlines.map((h, i) => (
              <button key={i} onClick={() => onSelectHeadline?.(h)}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 border ${
                  config.title === h ? "bg-primary/20 border-primary/40 text-primary" : "bg-secondary/30 border-border/30 text-foreground hover:bg-secondary/50 hover:border-primary/20"
                }`}>
                {h}
              </button>
            ))}
          </div>
        </CollapsibleSection>
      )}
      {isLoadingHeadlines && (
        <div className="flex items-center gap-2 text-xs text-muted-foreground px-1">
          <Loader2 className="w-3 h-3 animate-spin" /> Generating headlines...
        </div>
      )}

      {/* Font Section */}
      <CollapsibleSection label="🔤 Font & Style" icon={<Paintbrush className="w-3.5 h-3.5" />}>
        <div className="space-y-3">
          {/* Font Style */}
          <div>
            <label className="text-[10px] text-muted-foreground mb-1 block">Style</label>
            <div className="flex flex-wrap gap-1.5">
              {(Object.entries(FONT_STYLES) as [FontStyle, typeof FONT_STYLES["bold"]][]).map(([key, f]) => (
                <Chip key={key} selected={config.fontStyle === key} onClick={() => onChange({ fontStyle: key })}>{f.label}</Chip>
              ))}
            </div>
          </div>

          {/* Font Family - Bangla */}
          <div>
            <label className="text-[10px] text-muted-foreground mb-1 flex items-center gap-1 block">
              <Languages className="w-3 h-3" /> Bangla Fonts
            </label>
            <div className="flex flex-wrap gap-1.5">
              {banglaFonts.map(([key, f]) => (
                <Chip key={key} selected={config.fontPreset === key} onClick={() => onChange({ fontPreset: key })}>{f.label}</Chip>
              ))}
            </div>
          </div>

          {/* Font Family - English */}
          <div>
            <label className="text-[10px] text-muted-foreground mb-1 block">English Fonts</label>
            <div className="flex flex-wrap gap-1.5">
              {englishFonts.map(([key, f]) => (
                <Chip key={key} selected={config.fontPreset === key} onClick={() => onChange({ fontPreset: key })}>{f.label}</Chip>
              ))}
            </div>
          </div>

          {/* Text Size */}
          <div>
            <label className="text-[10px] text-muted-foreground mb-1 block">Size — {config.textSize}%</label>
            <Slider min={60} max={150} step={5} value={[config.textSize]} onValueChange={([v]) => onChange({ textSize: v })} />
          </div>

          {/* Text Position */}
          <div>
            <label className="text-[10px] text-muted-foreground mb-1 block">Position</label>
            <div className="flex flex-wrap gap-1.5">
              {positions.map((p) => (
                <Chip key={p.value} selected={config.textPosition === p.value} onClick={() => onChange({ textPosition: p.value })}>{p.label}</Chip>
              ))}
            </div>
          </div>
        </div>
      </CollapsibleSection>

      {/* Color Section */}
      <CollapsibleSection label="🎨 Color" icon={<Palette className="w-3.5 h-3.5" />}>
        <div className="space-y-3">
          {/* Color Mode */}
          <div className="flex gap-2">
            <Chip selected={config.colorStyle === "auto"} onClick={() => onChange({ colorStyle: "auto" })}>🤖 Auto (Topic)</Chip>
            <Chip selected={config.colorStyle === "custom"} onClick={() => onChange({ colorStyle: "custom" })}>🎨 Custom</Chip>
          </div>
          {config.colorStyle === "custom" && (
            <div className="flex items-center gap-2">
              <input type="color" value={config.customColor} onChange={(e) => onChange({ customColor: e.target.value })} className="w-8 h-8 rounded-lg border border-border/40 cursor-pointer" />
              <span className="text-xs text-muted-foreground">{config.customColor}</span>
            </div>
          )}

          {/* Color Presets */}
          <div>
            <label className="text-[10px] text-muted-foreground mb-1 block">Presets</label>
            <div className="grid grid-cols-2 gap-1.5">
              {(Object.entries(TEXT_COLORS) as [TextColor, typeof TEXT_COLORS["yellow"]][]).map(([key, c]) => (
                <Chip key={key} selected={config.textColor === key} onClick={() => onChange({ textColor: key })}>
                  <span className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ background: c.hex }} />
                    {c.label}
                  </span>
                </Chip>
              ))}
            </div>
          </div>
        </div>
      </CollapsibleSection>

      {/* Effects Section */}
      <CollapsibleSection label="✨ Effects" icon={<Eye className="w-3.5 h-3.5" />}>
        <div className="space-y-3">
          {/* Text Effect */}
          <div>
            <label className="text-[10px] text-muted-foreground mb-1 block">Text Effect</label>
            <div className="flex flex-wrap gap-1.5">
              {(Object.entries(TEXT_EFFECTS) as [TextEffect, { label: string }][]).map(([key, e]) => (
                <Chip key={key} selected={config.textEffect === key} onClick={() => onChange({ textEffect: key })}>{e.label}</Chip>
              ))}
            </div>
          </div>

          {/* Text Styles */}
          <div>
            <label className="text-[10px] text-muted-foreground mb-1 block">Text Styles</label>
            <div className="flex flex-wrap gap-1.5">
              {(["stroke", "shadow", "glow"] as TextStyleOption[]).map((s) => (
                <Chip key={s} selected={config.textStyles.includes(s)} onClick={() => toggleTextStyle(s)}>
                  {s === "stroke" ? "🖊️ Stroke" : s === "shadow" ? "🌑 Shadow" : "💫 Glow"}
                </Chip>
              ))}
            </div>
          </div>

          {/* Legacy toggles */}
          <div className="flex gap-3">
            <Toggle label="Glow" checked={config.enableGlow} onChange={(v) => onChange({ enableGlow: v })} />
            <Toggle label="Stroke" checked={config.enableStroke} onChange={(v) => onChange({ enableStroke: v })} />
          </div>

          {/* Shape Overlay */}
          <div>
            <label className="text-[10px] text-muted-foreground mb-1 block">Shape Overlay</label>
            <div className="flex flex-wrap gap-1.5">
              {(Object.entries(SHAPE_OVERLAYS) as [ShapeOverlay, { label: string }][]).map(([key, s]) => (
                <Chip key={key} selected={config.shapeOverlay === key} onClick={() => onChange({ shapeOverlay: key })}>{s.label}</Chip>
              ))}
            </div>
          </div>
        </div>
      </CollapsibleSection>

      {/* Image Section */}
      <CollapsibleSection label="🖼️ Image" icon={<ImageIcon className="w-3.5 h-3.5" />}>
        <div className="space-y-3">
          {/* Background Mode */}
          <div>
            <label className="text-[10px] text-muted-foreground mb-1 block">Background</label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {(["ai", "solid", "gradient", "upload"] as BgMode[]).map((m) => (
                <Chip key={m} selected={config.bgMode === m} onClick={() => onChange({ bgMode: m })}>
                  {m === "ai" ? "🤖 AI" : m === "solid" ? "🎨 Solid" : m === "gradient" ? "🌈 Gradient" : "📁 Upload"}
                </Chip>
              ))}
            </div>
            {config.bgMode === "solid" && (
              <div className="flex items-center gap-2">
                <input type="color" value={config.bgSolidColor} onChange={(e) => onChange({ bgSolidColor: e.target.value })} className="w-8 h-8 rounded-lg border border-border/40 cursor-pointer" />
                <span className="text-xs text-muted-foreground">{config.bgSolidColor}</span>
              </div>
            )}
            {config.bgMode === "gradient" && (
              <div className="flex items-center gap-2">
                <input type="color" value={config.bgGradient1} onChange={(e) => onChange({ bgGradient1: e.target.value })} className="w-8 h-8 rounded-lg border border-border/40 cursor-pointer" />
                <span className="text-xs text-muted-foreground">→</span>
                <input type="color" value={config.bgGradient2} onChange={(e) => onChange({ bgGradient2: e.target.value })} className="w-8 h-8 rounded-lg border border-border/40 cursor-pointer" />
              </div>
            )}
            {config.bgMode === "upload" && (
              <label className="flex items-center gap-2 cursor-pointer bg-secondary/30 border border-border/40 rounded-xl px-4 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-all">
                <Upload className="w-4 h-4" />
                {config.backgroundImage ? "Change BG" : "Upload Background"}
                <input type="file" accept="image/*" className="hidden" onChange={(e) => { if (e.target.files?.[0]) onBgUpload(e.target.files[0]); }} />
              </label>
            )}
            {(config.bgMode === "ai" || config.bgMode === "upload") && config.backgroundImage && (
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs text-muted-foreground w-8">Blur</span>
                <Slider min={0} max={20} step={1} value={[config.backgroundBlur]} onValueChange={([v]) => onChange({ backgroundBlur: v })} />
                <span className="text-xs text-muted-foreground w-8">{config.backgroundBlur}px</span>
              </div>
            )}
            {config.backgroundImage && (
              <button onClick={() => onChange({ backgroundImage: null })} className="text-xs text-destructive mt-1 hover:underline">Clear background</button>
            )}
          </div>

          {/* Subject Upload */}
          <div>
            <label className="text-[10px] text-muted-foreground mb-1 block">Subject Image</label>
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
                  <button onClick={() => onChange({ subjectFlip: !config.subjectFlip })} className={`text-xs px-2 py-1 rounded-lg transition-all ${config.subjectFlip ? "bg-primary/20 text-primary" : "bg-secondary/50 text-muted-foreground"}`}>
                    Flip ↔
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground w-8">Size</span>
                  <Slider min={30} max={100} step={1} value={[config.subjectScale]} onValueChange={([v]) => onChange({ subjectScale: v })} />
                  <span className="text-xs text-muted-foreground w-8">{config.subjectScale}%</span>
                </div>
              </div>
            )}
          </div>

          {/* Auto Remove BG */}
          <div className="flex items-center justify-between px-1">
            <div>
              <span className="text-xs font-medium text-foreground">Auto Remove BG</span>
              <p className="text-[10px] text-muted-foreground">Remove on upload</p>
            </div>
            <Switch checked={config.autoRemoveBg} onCheckedChange={(v) => onChange({ autoRemoveBg: v })} />
          </div>

          {/* Remove BG Effect */}
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-medium text-foreground">Remove BG Effect</span>
            <Switch checked={config.removeBg} onCheckedChange={(v) => onChange({ removeBg: v })} />
          </div>

          {/* Image Border */}
          <div>
            <label className="text-[10px] text-muted-foreground mb-1 block">Border</label>
            <div className="flex flex-wrap gap-1.5">
              {(Object.entries(IMAGE_BORDERS) as [ImageBorder, { label: string }][]).map(([key, b]) => (
                <Chip key={key} selected={config.imageBorder === key} onClick={() => onChange({ imageBorder: key })}>{b.label}</Chip>
              ))}
            </div>
          </div>
        </div>
      </CollapsibleSection>

      {/* Generate */}
      <button onClick={onGenerate} disabled={isGenerating || !config.title.trim()} className="w-full bg-gradient-to-r from-primary to-accent text-primary-foreground font-semibold py-3 rounded-xl hover:brightness-110 hover:scale-[1.02] transition-all duration-200 text-sm disabled:opacity-30 flex items-center justify-center gap-2 shadow-lg shadow-primary/20">
        {isGenerating ? <><Loader2 className="w-4 h-4 animate-spin" /> Generating...</> : <><Sparkles className="w-4 h-4" /> Generate AI Thumbnail</>}
      </button>
      {!isAdmin && <p className="text-center text-xs text-muted-foreground">{usage}/{limit} today</p>}
    </div>
  );
}

function CollapsibleSection({ label, icon, children, defaultOpen = false }: { label: string; icon?: React.ReactNode; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border border-border/20 rounded-xl overflow-hidden">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between px-3 py-2.5 text-xs font-medium text-foreground hover:bg-secondary/30 transition-colors">
        <span className="flex items-center gap-1.5">{icon}{label}</span>
        {open ? <ChevronUp className="w-3.5 h-3.5 text-muted-foreground" /> : <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />}
      </button>
      {open && <div className="px-3 pb-3">{children}</div>}
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
