import { useState, useRef, useEffect } from "react";
import { Send, Copy, Check } from "lucide-react";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { useAuth } from "@/lib/auth";
import { streamChat } from "@/lib/ai";
import { incrementUsage, getDailyUsage, getLimit } from "@/lib/usage";
import { toast } from "@/hooks/use-toast";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const AIChat = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Hello! I'm **PromptNova AI**. How can I help you today?" },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const [usage, setUsage] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const limit = getLimit("chat");

  useEffect(() => {
    if (user) getDailyUsage(user.id, "chat").then(setUsage);
  }, [user]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading || !user) return;
    if (usage >= limit) {
      toast({ title: "Daily limit reached", description: `You've used all ${limit} chat messages for today.`, variant: "destructive" });
      return;
    }

    const userMsg: Message = { role: "user", content: input.trim() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    const ok = await incrementUsage(user.id, "chat");
    if (!ok) {
      toast({ title: "Limit reached", description: "Daily chat limit exceeded.", variant: "destructive" });
      setIsLoading(false);
      return;
    }
    setUsage((u) => u + 1);

    let assistantContent = "";
    const updateAssistant = (chunk: string) => {
      assistantContent += chunk;
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (last?.role === "assistant" && prev.length === newMessages.length + 1) {
          return prev.map((m, i) => (i === prev.length - 1 ? { ...m, content: assistantContent } : m));
        }
        return [...prev, { role: "assistant", content: assistantContent }];
      });
    };

    await streamChat({
      messages: newMessages,
      onDelta: updateAssistant,
      onDone: () => setIsLoading(false),
      onError: (err) => {
        toast({ title: "Error", description: err, variant: "destructive" });
        setIsLoading(false);
      },
    });
  };

  const copyMessage = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  return (
    <div className="max-w-3xl mx-auto h-[calc(100vh-7rem)] flex flex-col">
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-heading text-foreground">AI Chat</h1>
        <span className="text-micro text-muted-foreground bg-secondary/50 px-3 py-1 rounded-lg">
          {usage}/{limit} today
        </span>
      </div>

      <div ref={scrollRef} className="flex-1 glass-card rounded-2xl p-5 overflow-y-auto space-y-4 mb-4">
        {messages.map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-caption relative group ${
              msg.role === "user"
                ? "bg-foreground text-background rounded-br-md"
                : "bg-secondary/60 text-foreground rounded-bl-md"
            }`}>
              {msg.role === "assistant" ? (
                <div className="prose prose-sm prose-invert max-w-none">
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>
              ) : (
                msg.content
              )}
              {msg.role === "assistant" && (
                <button
                  onClick={() => copyMessage(msg.content, i)}
                  className="absolute -right-1 -top-1 opacity-0 group-hover:opacity-100 transition-all bg-card border border-border rounded-lg p-1.5 shadow-lg"
                >
                  {copiedIdx === i ? <Check className="w-3 h-3 text-accent" /> : <Copy className="w-3 h-3 text-muted-foreground" />}
                </button>
              )}
            </div>
          </motion.div>
        ))}
        {isLoading && messages[messages.length - 1]?.role !== "assistant" && (
          <div className="flex justify-start">
            <div className="bg-secondary/60 rounded-2xl rounded-bl-md px-4 py-3 flex gap-1.5">
              <span className="w-1.5 h-1.5 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
              <span className="w-1.5 h-1.5 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
              <span className="w-1.5 h-1.5 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
          </div>
        )}
      </div>

      <div className="glass-card-highlight rounded-2xl p-1.5 flex items-center gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
          placeholder="Type your message..."
          className="flex-1 bg-transparent px-4 py-2.5 text-caption text-foreground placeholder:text-muted-foreground/40 focus:outline-none"
        />
        <button
          onClick={handleSend}
          disabled={isLoading || !input.trim()}
          className="bg-foreground text-background p-2.5 rounded-xl hover:bg-foreground/90 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default AIChat;
