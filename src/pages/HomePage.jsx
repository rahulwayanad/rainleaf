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
