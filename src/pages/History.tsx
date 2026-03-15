import { Clock } from "lucide-react";

const historyItems = [
  { type: "Chat", title: "Marketing strategy ideas", time: "2h ago" },
  { type: "Image", title: "Sunset landscape 4K", time: "5h ago" },
  { type: "Blog", title: "10 Tips for Productivity", time: "Yesterday" },
  { type: "Script", title: "Product launch video", time: "2 days ago" },
  { type: "Logo", title: "TechStart brand logo", time: "3 days ago" },
  { type: "Prompt", title: "SEO content strategy prompt", time: "4 days ago" },
];

const History = () => {
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-heading text-foreground mb-6">History</h1>
      {historyItems.length > 0 ? (
        <div className="space-y-2">
          {historyItems.map((item, i) => (
            <div key={i} className="glass-card rounded-xl px-5 py-3.5 flex items-center justify-between group cursor-pointer hover:-translate-y-0.5 transition-all duration-300">
              <div className="flex items-center gap-3">
                <span className="text-micro text-muted-foreground/60 font-medium uppercase w-12">{item.type}</span>
                <span className="text-caption font-medium text-foreground">{item.title}</span>
              </div>
              <span className="text-micro text-muted-foreground/50">{item.time}</span>
            </div>
          ))}
        </div>
      ) : (
        <div className="glass-card rounded-2xl p-16 text-center">
          <div className="w-14 h-14 rounded-2xl bg-secondary/50 flex items-center justify-center mx-auto mb-5">
            <Clock className="w-7 h-7 text-muted-foreground/30" />
          </div>
          <h3 className="text-body-lg font-semibold text-foreground mb-2">No history yet</h3>
          <p className="text-caption text-muted-foreground/60 max-w-xs mx-auto">Your generation history will appear here.</p>
        </div>
      )}
    </div>
  );
};

export default History;
