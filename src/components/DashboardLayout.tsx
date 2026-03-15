import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, MessageSquare, Image, FileText, Palette, Video,
  Wand2, Film, ImageIcon, Clock, User, Menu, X, LogOut, ChevronRight,
} from "lucide-react";
import logo from "@/assets/logo.png";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
  { icon: MessageSquare, label: "AI Chat", path: "/dashboard/chat" },
  { icon: Image, label: "Image Generator", path: "/dashboard/image" },
  { icon: FileText, label: "Blog Writer", path: "/dashboard/blog" },
  { icon: Palette, label: "Logo Generator", path: "/dashboard/logo" },
  { icon: Video, label: "Script Generator", path: "/dashboard/script" },
  { icon: Wand2, label: "Prompt Generator", path: "/dashboard/prompt" },
  { icon: Film, label: "Video Script Writer", path: "/dashboard/video-script" },
  { icon: ImageIcon, label: "Thumbnail Generator", path: "/dashboard/thumbnail" },
  { icon: Clock, label: "History", path: "/dashboard/history" },
  { icon: User, label: "Account", path: "/dashboard/account" },
];

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background flex">
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      <aside className={`fixed lg:sticky top-0 left-0 h-screen w-[260px] bg-sidebar z-50 flex flex-col transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
        <div className="absolute top-0 right-0 bottom-0 w-px bg-sidebar-border" />

        <div className="p-5 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <img src={logo} alt="PromptNova AI" className="w-7 h-7 rounded-lg" />
            <span className="font-semibold tracking-tight text-foreground text-body">PromptNova</span>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-muted-foreground hover:text-foreground transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto mt-2">
          {navItems.map((item) => {
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2 rounded-xl text-caption transition-all duration-200 group relative ${
                  active ? "text-foreground font-medium" : "text-sidebar-foreground hover:text-foreground"
                }`}
              >
                {active && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute inset-0 bg-sidebar-accent rounded-xl"
                    transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
                  />
                )}
                <span className="relative flex items-center gap-3">
                  <item.icon className={`w-4 h-4 ${active ? "text-primary" : "text-muted-foreground group-hover:text-foreground"} transition-colors`} />
                  {item.label}
                </span>
                {active && <ChevronRight className="w-3 h-3 ml-auto text-muted-foreground relative" />}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 mt-auto">
          <div className="h-px bg-sidebar-border mb-3" />
          <Link
            to="/"
            className="flex items-center gap-3 px-3 py-2 rounded-xl text-caption text-sidebar-foreground hover:text-foreground transition-all group"
          >
            <LogOut className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
            Log out
          </Link>
        </div>
      </aside>

      <div className="flex-1 min-w-0">
        <header className="sticky top-0 z-30 glass-strong h-14 flex items-center px-6 lg:hidden">
          <button onClick={() => setSidebarOpen(true)} className="text-muted-foreground hover:text-foreground transition-colors">
            <Menu className="w-5 h-5" />
          </button>
          <span className="ml-3 text-caption font-medium text-foreground">
            {navItems.find(n => n.path === location.pathname)?.label || "Dashboard"}
          </span>
        </header>
        <main className="p-6 lg:p-10">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
