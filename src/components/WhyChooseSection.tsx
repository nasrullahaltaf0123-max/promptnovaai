import { motion } from "framer-motion";
import { Zap, Layout, Wand2, Users } from "lucide-react";

const reasons = [
  { icon: Zap, title: "Lightning Fast AI", description: "Get results in seconds, not minutes. Our optimized models deliver at incredible speed." },
  { icon: Layout, title: "Simple Interface", description: "No learning curve. Clean, intuitive design that lets you focus on creating." },
  { icon: Wand2, title: "Powerful Creativity", description: "Advanced AI models produce professional-grade content every time." },
  { icon: Users, title: "Built for Everyone", description: "Whether you're a creator, marketer, or business — we've got you covered." },
];

const WhyChooseSection = () => {
  return (
    <section className="py-32 px-6 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/3 to-transparent" />
      <div className="max-w-6xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tighter text-foreground mb-4">
            Why Choose PromptNova
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            The smart choice for AI-powered creativity.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {reasons.map((reason, i) => (
            <motion.div
              key={reason.title}
              initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="flex gap-4 glass rounded-2xl p-6"
            >
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <reason.icon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">{reason.title}</h3>
                <p className="text-sm text-muted-foreground">{reason.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseSection;
