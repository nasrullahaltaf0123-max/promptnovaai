import { useEffect, useState } from "react";
import { Clock, Trash2 } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface HistoryItem {
  id: string;
  tool_type: string;
  title: string;
  prompt: string | null;
  result: string | null;
  created_at: string;
}

const History = () => {
  const { user } = useAuth();
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("generation_history")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(50)
      .then(({ data, error }) => {
        if (data) setItems(data as HistoryItem[]);
        if (error) console.error(error);
        setLoading(false);
      });
  }, [user]);

  const deleteItem = async (id: string) => {
    const { error } = await supabase.from("generation_history").delete().eq("id", id);
    if (!error) {
      setItems((prev) => prev.filter((i) => i.id !== id));
      toast({ title: "Deleted" });
    }
  };

  const formatTime = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto">
        <h1 className="text-heading text-foreground mb-6">History</h1>
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => <div key={i} className="shimmer h-14 rounded-xl" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-heading text-foreground mb-6">History</h1>
      {items.length > 0 ? (
        <div className="space-y-2">
          {items.map((item) => (
            <div key={item.id} className="glass-card rounded-xl px-5 py-3.5 flex items-center justify-between group hover:-translate-y-0.5 transition-all duration-300">
              <div className="flex items-center gap-3 min-w-0">
                <span className="text-micro text-muted-foreground/60 font-medium uppercase w-12 flex-shrink-0">{item.tool_type}</span>
                <span className="text-caption font-medium text-foreground truncate">{item.title}</span>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <span className="text-micro text-muted-foreground/50">{formatTime(item.created_at)}</span>
                <button onClick={() => deleteItem(item.id)} className="opacity-0 group-hover:opacity-100 text-muted-foreground/40 hover:text-destructive transition-all">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
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
