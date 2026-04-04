import { motion } from "framer-motion";
import { MessageSquare, Image, ImageIcon, Palette, Video, Wand2, Film, Type, Camera, CreditCard, Scissors, TrendingUp, Heart, Clock, Crown } from "lucide-react";
import { Link } from "react-router-dom";
import { useI18n } from "@/lib/i18n";

const FeaturesSection = () => {
  const { t } = useI18n();

  const tools = [
    { icon: Camera, title: "Passport Photo Pro", description: "Professional passport & visa photos with AI-perfect crop and background.", path: "/dashboard/photo", color: "from-primary/20 to-primary/5", badge: "🔥 Popular", badgeType: "popular" as const },
    { icon: CreditCard, title: "ID Card Pro", description: "Premium student, employee & corporate ID cards with smart templates.", path: "/dashboard/id-card", color: "from-accent/20 to-accent/5", badge: "⭐ Pro", badgeType: "pro" as const },
    { icon: Scissors, title: "Hair Design AI", description: "AI hairstyle transformation — see your new look before the cut.", path: "/dashboard/hair-design", color: "from-primary/15 to-accent/5", badge: "🆕 New", badgeType: "new" as const },
    { icon: ImageIcon, title: "Thumbnail Generator", description: "Create viral YouTube thumbnails that get clicks and views.", path: "/dashboard/thumbnail", color: "from-accent/15 to-primary/5", badge: "❤️ Creator Fav", badgeType: "favorite" as const },
    { icon: MessageSquare, title: "AI Chat", description: "Smart conversations powered by AI. Ask anything, get instant answers.", path: "/dashboard/chat", color: "from-primary/20 to-primary/5" },
    { icon: Wand2, title: "Prompt Generator", description: "Craft perfect AI prompts for any platform in seconds.", path: "/dashboard/prompt", color: "from-accent/20 to-accent/5", badge: "⚡ Trending", badgeType: "trending" as const },
    { icon: Palette, title: "Logo Generator", description: "Professional brand logos with AI-powered design intelligence.", path: "/dashboard/logo", color: "from-primary/15 to-accent/5" },
    { icon: Image, title: "Image Generator", description: "Stunning AI images in any style — photorealistic to digital art.", path: "/dashboard/image", color: "from-primary/20 to-primary/5" },
    { icon: Video, title: "Script Writer", description: "Engaging video scripts optimized for maximum retention.", path: "/dashboard/script", color: "from-accent/15 to-primary/5" },
    { icon: Type, title: "Blog Writer", description: "SEO-optimized blog posts generated in seconds.", path: "/dashboard/blog", color: "from-primary/15 to-primary/5" },
    { icon: Film, title: "TikTok Scripts", description: "Hook-driven short video scripts designed to go viral.", path: "/dashboard/tiktok-script", color: "from-accent/15 to-accent/5" },
    { icon: Type, title: "Viral Captions", description: "Attention-grabbing captions for Instagram, TikTok, and more.", path: "/dashboard/caption", color: "from-primary/15 to-primary/5" },
  ];

  const badgeStyles: Record<string, string> = {
    popular: "bg-primary/15 text-primary",
    pro: "bg-accent/15 text-accent",
    new: "bg-emerald-500/15 text-emerald-400",
    favorite: "bg-pink-500/15 text-pink-400",
    trending: "bg-amber-500/15 text-amber-400",
  };

  return (
    <section id="features" className="py-28 sm:py-36 px-6 relative section-glow">
      <div className="absolute inset-0 pointer-events-none" style={{
        background: "radial-gradient(ellipse 70% 30% at 50% 0%, hsl(250 80% 65% / 0.05), transparent)"
      }} />

      <div className="max-w-6xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-6"
        >
          <p className="text-micro font-semibold text-primary uppercase tracking-widest mb-3">POWERFUL AI TOOLS</p>
          <h2 className="text-heading sm:text-display text-foreground mb-5">Everything You Need to Create</h2>
          <p className="text-body-lg text-muted-foreground max-w-lg mx-auto">12 AI-powered tools to generate content, visuals, IDs, and more — all in one platform.</p>
        </motion.div>

        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 mb-14 text-center"
        >
          {[
            { value: "12+", label: "AI Tools" },
            { value: "1M+", label: "Generations" },
            { value: "50+", label: "Countries" },
            { value: "4.9/5", label: "Satisfaction" },
          ].map((stat) => (
            <div key={stat.label}>
              <p className="text-heading font-bold text-foreground">{stat.value}</p>
              <p className="text-micro text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {tools.map((tool, i) => (
            <motion.div
              key={tool.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.04, ease: [0.16, 1, 0.3, 1] }}
            >
              <Link
                to={tool.path}
                className="group block glass-card hover-lift rounded-2xl p-5 h-full relative"
              >
                {tool.badge && (
                  <span className={`absolute top-3 right-3 text-[10px] font-bold px-2 py-0.5 rounded-full ${badgeStyles[tool.badgeType!] || "bg-primary/15 text-primary"}`}>
                    {tool.badge}
                  </span>
                )}
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${tool.color} flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110`}>
                  <tool.icon className="w-5 h-5 text-foreground" />
                </div>
                <h3 className="text-body font-semibold text-foreground mb-1.5">{tool.title}</h3>
                <p className="text-micro text-muted-foreground leading-relaxed">{tool.description}</p>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Best for line */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-caption text-muted-foreground/50 mt-10"
        >
          Best for <span className="text-muted-foreground">YouTubers</span> · <span className="text-muted-foreground">Students</span> · <span className="text-muted-foreground">Freelancers</span> · <span className="text-muted-foreground">Businesses</span> · <span className="text-muted-foreground">Agencies</span>
        </motion.p>
      </div>
    </section>
  );
};

export default FeaturesSection;
