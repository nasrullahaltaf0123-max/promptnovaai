import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

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

const container = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const } } };

const TestimonialsSection = () => (
  <section className="py-20 sm:py-28 px-6 relative overflow-hidden">
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
        <span className="text-micro font-semibold tracking-widest uppercase text-primary mb-3 block">Testimonials</span>
        <h2 className="text-heading sm:text-display-sm leading-tight">
          <span className="gradient-text">Loved by Creators</span>
        </h2>
        <p className="text-caption sm:text-body text-muted-foreground mt-3 max-w-md mx-auto">
          Join thousands of creators who trust PromptNova AI for their content needs.
        </p>
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
            className="glass-card rounded-2xl p-6 relative group hover:-translate-y-1 transition-transform duration-300"
          >
            <Quote className="w-8 h-8 text-primary/15 absolute top-5 right-5" />
            <div className="flex gap-0.5 mb-3">
              {Array.from({ length: t.rating }).map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-primary text-primary" />
              ))}
            </div>
            <p className="text-caption text-muted-foreground leading-relaxed mb-4">"{t.text}"</p>
            <div>
              <p className="text-caption font-semibold text-foreground">{t.name}</p>
              <p className="text-micro text-muted-foreground">{t.role}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.4 }}
        className="mt-10 flex flex-wrap items-center justify-center gap-6 text-micro text-muted-foreground/50"
      >
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-primary/80" />
          1,000+ active users
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-primary" />
          50,000+ generations
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-accent" />
          4.9/5 avg rating
        </span>
      </motion.div>
    </div>
  </section>
);

export default TestimonialsSection;
