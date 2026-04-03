import { memo, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Zap, Sparkles, Shield, Star, Users, Activity } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import GradientMeshBackground from "./GradientMeshBackground";
import logoFull from "@/assets/logo-full.png";

const ease = [0.16, 1, 0.3, 1] as const;

const AnimatedCounter = memo(({ target, suffix = "" }: { target: number; suffix?: string }) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let frame: number;
    const duration = 2000;
    const start = performance.now();
    const animate = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [target]);
  return <>{count.toLocaleString()}{suffix}</>;
});
AnimatedCounter.displayName = "AnimatedCounter";

const HeroSection = memo(() => {
  const { t } = useI18n();

  return (
    <section className="relative min-h-[100svh] flex items-center justify-center overflow-hidden">
      <GradientMeshBackground />

      {/* Vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 70% at 50% 50%, transparent 40%, hsl(var(--background)) 100%)",
        }}
      />
      {/* Top/bottom fade */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-transparent to-background pointer-events-none" />

      {/* Extra spotlight behind logo */}
      <div
        className="absolute left-1/2 top-[30%] -translate-x-1/2 -translate-y-1/2 pointer-events-none will-change-transform"
        style={{
          width: "min(90vw, 800px)",
          height: "min(50vh, 500px)",
          background: "radial-gradient(ellipse, hsl(var(--glow-violet) / 0.08) 0%, hsl(var(--glow-cyan) / 0.04) 40%, transparent 70%)",
          animation: "mesh-pulse 8s ease-in-out infinite",
        }}
      />

      <div className="relative z-10 max-w-4xl mx-auto px-5 sm:px-6 text-center pt-28 sm:pt-24 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease }}
        >
          {/* Logo — large with animated glow ring */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15, duration: 0.6, ease }}
            className="mb-10 sm:mb-12 relative"
          >
            {/* Outer glow ring */}
            <div
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full will-change-transform"
              style={{
                width: "clamp(260px, 55vw, 480px)",
                height: "clamp(260px, 55vw, 480px)",
                background:
                  "radial-gradient(circle, hsl(var(--glow-violet) / 0.18) 0%, hsl(var(--glow-cyan) / 0.08) 40%, transparent 70%)",
                animation: "mesh-pulse 5s ease-in-out infinite",
              }}
            />
            {/* Inner ring shimmer */}
            <div
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full will-change-transform"
              style={{
                width: "clamp(180px, 40vw, 350px)",
                height: "clamp(180px, 40vw, 350px)",
                border: "1px solid hsl(var(--glow-violet) / 0.12)",
                animation: "mesh-drift-1 12s ease-in-out infinite",
              }}
            />
            <motion.img
              src={logoFull}
              alt="PromptNova AI"
              className="relative h-44 sm:h-60 lg:h-72 mx-auto w-auto object-contain"
              loading="eager"
              fetchPriority="high"
              style={{
                filter:
                  "drop-shadow(0 0 80px hsl(250 80% 65% / 0.4)) drop-shadow(0 0 30px hsl(200 90% 50% / 0.2))",
              }}
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.div>

          {/* Headline */}
          <h1 className="text-[2.6rem] sm:text-display-lg lg:text-display-xl leading-[0.92] tracking-tighter mb-6">
            <span
              className="gradient-text"
              style={{
                filter: "drop-shadow(0 0 20px hsl(250 80% 65% / 0.3))",
              }}
            >
              {t.heroTitle1 as string}
            </span>
            <br />
            <span className="text-foreground">{t.heroTitle2 as string}</span>
          </h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.6 }}
            className="text-body-lg sm:text-subheading max-w-xl mx-auto mb-4 text-muted-foreground"
          >
            {t.heroSubtitle as string}
          </motion.p>

          {/* Micro-text */}
          <p className="text-micro text-muted-foreground/50 mb-10">
            AI tools for creators, students & businesses
          </p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
          >
            <Link
              to="/signup"
              className="cta-shine group relative inline-flex items-center gap-2.5 bg-gradient-to-r from-primary via-primary to-accent text-primary-foreground font-bold px-10 sm:px-12 py-4 sm:py-5 rounded-2xl transition-all duration-300 text-body-lg hover:scale-[1.04] hover:brightness-110 shadow-lg shadow-primary/25 hover:shadow-primary/40 animate-glow-pulse"
            >
              {t.heroCta1 as string}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
            </Link>
            <a
              href="#features"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground font-medium px-10 sm:px-12 py-4 sm:py-5 rounded-2xl transition-all duration-200 text-body-lg glass hover:bg-secondary/40 hover:scale-[1.02] active:scale-[0.98]"
            >
              {t.heroCta2 as string}
              <span className="text-muted-foreground/40">↓</span>
            </a>
          </motion.div>

          {/* Live counters */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.55, duration: 0.5 }}
            className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mb-8"
          >
            <div className="glass-card rounded-full px-4 py-2 flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" style={{ animation: "live-pulse 2s ease-in-out infinite" }} />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
              </span>
              <span className="text-micro font-semibold text-foreground"><AnimatedCounter target={12847} suffix="+" /></span>
              <span className="text-micro text-muted-foreground">creations today</span>
            </div>
            <div className="glass-card rounded-full px-4 py-2 flex items-center gap-2">
              <Users className="w-3.5 h-3.5 text-primary" />
              <span className="text-micro font-semibold text-foreground"><AnimatedCounter target={342} /></span>
              <span className="text-micro text-muted-foreground">creators online</span>
            </div>
            <div className="hidden sm:flex glass-card rounded-full px-4 py-2 items-center gap-2">
              <Activity className="w-3.5 h-3.5 text-accent" />
              <span className="text-micro text-muted-foreground">AI generating now</span>
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            </div>
          </motion.div>

          {/* Trust */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 text-accent fill-accent" />
              ))}
              <span className="text-micro text-muted-foreground/60 ml-2">
                Trusted by 1,000+ creators
              </span>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-5 sm:gap-7">
              {[
                { icon: Zap, text: "Lightning Fast" },
                { icon: Sparkles, text: "No Skills Needed" },
                { icon: Shield, text: "Free to Start" },
              ].map((item) => (
                <div
                  key={item.text}
                  className="flex items-center gap-2 text-caption text-muted-foreground/50"
                >
                  <item.icon className="w-4 h-4 text-primary/60" />
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
});

HeroSection.displayName = "HeroSection";

export default HeroSection;