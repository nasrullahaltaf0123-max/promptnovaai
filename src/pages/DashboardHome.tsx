import { Link } from "react-router-dom";
import { MessageSquare, Image, FileText, Palette, Video, Zap, Clock, Sparkles } from "lucide-react";

const quickTools = [
  { icon: MessageSquare, title: "AI Chat", path: "/dashboard/chat", color: "from-primary to-primary/60" },
  { icon: Image, title: "Image Gen", path: "/dashboard/image", color: "from-accent to-accent/60" },
  { icon: FileText, title: "Blog Writer", path: "/dashboard/blog", color: "from-primary to-accent" },
  { icon: Palette, title: "Logo Gen", path: "/dashboard/logo", color: "from-accent to-primary" },
  { icon: Video, title: "Script Gen", path: "/dashboard/script", color: "from-primary/80 to-accent/80" },
];

const recentItems = [
  { type: "Chat", title: "Marketing strategy ideas", time: "2 hours ago" },
  { type: "Image", title: "Sunset landscape", time: "5 hours ago" },
  { type: "Blog", title: "10 Tips for Productivity", time: "Yesterday" },
];

const DashboardHome = () => {
  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Welcome */}
      <div className="glass rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-primary/10 to-transparent rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="relative">
          <h1 className="text-2xl font-bold tracking-tighter text-foreground mb-1">Welcome back! 👋</h1>
          <p className="text-sm text-muted-foreground">What would you like to create today?</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass rounded-2xl p-5 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Zap className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Credits Remaining</p>
            <p className="text-xl font-bold text-foreground">250</p>
          </div>
        </div>
        <div className="glass rounded-2xl p-5 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-accent" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Generations Today</p>
            <p className="text-xl font-bold text-foreground">12</p>
          </div>
        </div>
        <div className="glass rounded-2xl p-5 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Clock className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Saved Items</p>
            <p className="text-xl font-bold text-foreground">34</p>
          </div>
        </div>
      </div>

      {/* Quick Tools */}
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-4">Quick Tools</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {quickTools.map((tool) => (
            <Link
              key={tool.path}
              to={tool.path}
              className="glass rounded-2xl p-5 text-center hover:glow-violet-sm transition-all duration-300 group"
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${tool.color} flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300`}>
                <tool.icon className="w-5 h-5 text-primary-foreground" />
              </div>
              <p className="text-sm font-medium text-foreground">{tool.title}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent */}
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-4">Recent Creations</h2>
        <div className="space-y-3">
          {recentItems.map((item, i) => (
            <div key={i} className="glass rounded-xl px-5 py-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">{item.title}</p>
                <p className="text-xs text-muted-foreground">{item.type}</p>
              </div>
              <span className="text-xs text-muted-foreground">{item.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
