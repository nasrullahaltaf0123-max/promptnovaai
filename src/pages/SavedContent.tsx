import { BookmarkCheck } from "lucide-react";

const SavedContent = () => {
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-heading text-foreground mb-6">Saved Content</h1>
      <div className="glass-card rounded-2xl p-16 text-center">
        <div className="w-14 h-14 rounded-2xl bg-secondary/50 flex items-center justify-center mx-auto mb-5">
          <BookmarkCheck className="w-7 h-7 text-muted-foreground/30" />
        </div>
        <h3 className="text-body-lg font-semibold text-foreground mb-2">Nothing saved yet</h3>
        <p className="text-caption text-muted-foreground/60 max-w-xs mx-auto">Content you save from AI tools will appear here for easy access.</p>
      </div>
    </div>
  );
};

export default SavedContent;
