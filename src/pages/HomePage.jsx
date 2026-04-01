import SEO from '../components/common/SEO';
import StructuredData from '../components/common/StructuredData';
import Hero from '../components/home/Hero';
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
        description="Rainleaf Family Retreat - 3 exclusive private villas with swimming pools in Wayanad, Kerala. Enjoy complimentary breakfast, trekking & total privacy. Book now!"
        keywords="private villa Wayanad, family resort Wayanad Kerala, homestay with pool Wayanad, Kaniyambetta resort, Rainleaf Family Retreat, private swimming pool villa Kerala"
      />
      <StructuredData page="home" />
      <Hero />
      <AboutSection />
      <VillasSection />
      <ServicesPreview />
      <CtaBanner />
      <GallerySection />
    </>
  );
}
