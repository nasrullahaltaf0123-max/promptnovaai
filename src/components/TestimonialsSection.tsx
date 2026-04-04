import { motion } from "framer-motion";
import { Star, Quote, Globe, BarChart3, Users, Award } from "lucide-react";

const testimonials = [
  {
    name: "Rafiq Ahmed",
    role: "YouTube Creator",
    text: "PromptNova AI cut my content creation time by 80%. The thumbnail and script generators are insanely good.",
    rating: 5,
  },
  {
    name: "Nusrat Jahan",
    role: "Digital Marketer",
    text: "I use the blog writer and caption generator daily. My engagement rates have tripled since I started.",
    rating: 5,
  },
  {
    name: "Imran Hossain",
    role: "Freelance Designer",
    text: "The logo generator saved me hours of brainstorming. My clients love the concepts it produces.",
    rating: 5,
  },
  {
    name: "Fatima Khan",
    role: "TikTok Creator",
    text: "Viral captions and TikTok scripts on demand — this tool is a game changer for short-form content.",
    rating: 5,
  },
];

const stats = [
  { icon: Users, value: "12,000+", label: "Active Creators" },
  { icon: Globe, value: "50+", label: "Countries" },
  { icon: BarChart3, value: "1M+", label: "AI Generations" },
  { icon: Award, value: "4.9/5", label: "Satisfaction" },
];

const container = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const } } };

const TestimonialsSection = () => (
  <section className="py-24 sm:py-32 px-6 relative overflow-hidden section-glow">
    <div className="absolute inset-0 pointer-events-none" style={{
      background: "radial-gradient(ellipse 60% 40% at 50% 50%, hsl(250 80% 65% / 0.04), transparent)"
    }} />

    <div className="max-w-6xl mx-auto relative">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-14"
      >
        <span className="text-micro font-semibold tracking-widest uppercase text-primary mb-3 block">SOCIAL PROOF</span>
        <h2 className="text-heading sm:text-display leading-tight">
          <span className="gradient-text">Loved by Creators</span>
        </h2>
        <p className="text-caption sm:text-body text-muted-foreground mt-3 max-w-md mx-auto">
          Join thousands of creators who trust PromptNova AI for their content needs.
        </p>
      </motion.div>

      {/* Stats grid */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12"
      >
        {stats.map((stat) => (
          <div key={stat.label} className="glass-card rounded-2xl p-5 text-center hover-lift">
            <stat.icon className="w-5 h-5 text-primary mx-auto mb-2" />
            <p className="text-heading font-bold text-foreground">{stat.value}</p>
            <p className="text-micro text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </motion.div>

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5"
      >
        {testimonials.map((t) => (
          <motion.div
            key={t.name}
            variants={item}
            className="glass-card-highlight hover-lift rounded-2xl p-6 relative group"
          >
            <Quote className="w-8 h-8 text-primary/10 absolute top-5 right-5" />
            <div className="flex gap-0.5 mb-3">
              {Array.from({ length: t.rating }).map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-primary text-primary" />
              ))}
            </div>
            <p className="text-caption text-muted-foreground leading-relaxed mb-4">"{t.text}"</p>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center text-[11px] font-bold text-foreground">
                {t.name.split(" ").map(n => n[0]).join("")}
              </div>
              <div>
                <p className="text-caption font-semibold text-foreground">{t.name}</p>
                <p className="text-micro text-muted-foreground">{t.role}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  </section>
);

export default TestimonialsSection;
