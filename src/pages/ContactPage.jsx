import PageHero from '../components/common/PageHero';
import ContactInfo from '../components/contact/ContactInfo';
import ContactForm from '../components/contact/ContactForm';
import MapSection from '../components/contact/MapSection';

export default function ContactPage() {
  return (
    <>
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
