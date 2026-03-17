import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import GradientMeshBackground from "./GradientMeshBackground";
import logoFull from "@/assets/logo-full.png";

const HeroSection = () => {
  const { t } = useI18n();

  return (
    <section className="relative min-h-[100svh] flex items-center justify-center overflow-hidden">
      <GradientMeshBackground />
      
      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-transparent to-background pointer-events-none" />
      <div className="absolute inset-0 pointer-events-none" style={{
        background: "radial-gradient(ellipse 50% 40% at 50% 40%, hsl(250 80% 65% / 0.08), transparent)"
      }} />

      <div className="relative z-10 max-w-3xl mx-auto px-6 text-center pt-20">
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
            className="inline-flex items-center gap-2 glass-card rounded-full px-4 py-1.5 mb-8"
          >
            <Sparkles className="w-3.5 h-3.5 text-accent" />
            <span className="text-micro font-medium text-muted-foreground tracking-wide">
              {t.heroBadge}
            </span>
          </motion.div>

          {/* Headline */}
          <h1 className="text-[2.5rem] sm:text-display-lg lg:text-display-xl leading-[0.95] tracking-tighter mb-6">
            <span className="gradient-text">{t.heroTitle1}</span>
            <br />
            <span className="text-foreground">{t.heroTitle2}</span>
          </h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            className="text-body-lg sm:text-subheading text-muted-foreground max-w-lg mx-auto mb-10"
          >
            {t.heroSubtitle}
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3"
          >
            <Link
              to="/signup"
              className="group relative inline-flex items-center gap-2 bg-primary text-primary-foreground font-semibold px-7 py-3.5 rounded-xl hover:bg-primary/90 transition-all duration-300 text-body shadow-lg shadow-primary/20"
            >
              {t.heroCta1}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-200" />
            </Link>
            <a
              href="#features"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground font-medium px-7 py-3.5 rounded-xl transition-all duration-200 text-body border border-border/50 hover:border-border hover:bg-secondary/30"
            >
              {t.heroCta2}
              <span className="text-muted-foreground/40">↓</span>
            </a>
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none" />
    </section>
  );
};

export default HeroSection;
