import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { I18nProvider } from "@/lib/i18n";
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
import History from "./pages/History";
import Account from "./pages/Account";
import DashboardLayout from "./components/DashboardLayout";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <I18nProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/dashboard" element={<DashboardLayout><DashboardHome /></DashboardLayout>} />
            <Route path="/dashboard/chat" element={<DashboardLayout><AIChat /></DashboardLayout>} />
            <Route path="/dashboard/image" element={<DashboardLayout><ImageGenerator /></DashboardLayout>} />
            <Route path="/dashboard/blog" element={<DashboardLayout><BlogWriter /></DashboardLayout>} />
            <Route path="/dashboard/logo" element={<DashboardLayout><LogoGenerator /></DashboardLayout>} />
            <Route path="/dashboard/script" element={<DashboardLayout><ScriptGenerator /></DashboardLayout>} />
            <Route path="/dashboard/prompt" element={<DashboardLayout><PromptGenerator /></DashboardLayout>} />
            <Route path="/dashboard/video-script" element={<DashboardLayout><VideoScriptWriter /></DashboardLayout>} />
            <Route path="/dashboard/thumbnail" element={<DashboardLayout><ThumbnailGenerator /></DashboardLayout>} />
            <Route path="/dashboard/history" element={<DashboardLayout><History /></DashboardLayout>} />
            <Route path="/dashboard/account" element={<DashboardLayout><Account /></DashboardLayout>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </I18nProvider>
  </QueryClientProvider>
);

export default App;
