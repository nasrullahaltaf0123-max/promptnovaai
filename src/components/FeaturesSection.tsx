import { motion } from "framer-motion";
import { MessageSquare, Image, FileText, Palette, Video, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";

const tools = [
  { icon: MessageSquare, title: "AI Chat", description: "Intelligent conversations with context-aware responses.", path: "/dashboard/chat", gradient: "from-violet-500/20 to-violet-500/5" },
  { icon: Image, title: "Image Generator", description: "Generate stunning visuals from natural language.", path: "/dashboard/image", gradient: "from-cyan-500/20 to-cyan-500/5" },
  { icon: FileText, title: "Blog Writer", description: "SEO-optimized articles with perfect structure.", path: "/dashboard/blog", gradient: "from-blue-500/20 to-blue-500/5" },
  { icon: Palette, title: "Logo Generator", description: "Professional brand logos in seconds.", path: "/dashboard/logo", gradient: "from-purple-500/20 to-purple-500/5" },
  { icon: Video, title: "Script Generator", description: "Engaging video scripts for any platform.", path: "/dashboard/script", gradient: "from-teal-500/20 to-teal-500/5" },
];

const FeaturesSection = () => {
  return (
    <section id="features" className="py-32 sm:py-40 px-6 relative">
      {/* Ambient background */}
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
          <p className="text-micro font-medium text-primary uppercase tracking-widest mb-4">Tools</p>
          <h2 className="text-display text-foreground mb-5">
            Everything you need
          </h2>
          <p className="text-subheading text-muted-foreground max-w-md mx-auto">
            Five powerful AI tools, one seamless workspace.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {tools.map((tool, i) => (
            <motion.div
              key={tool.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
            >
              <Link
                to={tool.path}
                className="group block glass-card-highlight rounded-2xl p-6 h-full transition-all duration-500 hover:glow-violet-sm hover:-translate-y-0.5"
              >
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${tool.gradient} flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110`}>
                  <tool.icon className="w-5 h-5 text-foreground" />
                </div>
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-body-lg font-semibold text-foreground">{tool.title}</h3>
                  <ArrowUpRight className="w-4 h-4 text-muted-foreground/30 group-hover:text-muted-foreground transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
                <p className="text-caption text-muted-foreground leading-relaxed">{tool.description}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
