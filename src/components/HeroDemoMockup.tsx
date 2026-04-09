import { memo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Image, FileText, Video, Wand2, Check } from "lucide-react";

const ease = [0.16, 1, 0.3, 1] as const;

const tools = [
  { icon: Image, label: "Thumbnail", color: "hsl(var(--primary))" },
  { icon: FileText, label: "Blog Post", color: "hsl(var(--accent))" },
  { icon: Video, label: "Video Script", color: "hsl(var(--glow-violet))" },
  { icon: Sparkles, label: "Logo", color: "hsl(var(--primary))" },
  { icon: Wand2, label: "Caption", color: "hsl(var(--accent))" },
];

const mockOutputLines = [
  ["🎨 Generating eye-catching thumbnail...", "✅ Thumbnail ready — 1920×1080"],
  ["✍️ Writing engaging blog intro...", "✅ 800-word blog post generated"],
  ["🎬 Crafting viral video script...", "✅ Script with hooks & CTAs ready"],
  ["✨ Designing unique brand logo...", "✅ Logo with 4 variations ready"],
  ["💬 Generating viral captions...", "✅ 5 captions with hashtags ready"],
];

const HeroDemoMockup = memo(() => {
  const [activeToolIndex, setActiveToolIndex] = useState(0);
  const [phase, setPhase] = useState<"typing" | "generating" | "done">("typing");
  const [typedPrompt, setTypedPrompt] = useState("");

  const prompts = [
    "Make a thumbnail for my cooking vlog",
    "Write a blog about productivity tips",
    "Create a script for tech review video",
    "Design a logo for my coffee brand",
    "Write captions for my travel photos",
  ];

  const prompt = prompts[activeToolIndex];

  // Typing effect
  useEffect(() => {
    setPhase("typing");
    setTypedPrompt("");
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setTypedPrompt(prompt.slice(0, i));
      if (i >= prompt.length) {
        clearInterval(interval);
        setTimeout(() => setPhase("generating"), 600);
      }
    }, 45);
    return () => clearInterval(interval);
  }, [activeToolIndex, prompt]);

  // Generating → done
  useEffect(() => {
    if (phase === "generating") {
      const t = setTimeout(() => setPhase("done"), 2000);
      return () => clearTimeout(t);
    }
  }, [phase]);

  // Cycle tools
  useEffect(() => {
    if (phase === "done") {
      const t = setTimeout(() => {
        setActiveToolIndex((prev) => (prev + 1) % tools.length);
      }, 2500);
      return () => clearTimeout(t);
    }
  }, [phase]);

  const activeTool = tools[activeToolIndex];
  const Icon = activeTool.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8, duration: 0.8, ease }}
      className="relative max-w-2xl mx-auto"
    >
      {/* Glow behind mockup */}
      <div
        className="absolute -inset-4 rounded-3xl opacity-30 blur-2xl pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at 50% 50%, ${activeTool.color}, transparent 70%)`,
          transition: "background 0.8s ease",
        }}
      />

      {/* Browser frame */}
      <div className="relative rounded-2xl border border-border/60 overflow-hidden bg-card/80 backdrop-blur-sm shadow-2xl">
        {/* Title bar */}
        <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border/40 bg-secondary/50">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-destructive/60" />
            <div className="w-2.5 h-2.5 rounded-full bg-accent/40" />
            <div className="w-2.5 h-2.5 rounded-full bg-primary/30" />
          </div>
          <div className="flex-1 flex justify-center">
            <div className="px-3 py-0.5 rounded-md bg-muted/50 text-[10px] text-muted-foreground font-mono">
              promptnova.ai/dashboard
            </div>
          </div>
        </div>

        {/* Content area */}
        <div className="p-4 sm:p-5 space-y-3">
          {/* Tool selector pills */}
          <div className="flex gap-2">
            {tools.map((tool, i) => {
              const TIcon = tool.icon;
              return (
                <button
                  key={tool.label}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium transition-all duration-300 ${
                    i === activeToolIndex
                      ? "bg-primary/20 text-primary border border-primary/30"
                      : "bg-muted/30 text-muted-foreground border border-transparent"
                  }`}
                >
                  <TIcon className="w-3 h-3" />
                  {tool.label}
                </button>
              );
            })}
          </div>

          {/* Prompt input */}
          <div className="relative rounded-xl border border-border/50 bg-muted/20 px-4 py-3">
            <div className="flex items-center gap-2">
              <Wand2 className="w-3.5 h-3.5 text-muted-foreground/50 shrink-0" />
              <span className="text-xs text-foreground/80 font-mono">
                {typedPrompt}
                {phase === "typing" && (
                  <span
                    className="inline-block w-[1.5px] h-3 bg-primary ml-0.5 align-middle"
                    style={{ animation: "cursor-blink 1s steps(1) infinite" }}
                  />
                )}
              </span>
            </div>
          </div>

          {/* Output area */}
          <div className="rounded-xl border border-border/30 bg-muted/10 px-4 py-3 min-h-[60px]">
            <AnimatePresence mode="wait">
              {phase === "typing" && (
                <motion.div
                  key="idle"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.3 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-2 text-[11px] text-muted-foreground"
                >
                  <Sparkles className="w-3 h-3" />
                  Waiting for prompt...
                </motion.div>
              )}
              {phase === "generating" && (
                <motion.div
                  key="gen"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-2"
                >
                  <div className="flex items-center gap-2 text-[11px] text-primary">
                    <div className="w-3 h-3 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    {mockOutputLines[activeToolIndex][0]}
                  </div>
                  {/* Progress bar */}
                  <div className="h-1 rounded-full bg-muted/30 overflow-hidden">
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 1.8, ease: "easeInOut" }}
                    />
                  </div>
                </motion.div>
              )}
              {phase === "done" && (
                <motion.div
                  key="done"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-2 text-[11px] text-accent"
                >
                  <Check className="w-3.5 h-3.5" />
                  {mockOutputLines[activeToolIndex][1]}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  );
});

HeroDemoMockup.displayName = "HeroDemoMockup";
export default HeroDemoMockup;
