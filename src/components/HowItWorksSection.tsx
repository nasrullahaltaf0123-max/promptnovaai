import { motion } from "framer-motion";
import { MousePointerClick, PenLine, Sparkles } from "lucide-react";
import { useI18n } from "@/lib/i18n";

const HowItWorksSection = () => {
  const { t } = useI18n();

  const steps = [
    { icon: MousePointerClick, num: "01", title: t.howStep1, description: t.howStep1Desc },
    { icon: PenLine, num: "02", title: t.howStep2, description: t.howStep2Desc },
    { icon: Sparkles, num: "03", title: t.howStep3, description: t.howStep3Desc },
  ];

  return (
    <section id="how-it-works" className="py-24 sm:py-32 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16"
        >
          <p className="text-micro font-semibold text-accent uppercase tracking-widest mb-3">{t.howLabel}</p>
          <h2 className="text-heading sm:text-display text-foreground mb-4">{t.howTitle}</h2>
          <p className="text-body-lg text-muted-foreground max-w-md mx-auto">{t.howSubtitle}</p>
        </motion.div>

        <div className="relative">
          {/* Connector line */}
          <div className="hidden md:block absolute top-[44px] left-[16.67%] right-[16.67%] h-px">
            <div className="h-full bg-gradient-to-r from-primary/30 via-accent/30 to-primary/30" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-6">
            {steps.map((s, i) => (
              <motion.div
                key={s.num}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
                className="text-center relative"
              >
                <div className="relative inline-block mb-6">
                  <div className="w-[72px] h-[72px] rounded-2xl glass-card-highlight flex items-center justify-center mx-auto">
                    <s.icon className="w-7 h-7 text-foreground" />
                  </div>
                  <span className="absolute -top-1.5 -right-1.5 text-micro font-bold bg-gradient-to-br from-primary to-accent text-primary-foreground w-6 h-6 rounded-full flex items-center justify-center shadow-lg shadow-primary/25">
                    {i + 1}
                  </span>
                </div>
                <h3 className="text-body-lg font-semibold text-foreground mb-2">{String(s.title)}</h3>
                <p className="text-caption text-muted-foreground max-w-[220px] mx-auto">{String(s.description)}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
