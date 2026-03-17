import { motion } from "framer-motion";
import { MessageSquare, Image, FileText, Palette, Video, Wand2, Send } from "lucide-react";
import { useI18n } from "@/lib/i18n";

const DashboardPreviewSection = () => {
  const { t } = useI18n();

  const tools = [
    { icon: MessageSquare, label: "Chat" },
    { icon: Image, label: "Image" },
    { icon: FileText, label: "Blog" },
    { icon: Palette, label: "Logo" },
    { icon: Video, label: "Script" },
    { icon: Wand2, label: "Prompt" },
  ];

  return (
    <section className="py-24 sm:py-32 px-6 relative">
      <div className="absolute inset-0 pointer-events-none" style={{
        background: "radial-gradient(ellipse 60% 40% at 50% 60%, hsl(200 90% 50% / 0.03), transparent)"
      }} />

      <div className="max-w-5xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-12"
        >
          <p className="text-micro font-semibold text-accent uppercase tracking-widest mb-3">{t.dashboardPreviewLabel}</p>
          <h2 className="text-heading sm:text-display text-foreground mb-4">{t.dashboardPreviewTitle}</h2>
          <p className="text-body-lg text-muted-foreground max-w-md mx-auto">{t.dashboardPreviewSubtitle}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="glass-card-highlight rounded-2xl overflow-hidden stripe-border"
        >
          {/* Mock top bar */}
          <div className="flex items-center gap-2 px-5 py-3 border-b border-border/40">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-destructive/60" />
              <div className="w-2.5 h-2.5 rounded-full bg-accent/40" />
              <div className="w-2.5 h-2.5 rounded-full bg-primary/40" />
            </div>
            <div className="flex-1 text-center">
              <span className="text-micro text-muted-foreground/50">promptnova.ai/dashboard</span>
            </div>
          </div>

          <div className="flex min-h-[320px]">
            {/* Sidebar */}
            <div className="hidden sm:flex flex-col w-48 border-r border-border/30 p-3 gap-1">
              {tools.map((tool, i) => (
                <div
                  key={tool.label}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-caption transition-colors ${
                    i === 0 ? "bg-primary/10 text-foreground" : "text-muted-foreground"
                  }`}
                >
                  <tool.icon className="w-4 h-4" />
                  <span>{tool.label}</span>
                </div>
              ))}
            </div>

            {/* Main content */}
            <div className="flex-1 p-5 flex flex-col">
              <div className="flex-1 space-y-4">
                {/* AI response bubble */}
                <div className="flex gap-3">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary/30 to-accent/20 flex items-center justify-center flex-shrink-0">
                    <MessageSquare className="w-3.5 h-3.5 text-primary" />
                  </div>
                  <div className="glass-card rounded-xl rounded-tl-sm px-4 py-3 max-w-[80%]">
                    <p className="text-caption text-muted-foreground">Hello! I'm your AI assistant. I can help you write blogs, generate images, create logos, and much more. What would you like to create today?</p>
                  </div>
                </div>

                {/* User bubble */}
                <div className="flex gap-3 justify-end">
                  <div className="bg-primary/10 rounded-xl rounded-tr-sm px-4 py-3 max-w-[70%]">
                    <p className="text-caption text-foreground">Write a blog about AI tools for content creators</p>
                  </div>
                </div>

                {/* AI typing */}
                <div className="flex gap-3">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary/30 to-accent/20 flex items-center justify-center flex-shrink-0">
                    <MessageSquare className="w-3.5 h-3.5 text-primary" />
                  </div>
                  <div className="glass-card rounded-xl rounded-tl-sm px-4 py-3">
                    <div className="flex gap-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary/50 animate-pulse" />
                      <div className="w-1.5 h-1.5 rounded-full bg-primary/50 animate-pulse" style={{ animationDelay: "0.2s" }} />
                      <div className="w-1.5 h-1.5 rounded-full bg-primary/50 animate-pulse" style={{ animationDelay: "0.4s" }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Input */}
              <div className="mt-4 flex items-center gap-2 glass rounded-xl px-4 py-2.5">
                <span className="text-caption text-muted-foreground/40 flex-1">Type your message...</span>
                <div className="w-7 h-7 rounded-lg bg-primary/20 flex items-center justify-center">
                  <Send className="w-3.5 h-3.5 text-primary" />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default DashboardPreviewSection;
