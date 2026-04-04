import { memo, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const MobileStickyCta = memo(() => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 600);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-0 left-0 right-0 z-50 sm:hidden p-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))]"
          style={{
            background: "linear-gradient(to top, hsl(var(--background)) 60%, transparent)",
          }}
        >
          <Link
            to="/signup"
            className="cta-shine flex items-center justify-center gap-2 w-full bg-gradient-to-r from-primary to-accent text-primary-foreground font-bold py-4 rounded-2xl shadow-lg shadow-primary/30 text-body active:scale-[0.98] transition-transform"
          >
            Start Creating Free
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  );
});

MobileStickyCta.displayName = "MobileStickyCta";

export default MobileStickyCta;
