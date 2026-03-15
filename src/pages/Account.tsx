import { User } from "lucide-react";

const Account = () => {
  return (
    <div className="max-w-lg mx-auto">
      <h1 className="text-heading text-foreground mb-6">Account</h1>
      <div className="glass-card-highlight rounded-2xl p-7 space-y-7">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
            <User className="w-7 h-7 text-foreground/60" />
          </div>
          <div>
            <h2 className="text-body-lg font-semibold text-foreground">Demo User</h2>
            <p className="text-caption text-muted-foreground">demo@promptnova.ai</p>
          </div>
        </div>
        <div className="h-px bg-border/50" />
        <div className="space-y-4">
          {[
            { label: "Plan", value: "Pro", badge: true },
            { label: "Credits remaining", value: "250" },
            { label: "Member since", value: "March 2026" },
          ].map((item) => (
            <div key={item.label} className="flex items-center justify-between">
              <span className="text-caption text-muted-foreground">{item.label}</span>
              {item.badge ? (
                <span className="text-micro font-medium text-primary bg-primary/8 px-3 py-1 rounded-lg">{item.value}</span>
              ) : (
                <span className="text-caption font-medium text-foreground">{item.value}</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Account;
