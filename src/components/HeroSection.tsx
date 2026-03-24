import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Zap, Sparkles, Shield, Star } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import GradientMeshBackground from "./GradientMeshBackground";
import logoFull from "@/assets/logo-full.png";

const HeroSection = () => {
  const { t } = useI18n();

  return (
    <section className="relative min-h-[100svh] flex items-center justify-center overflow-hidden">
      <GradientMeshBackground />
      
      <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-transparent to-background pointer-events-none" />
      <div className="absolute inset-0 pointer-events-none" style={{
        background: "radial-gradient(ellipse 60% 45% at 50% 40%, hsl(250 80% 65% / 0.1), transparent)"
      }} />

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center pt-24 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mb-8 sm:mb-10"
          >
            <motion.img
              src={logoFull}
              alt="PromptNova AI"
              className="h-28 sm:h-40 lg:h-48 mx-auto w-auto object-contain drop-shadow-[0_0_60px_hsl(250_80%_65%/0.35)]"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.div>

          {/* Headline */}
          <h1 className="text-[2.5rem] sm:text-display-lg lg:text-display-xl leading-[0.92] tracking-tighter mb-6">
            <span className="gradient-text">{t.heroTitle1 as string}</span>
            <br />
            <span className="text-foreground">{t.heroTitle2 as string}</span>
          </h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            className="text-body-lg sm:text-subheading text-muted-foreground max-w-xl mx-auto mb-10"
            style={{ color: "hsl(220 12% 62%)" }}
          >
            {t.heroSubtitle as string}
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
          >
            <Link
              to="/signup"
              className="group relative inline-flex items-center gap-2.5 bg-gradient-to-r from-primary via-primary to-accent text-primary-foreground font-bold px-10 py-4 rounded-2xl transition-all duration-300 text-body-lg shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:scale-[1.04] hover:brightness-110"
            >
              {t.heroCta1 as string}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
            </Link>
            <a
              href="#features"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground font-medium px-10 py-4 rounded-2xl transition-all duration-200 text-body-lg border border-border/50 hover:border-border hover:bg-secondary/30 hover:scale-[1.02]"
            >
              {t.heroCta2 as string}
              <span className="text-muted-foreground/40">↓</span>
            </a>
          </motion.div>

          {/* Trust Elements */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="space-y-5"
          >
            <div className="flex items-center justify-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 text-accent fill-accent" />
              ))}
              <span className="text-micro text-muted-foreground/70 ml-2">Trusted by 1,000+ creators</span>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-5 sm:gap-7">
              {[
                { icon: Zap, text: "Lightning Fast" },
                { icon: Sparkles, text: "No Skills Needed" },
                { icon: Shield, text: "Free to Start" },
              ].map((item) => (
                <div key={item.text} className="flex items-center gap-2 text-caption text-muted-foreground/60">
                  <item.icon className="w-4 h-4 text-primary/70" />
                  {item.text}
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none" />
    </section>
  );
};

export default HeroSection;
