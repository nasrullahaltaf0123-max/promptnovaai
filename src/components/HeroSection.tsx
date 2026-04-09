import { memo, useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Zap, Sparkles, Shield, Star, Users, Activity, Play, Crown, X } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import GradientMeshBackground from "./GradientMeshBackground";
import HeroDemoMockup from "./HeroDemoMockup";
import logoFull from "@/assets/logo-full.png";
import { Dialog, DialogContent } from "@/components/ui/dialog";

const ease = [0.16, 1, 0.3, 1] as const;

const typingPhrases = [
  "YouTube Thumbnails",
  "Blog Posts",
  "Video Scripts",
  "AI Captions",
  "TikTok Scripts",
  "Pro Headshots",
  "Logo Designs",
];

const TypingRotator = memo(() => {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const phrase = typingPhrases[phraseIndex];

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;

    if (!isDeleting && displayed.length < phrase.length) {
      timeout = setTimeout(() => setDisplayed(phrase.slice(0, displayed.length + 1)), 80);
    } else if (!isDeleting && displayed.length === phrase.length) {
      timeout = setTimeout(() => setIsDeleting(true), 2000);
    } else if (isDeleting && displayed.length > 0) {
      timeout = setTimeout(() => setDisplayed(phrase.slice(0, displayed.length - 1)), 40);
    } else if (isDeleting && displayed.length === 0) {
      setIsDeleting(false);
      setPhraseIndex((prev) => (prev + 1) % typingPhrases.length);
    }

    return () => clearTimeout(timeout);
  }, [displayed, isDeleting, phrase]);

  return (
    <span className="inline-flex items-baseline">
      <span className="gradient-text font-semibold">{displayed}</span>
      <span
        className="inline-block w-[2px] h-[1.1em] bg-primary ml-0.5 rounded-full"
        style={{ animation: "cursor-blink 1s steps(1) infinite" }}
      />
    </span>
  );
});
TypingRotator.displayName = "TypingRotator";

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

const creatorAvatars = ["RA", "NJ", "IH", "FK", "SA"];

