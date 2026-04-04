import { memo, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Crown, ArrowRight } from "lucide-react";

const ScrollProgressCta = memo(() => {
  const [progress, setProgress] = useState(0);
  const [show, setShow] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? scrollTop / docHeight : 0;
      setProgress(pct);
      setShow(pct >= 0.75);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* Progress bar — always visible on desktop */}
      <div className="hidden sm:block fixed top-0 left-0 right-0 z-[60] h-[3px] pointer-events-none">
        <div
          className="h-full bg-gradient-to-r from-primary to-accent transition-[width] duration-150 ease-out"
          style={{ width: `${Math.min(progress * 100, 100)}%` }}
        />
      </div>

      {/* CTA reveal at 75% */}
      <AnimatePresence>
        {show && !dismissed && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="hidden sm:flex fixed bottom-6 right-6 z-50 items-center gap-3 glass-card-premium rounded-2xl p-4 pr-5 shadow-2xl shadow-primary/20"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center flex-shrink-0">
              <Crown className="w-4 h-4 text-primary" />
            </div>
            <div className="mr-2">
              <p className="text-caption font-semibold text-foreground">Unlock all 12 AI tools</p>
              <p className="text-micro text-muted-foreground">Pro at ৳99/mo — limited offer</p>
            </div>
            <Link
              to="/signup"
              className="cta-shine inline-flex items-center gap-1.5 bg-gradient-to-r from-primary to-accent text-primary-foreground text-caption font-semibold px-4 py-2 rounded-xl hover:brightness-110 transition-all shadow-md shadow-primary/25 flex-shrink-0"
            >
              Try Pro Free
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <button
              onClick={() => setDismissed(true)}
              className="text-muted-foreground hover:text-foreground text-micro ml-1 transition-colors"
              aria-label="Dismiss"
            >
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
});

ScrollProgressCta.displayName = "ScrollProgressCta";

export default ScrollProgressCta;
