import SEO from '../components/common/SEO';
import StructuredData from '../components/common/StructuredData';
import Hero from '../components/home/Hero';
import BookingBar from '../components/home/BookingBar';
import AboutSection from '../components/home/AboutSection';
import VillasSection from '../components/home/VillasSection';
import ServicesPreview from '../components/home/ServicesPreview';
import CtaBanner from '../components/home/CtaBanner';
import GallerySection from '../components/home/GallerySection';
import AttractionsMap from '../components/home/AttractionsMap';

export default function HomePage() {
  return (
    <>
      <SEO
        canonicalPath="/"
        description="Rainleaf Family Retreat — affordable, budget-friendly private pool villas in Wayanad, Kerala. 3 exclusive villas with swimming pools near Kaniyambetta, complimentary Kerala breakfast, bonfire, guided trekking & free WiFi. Book direct for the cheapest, best-value private pool villa rate in Wayanad."
        keywords="budget friendly private pool villa Wayanad, affordable private pool villa Wayanad, cheap private pool villa Wayanad, budget resort in Wayanad, affordable resort in Wayanad, cheap resort in Wayanad with pool, budget villa with private pool Kerala, low cost pool villa Wayanad, best value private pool villa Wayanad, resorts in Wayanad, best resort in Wayanad, Wayanad resort, private pool villa Wayanad, family resort Wayanad, Wayanad homestay with pool, Kaniyambetta resort, honeymoon resort Wayanad, Rainleaf Family Retreat, resort near Kalpetta, resort near Meppadi, Wayanad accommodation"
      />
      <StructuredData page="home" />
      <Hero />
      {/* <BookingBar /> */}
      <AboutSection />
      <VillasSection />
      <ServicesPreview />
      <AttractionsMap />
      <CtaBanner />
      <GallerySection />
    </>
  );
}
