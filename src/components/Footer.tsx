import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import logoFull from "@/assets/logo-full.png";

const Footer = () => {
  return (
    <footer className="relative">
      {/* CTA Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="py-28 px-6 text-center relative overflow-hidden section-glow"
      >
        <div className="absolute inset-0 pointer-events-none" style={{
          background: "radial-gradient(ellipse 50% 60% at 50% 100%, hsl(250 80% 65% / 0.08), transparent)"
        }} />
        <div className="relative max-w-lg mx-auto">
          <h2 className="text-heading sm:text-display text-foreground mb-5">Ready to Create?</h2>
          <p className="text-body-lg text-muted-foreground mb-10">Join 1,000+ creators using AI to produce viral content every day.</p>
          <Link
            to="/signup"
            className="cta-shine group inline-flex items-center gap-2 bg-gradient-to-r from-primary to-accent text-primary-foreground font-semibold px-10 py-4 rounded-xl transition-all duration-300 text-body shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:scale-[1.03] hover:brightness-110"
          >
            Start Free Now
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </motion.section>

      {/* Footer bar */}
      <div className="border-t border-border/30 py-10 px-6">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <img src={logoFull} alt="PromptNova AI" className="h-7 w-auto object-contain" />
          </div>

          <div className="flex items-center gap-6">
            {[
              { label: "Features", href: "#features" },
              { label: "Pricing", href: "#pricing" },
              { label: "Contact", href: "mailto:aipromptnova@gmail.com" },
            ].map((link) => (
              <a key={link.label} href={link.href} className="text-caption text-muted-foreground hover:text-foreground transition-colors">
                {link.label}
              </a>
            ))}
          </div>

          <p className="text-micro text-muted-foreground/40">
            © 2026 PromptNova AI
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;