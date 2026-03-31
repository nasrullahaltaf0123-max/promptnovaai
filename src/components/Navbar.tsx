import { useState, memo, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import logoFull from "@/assets/logo-full.png";

const Navbar = memo(() => {
  const { lang, setLang, t } = useI18n();
  const [mobileOpen, setMobileOpen] = useState(false);
  const toggle = useCallback(() => setMobileOpen((v) => !v), []);
  const close = useCallback(() => setMobileOpen(false), []);

  const navLinks = [
    { label: t.features as string, href: "#features" },
    { label: t.pricing as string, href: "#pricing" },
    { label: t.howItWorks as string, href: "#how-it-works" },
  ];

  return (
    <motion.nav
      initial={{ y: -10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 left-0 right-0 z-50"
    >
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6">
        <div className="mt-3 sm:mt-4 rounded-2xl glass-strong shadow-xl shadow-background/60 px-5 sm:px-7 h-[4.5rem] sm:h-[4.75rem] flex items-center justify-between">
          <Link to="/" className="flex items-center group shrink-0">
            <img
              src={logoFull}
              alt="PromptNova AI"
              className="h-10 sm:h-11 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
              style={{ filter: "drop-shadow(0 0 12px hsl(250 80% 65% / 0.25))" }}
            />
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="relative text-caption text-muted-foreground hover:text-foreground px-4 py-2 rounded-lg transition-all duration-200 hover:bg-secondary/50 group"
              >
                {item.label}
                <span className="absolute bottom-0.5 left-4 right-4 h-px bg-primary/60 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
              </a>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setLang(lang === "en" ? "bn" : "en")}
              className="text-micro font-medium text-muted-foreground hover:text-foreground px-2.5 py-1.5 rounded-lg transition-all duration-200 hover:bg-secondary/50 border border-border/30"
            >
              {lang === "en" ? "বাংলা" : "EN"}
            </button>
            <Link
              to="/login"
              className="hidden sm:inline-flex text-caption text-muted-foreground hover:text-foreground px-4 py-2 rounded-lg transition-all duration-200 hover:bg-secondary/50"
            >
              {t.logIn}
            </Link>
            <Link
              to="/signup"
              className="hidden sm:inline-flex text-caption font-semibold bg-gradient-to-r from-primary to-accent text-primary-foreground px-5 py-2.5 rounded-xl hover:brightness-110 hover:scale-[1.03] transition-all duration-200 shadow-md shadow-primary/25 hover:shadow-primary/40"
            >
              {t.startFree}
            </Link>
            <button
              onClick={toggle}
              className="md:hidden p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors active:scale-95"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="md:hidden mt-2 rounded-2xl glass-strong shadow-lg shadow-background/50 p-4 flex flex-col gap-1"
            >
              {navLinks.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={close}
                  className="text-body text-muted-foreground hover:text-foreground px-4 py-3.5 rounded-xl transition-all duration-200 hover:bg-secondary/50 active:bg-secondary/70"
                >
                  {item.label}
                </a>
              ))}
              <hr className="border-border/30 my-1" />
              <Link
                to="/login"
                onClick={close}
                className="text-body text-muted-foreground hover:text-foreground px-4 py-3.5 rounded-xl transition-all duration-200 hover:bg-secondary/50"
              >
                {t.logIn}
              </Link>
              <Link
                to="/signup"
                onClick={close}
                className="text-body font-semibold text-center bg-gradient-to-r from-primary to-accent text-primary-foreground px-4 py-3.5 rounded-xl hover:brightness-110 transition-all duration-200 shadow-md shadow-primary/20"
              >
                {t.startFree}
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
});

Navbar.displayName = "Navbar";

export default Navbar;
