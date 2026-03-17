import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import FeaturesSection from "../components/FeaturesSection";
import HowItWorksSection from "../components/HowItWorksSection";
import DashboardPreviewSection from "../components/DashboardPreviewSection";
import PricingSection from "../components/PricingSection";
import Footer from "../components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <DashboardPreviewSection />
      <PricingSection />
      <Footer />
    </div>
  );
};

export default Index;
