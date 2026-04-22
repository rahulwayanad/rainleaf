import SEO from '../components/common/SEO';
import StructuredData from '../components/common/StructuredData';
import PageHero from '../components/common/PageHero';
import ContactInfo from '../components/contact/ContactInfo';
import ContactForm from '../components/contact/ContactForm';
import MapSection from '../components/contact/MapSection';

export default function ContactPage() {
  return (
    <>
      <SEO
        title="Contact & Book a Wayanad Private Pool Villa"
        canonicalPath="/contact"
        description="Contact Rainleaf Family Retreat, Wayanad's top-rated private pool villa resort, near Kaniyambetta, Kerala. Call +91 70126 05966 or WhatsApp for the best direct-booking rate on private villa stays."
        keywords="contact Rainleaf Wayanad, Wayanad resort contact number, book villa Wayanad, Rainleaf Family Retreat phone, resort booking Kaniyambetta, best Wayanad resort booking, family villa booking Kerala, Wayanad resort WhatsApp"
        image="https://www.rainleafresort.com/images/gallery-pool-night.jpeg"
      />
      <StructuredData page="contact" />
      <PageHero title="CONTACT" breadcrumbLabel="Contact" />
      <section className="contact-section section">
        <div className="container">
          <div className="contact-grid">
            <ContactInfo />
            <ContactForm />
          </div>
        </div>
      </section>
      <MapSection />
    </>
  );
}
