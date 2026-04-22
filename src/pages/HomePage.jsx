import SEO from '../components/common/SEO';
import StructuredData from '../components/common/StructuredData';
import Hero from '../components/home/Hero';
import BookingBar from '../components/home/BookingBar';
import AboutSection from '../components/home/AboutSection';
import VillasSection from '../components/home/VillasSection';
import ServicesPreview from '../components/home/ServicesPreview';
import CtaBanner from '../components/home/CtaBanner';
import GallerySection from '../components/home/GallerySection';

export default function HomePage() {
  return (
    <>
      <SEO
        canonicalPath="/"
        description="Rainleaf Family Retreat — Wayanad's top-rated private-pool villa resort. 3 exclusive villas with swimming pools near Kaniyambetta, Kerala. Complimentary Kerala breakfast, bonfire, guided trekking & free WiFi. Book direct for the best rate."
        keywords="resorts in Wayanad, best resort in Wayanad, Wayanad resort, luxury resort Wayanad, private pool villa Wayanad, villa with private pool Wayanad, family resort Wayanad, Wayanad homestay with pool, Kaniyambetta resort, honeymoon resort Wayanad, Rainleaf Family Retreat, Rainleaf Resort Wayanad, resort near Kalpetta, resort near Meppadi, Wayanad Kerala resort booking, private villa Kerala, Wayanad accommodation"
      />
      <StructuredData page="home" />
      <Hero />
      <BookingBar />
      <AboutSection />
      <VillasSection />
      <ServicesPreview />
      <CtaBanner />
      <GallerySection />
    </>
  );
}
