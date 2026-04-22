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
        title="Services & Amenities at the Best Wayanad Resort"
        canonicalPath="/services"
        description="All-inclusive Wayanad resort services at Rainleaf Family Retreat — private villa, private swimming pool, complimentary Kerala breakfast, bonfire, guided Wayanad trekking, in-villa lunch & dinner, free WiFi and children's play area."
        keywords="Wayanad resort amenities, private villa services Wayanad, breakfast included Wayanad resort, best Wayanad trekking resort, private pool resort Kerala, bonfire resort Wayanad, campfire villa Kerala, all inclusive Wayanad resort, resort with activities Wayanad"
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
              <Link to="/availability" className="btn-outline-dark">Book Your Stay</Link>
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
