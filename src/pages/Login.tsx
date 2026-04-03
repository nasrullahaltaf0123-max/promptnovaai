import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Sparkles, Eye, EyeOff, ArrowRight, Loader2, Shield, Zap, Lock } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { toast } from "@/hooks/use-toast";
import logoFull from "@/assets/logo-full.png";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await signIn(email, password);
    setLoading(false);
    if (error) {
      toast({ title: "Login failed", description: error, variant: "destructive" });
    } else {
      navigate("/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-stretch relative overflow-hidden">
      {/* Left branding panel — desktop only */}
      <div className="hidden lg:flex lg:w-[45%] relative items-center justify-center p-12">
        <div className="absolute inset-0" style={{
          background: "linear-gradient(135deg, hsl(225 20% 5%) 0%, hsl(250 25% 8%) 50%, hsl(225 15% 4%) 100%)"
        }} />
        <div className="absolute inset-0 pointer-events-none" style={{
          background: "radial-gradient(ellipse 80% 60% at 30% 50%, hsl(250 80% 65% / 0.08), transparent)"
        }} />
        <div className="absolute inset-0 pointer-events-none" style={{
          background: "radial-gradient(ellipse 60% 60% at 70% 70%, hsl(200 90% 50% / 0.05), transparent)"
        }} />
        <div className="relative z-10 text-center space-y-8">
          <motion.img
            src={logoFull}
            alt="PromptNova AI"
            className="h-32 mx-auto w-auto object-contain"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            style={{ filter: "drop-shadow(0 0 40px hsl(250 80% 65% / 0.3))" }}
          />
          <div className="space-y-4 max-w-xs mx-auto">
            {[
              { icon: Zap, text: "Lightning fast AI generation" },
              { icon: Shield, text: "Trusted by 1,000+ creators" },
              { icon: Lock, text: "Your data stays encrypted" },
            ].map((item) => (
              <div key={item.text} className="flex items-center gap-3 text-caption text-muted-foreground/70">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <item.icon className="w-4 h-4 text-primary/70" />
                </div>
                {item.text}
              </div>
            ))}
          </div>
          <p className="text-micro text-muted-foreground/40">Fast, secure, private AI workspace</p>
        </div>
      </div>

      {/* Right auth panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        {/* Background orbs */}
        <div className="absolute w-[500px] h-[500px] rounded-full opacity-60 pointer-events-none lg:hidden" style={{
          top: "20%", left: "20%",
          background: "radial-gradient(circle, hsl(259 75% 62% / 0.04), transparent)",
          animation: "orb-float-1 20s ease-in-out infinite",
        }} />

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-sm relative"
        >
          <div className="text-center mb-10">
            <Link to="/" className="inline-flex items-center gap-2.5 mb-8">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary via-primary/80 to-accent flex items-center justify-center shadow-lg shadow-primary/20">
                <Sparkles className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="text-body-lg font-semibold tracking-tight text-foreground">PromptNova AI</span>
            </Link>
            <h1 className="text-heading text-foreground">Welcome back</h1>
            <p className="text-caption text-muted-foreground mt-2">Sign in to continue creating</p>
          </div>

          <form onSubmit={handleSubmit} className="glass-card-premium rounded-2xl p-7 space-y-5">
            <div>
              <label className="text-caption font-medium text-foreground mb-2 block">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="w-full bg-secondary/40 border border-border/50 rounded-xl px-4 py-3 text-caption text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition-all duration-200" required />
            </div>
            <div>
              <label className="text-caption font-medium text-foreground mb-2 block">Password</label>
              <div className="relative">
                <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="w-full bg-secondary/40 border border-border/50 rounded-xl px-4 py-3 text-caption text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition-all duration-200 pr-10" required />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/40 hover:text-muted-foreground transition-colors">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading} className="cta-shine group w-full flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-accent text-primary-foreground font-semibold py-3 rounded-xl hover:brightness-110 transition-all duration-300 text-caption disabled:opacity-50 shadow-lg shadow-primary/20 hover:shadow-primary/40">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Sign in <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" /></>}
            </button>
          </form>

          <p className="text-center text-caption text-muted-foreground mt-8">
            Don't have an account?{" "}
            <Link to="/signup" className="text-primary hover:text-primary/80 font-medium transition-colors">Sign up</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;