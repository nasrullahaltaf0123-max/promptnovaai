import { lazy, Suspense } from "react";
import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import MobileStickyCta from "../components/MobileStickyCtA";
import ScrollProgressCta from "../components/ScrollProgressCta";

const FeaturesSection = lazy(() => import("../components/FeaturesSection"));
const HowItWorksSection = lazy(() => import("../components/HowItWorksSection"));
const TestimonialsSection = lazy(() => import("../components/TestimonialsSection"));
const PricingSection = lazy(() => import("../components/PricingSection"));
const FAQSection = lazy(() => import("../components/FAQSection"));
const Footer = lazy(() => import("../components/Footer"));

const SectionFallback = () => (
  <div className="py-20 flex items-center justify-center">
    <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
  </div>
);

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <Suspense fallback={<SectionFallback />}>
        <FeaturesSection />
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <HowItWorksSection />
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <TestimonialsSection />
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <PricingSection />
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <FAQSection />
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <Footer />
      </Suspense>
      <MobileStickyCta />
      <ScrollProgressCta />
    </div>
  );
};

export default Index;
