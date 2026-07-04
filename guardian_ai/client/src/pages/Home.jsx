import HeroSection from "../sections/HeroSection";
import FeaturesSection from "../sections/FeaturesSection";
import HowItWorksSection from "../sections/HowItWorksSection";
import DashboardPreviewSection from "../sections/DashboardPreviewSection";
import TestimonialsSection from "../sections/TestimonialsSection";
import PricingSection from "../sections/PricingSection";
import ContactSection from "../sections/ContactSection";
import CTASection from "../sections/CTASection";

export default function Home() {
  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <DashboardPreviewSection />
      <TestimonialsSection />
      <PricingSection />
      <ContactSection />
      <CTASection />
    </>
  );
}