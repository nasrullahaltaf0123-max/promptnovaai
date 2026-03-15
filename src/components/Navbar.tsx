import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

const Navbar = () => {
  return (
    <motion.nav
      initial={{ y: -10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 left-0 right-0 z-50"
    >
      <div className="mx-auto max-w-screen-xl px-6">
        <div className="mt-4 rounded-2xl glass-strong px-5 h-14 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary via-primary/80 to-accent flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
              <Sparkles className="w-3.5 h-3.5 text-primary-foreground" />
            </div>
            <span className="text-body font-semibold tracking-tight text-foreground">
              PromptNova
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {["Features", "Pricing", "How It Works"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace(/ /g, "-")}`}
                className="text-caption text-muted-foreground hover:text-foreground px-3.5 py-1.5 rounded-lg transition-all duration-200 hover:bg-secondary/50"
              >
                {item}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/login"
              className="text-caption text-muted-foreground hover:text-foreground px-4 py-1.5 rounded-lg transition-all duration-200 hover:bg-secondary/50"
            >
              Log in
            </Link>
            <Link
              to="/signup"
              className="text-caption font-medium bg-foreground text-background px-4 py-1.5 rounded-lg hover:bg-foreground/90 transition-all duration-200"
            >
              Start free
            </Link>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
