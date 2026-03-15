import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import DashboardHome from "./pages/DashboardHome";
import AIChat from "./pages/AIChat";
import ImageGenerator from "./pages/ImageGenerator";
import BlogWriter from "./pages/BlogWriter";
import LogoGenerator from "./pages/LogoGenerator";
import ScriptGenerator from "./pages/ScriptGenerator";
import SavedContent from "./pages/SavedContent";
import Account from "./pages/Account";
import DashboardLayout from "./components/DashboardLayout";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
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
          <Route path="/dashboard/saved" element={<DashboardLayout><SavedContent /></DashboardLayout>} />
          <Route path="/dashboard/account" element={<DashboardLayout><Account /></DashboardLayout>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
