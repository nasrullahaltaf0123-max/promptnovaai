import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useI18n } from "@/lib/i18n";
import logo from "@/assets/logo.png";

const Navbar = () => {
  const { lang, setLang, t } = useI18n();

  return (
    <motion.nav
      initial={{ y: -10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 left-0 right-0 z-50"
    >
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6">
        <div className="mt-3 sm:mt-4 rounded-2xl glass-strong px-4 sm:px-5 h-14 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group">
            <img src={logo} alt="PromptNova AI" className="w-7 h-7 rounded-lg transition-transform duration-300 group-hover:scale-105" />
            <span className="text-body font-semibold tracking-tight text-foreground hidden sm:inline">
              PromptNova
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {[
              { label: t.features as string, href: "#features" },
              { label: t.pricing as string, href: "#pricing" },
              { label: t.howItWorks as string, href: "#how-it-works" },
            ].map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-caption text-muted-foreground hover:text-foreground px-3.5 py-1.5 rounded-lg transition-all duration-200 hover:bg-secondary/50"
              >
                {item.label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setLang(lang === "en" ? "bn" : "en")}
              className="text-micro font-medium text-muted-foreground hover:text-foreground px-2.5 py-1.5 rounded-lg transition-all duration-200 hover:bg-secondary/50 border border-border/30"
            >
              {lang === "en" ? "বাং" : "EN"}
            </button>
            <Link
              to="/login"
              className="text-caption text-muted-foreground hover:text-foreground px-3 sm:px-4 py-1.5 rounded-lg transition-all duration-200 hover:bg-secondary/50"
            >
              {t.logIn}
            </Link>
            <Link
              to="/signup"
              className="text-caption font-medium bg-primary text-primary-foreground px-3 sm:px-4 py-1.5 rounded-lg hover:bg-primary/90 transition-all duration-200"
            >
              {t.startFree}
            </Link>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
