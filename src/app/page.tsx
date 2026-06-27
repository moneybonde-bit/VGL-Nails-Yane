import { BookingProvider } from '@/store/booking';
import { Header } from '@/components/ui/Header';
import { Hero } from '@/components/sections/Hero';
import { Gallery } from '@/components/sections/Gallery';
import { Services } from '@/components/sections/Services';
import { Pricing } from '@/components/sections/Pricing';
import { Testimonials } from '@/components/sections/Testimonials';
import { LocationSection } from '@/components/sections/LocationSection';
import { Faq } from '@/components/sections/Faq';
import { Footer } from '@/components/sections/Footer';
import { MobileStickyCTA } from '@/components/ui/MobileStickyCTA';
import { BookingForm } from '@/components/booking/BookingForm';
import { LocalBusinessJsonLd } from '@/components/seo/JsonLd';
import {
  getAddons,
  getFaq,
  getGallery,
  getPricing,
  getServices,
  getTestimonials,
} from '@/services/content';

export default async function HomePage() {
  // Fetch all content in parallel (each falls back to seed data if DB is empty).
  const [gallery, services, pricing, addons, testimonials, faq] = await Promise.all([
    getGallery(),
    getServices(),
    getPricing(),
    getAddons(),
    getTestimonials(),
    getFaq(),
  ]);

  return (
    <BookingProvider>
      <LocalBusinessJsonLd />
      <Header />
      <main id="main">
        <Hero />
        <Gallery items={gallery} />
        <Services services={services} />
        <Pricing tiers={pricing} addons={addons} />
        <Testimonials items={testimonials} />
        <LocationSection />
        <Faq items={faq} />
      </main>
      <Footer />
      <MobileStickyCTA />
      <BookingForm />
    </BookingProvider>
  );
}
