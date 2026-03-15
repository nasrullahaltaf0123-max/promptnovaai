import { motion } from "framer-motion";
import { MessageSquare, Image, FileText, Palette, Video, Wand2, Film, ImageIcon, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useI18n } from "@/lib/i18n";

const FeaturesSection = () => {
  const { t } = useI18n();

  const tools = [
    { icon: MessageSquare, title: t.toolChat, description: t.toolChatDesc, path: "/dashboard/chat", gradient: "from-violet-500/20 to-violet-500/5" },
    { icon: Image, title: t.toolImage, description: t.toolImageDesc, path: "/dashboard/image", gradient: "from-cyan-500/20 to-cyan-500/5" },
    { icon: FileText, title: t.toolBlog, description: t.toolBlogDesc, path: "/dashboard/blog", gradient: "from-blue-500/20 to-blue-500/5" },
    { icon: Palette, title: t.toolLogo, description: t.toolLogoDesc, path: "/dashboard/logo", gradient: "from-purple-500/20 to-purple-500/5" },
    { icon: Video, title: t.toolScript, description: t.toolScriptDesc, path: "/dashboard/script", gradient: "from-teal-500/20 to-teal-500/5" },
    { icon: Wand2, title: t.toolPrompt, description: t.toolPromptDesc, path: "/dashboard/prompt", gradient: "from-pink-500/20 to-pink-500/5" },
    { icon: Film, title: t.toolVideo, description: t.toolVideoDesc, path: "/dashboard/video-script", gradient: "from-orange-500/20 to-orange-500/5" },
    { icon: ImageIcon, title: t.toolThumbnail, description: t.toolThumbnailDesc, path: "/dashboard/thumbnail", gradient: "from-emerald-500/20 to-emerald-500/5" },
  ];

  return (
    <section id="features" className="py-32 sm:py-40 px-6 relative">
      <div className="absolute inset-0 pointer-events-none" style={{
        background: "radial-gradient(ellipse 80% 40% at 50% 0%, hsl(259 75% 62% / 0.03), transparent)"
      }} />

      <div className="max-w-5xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-20"
        >
          <p className="text-micro font-medium text-primary uppercase tracking-widest mb-4">{t.featuresLabel}</p>
          <h2 className="text-display text-foreground mb-5">{t.featuresTitle}</h2>
          <p className="text-subheading text-muted-foreground max-w-md mx-auto">{t.featuresSubtitle}</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
                className="group block glass-card-highlight rounded-2xl p-6 h-full transition-all duration-500 hover:glow-violet-sm hover:-translate-y-0.5"
              >
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${tool.gradient} flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110`}>
                  <tool.icon className="w-5 h-5 text-foreground" />
                </div>
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-body font-semibold text-foreground">{String(tool.title)}</h3>
                  <ArrowUpRight className="w-4 h-4 text-muted-foreground/30 group-hover:text-muted-foreground transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 flex-shrink-0" />
                </div>
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
