import { memo } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Image,
  FileText,
  Video,
  Film,
  FileCode,
  Sparkles,
  MessageSquare,
  Camera,
  Palette,
  Scissors,
  Wand2,
  ArrowRight,
} from "lucide-react";

// Each tool gets a unique idle animation type
type IconAnim = "float" | "pulse" | "rotate" | "wiggle" | "bounce" | "breathe" | "tilt" | "morph";

const iconAnimations: Record<IconAnim, { [key: string]: number[] | { duration: number; repeat: number; ease: string; repeatDelay?: number } }> = {
  float: {
    y: [0, -3, 0],
    transition: { duration: 3, repeat: Infinity, ease: "easeInOut" },
  },
  pulse: {
    scale: [1, 1.12, 1],
    transition: { duration: 2.5, repeat: Infinity, ease: "easeInOut" },
  },
  rotate: {
    rotate: [0, 8, -8, 0],
    transition: { duration: 4, repeat: Infinity, ease: "easeInOut" },
  },
  wiggle: {
    rotate: [0, -6, 6, -3, 0],
    transition: { duration: 2, repeat: Infinity, ease: "easeInOut", repeatDelay: 1 },
  },
  bounce: {
    y: [0, -4, 0],
    transition: { duration: 1.6, repeat: Infinity, ease: "easeInOut", repeatDelay: 0.8 },
  },
  breathe: {
    scale: [1, 1.08, 1],
    opacity: [0.85, 1, 0.85],
    transition: { duration: 3.5, repeat: Infinity, ease: "easeInOut" },
  },
  tilt: {
    rotate: [0, 12, 0],
    transition: { duration: 3, repeat: Infinity, ease: "easeInOut" },
  },
  morph: {
    scale: [1, 1.1, 0.95, 1],
    rotate: [0, 5, -5, 0],
    transition: { duration: 3, repeat: Infinity, ease: "easeInOut" },
  },
};

const tools = [
  {
    icon: Image,
    title: "Thumbnail Generator",
    desc: "Eye-catching YouTube thumbnails that boost your CTR instantly.",
    to: "/thumbnail-generator",
    gradient: "from-primary/20 to-primary/5",
    iconColor: "text-primary",
    accentBorder: "group-hover:border-primary/40",
    glowColor: "hsl(var(--primary) / 0.25)",
    anim: "float" as IconAnim,
  },
  {
    icon: FileText,
    title: "Blog Writer",
    desc: "SEO-optimized blog posts written in seconds, not hours.",
    to: "/blog-writer",
    gradient: "from-accent/20 to-accent/5",
    iconColor: "text-accent",
    accentBorder: "group-hover:border-accent/40",
    glowColor: "hsl(var(--accent) / 0.25)",
    anim: "wiggle" as IconAnim,
  },
  {
    icon: Video,
    title: "Video Script",
    desc: "Viral-ready scripts with hooks, structure & CTAs built in.",
    to: "/video-script-writer",
    gradient: "from-primary/15 to-accent/10",
    iconColor: "text-primary",
    accentBorder: "group-hover:border-primary/40",
    glowColor: "hsl(var(--primary) / 0.2)",
    anim: "pulse" as IconAnim,
  },
  {
    icon: MessageSquare,
    title: "Caption Generator",
    desc: "Scroll-stopping captions with trending hashtags for any platform.",
    to: "/caption-generator",
    gradient: "from-accent/20 to-primary/5",
    iconColor: "text-accent",
    accentBorder: "group-hover:border-accent/40",
    glowColor: "hsl(var(--accent) / 0.2)",
    anim: "bounce" as IconAnim,
  },
  {
    icon: Sparkles,
    title: "Logo Generator",
    desc: "Professional brand logos with multiple variations in one click.",
    to: "/logo-generator",
    gradient: "from-primary/20 to-accent/10",
    iconColor: "text-primary",
    accentBorder: "group-hover:border-primary/40",
    glowColor: "hsl(var(--primary) / 0.25)",
    anim: "morph" as IconAnim,
  },
  {
    icon: Camera,
    title: "Photo Maker",
    desc: "Studio-quality headshots and portraits — no photographer needed.",
    to: "/photo-maker",
    gradient: "from-accent/15 to-primary/5",
    iconColor: "text-accent",
    accentBorder: "group-hover:border-accent/40",
    glowColor: "hsl(var(--accent) / 0.2)",
    anim: "rotate" as IconAnim,
  },
  {
    icon: Palette,
    title: "Hair Design AI",
    desc: "Try new hairstyles and colors virtually before committing.",
    to: "/hair-design-ai",
    gradient: "from-primary/15 to-accent/5",
    iconColor: "text-primary",
    accentBorder: "group-hover:border-primary/40",
    glowColor: "hsl(var(--primary) / 0.2)",
    anim: "breathe" as IconAnim,
  },
  {
    icon: Wand2,
    title: "AI Chat",
    desc: "Your creative co-pilot — brainstorm, refine & create anything.",
    to: "/ai-chat",
    gradient: "from-accent/20 to-primary/10",
    iconColor: "text-accent",
    accentBorder: "group-hover:border-accent/40",
    glowColor: "hsl(var(--accent) / 0.25)",
    anim: "tilt" as IconAnim,
  },
  {
    icon: Film,
    title: "Prompt to Video",
    desc: "Transform ideas into detailed AI video prompts for Runway, Sora & more.",
    to: "/prompt-to-video",
    gradient: "from-primary/20 to-accent/15",
    iconColor: "text-primary",
    accentBorder: "group-hover:border-primary/40",
    glowColor: "hsl(var(--primary) / 0.25)",
    anim: "float" as IconAnim,
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const },
  },
};

