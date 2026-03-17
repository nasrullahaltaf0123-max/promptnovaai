import { Link } from "react-router-dom";
import { Crown, Lock } from "lucide-react";
import { useCredits } from "@/hooks/use-credits";

/** Small inline upgrade CTA — use in tool pages */
export const UpgradeBanner = () => {
  const { plan, remaining } = useCredits();
  if (plan === "pro") return null;

  return (
    <div className="glass-card rounded-xl p-4 flex items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <Crown className="w-5 h-5 text-primary flex-shrink-0" />
        <div>
          <p className="text-caption font-medium text-foreground">
            {remaining <= 0 ? "No credits left!" : `${remaining} credits remaining`}
          </p>
          <p className="text-micro text-muted-foreground">Upgrade to Pro for 999 daily credits</p>
        </div>
      </div>
      <Link
        to="/dashboard/upgrade"
        className="bg-gradient-to-r from-primary to-accent text-primary-foreground text-micro font-semibold px-4 py-2 rounded-lg hover:opacity-90 transition-opacity flex-shrink-0"
      >
        Upgrade
      </Link>
    </div>
  );
};

/** Locked feature overlay for free users */
export const LockedFeature = ({ feature }: { feature: string }) => {
  return (
    <div className="glass-card rounded-2xl p-8 text-center space-y-3">
      <div className="w-12 h-12 rounded-xl bg-muted/50 flex items-center justify-center mx-auto">
        <Lock className="w-6 h-6 text-muted-foreground" />
      </div>
      <h3 className="text-body-lg font-semibold text-foreground">{feature}</h3>
      <p className="text-caption text-muted-foreground">This feature is available on the Pro plan</p>
      <Link
        to="/dashboard/upgrade"
        className="inline-flex items-center gap-2 bg-gradient-to-r from-primary to-accent text-primary-foreground text-caption font-semibold px-6 py-2.5 rounded-xl hover:opacity-90 transition-opacity"
      >
        <Crown className="w-4 h-4" /> Upgrade to Pro
      </Link>
    </div>
  );
};
