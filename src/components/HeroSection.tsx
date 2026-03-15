import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Zap } from "lucide-react";
import GradientMeshBackground from "./GradientMeshBackground";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <GradientMeshBackground />
      <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-transparent to-background" />

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 mb-8">
            <Zap className="w-3.5 h-3.5 text-accent" />
            <span className="text-xs font-medium text-muted-foreground">Powered by Advanced AI</span>
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-tighter leading-[0.9] mb-6">
            <span className="text-foreground">PromptNova</span>
            <br />
            <span className="gradient-text">AI</span>
          </h1>

          <p className="text-xl sm:text-2xl text-muted-foreground font-light max-w-2xl mx-auto mb-4 tracking-tight">
            Create Content, Images, Logos and Scripts Instantly with AI
          </p>

          <p className="text-sm text-muted-foreground/70 max-w-md mx-auto mb-10">
            All the AI tools you need — in one powerful workspace.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/signup"
              className="group relative inline-flex items-center gap-2 bg-gradient-to-r from-primary to-accent text-primary-foreground font-semibold px-8 py-3.5 rounded-xl hover:shadow-xl hover:shadow-primary/25 transition-all duration-500 text-sm"
            >
              Start Creating
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a
              href="#features"
              className="inline-flex items-center gap-2 glass text-foreground font-medium px-8 py-3.5 rounded-xl hover:bg-card/80 transition-all duration-300 text-sm"
            >
              Explore Tools
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
