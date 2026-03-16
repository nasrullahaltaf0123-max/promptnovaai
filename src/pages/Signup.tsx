import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Sparkles, Eye, EyeOff, ArrowRight, Loader2 } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { toast } from "@/hooks/use-toast";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await signUp(email, password, name);
    setLoading(false);
    if (error) {
      toast({ title: "Signup failed", description: error, variant: "destructive" });
    } else {
      toast({ title: "Account created!", description: "Please check your email to verify your account." });
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6 relative overflow-hidden">
      <div className="absolute w-[500px] h-[500px] rounded-full opacity-60 pointer-events-none" style={{
        top: "20%", left: "20%",
        background: "radial-gradient(circle, hsl(259 75% 62% / 0.04), transparent)",
        animation: "orb-float-1 20s ease-in-out infinite",
      }} />
      <div className="absolute w-[400px] h-[400px] rounded-full opacity-60 pointer-events-none" style={{
        bottom: "20%", right: "20%",
        background: "radial-gradient(circle, hsl(187 92% 43% / 0.03), transparent)",
        animation: "orb-float-2 25s ease-in-out infinite",
      }} />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-sm relative"
      >
        <div className="text-center mb-10">
          <Link to="/" className="inline-flex items-center gap-2.5 mb-8">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary via-primary/80 to-accent flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="text-body-lg font-semibold tracking-tight text-foreground">PromptNova AI</span>
          </Link>
          <h1 className="text-heading text-foreground">Create your account</h1>
          <p className="text-caption text-muted-foreground mt-2">Start creating with AI in seconds</p>
        </div>

        <form onSubmit={handleSubmit} className="glass-card-highlight rounded-2xl p-6 space-y-5">
          <div>
            <label className="text-caption font-medium text-foreground mb-2 block">Full name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe" className="w-full bg-secondary/40 border border-border/50 rounded-xl px-4 py-2.5 text-caption text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/30 transition-all" required />
          </div>
          <div>
            <label className="text-caption font-medium text-foreground mb-2 block">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="w-full bg-secondary/40 border border-border/50 rounded-xl px-4 py-2.5 text-caption text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/30 transition-all" required />
          </div>
          <div>
            <label className="text-caption font-medium text-foreground mb-2 block">Password</label>
            <div className="relative">
              <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="w-full bg-secondary/40 border border-border/50 rounded-xl px-4 py-2.5 text-caption text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/30 transition-all pr-10" required minLength={6} />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/50 hover:text-muted-foreground transition-colors">
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <button type="submit" disabled={loading} className="group w-full flex items-center justify-center gap-2 bg-foreground text-background font-medium py-2.5 rounded-xl hover:bg-foreground/90 transition-all duration-200 text-caption disabled:opacity-50">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Create account <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" /></>}
          </button>
        </form>

        <p className="text-center text-caption text-muted-foreground mt-8">
          Already have an account?{" "}
          <Link to="/login" className="text-foreground hover:text-primary font-medium transition-colors">Sign in</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Signup;