const ToolShowcase = memo(() => {
  return (
    <section className="relative py-20 sm:py-28 overflow-hidden">
      {/* Ambient glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] pointer-events-none opacity-20 blur-3xl"
        style={{
          background:
            "radial-gradient(ellipse, hsl(var(--primary) / 0.4), transparent 70%)",
        }}
      />

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14 sm:mb-16"
        >
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-4 border border-primary/20">
            <Sparkles className="w-3 h-3" />
            AI-Powered Suite
          </span>
          <h2 className="text-heading sm:text-display font-bold text-foreground mb-3">
            Every Tool You Need
          </h2>
          <p className="text-body text-muted-foreground max-w-lg mx-auto">
            One platform, unlimited creativity. Pick a tool and start creating in seconds.
          </p>
        </motion.div>

        {/* Tool grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5"
        >
          {tools.map((tool) => {
            const Icon = tool.icon;
            return (
              <motion.div key={tool.title} variants={cardVariants}>
                <Link
                  to={tool.to}
                  className={`group relative flex flex-col p-5 sm:p-6 rounded-2xl border border-border/40 ${tool.accentBorder} bg-card/60 backdrop-blur-sm transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 h-full`}
                >
                  {/* Gradient bg on hover */}
                  <div
                    className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${tool.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`}
                  />

                  {/* Icon with unique animation */}
                  <div className="relative z-10 mb-4">
                    <div className="relative inline-flex items-center justify-center w-11 h-11 rounded-xl bg-muted/40 group-hover:bg-muted/60 transition-colors duration-300">
                      {/* Glow ring behind icon */}
                      <div
                        className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                        style={{
                          boxShadow: `0 0 16px 2px ${tool.glowColor}, inset 0 0 8px 1px ${tool.glowColor}`,
                        }}
                      />
                      <motion.div
                        animate={iconAnimations[tool.anim] as any}
                        className="flex items-center justify-center"
                      >
                        <Icon
                          className={`w-5 h-5 ${tool.iconColor}`}
                        />
                      </motion.div>
                    </div>
                  </div>

                  {/* Text */}
                  <h3 className="relative z-10 text-body font-semibold text-foreground mb-1.5 group-hover:text-foreground transition-colors">
                    {tool.title}
                  </h3>
                  <p className="relative z-10 text-caption text-muted-foreground leading-relaxed mb-4 flex-1">
                    {tool.desc}
                  </p>

                  {/* Arrow indicator */}
                  <div className="relative z-10 flex items-center gap-1 text-xs font-medium text-muted-foreground/50 group-hover:text-primary transition-colors duration-300">
                    Try it free
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform duration-200" />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
});

ToolShowcase.displayName = "ToolShowcase";
export default ToolShowcase;
