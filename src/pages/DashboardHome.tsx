import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { MessageSquare, Image, FileText, Palette, Video, Zap, Clock, Sparkles, ArrowUpRight } from "lucide-react";

const quickTools = [
  { icon: MessageSquare, title: "AI Chat", path: "/dashboard/chat", gradient: "from-violet-500/20 to-violet-500/5" },
  { icon: Image, title: "Image Gen", path: "/dashboard/image", gradient: "from-cyan-500/20 to-cyan-500/5" },
  { icon: FileText, title: "Blog Writer", path: "/dashboard/blog", gradient: "from-blue-500/20 to-blue-500/5" },
  { icon: Palette, title: "Logo Gen", path: "/dashboard/logo", gradient: "from-purple-500/20 to-purple-500/5" },
  { icon: Video, title: "Script Gen", path: "/dashboard/script", gradient: "from-teal-500/20 to-teal-500/5" },
];

const recentItems = [
  { type: "Chat", title: "Marketing strategy ideas", time: "2h ago" },
  { type: "Image", title: "Sunset landscape", time: "5h ago" },
  { type: "Blog", title: "10 Tips for Productivity", time: "Yesterday" },
];

const stats = [
  { icon: Zap, label: "Credits", value: "250", sublabel: "remaining" },
  { icon: Sparkles, label: "Generated", value: "12", sublabel: "today" },
  { icon: Clock, label: "Saved", value: "34", sublabel: "items" },
];

const container = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } } };

const DashboardHome = () => {
  return (
    <div className="max-w-5xl mx-auto">
      <motion.div variants={container} initial="hidden" animate="show" className="space-y-8">
        {/* Welcome */}
        <motion.div variants={item} className="glass-card-highlight rounded-2xl p-7 relative overflow-hidden">
          <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full opacity-30" style={{
            background: "radial-gradient(circle, hsl(259 75% 62% / 0.15), transparent)"
          }} />
          <div className="relative">
            <h1 className="text-heading text-foreground mb-1.5">Welcome back 👋</h1>
            <p className="text-caption text-muted-foreground">What would you like to create today?</p>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div variants={item} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {stats.map((s) => (
            <div key={s.label} className="glass-card rounded-2xl p-5 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-primary/8 flex items-center justify-center flex-shrink-0">
                <s.icon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-micro text-muted-foreground">{s.label} {s.sublabel}</p>
                <p className="text-heading text-foreground">{s.value}</p>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Quick Tools */}
        <motion.div variants={item}>
          <h2 className="text-body-lg font-semibold text-foreground mb-4">Quick tools</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {quickTools.map((tool) => (
              <Link
                key={tool.path}
                to={tool.path}
                className="group glass-card rounded-2xl p-5 text-center transition-all duration-300 hover:glow-violet-sm hover:-translate-y-0.5"
              >
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${tool.gradient} flex items-center justify-center mx-auto mb-3 transition-transform duration-300 group-hover:scale-110`}>
                  <tool.icon className="w-5 h-5 text-foreground" />
                </div>
                <p className="text-caption font-medium text-foreground">{tool.title}</p>
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Recent */}
        <motion.div variants={item}>
          <h2 className="text-body-lg font-semibold text-foreground mb-4">Recent creations</h2>
          <div className="space-y-2">
            {recentItems.map((ri, i) => (
              <div key={i} className="glass-card rounded-xl px-5 py-3.5 flex items-center justify-between group cursor-pointer hover:-translate-y-0.5 transition-all duration-300">
                <div className="flex items-center gap-3">
                  <span className="text-micro text-muted-foreground/60 font-medium uppercase w-10">{ri.type}</span>
                  <span className="text-caption font-medium text-foreground">{ri.title}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-micro text-muted-foreground/50">{ri.time}</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-muted-foreground/30 group-hover:text-muted-foreground transition-colors" />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default DashboardHome;
