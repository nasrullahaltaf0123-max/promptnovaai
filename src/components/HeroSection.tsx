import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import GradientMeshBackground from "./GradientMeshBackground";

const HeroSection = () => {
  return (
    <section className="relative min-h-[100svh] flex items-center justify-center overflow-hidden">
      <GradientMeshBackground />

      {/* Top vignette */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background pointer-events-none" />

      {/* Radial center light */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: "radial-gradient(ellipse 60% 50% at 50% 45%, hsl(259 75% 62% / 0.06), transparent)"
      }} />

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center pt-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-flex items-center gap-2 glass-card rounded-full px-4 py-1.5 mb-10"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            <span className="text-micro font-medium text-muted-foreground tracking-wide uppercase">
              Powered by Advanced AI
            </span>
          </motion.div>

          {/* Title — Apple-scale typography */}
          <h1 className="text-display-lg sm:text-display-xl mb-8">
            <span className="text-foreground block">Create anything</span>
            <span className="gradient-text block mt-1">with AI</span>
          </h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            className="text-subheading text-muted-foreground max-w-xl mx-auto mb-4"
          >
            Content, images, logos, and scripts — all from a single prompt.
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="text-caption text-muted-foreground/60 mb-12"
          >
            All the AI tools you need — in one powerful workspace.
          </motion.p>

          {/* CTAs — Stripe-style buttons */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3"
          >
            <Link
              to="/signup"
              className="group relative inline-flex items-center gap-2 bg-foreground text-background font-medium px-7 py-3 rounded-xl hover:bg-foreground/90 transition-all duration-300 text-body"
            >
              Start creating
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-200" />
            </Link>
            <a
              href="#features"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground font-medium px-7 py-3 rounded-xl transition-all duration-200 text-body"
            >
              Explore tools
              <span className="text-muted-foreground/40">↓</span>
            </a>
          </motion.div>
        </motion.div>

        {/* Fade out gradient at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background to-transparent" />
      </div>
    </section>
  );
};

export default HeroSection;
