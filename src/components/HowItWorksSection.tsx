import { motion } from "framer-motion";
import { MousePointerClick, PenLine, Sparkles } from "lucide-react";
import { useI18n } from "@/lib/i18n";

const HowItWorksSection = () => {
  const { t } = useI18n();

  const steps = [
    { icon: MousePointerClick, step: "01", title: t.howStep1, description: t.howStep1Desc },
    { icon: PenLine, step: "02", title: t.howStep2, description: t.howStep2Desc },
    { icon: Sparkles, step: "03", title: t.howStep3, description: t.howStep3Desc },
  ];

  return (
    <section id="how-it-works" className="py-32 sm:py-40 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-20"
        >
          <p className="text-micro font-medium text-primary uppercase tracking-widest mb-4">{t.howLabel}</p>
          <h2 className="text-display text-foreground mb-5">{t.howTitle}</h2>
          <p className="text-subheading text-muted-foreground max-w-md mx-auto">{t.howSubtitle}</p>
        </motion.div>

        <div className="relative">
          <div className="hidden md:block absolute top-[52px] left-[16.67%] right-[16.67%] h-px">
            <div className="h-full bg-gradient-to-r from-transparent via-border to-transparent" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-6">
            {steps.map((s, i) => (
              <motion.div
                key={s.step}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
                className="text-center relative"
              >
                <div className="relative inline-block mb-7">
                  <div className="w-[72px] h-[72px] rounded-2xl glass-card-highlight flex items-center justify-center mx-auto">
                    <s.icon className="w-7 h-7 text-foreground" />
                  </div>
                  <span className="absolute -top-1.5 -right-1.5 text-micro font-bold bg-gradient-to-br from-primary to-accent text-primary-foreground w-6 h-6 rounded-full flex items-center justify-center shadow-lg shadow-primary/20">
                    {i + 1}
                  </span>
                </div>
                <h3 className="text-body-lg font-semibold text-foreground mb-2">{String(s.title)}</h3>
                <p className="text-caption text-muted-foreground max-w-[240px] mx-auto">{String(s.description)}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
