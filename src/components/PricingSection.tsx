import { motion } from "framer-motion";
import { Check, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Perfect for trying things out.",
    features: ["5 generations per day", "AI Chat access", "Basic image generation", "Community support"],
    cta: "Get started",
    popular: false,
  },
  {
    name: "Pro",
    price: "$19",
    period: "/mo",
    description: "For professionals who need more.",
    features: ["100 generations per day", "All AI tools", "HD image generation", "Priority support", "Save & export"],
    cta: "Start free trial",
    popular: true,
  },
  {
    name: "Creator",
    price: "$49",
    period: "/mo",
    description: "Unlimited power for teams.",
    features: ["Unlimited generations", "All AI tools", "4K image generation", "API access", "Team collaboration", "Dedicated support"],
    cta: "Contact sales",
    popular: false,
  },
];

const PricingSection = () => {
  return (
    <section id="pricing" className="py-32 sm:py-40 px-6 relative">
      <div className="absolute inset-0 pointer-events-none" style={{
        background: "radial-gradient(ellipse 70% 40% at 50% 50%, hsl(259 75% 62% / 0.025), transparent)"
      }} />

      <div className="max-w-5xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-20"
        >
          <p className="text-micro font-medium text-primary uppercase tracking-widest mb-4">Pricing</p>
          <h2 className="text-display text-foreground mb-5">
            Simple, transparent pricing
          </h2>
          <p className="text-subheading text-muted-foreground max-w-md mx-auto">
            Start free. Upgrade when you're ready.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              className={`rounded-2xl p-7 relative flex flex-col ${
                plan.popular
                  ? "glass-card-highlight stripe-border"
                  : "glass-card"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-gradient-to-r from-primary to-accent text-primary-foreground text-micro font-semibold px-3.5 py-1 rounded-full shadow-lg shadow-primary/20">
                    Most popular
                  </span>
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-body-lg font-semibold text-foreground mb-1">{plan.name}</h3>
                <p className="text-caption text-muted-foreground">{plan.description}</p>
              </div>

              <div className="mb-7">
                <span className="text-display font-extrabold text-foreground">{plan.price}</span>
                <span className="text-caption text-muted-foreground ml-1">{plan.period}</span>
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5">
                    <div className="w-4 h-4 rounded-full bg-accent/10 flex items-center justify-center mt-0.5 flex-shrink-0">
                      <Check className="w-2.5 h-2.5 text-accent" />
                    </div>
                    <span className="text-caption text-muted-foreground">{f}</span>
                  </li>
                ))}
              </ul>

              <Link
                to="/signup"
                className={`group flex items-center justify-center gap-2 py-2.5 rounded-xl text-body font-medium transition-all duration-300 ${
                  plan.popular
                    ? "bg-foreground text-background hover:bg-foreground/90"
                    : "bg-secondary hover:bg-secondary/80 text-foreground"
                }`}
              >
                {plan.cta}
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
