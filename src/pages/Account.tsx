import { User } from "lucide-react";

const Account = () => {
  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold tracking-tighter text-foreground mb-6">Account</h1>
      <div className="glass rounded-2xl p-6 space-y-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <User className="w-8 h-8 text-primary-foreground" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">Demo User</h2>
            <p className="text-sm text-muted-foreground">demo@promptnova.ai</p>
          </div>
        </div>
        <div className="border-t border-border pt-6 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Plan</span>
            <span className="text-sm font-medium text-foreground bg-primary/10 px-3 py-1 rounded-lg">Pro</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Credits</span>
            <span className="text-sm font-medium text-foreground">250 remaining</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Member since</span>
            <span className="text-sm font-medium text-foreground">March 2026</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;
