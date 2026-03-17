import { useState } from "react";
import { Share2, Copy, Check, Twitter, Facebook } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";

interface ShareButtonProps {
  title: string;
  toolType: string;
  imageUrl?: string;
}

const ShareButton = ({ title, toolType, imageUrl }: ShareButtonProps) => {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const shareText = `🚀 Just created "${title}" using PromptNova AI!\n\nMade with PromptNova AI — Free AI tools for creators\n${window.location.origin}`;
  const shareUrl = window.location.origin;

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(shareText);
    setCopied(true);
    toast({ title: "Copied to clipboard!" });
    setTimeout(() => setCopied(false), 2000);
  };

  const shareTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`, "_blank");
  };

  const shareFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`, "_blank");
  };

  const shareNative = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: `Made with PromptNova AI`, text: shareText, url: shareUrl });
      } catch {}
    } else {
      copyToClipboard();
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 bg-primary/10 text-primary text-micro px-3 py-1.5 rounded-lg hover:bg-primary/20 transition-colors font-medium"
      >
        <Share2 className="w-3.5 h-3.5" />
        Share
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 4 }}
            className="absolute right-0 top-full mt-2 z-50 glass-card-highlight rounded-xl p-3 min-w-[180px] space-y-1"
          >
            <button onClick={shareTwitter} className="flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-micro text-foreground hover:bg-secondary/50 transition-colors">
              <Twitter className="w-3.5 h-3.5" /> Twitter / X
            </button>
            <button onClick={shareFacebook} className="flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-micro text-foreground hover:bg-secondary/50 transition-colors">
              <Facebook className="w-3.5 h-3.5" /> Facebook
            </button>
            <button onClick={copyToClipboard} className="flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-micro text-foreground hover:bg-secondary/50 transition-colors">
              {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? "Copied!" : "Copy Link"}
            </button>
            <button onClick={shareNative} className="flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-micro text-foreground hover:bg-secondary/50 transition-colors">
              <Share2 className="w-3.5 h-3.5" /> More...
            </button>
            <div className="pt-1 border-t border-border/30 mt-1">
              <p className="text-[10px] text-muted-foreground/50 text-center">Made with PromptNova AI ✨</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ShareButton;
