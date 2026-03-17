import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import logo from "@/assets/logo.png";

const Footer = () => {
  const { t } = useI18n();

  return (
    <footer className="relative">
      {/* CTA Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="py-24 px-6 text-center relative overflow-hidden"
      >
        <div className="absolute inset-0 pointer-events-none" style={{
          background: "radial-gradient(ellipse 50% 60% at 50% 100%, hsl(250 80% 65% / 0.06), transparent)"
        }} />
        <div className="relative max-w-lg mx-auto">
          <h2 className="text-heading sm:text-display text-foreground mb-4">{t.readyTitle}</h2>
          <p className="text-body-lg text-muted-foreground mb-8">{t.readySubtitle}</p>
          <Link
            to="/signup"
            className="group inline-flex items-center gap-2 bg-primary text-primary-foreground font-semibold px-7 py-3.5 rounded-xl hover:bg-primary/90 transition-all duration-200 text-body shadow-lg shadow-primary/20"
          >
            {t.readyCta}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </motion.section>

      {/* Footer bar */}
      <div className="border-t border-border/40 py-10 px-6">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <img src={logo} alt="PromptNova AI" className="w-6 h-6 rounded-md" />
            <span className="text-body font-semibold tracking-tight text-foreground">PromptNova AI</span>
          </div>

          <div className="flex items-center gap-6">
            {[
              { label: t.features, href: "#features" },
              { label: t.pricing, href: "#pricing" },
              { label: t.contact, href: "mailto:aipromptnova@gmail.com" },
            ].map((link) => (
              <a key={String(link.label)} href={link.href} className="text-caption text-muted-foreground hover:text-foreground transition-colors">
                {String(link.label)}
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