const HeroSection = memo(() => {
  const { t } = useI18n();
  const [showDemo, setShowDemo] = useState(false);

  return (
    <>
    <Dialog open={showDemo} onOpenChange={setShowDemo}>
      <DialogContent className="max-w-3xl p-0 overflow-hidden bg-black border-border/30">
        <div className="aspect-video w-full">
          <iframe
            src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0"
            title="PromptNova AI Demo"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
          />
        </div>
      </DialogContent>
    </Dialog>
    <section className="relative min-h-[100svh] flex items-center justify-center overflow-hidden">
      <GradientMeshBackground />

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 80% 70% at 50% 50%, transparent 40%, hsl(var(--background)) 100%)",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-transparent to-background pointer-events-none" />

      {/* Animated accent lines */}
      <div className="absolute left-[15%] top-0 w-px h-full pointer-events-none overflow-hidden opacity-[0.06]">
        <div className="w-full h-32 bg-gradient-to-b from-transparent via-primary to-transparent" style={{ animation: "hero-line-flow 8s ease-in-out infinite" }} />
      </div>
      <div className="absolute right-[15%] top-0 w-px h-full pointer-events-none overflow-hidden opacity-[0.06]">
        <div className="w-full h-32 bg-gradient-to-b from-transparent via-accent to-transparent" style={{ animation: "hero-line-flow 8s ease-in-out infinite 4s" }} />
      </div>

      <div
        className="absolute left-1/2 top-[30%] -translate-x-1/2 -translate-y-1/2 pointer-events-none will-change-transform"
        style={{
          width: "min(90vw, 800px)",
          height: "min(50vh, 500px)",
          background: "radial-gradient(ellipse, hsl(var(--glow-violet) / 0.1) 0%, hsl(var(--glow-cyan) / 0.05) 40%, transparent 70%)",
          animation: "mesh-pulse 8s ease-in-out infinite",
        }}
      />

      <div className="relative z-10 max-w-4xl mx-auto px-5 sm:px-6 text-center pt-28 sm:pt-24 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease }}
        >
          {/* Urgency strip */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="mb-8"
          >
            <span className="hero-badge inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-micro font-semibold">
              <Crown className="w-3.5 h-3.5 text-primary" />
              <span className="text-primary">Launch Offer</span>
              <span className="mx-1 w-px h-3 bg-border" />
              <span className="text-muted-foreground">Pro at ৳99 today</span>
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            </span>
          </motion.div>

          {/* Logo with enhanced glow */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15, duration: 0.6, ease }}
            className="mb-12 sm:mb-14 relative"
          >
            <div
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full will-change-transform"
              style={{
                width: "clamp(280px, 60vw, 520px)",
                height: "clamp(280px, 60vw, 520px)",
                background: "radial-gradient(circle, hsl(var(--glow-violet) / 0.2) 0%, hsl(var(--glow-cyan) / 0.1) 40%, transparent 70%)",
                animation: "mesh-pulse 5s ease-in-out infinite",
              }}
            />
            <div
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full will-change-transform"
              style={{
                width: "clamp(200px, 45vw, 380px)",
                height: "clamp(200px, 45vw, 380px)",
                border: "1px solid hsl(var(--glow-violet) / 0.1)",
                animation: "mesh-drift-1 12s ease-in-out infinite",
              }}
            />
            {/* Outer ring */}
            <div
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full will-change-transform"
              style={{
                width: "clamp(340px, 70vw, 600px)",
                height: "clamp(340px, 70vw, 600px)",
                border: "1px solid hsl(var(--glow-cyan) / 0.05)",
                animation: "mesh-drift-2 16s ease-in-out infinite",
              }}
            />
            <motion.img
              src={logoFull}
              alt="PromptNova AI"
              className="relative h-48 sm:h-64 lg:h-80 mx-auto w-auto object-contain"
              loading="eager"
              fetchPriority="high"
              style={{
                filter: "drop-shadow(0 0 100px hsl(250 80% 65% / 0.5)) drop-shadow(0 0 40px hsl(200 90% 50% / 0.25))",
              }}
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.div>

          {/* Headline */}
          <h1 className="text-[2.8rem] sm:text-display-lg lg:text-display-xl leading-[0.9] tracking-tighter mb-6">
            <span className="gradient-text font-extrabold" style={{ filter: "drop-shadow(0 0 30px hsl(250 80% 65% / 0.35))" }}>
              {t.heroTitle1 as string}
            </span>
            <br />
            <span className="text-foreground font-bold">{t.heroTitle2 as string}</span>
          </h1>

          {/* Subtitle with typing rotator */}
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.6 }}
            className="text-body-lg sm:text-subheading max-w-xl mx-auto mb-3 text-muted-foreground leading-relaxed"
          >
            Create stunning <TypingRotator /> <br className="hidden sm:block" />
            with AI — in seconds, not hours.
          </motion.p>

          {/* Pain-point line */}
          <p className="text-caption text-muted-foreground/50 mb-10 max-w-md mx-auto">
            Stop wasting hours on content. Let AI do the heavy lifting — in seconds.
          </p>

          {/* CTAs with animated border */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-5"
          >
            <Link
              to="/signup"
              className="hero-cta-primary group relative inline-flex items-center gap-2.5 font-bold px-10 sm:px-14 py-4 sm:py-5 rounded-2xl transition-all duration-300 text-body-lg hover:scale-[1.04] active:scale-[0.98]"
            >
              <span className="relative z-10 flex items-center gap-2.5 text-primary-foreground">
                {t.heroCta1 as string}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform duration-200" />
              </span>
            </Link>
            <button
              onClick={() => setShowDemo(true)}
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground font-medium px-10 sm:px-12 py-4 sm:py-5 rounded-2xl transition-all duration-200 text-body-lg glass hover:bg-secondary/40 hover:scale-[1.02] active:scale-[0.98] border border-border/50"
            >
              <Play className="w-4 h-4" />
              Watch Demo
            </button>
          </motion.div>

          {/* Micro trust */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.4 }}
            className="text-micro text-muted-foreground/40 mb-12"
          >
            ✓ Free forever plan &nbsp;·&nbsp; ✓ No credit card needed &nbsp;·&nbsp; ✓ Cancel anytime
          </motion.p>

          {/* Animated demo mockup */}
          <div className="mb-12">
            <HeroDemoMockup />
          </div>

          {/* Creator avatars + stars */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="flex items-center justify-center gap-3 mb-8"
          >
            <div className="flex -space-x-2.5">
              {creatorAvatars.map((initials, i) => (
                <div
                  key={initials}
                  className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/50 to-accent/50 border-2 border-background flex items-center justify-center text-[10px] font-bold text-foreground"
                  style={{ zIndex: creatorAvatars.length - i }}
                >
                  {initials}
                </div>
              ))}
            </div>
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 text-accent fill-accent" />
              ))}
            </div>
            <span className="text-micro text-muted-foreground">
              Loved by <span className="text-foreground font-semibold">12,000+</span> creators
            </span>
          </motion.div>

          {/* Live counters */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.55, duration: 0.5 }}
            className="flex flex-wrap items-center justify-center gap-3 sm:gap-5 mb-10"
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

          {/* Trust badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.5 }}
          >
            <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8">
              {[
                { icon: Zap, text: "Lightning Fast" },
                { icon: Sparkles, text: "No Skills Needed" },
                { icon: Shield, text: "Free to Start" },
              ].map((item) => (
                <div key={item.text} className="flex items-center gap-2 text-caption text-muted-foreground/40">
                  <item.icon className="w-4 h-4 text-primary/50" />
                  {item.text}
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background via-background/80 to-transparent pointer-events-none" />
    </section>
    </>
  );
});

HeroSection.displayName = "HeroSection";

export default HeroSection;
