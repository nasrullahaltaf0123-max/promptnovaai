import { motion } from "framer-motion";
import { MessageSquare, Image, FileText, Palette, Video, Wand2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useI18n } from "@/lib/i18n";

const FeaturesSection = () => {
  const { t } = useI18n();

  const tools = [
    { icon: MessageSquare, title: t.toolChat, description: t.toolChatDesc, path: "/dashboard/chat", color: "from-primary/20 to-primary/5" },
    { icon: Image, title: t.toolImage, description: t.toolImageDesc, path: "/dashboard/image", color: "from-accent/20 to-accent/5" },
    { icon: FileText, title: t.toolBlog, description: t.toolBlogDesc, path: "/dashboard/blog", color: "from-primary/15 to-accent/5" },
    { icon: Palette, title: t.toolLogo, description: t.toolLogoDesc, path: "/dashboard/logo", color: "from-accent/15 to-primary/5" },
    { icon: Video, title: t.toolScript, description: t.toolScriptDesc, path: "/dashboard/script", color: "from-primary/20 to-primary/5" },
    { icon: Wand2, title: t.toolPrompt, description: t.toolPromptDesc, path: "/dashboard/prompt", color: "from-accent/20 to-accent/5" },
  ];

  return (
    <section id="features" className="py-24 sm:py-32 px-6 relative">
      <div className="absolute inset-0 pointer-events-none" style={{
        background: "radial-gradient(ellipse 70% 30% at 50% 0%, hsl(250 80% 65% / 0.04), transparent)"
      }} />

      <div className="max-w-5xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16"
        >
          <p className="text-micro font-semibold text-primary uppercase tracking-widest mb-3">{t.featuresLabel}</p>
          <h2 className="text-heading sm:text-display text-foreground mb-4">{t.featuresTitle}</h2>
          <p className="text-body-lg text-muted-foreground max-w-md mx-auto">{t.featuresSubtitle}</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {tools.map((tool, i) => (
            <motion.div
              key={String(tool.title)}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
            >
              <Link
                to={tool.path}
                className="group block glass-card rounded-2xl p-6 h-full transition-all duration-500 hover:glow-violet-sm hover:-translate-y-1"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${tool.color} flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110`}>
                  <tool.icon className="w-5 h-5 text-foreground" />
                </div>
                <h3 className="text-body-lg font-semibold text-foreground mb-2">{String(tool.title)}</h3>
                <p className="text-caption text-muted-foreground leading-relaxed">{String(tool.description)}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
