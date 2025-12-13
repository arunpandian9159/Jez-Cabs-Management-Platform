import {
  HeroSection,
  ServicesSection,
  StatsSection,
  HowItWorksSection,
  FleetSection,
  FeaturesSection,
  ForOwnersSection,
  TestimonialsSection,
  CTASection,
  FooterSection,
} from '../components/home';

export function Home() {
  return (
    <div className="min-h-screen bg-white">
      <HeroSection />
      <ServicesSection />
      <StatsSection />
      <HowItWorksSection />
      <FleetSection />
      <FeaturesSection />
      <ForOwnersSection />
      <TestimonialsSection />
      <CTASection />
      <FooterSection />
    </div>
  );
}
