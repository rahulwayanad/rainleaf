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
        title="Contact Us & Book Your Stay"
        canonicalPath="/contact"
        description="Contact Rainleaf Family Retreat in Wayanad, Kerala. Book your private villa with pool today. Call us or send a message for availability and pricing."
        keywords="contact Rainleaf Wayanad, book villa Wayanad, Rainleaf Family Retreat phone, resort booking Kaniyambetta, family villa booking Kerala"
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
