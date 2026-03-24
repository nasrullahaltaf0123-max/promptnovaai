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

      {/* Vignette edges */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: "radial-gradient(ellipse 80% 70% at 50% 50%, transparent 40%, hsl(var(--background)) 100%)"
      }} />
      
      {/* Top/bottom fade */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-transparent to-background pointer-events-none" />

      {/* Central radial light */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: "radial-gradient(ellipse 50% 40% at 50% 38%, hsl(var(--glow-violet) / 0.12), transparent)"
      }} />

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center pt-24 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Logo — 2x bigger with glow ring */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="mb-8 sm:mb-10 relative"
          >
            {/* Pulsing glow ring behind logo */}
            <motion.div
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
              style={{
                width: "clamp(200px, 45vw, 380px)",
                height: "clamp(200px, 45vw, 380px)",
                background: "radial-gradient(circle, hsl(var(--glow-violet) / 0.2) 0%, hsl(var(--glow-cyan) / 0.08) 50%, transparent 70%)",
              }}
              animate={{
                scale: [1, 1.15, 1],
                opacity: [0.6, 1, 0.6],
              }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />
            {/* Outer ring */}
            <motion.div
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary/10"
              style={{
                width: "clamp(220px, 50vw, 420px)",
                height: "clamp(220px, 50vw, 420px)",
              }}
              animate={{
                scale: [1, 1.08, 1],
                opacity: [0.3, 0.6, 0.3],
                rotate: [0, 360],
              }}
              transition={{
                scale: { duration: 4, repeat: Infinity, ease: "easeInOut" },
                opacity: { duration: 4, repeat: Infinity, ease: "easeInOut" },
                rotate: { duration: 30, repeat: Infinity, ease: "linear" },
              }}
            />
            <motion.img
              src={logoFull}
              alt="PromptNova AI"
              className="relative h-36 sm:h-52 lg:h-64 mx-auto w-auto object-contain"
              style={{
                filter: "drop-shadow(0 0 80px hsl(250 80% 65% / 0.4)) drop-shadow(0 0 30px hsl(200 90% 50% / 0.2))",
              }}
              animate={{ y: [0, -14, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.div>

          {/* Headline — bigger & bolder */}
          <h1 className="text-[2.75rem] sm:text-display-lg lg:text-display-xl leading-[0.92] tracking-tighter mb-6">
            <span className="gradient-text" style={{ filter: "drop-shadow(0 0 20px hsl(250 80% 65% / 0.3))" }}>
              {t.heroTitle1 as string}
            </span>
            <br />
            <span className="text-foreground">{t.heroTitle2 as string}</span>
          </h1>

          {/* Subheadline — brighter */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            className="text-body-lg sm:text-subheading max-w-xl mx-auto mb-10"
            style={{ color: "hsl(220 15% 68%)" }}
          >
            {t.heroSubtitle as string}
          </motion.p>

          {/* CTAs — bigger, glowing, pulse */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14"
          >
            <motion.div
              animate={{
                boxShadow: [
                  "0 0 20px -5px hsl(250 80% 65% / 0.3)",
                  "0 0 40px -5px hsl(250 80% 65% / 0.5)",
                  "0 0 20px -5px hsl(250 80% 65% / 0.3)",
                ],
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="rounded-2xl"
            >
              <Link
                to="/signup"
                className="group relative inline-flex items-center gap-2.5 bg-gradient-to-r from-primary via-primary to-accent text-primary-foreground font-bold px-12 py-5 rounded-2xl transition-all duration-300 text-body-lg hover:scale-[1.05] hover:brightness-110"
              >
                {t.heroCta1 as string}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform duration-200" />
              </Link>
            </motion.div>
            <a
              href="#features"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground font-medium px-12 py-5 rounded-2xl transition-all duration-200 text-body-lg glass hover:bg-secondary/40 hover:scale-[1.03]"
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
