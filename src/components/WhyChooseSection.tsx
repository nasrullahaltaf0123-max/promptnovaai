import { motion } from "framer-motion";
import { Zap, Layout, Wand2, Users } from "lucide-react";
import { useI18n } from "@/lib/i18n";

const WhyChooseSection = () => {
  const { t } = useI18n();

  const reasons = [
    { icon: Zap, title: t.whyFast, description: t.whyFastDesc },
    { icon: Layout, title: t.whySimple, description: t.whySimpleDesc },
    { icon: Wand2, title: t.whyPro, description: t.whyProDesc },
    { icon: Users, title: t.whyBuilt, description: t.whyBuiltDesc },
  ];

  return (
    <section className="py-32 sm:py-40 px-6 relative">
      <div className="absolute inset-0 pointer-events-none" style={{
        background: "radial-gradient(ellipse 60% 50% at 50% 50%, hsl(187 92% 43% / 0.02), transparent)"
      }} />

      <div className="max-w-5xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-20"
        >
          <p className="text-micro font-medium text-accent uppercase tracking-widest mb-4">{t.whyLabel}</p>
          <h2 className="text-display text-foreground mb-5">{t.whyTitle}</h2>
          <p className="text-subheading text-muted-foreground max-w-md mx-auto">{t.whySubtitle}</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reasons.map((reason, i) => (
            <motion.div
              key={String(reason.title)}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="glass-card rounded-2xl p-6 flex gap-5"
            >
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <reason.icon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="text-body-lg font-semibold text-foreground mb-1.5">{String(reason.title)}</h3>
                <p className="text-caption text-muted-foreground leading-relaxed">{String(reason.description)}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseSection;
