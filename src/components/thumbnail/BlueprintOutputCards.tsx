import { Copy, Check, Paintbrush, Sparkles, Palette, Type as TypeIcon, Shapes, SlidersHorizontal, Image as ImageIcon, User } from "lucide-react";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import type { BlueprintData, CharacterPrompt } from "@/pages/ThumbnailGenerator";

interface Props {
  blueprint: BlueprintData | null;
  characterPrompt: CharacterPrompt | null;
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    toast({ title: "Copied to clipboard" });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-all"
      title="Copy to clipboard"
    >
      {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
    </button>
  );
}

function BlueprintItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-1.5 text-[11px] font-semibold text-primary/80 uppercase tracking-wider">
        {icon}
        {label}
      </div>
      <p className="text-xs text-foreground/85 leading-relaxed pl-5">{value}</p>
    </div>
  );
}

export default function BlueprintOutputCards({ blueprint, characterPrompt }: Props) {
  if (!blueprint) return null;

  const blueprintText = [
    `🎨 BACKGROUND (BG):\n${blueprint.background}`,
    `✨ EFFECTS:\n${blueprint.effects}`,
    `🎨 COLOR PALETTE:\n${blueprint.colorPalette}`,
    `🔤 FONT:\n${blueprint.font}`,
    `📐 SHAPES:\n${blueprint.shapes}`,
    `🎛️ FILTERS & RETOUCHING:\n${blueprint.filters}`,
    blueprint.referenceIntegration ? `🖼️ REFERENCE INTEGRATION:\n${blueprint.referenceIntegration}` : "",
  ].filter(Boolean).join("\n\n");

  return (
    <div className="space-y-4">
      {/* Blueprint Card */}
      <div className="rounded-2xl border border-border/50 bg-card/60 backdrop-blur-sm p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-primary/15 flex items-center justify-center">
              <Paintbrush className="w-3.5 h-3.5 text-primary" />
            </div>
            <h3 className="text-sm font-semibold text-foreground">Thumbnail Blueprint</h3>
          </div>
          <CopyButton text={blueprintText} />
        </div>

        <div className="space-y-3.5">
          <BlueprintItem
            icon={<ImageIcon className="w-3 h-3" />}
            label="Background"
            value={blueprint.background}
          />
          <BlueprintItem
            icon={<Sparkles className="w-3 h-3" />}
            label="Effects"
            value={blueprint.effects}
          />
          <BlueprintItem
            icon={<Palette className="w-3 h-3" />}
            label="Color Palette"
            value={blueprint.colorPalette}
          />
          <BlueprintItem
            icon={<TypeIcon className="w-3 h-3" />}
            label="Font"
            value={blueprint.font}
          />
          <BlueprintItem
            icon={<Shapes className="w-3 h-3" />}
            label="Shapes"
            value={blueprint.shapes}
          />
          <BlueprintItem
            icon={<SlidersHorizontal className="w-3 h-3" />}
            label="Filters & Retouching"
            value={blueprint.filters}
          />
          {blueprint.referenceIntegration && (
            <BlueprintItem
              icon={<ImageIcon className="w-3 h-3" />}
              label="Reference Integration"
              value={blueprint.referenceIntegration}
            />
          )}
        </div>
      </div>

      {/* AI Character Prompt Card */}
      {characterPrompt && (
        <div className="rounded-2xl border border-border/50 bg-card/60 backdrop-blur-sm p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-accent/15 flex items-center justify-center">
                <User className="w-3.5 h-3.5 text-accent" />
              </div>
              <h3 className="text-sm font-semibold text-foreground">AI Character Prompt</h3>
            </div>
            <CopyButton text={characterPrompt.prompt} />
          </div>
          <p className="text-xs text-foreground/80 leading-relaxed bg-secondary/20 rounded-xl p-3 border border-border/20 font-mono">
            {characterPrompt.prompt}
          </p>
          <p className="text-[10px] text-muted-foreground mt-2">
            Ready to use with Midjourney, DALL-E, or Stable Diffusion
          </p>
        </div>
      )}
    </div>
  );
}
