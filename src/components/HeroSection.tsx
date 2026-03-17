import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Zap, Sparkles, Shield } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import GradientMeshBackground from "./GradientMeshBackground";
import logoFull from "@/assets/logo-full.png";

const HeroSection = () => {
  const { t } = useI18n();

  return (
    <section className="relative min-h-[100svh] flex items-center justify-center overflow-hidden">
      <GradientMeshBackground />
      
      <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-transparent to-background pointer-events-none" />
      <div className="absolute inset-0 pointer-events-none" style={{
        background: "radial-gradient(ellipse 50% 40% at 50% 40%, hsl(250 80% 65% / 0.08), transparent)"
      }} />

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center pt-20">
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
              className="h-24 sm:h-36 lg:h-44 mx-auto w-auto object-contain drop-shadow-[0_0_40px_hsl(250_80%_65%/0.3)]"
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.div>

          {/* Headline */}
          <h1 className="text-[2rem] sm:text-display-lg lg:text-display-xl leading-[0.95] tracking-tighter mb-5">
            <span className="gradient-text">Create Viral Content</span>
            <br />
            <span className="text-foreground">with AI</span>
          </h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            className="text-body-lg sm:text-subheading text-muted-foreground max-w-lg mx-auto mb-8"
          >
            Generate thumbnails, logos, scripts & images in seconds
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-10"
          >
            <Link
              to="/signup"
              className="group relative inline-flex items-center gap-2 bg-gradient-to-r from-primary via-primary to-accent text-primary-foreground font-semibold px-8 py-3.5 rounded-xl transition-all duration-300 text-body shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:scale-[1.02]"
            >
              Start Free
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-200" />
            </Link>
            <a
              href="#features"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground font-medium px-8 py-3.5 rounded-xl transition-all duration-200 text-body border border-border/50 hover:border-border hover:bg-secondary/30"
            >
              Try Demo
              <span className="text-muted-foreground/40">↓</span>
            </a>
          </motion.div>

          {/* Trust Elements */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="space-y-4"
          >
            <p className="text-micro text-muted-foreground/60 font-medium">Trusted by 1,000+ creators worldwide</p>
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
              {[
                { icon: Zap, text: "Lightning Fast" },
                { icon: Sparkles, text: "No Skills Needed" },
                { icon: Shield, text: "Free to Start" },
              ].map((item) => (
                <div key={item.text} className="flex items-center gap-1.5 text-micro text-muted-foreground/50">
                  <item.icon className="w-3.5 h-3.5 text-primary/60" />
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
