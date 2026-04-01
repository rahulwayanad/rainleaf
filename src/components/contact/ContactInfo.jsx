export default function ContactInfo() {
  return (
    <div className="contact-info-block">
      <span className="section-tag"><i className="fas fa-envelope"></i> Contact Us</span>
      <h2 className="contact-heading">CONTACT WITH US</h2>
      <p className="contact-desc">Experience the serenity of Wayanad at Rainleaf Family Retreat. Get in touch with us to book your private villa or for any enquiries about your stay.</p>
      <div className="contact-details">
        <div className="contact-detail-item">
          <i className="fas fa-phone"></i>
          <div>
            <h4>Phone</h4>
            <p><a href="https://wa.me/7012605966">+91 70126 05966</a></p>
          </div>
        </div>
        <div className="contact-detail-item">
          <i className="fas fa-envelope"></i>
          <div>
            <h4>Email</h4>
            <p><a href="mailto:info@rainleafresort.com">info@rainleafresort.com</a></p>
          </div>
        </div>
        <div className="contact-detail-item">
          <i className="fas fa-map-marker-alt"></i>
          <div>
            <h4>Address</h4>
            <p>Rainleaf Family Retreat, Near GHSS,<br />Kaniyambetta, Wayanad, Kerala 673121</p>
          </div>
        </div>
      </div>
    </div>
  );
}
