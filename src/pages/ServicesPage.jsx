import { Link } from 'react-router-dom';
import SEO from '../components/common/SEO';
import StructuredData from '../components/common/StructuredData';
import PageHero from '../components/common/PageHero';
import ServiceBlock from '../components/services/ServiceBlock';
import CtaBanner from '../components/home/CtaBanner';
import services from '../data/services';

export default function ServicesPage() {
  const pageServices = services.filter((s) => s.image);

  return (
    <>
      <SEO
        title="Services"
        canonicalPath="/services"
        description="Explore services at Rainleaf Family Retreat - private house, private swimming pool, complimentary breakfast, campfire, trekking in Wayanad, and optional lunch & dinner."
        keywords="Rainleaf services, private villa services Wayanad, breakfast included Wayanad resort, trekking Wayanad, private pool resort Kerala, campfire Wayanad resort, campfire villa Kerala"
        image="https://www.rainleafresort.com/images/villa-3.jpeg"
      />
      <StructuredData page="services" />
      <PageHero title="SERVICES" breadcrumbLabel="Services" />

      <section className="services-page-intro section">
        <div className="container">
          <div className="services-intro-header">
            <div>
              <h2 className="services-intro-title">ENJOY COMPLETE & BEST<br />QUALITY FACILITIES</h2>
            </div>
            <div className="services-intro-line">
              <Link to="/contact" className="btn-outline-dark">Book Your Stay</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="services-page-list">
        <div className="container">
          {pageServices.map((service, index) => (
            <ServiceBlock
              key={service.id}
              number={service.number}
              title={service.title}
              description={service.fullDesc}
              image={service.image}
              badge={service.badge}
              reverse={index % 2 === 1}
            />
          ))}
        </div>
      </section>

      <CtaBanner
        title="Ready to Experience Rainleaf?"
        description="Book your private villa today and enjoy all our services amidst the serene beauty of Wayanad."
        showStats={false}
        ctaText="Book Your Stay"
      />
    </>
  );
}
