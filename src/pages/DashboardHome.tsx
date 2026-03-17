import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { MessageSquare, Image, FileText, Palette, Video, Wand2, Film, ImageIcon, Zap, Clock, Sparkles, ArrowUpRight, Type, Clapperboard, Gift, Crown } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { useCredits } from "@/hooks/use-credits";
import GamificationWidget from "@/components/GamificationWidget";
import { UpgradeBanner } from "@/components/UpgradePrompt";

const quickTools = [
  { icon: MessageSquare, title: "AI Chat", path: "/dashboard/chat", gradient: "from-violet-500/20 to-violet-500/5" },
  { icon: Image, title: "Image Gen", path: "/dashboard/image", gradient: "from-cyan-500/20 to-cyan-500/5" },
  { icon: FileText, title: "Blog Writer", path: "/dashboard/blog", gradient: "from-blue-500/20 to-blue-500/5" },
  { icon: Palette, title: "Logo Gen", path: "/dashboard/logo", gradient: "from-purple-500/20 to-purple-500/5" },
  { icon: Video, title: "Script Gen", path: "/dashboard/script", gradient: "from-teal-500/20 to-teal-500/5" },
  { icon: Wand2, title: "Prompt Gen", path: "/dashboard/prompt", gradient: "from-pink-500/20 to-pink-500/5" },
  { icon: Film, title: "Video Script", path: "/dashboard/video-script", gradient: "from-orange-500/20 to-orange-500/5" },
  { icon: ImageIcon, title: "Thumbnails", path: "/dashboard/thumbnail", gradient: "from-emerald-500/20 to-emerald-500/5" },
  { icon: Type, title: "Viral Captions", path: "/dashboard/caption", gradient: "from-rose-500/20 to-rose-500/5" },
  { icon: Clapperboard, title: "TikTok Script", path: "/dashboard/tiktok-script", gradient: "from-fuchsia-500/20 to-fuchsia-500/5" },
];

const container = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as const } } };

const DashboardHome = () => {
  const { user, profile } = useAuth();
  const { remaining, dailyLimit, plan } = useCredits();
  const [recentItems, setRecentItems] = useState<any[]>([]);
  const [totalGenerated, setTotalGenerated] = useState(0);

  useEffect(() => {
    if (!user) return;
    getAllDailyUsage(user.id).then(setUsage);
    
    supabase
      .from("generation_history")
      .select("tool_type, title, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(5)
      .then(({ data }) => {
        if (data) setRecentItems(data as any[]);
      });

    supabase
      .from("generation_history")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id)
      .then(({ count }) => setTotalGenerated(count || 0));
  }, [user]);

  const totalUsedToday = Object.values(usage).reduce((a, b) => a + b, 0);
  const chatRemaining = getLimit("chat") - (usage.chat || 0);
  const imageRemaining = getLimit("image") - (usage.image || 0);
  const blogRemaining = getLimit("blog") - (usage.blog || 0);

  const stats = [
    { icon: Zap, label: "Chat", value: `${chatRemaining}`, sublabel: "remaining" },
    { icon: Image, label: "Images", value: `${imageRemaining}`, sublabel: "remaining" },
    { icon: FileText, label: "Blogs", value: `${blogRemaining}`, sublabel: "remaining" },
    { icon: Sparkles, label: "Generated", value: `${totalUsedToday}`, sublabel: "today" },
    { icon: Clock, label: "Total", value: `${totalGenerated}`, sublabel: "all time" },
  ];

  const formatTime = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  };

  return (
    <div className="max-w-5xl mx-auto">
      <motion.div variants={container} initial="hidden" animate="show" className="space-y-8">
        <motion.div variants={item} className="glass-card-highlight rounded-2xl p-7 relative overflow-hidden">
          <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full opacity-30" style={{
            background: "radial-gradient(circle, hsl(259 75% 62% / 0.15), transparent)"
          }} />
          <div className="relative flex items-center justify-between">
            <div>
              <h1 className="text-heading text-foreground mb-1.5">
                Welcome back{profile?.full_name ? `, ${profile.full_name}` : ""} 👋
              </h1>
              <p className="text-caption text-muted-foreground">What would you like to create today?</p>
            </div>
            <Link to="/dashboard/referrals" className="hidden sm:flex items-center gap-2 bg-primary/10 text-primary text-micro font-medium px-3 py-1.5 rounded-lg hover:bg-primary/20 transition-colors">
              <Gift className="w-3.5 h-3.5" /> Refer & Earn
            </Link>
          </div>
        </motion.div>

        {/* Gamification + Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          <motion.div variants={item} className="lg:col-span-2">
            <GamificationWidget />
          </motion.div>
          <motion.div variants={item} className="lg:col-span-3 grid grid-cols-2 sm:grid-cols-3 gap-3 content-start">
            {stats.map((s) => (
              <div key={s.label} className="glass-card rounded-2xl p-4 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <s.icon className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-micro text-muted-foreground">{s.label}</p>
                  <p className="text-body-lg font-semibold text-foreground">{s.value}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        <motion.div variants={item}>
          <h2 className="text-body-lg font-semibold text-foreground mb-4">Quick tools</h2>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {quickTools.map((tool) => (
              <Link key={tool.path} to={tool.path} className="group glass-card rounded-2xl p-4 text-center transition-all duration-300 hover:glow-violet-sm hover:-translate-y-0.5">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${tool.gradient} flex items-center justify-center mx-auto mb-2.5 transition-transform duration-300 group-hover:scale-110`}>
                  <tool.icon className="w-4.5 h-4.5 text-foreground" />
                </div>
                <p className="text-micro font-medium text-foreground">{tool.title}</p>
              </Link>
            ))}
          </div>
        </motion.div>

        <motion.div variants={item}>
          <h2 className="text-body-lg font-semibold text-foreground mb-4">Recent creations</h2>
          {recentItems.length > 0 ? (
            <div className="space-y-2">
              {recentItems.map((ri, i) => (
                <div key={i} className="glass-card rounded-xl px-5 py-3.5 flex items-center justify-between group cursor-pointer hover:-translate-y-0.5 transition-all duration-300">
                  <div className="flex items-center gap-3">
                    <span className="text-micro text-muted-foreground/60 font-medium uppercase w-12">{ri.tool_type}</span>
                    <span className="text-caption font-medium text-foreground">{ri.title}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-micro text-muted-foreground/50">{formatTime(ri.created_at)}</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-muted-foreground/30 group-hover:text-muted-foreground transition-colors" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="glass-card rounded-xl px-5 py-8 text-center">
              <p className="text-caption text-muted-foreground/50">No creations yet. Start using the tools above!</p>
            </div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default DashboardHome;
