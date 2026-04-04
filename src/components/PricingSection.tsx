import { motion } from "framer-motion";
import { Check, ArrowRight, Zap, Crown, Star } from "lucide-react";
import { Link } from "react-router-dom";

const PricingSection = () => {
  const plans = [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      description: "Get started with limited daily credits",
      bestFor: "Students & hobbyists",
      features: [
        "100 AI chat messages/day",
        "10 image generations/day",
        "2 blog posts/day",
        "5 logo designs/day",
        "Basic AI models",
        "Community support",
      ],
      cta: "Start Free",
      popular: false,
    },
    {
      name: "Pro",
      price: "৳99",
      oldPrice: "৳299",
      period: "/mo",
      description: "Unlimited creative power for serious creators",
      bestFor: "YouTubers, freelancers & businesses",
      badge: "🔥 Launch Offer (Limited Time)",
      subBadge: "Only for first 100 users",
      features: [
        "999 credits/day (unlimited use)",
        "All 12 AI tools unlocked",
        "Premium AI models (GPT-4 level)",
        "Priority support",
        "No watermarks",
        "Early access to new tools",
        "ID Card Pro templates",
        "Hair Design AI access",
      ],
      cta: "Upgrade to Pro",
      popular: true,
    },
    {
      name: "Creator",
      price: "$49",
      period: "/mo",
      description: "For teams and professional creators",
      bestFor: "Agencies & teams",
      features: [
        "Everything in Pro",
        "API access",
        "Team collaboration",
        "Custom brand presets",
        "Analytics dashboard",
        "Dedicated support",
        "Bulk ID generation",
        "White-label exports",
      ],
      cta: "Contact Sales",
      popular: false,
    },
  ];

  return (
    <section id="pricing" className="py-28 sm:py-36 px-6 relative section-glow">
      <div className="absolute inset-0 pointer-events-none" style={{
        background: "radial-gradient(ellipse 60% 35% at 50% 50%, hsl(250 80% 65% / 0.04), transparent)"
      }} />

      <div className="max-w-5xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16"
        >
          <p className="text-micro font-semibold text-primary uppercase tracking-widest mb-3">PRICING</p>
          <h2 className="text-heading sm:text-display text-foreground mb-5">Simple, Transparent Pricing</h2>
          <p className="text-body-lg text-muted-foreground max-w-md mx-auto">Start free, upgrade when you need more power</p>
        </motion.div>

        {/* Urgency banner */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-card-highlight rounded-xl p-3 mb-8 flex items-center justify-center gap-2 text-caption text-muted-foreground"
        >
          <Zap className="w-4 h-4 text-primary" />
          <span>⚡ Limited free credits daily — <span className="text-foreground font-medium">Upgrade to unlock full power</span></span>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              className={`rounded-2xl p-7 relative flex flex-col hover-lift ${
                plan.popular ? "glass-card-premium stripe-border scale-[1.02]" : "glass-card"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="cta-shine bg-gradient-to-r from-primary to-accent text-primary-foreground text-micro font-semibold px-4 py-1 rounded-full shadow-lg shadow-primary/30 flex items-center gap-1.5">
                    <Crown className="w-3 h-3" />
                    Most Popular
                  </span>
                </div>
              )}

              <div className="mb-4">
                <h3 className="text-body-lg font-semibold text-foreground mb-1">{plan.name}</h3>
                <p className="text-caption text-muted-foreground">{plan.description}</p>
              </div>

              {"badge" in plan && (plan as any).badge && (
                <div className="mb-3">
                  <span className="text-micro font-bold text-primary">{(plan as any).badge}</span>
                  <p className="text-micro text-muted-foreground mt-0.5">{(plan as any).subBadge}</p>
                </div>
              )}

              <div className="mb-2 flex items-baseline gap-2">
                <span className="text-display font-extrabold text-foreground">{plan.price}</span>
                {"oldPrice" in plan && (plan as any).oldPrice && (
                  <span className="text-body text-muted-foreground/50 line-through">{(plan as any).oldPrice}</span>
                )}
                <span className="text-caption text-muted-foreground">{plan.period}</span>
              </div>

              {/* Best for line */}
              <p className="text-micro text-primary/70 mb-6 flex items-center gap-1.5">
                <Star className="w-3 h-3" />
                {plan.bestFor}
              </p>

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
                className={`group flex items-center justify-center gap-2 py-3 rounded-xl text-body font-medium transition-all duration-300 ${
                  plan.popular
                    ? "cta-shine bg-gradient-to-r from-primary to-accent text-primary-foreground hover:brightness-110 shadow-lg shadow-primary/25 hover:shadow-primary/40"
                    : "bg-secondary hover:bg-secondary/80 text-foreground"
                }`}
              >
                {plan.cta}
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Guarantee */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-micro text-muted-foreground/50 mt-8"
        >
          🔒 Secure payment &nbsp;·&nbsp; Cancel anytime &nbsp;·&nbsp; 7-day money-back guarantee
        </motion.p>
      </div>
    </section>
  );
};

export default PricingSection;
