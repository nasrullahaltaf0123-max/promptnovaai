import { User, LogOut } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useNavigate } from "react-router-dom";

const Account = () => {
  const { profile, user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <div className="max-w-lg mx-auto">
      <h1 className="text-heading text-foreground mb-6">Account</h1>
      <div className="glass-card-highlight rounded-2xl p-7 space-y-7">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
            <User className="w-7 h-7 text-foreground/60" />
          </div>
          <div>
            <h2 className="text-body-lg font-semibold text-foreground">{profile?.full_name || "User"}</h2>
            <p className="text-caption text-muted-foreground">{profile?.email || user?.email}</p>
          </div>
        </div>
        <div className="h-px bg-border/50" />
        <div className="space-y-4">
          {[
            { label: "Plan", value: (profile?.plan || "free").charAt(0).toUpperCase() + (profile?.plan || "free").slice(1), badge: true },
            { label: "Member since", value: profile?.created_at ? new Date(profile.created_at).toLocaleDateString("en-US", { month: "long", year: "numeric" }) : "—" },
          ].map((item) => (
            <div key={item.label} className="flex items-center justify-between">
              <span className="text-caption text-muted-foreground">{item.label}</span>
              {item.badge ? (
                <span className="text-micro font-medium text-primary bg-primary/10 px-3 py-1 rounded-lg">{item.value}</span>
              ) : (
                <span className="text-caption font-medium text-foreground">{item.value}</span>
              )}
            </div>
          ))}
        </div>
        <div className="h-px bg-border/50" />
        <button onClick={handleSignOut} className="flex items-center gap-2 text-caption text-destructive hover:text-destructive/80 transition-colors">
          <LogOut className="w-4 h-4" /> Sign out
        </button>
      </div>
    </div>
  );
};

export default Account;
