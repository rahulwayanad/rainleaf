import services from '../../data/services';

export default function ServicesPreview() {
  return (
    <section id="services" className="services section">
      <div className="container">
        <div className="section-header">
          <span className="section-tag"><i className="fas fa-concierge-bell" aria-hidden="true"></i> Our Services</span>
          <h2 className="section-title">All-Inclusive Amenities<br />At Wayanad's Best Resort</h2>
          <p className="section-desc">From a private swimming pool and complimentary Kerala breakfast to bonfire nights and guided Wayanad trekking — Rainleaf Family Retreat packs every amenity a luxury Wayanad resort should have.</p>
        </div>
        <div className="services-grid">
          {services.map((service) => (
            <div className="service-card" key={service.id}>
              <div className="service-icon"><i className={service.icon}></i></div>
              <h3>{service.title}</h3>
              <p>{service.shortDesc}</p>
              <span className={service.badge === 'included' ? 'service-badge' : 'service-badge service-badge-paid'}>
                {service.badge === 'included' ? 'Included' : 'Payable'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
