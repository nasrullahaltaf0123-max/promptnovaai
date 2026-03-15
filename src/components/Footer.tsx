import { Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const Footer = () => {
  return (
    <footer className="relative">
      {/* CTA Banner */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="py-28 px-6 text-center relative overflow-hidden"
      >
        <div className="absolute inset-0 pointer-events-none" style={{
          background: "radial-gradient(ellipse 50% 60% at 50% 100%, hsl(259 75% 62% / 0.06), transparent)"
        }} />
        <div className="relative max-w-lg mx-auto">
          <h2 className="text-heading sm:text-display text-foreground mb-4">
            Ready to create?
          </h2>
          <p className="text-subheading text-muted-foreground mb-8">
            Join thousands of creators using PromptNova AI.
          </p>
          <Link
            to="/signup"
            className="group inline-flex items-center gap-2 bg-foreground text-background font-medium px-7 py-3 rounded-xl hover:bg-foreground/90 transition-all duration-200 text-body"
          >
            Get started free
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </motion.section>

      {/* Footer links */}
      <div className="border-t border-border/50 py-12 px-6">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Sparkles className="w-3 h-3 text-primary-foreground" />
            </div>
            <span className="text-body font-semibold tracking-tight text-foreground">PromptNova AI</span>
          </div>

          <div className="flex items-center gap-6">
            {["About", "Privacy", "Terms", "Contact"].map((link) => (
              <Link key={link} to="/" className="text-caption text-muted-foreground hover:text-foreground transition-colors">
                {link}
              </Link>
            ))}
          </div>

          <p className="text-micro text-muted-foreground/50">
            © 2026 PromptNova AI
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
