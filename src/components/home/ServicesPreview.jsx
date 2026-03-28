import services from '../../data/services';

export default function ServicesPreview() {
  return (
    <section id="services" className="services section">
      <div className="container">
        <div className="section-header">
          <span className="section-tag"><i className="fas fa-concierge-bell"></i> Our Services</span>
          <h2 className="section-title">What We Offer<br />At Rainleaf</h2>
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
