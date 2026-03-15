import { BookmarkCheck } from "lucide-react";

const SavedContent = () => {
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold tracking-tighter text-foreground mb-6">Saved Content</h1>
      <div className="glass rounded-2xl p-12 text-center">
        <BookmarkCheck className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-foreground mb-2">No saved content yet</h3>
        <p className="text-sm text-muted-foreground">Content you save from AI tools will appear here.</p>
      </div>
    </div>
  );
};

export default SavedContent;
