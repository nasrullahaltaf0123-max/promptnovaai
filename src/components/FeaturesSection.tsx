import { motion } from "framer-motion";
import { MessageSquare, Image, FileText, Palette, Video } from "lucide-react";

const tools = [
  { icon: MessageSquare, title: "AI Chat", description: "Have intelligent conversations and get instant answers to any question.", color: "from-primary to-primary/60" },
  { icon: Image, title: "AI Image Generator", description: "Generate stunning visuals from text descriptions in seconds.", color: "from-accent to-accent/60" },
  { icon: FileText, title: "AI Blog Writer", description: "Create SEO-optimized blog articles with perfect structure.", color: "from-primary to-accent" },
  { icon: Palette, title: "AI Logo Generator", description: "Design professional brand logos with AI-powered creativity.", color: "from-accent to-primary" },
  { icon: Video, title: "AI Script Generator", description: "Write engaging video scripts for any platform or audience.", color: "from-primary/80 to-accent/80" },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const FeaturesSection = () => {
  return (
    <section id="features" className="py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tighter text-foreground mb-4">
            Powerful AI Tools
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Everything you need to create, generate, and innovate — all in one place.
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {tools.map((tool) => (
            <motion.div
              key={tool.title}
              variants={item}
              className="group glass rounded-2xl p-6 hover:glow-violet transition-all duration-500 cursor-pointer relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${tool.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <tool.icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{tool.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{tool.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesSection;
