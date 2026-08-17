import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Hero from '../components/marketing/Hero';
import FeatureGrid from '../components/marketing/FeatureGrid';
import HowItWorks from '../components/marketing/HowItWorks';
import PricingSection from '../components/marketing/PricingSection';
import Testimonials from '../components/marketing/Testimonials';
import FAQSection from '../components/marketing/FAQSection';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-25 dark:bg-gray-950">
      <Navbar />
      <Hero />
      <FeatureGrid />
      <HowItWorks />
      <PricingSection />
      <Testimonials />
      <FAQSection />
      <Footer />
    </div>
  );
}
