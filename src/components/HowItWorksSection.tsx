import { motion } from "framer-motion";
import { MousePointerClick, PenLine, Sparkles } from "lucide-react";

const steps = [
  { icon: MousePointerClick, step: "01", title: "Choose Your Tool", description: "Pick from our suite of AI-powered creative tools." },
  { icon: PenLine, step: "02", title: "Enter Your Prompt", description: "Describe what you want to create in natural language." },
  { icon: Sparkles, step: "03", title: "Generate Instantly", description: "Get professional results in seconds. Download or save." },
];

const HowItWorksSection = () => {
  return (
    <section id="how-it-works" className="py-32 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tighter text-foreground mb-4">
            How It Works
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Three simple steps to unlock AI-powered creativity.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((s, i) => (
            <motion.div
              key={s.step}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="text-center relative"
            >
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-12 left-[60%] w-[80%] h-px bg-gradient-to-r from-border to-transparent" />
              )}
              <div className="w-20 h-20 rounded-2xl glass mx-auto mb-6 flex items-center justify-center relative">
                <s.icon className="w-8 h-8 text-primary" />
                <span className="absolute -top-2 -right-2 text-xs font-bold bg-primary text-primary-foreground w-6 h-6 rounded-full flex items-center justify-center">
                  {s.step}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">{s.title}</h3>
              <p className="text-sm text-muted-foreground">{s.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
