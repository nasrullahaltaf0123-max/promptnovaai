import { motion } from "framer-motion";
import { MessageSquare, Image, ImageIcon, Palette, Video, Wand2, Film, Type } from "lucide-react";
import { Link } from "react-router-dom";
import { useI18n } from "@/lib/i18n";

const FeaturesSection = () => {
  const { t } = useI18n();

  const tools = [
    { icon: MessageSquare, title: "AI Chat", description: "Smart conversations powered by AI. Ask anything, get instant answers.", path: "/dashboard/chat", color: "from-primary/20 to-primary/5" },
    { icon: ImageIcon, title: "Thumbnail Generator", description: "Create viral YouTube thumbnails that get clicks and views.", path: "/dashboard/thumbnail", color: "from-accent/20 to-accent/5" },
    { icon: Palette, title: "Logo Generator", description: "Professional brand logos with AI-powered design intelligence.", path: "/dashboard/logo", color: "from-primary/15 to-accent/5" },
    { icon: Video, title: "Script Writer", description: "Engaging video scripts optimized for maximum retention.", path: "/dashboard/script", color: "from-accent/15 to-primary/5" },
    { icon: Image, title: "Image Generator", description: "Stunning AI images in any style — photorealistic to digital art.", path: "/dashboard/image", color: "from-primary/20 to-primary/5" },
    { icon: Wand2, title: "Prompt Generator", description: "Craft perfect AI prompts for any platform in seconds.", path: "/dashboard/prompt", color: "from-accent/20 to-accent/5" },
    { icon: Type, title: "Viral Captions", description: "Attention-grabbing captions for Instagram, TikTok, and more.", path: "/dashboard/caption", color: "from-primary/15 to-primary/5" },
    { icon: Film, title: "TikTok Scripts", description: "Hook-driven short video scripts designed to go viral.", path: "/dashboard/tiktok-script", color: "from-accent/15 to-accent/5" },
  ];

  return (
    <section id="features" className="py-28 sm:py-36 px-6 relative section-glow">
      <div className="absolute inset-0 pointer-events-none" style={{
        background: "radial-gradient(ellipse 70% 30% at 50% 0%, hsl(250 80% 65% / 0.05), transparent)"
      }} />

      <div className="max-w-5xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16"
        >
          <p className="text-micro font-semibold text-primary uppercase tracking-widest mb-3">POWERFUL AI TOOLS</p>
          <h2 className="text-heading sm:text-display text-foreground mb-5">Everything You Need to Create</h2>
          <p className="text-body-lg text-muted-foreground max-w-md mx-auto">8 AI-powered tools to generate content, visuals, and scripts — all in one platform.</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {tools.map((tool, i) => (
            <motion.div
              key={tool.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
            >
              <Link
                to={tool.path}
                className="group block glass-card hover-lift rounded-2xl p-5 h-full"
              >
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${tool.color} flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110`}>
                  <tool.icon className="w-5 h-5 text-foreground" />
                </div>
                <h3 className="text-body font-semibold text-foreground mb-1.5">{tool.title}</h3>
                <p className="text-micro text-muted-foreground leading-relaxed">{tool.description}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;