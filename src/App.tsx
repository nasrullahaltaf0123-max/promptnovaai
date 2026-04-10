import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { I18nProvider } from "@/lib/i18n";
import { AuthProvider, useAuth } from "@/lib/auth";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import DashboardHome from "./pages/DashboardHome";
import AIChat from "./pages/AIChat";
import ImageGenerator from "./pages/ImageGenerator";
import BlogWriter from "./pages/BlogWriter";
import LogoGenerator from "./pages/LogoGenerator";
import ScriptGenerator from "./pages/ScriptGenerator";
import PromptGenerator from "./pages/PromptGenerator";
import VideoScriptWriter from "./pages/VideoScriptWriter";
import ThumbnailGenerator from "./pages/ThumbnailGenerator";
import CaptionGenerator from "./pages/CaptionGenerator";
import TikTokScriptGenerator from "./pages/TikTokScriptGenerator";
import PhotoMaker from "./pages/PhotoMaker";
import IDCardPro from "./pages/IDCardPro";
import HairDesignAI from "./pages/HairDesignAI";
import ScriptToPrompt from "./pages/ScriptToPrompt";
import Referrals from "./pages/Referrals";
import History from "./pages/History";
import Account from "./pages/Account";
import Upgrade from "./pages/Upgrade";
import DashboardLayout from "./components/DashboardLayout";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen bg-background flex items-center justify-center"><div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>;
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <I18nProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout><DashboardHome /></DashboardLayout></ProtectedRoute>} />
              <Route path="/dashboard/chat" element={<ProtectedRoute><DashboardLayout><AIChat /></DashboardLayout></ProtectedRoute>} />
              <Route path="/dashboard/image" element={<ProtectedRoute><DashboardLayout><ImageGenerator /></DashboardLayout></ProtectedRoute>} />
              <Route path="/dashboard/blog" element={<ProtectedRoute><DashboardLayout><BlogWriter /></DashboardLayout></ProtectedRoute>} />
              <Route path="/dashboard/logo" element={<ProtectedRoute><DashboardLayout><LogoGenerator /></DashboardLayout></ProtectedRoute>} />
              <Route path="/dashboard/script" element={<ProtectedRoute><DashboardLayout><ScriptGenerator /></DashboardLayout></ProtectedRoute>} />
              <Route path="/dashboard/prompt" element={<ProtectedRoute><DashboardLayout><PromptGenerator /></DashboardLayout></ProtectedRoute>} />
              <Route path="/dashboard/video-script" element={<ProtectedRoute><DashboardLayout><VideoScriptWriter /></DashboardLayout></ProtectedRoute>} />
              <Route path="/dashboard/thumbnail" element={<ProtectedRoute><DashboardLayout><ThumbnailGenerator /></DashboardLayout></ProtectedRoute>} />
              <Route path="/dashboard/caption" element={<ProtectedRoute><DashboardLayout><CaptionGenerator /></DashboardLayout></ProtectedRoute>} />
              <Route path="/dashboard/tiktok-script" element={<ProtectedRoute><DashboardLayout><TikTokScriptGenerator /></DashboardLayout></ProtectedRoute>} />
              <Route path="/dashboard/photo-maker" element={<ProtectedRoute><DashboardLayout><PhotoMaker /></DashboardLayout></ProtectedRoute>} />
              <Route path="/dashboard/id-card" element={<ProtectedRoute><DashboardLayout><IDCardPro /></DashboardLayout></ProtectedRoute>} />
              <Route path="/dashboard/hair-design" element={<ProtectedRoute><DashboardLayout><HairDesignAI /></DashboardLayout></ProtectedRoute>} />
              <Route path="/dashboard/script-to-prompt" element={<ProtectedRoute><DashboardLayout><ScriptToPrompt /></DashboardLayout></ProtectedRoute>} />
              <Route path="/dashboard/referrals" element={<ProtectedRoute><DashboardLayout><Referrals /></DashboardLayout></ProtectedRoute>} />
              <Route path="/dashboard/upgrade" element={<ProtectedRoute><DashboardLayout><Upgrade /></DashboardLayout></ProtectedRoute>} />
              <Route path="/dashboard/history" element={<ProtectedRoute><DashboardLayout><History /></DashboardLayout></ProtectedRoute>} />
              <Route path="/dashboard/account" element={<ProtectedRoute><DashboardLayout><Account /></DashboardLayout></ProtectedRoute>} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </I18nProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
