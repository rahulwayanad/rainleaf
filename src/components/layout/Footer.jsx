import { Link } from 'react-router-dom';

export default function Footer() {
  const galleryThumbs = [
    { src: '/images/gallery-pool-night.jpeg', alt: 'Pool night' },
    { src: '/images/gallery-villa-pool.jpeg', alt: 'Villa pool' },
    { src: '/images/gallery-bedroom.jpeg', alt: 'Bedroom' },
    { src: '/images/gallery-kitchen.jpeg', alt: 'Kitchen' },
    { src: '/images/gallery-living.jpeg', alt: 'Living room' },
    { src: '/images/gallery-aerial-night.jpeg', alt: 'Aerial night' },
  ];

  return (
    <footer className="footer">
      {/* Footer Top */}
      <div className="footer-top">
        <div className="container">
          <Link to="/" className="logo footer-logo">
            <span className="logo-icon">&#127807;</span>
            <span className="logo-text">RAINLEAF<br /><small>FAMILY RETREAT</small></span>
          </Link>
          <div className="footer-nav-icons">
            <a href="/#villas" className="footer-nav-icon">
              <span className="footer-icon-circle"><i className="fas fa-home"></i></span>
              <span>Villas</span>
            </a>
            <Link to="/services" className="footer-nav-icon">
              <span className="footer-icon-circle"><i className="fas fa-concierge-bell"></i></span>
              <span>Services</span>
            </Link>
            <Link to="/contact" className="footer-nav-icon">
              <span className="footer-icon-circle"><i className="fas fa-envelope"></i></span>
              <span>Contact</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Footer Main */}
      <div className="footer-main">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-col">
              <h3>Contact Info</h3>
              <ul className="contact-list">
                <li><i className="fas fa-phone"></i> <a href="tel:+91XXXXXXXXXX">+91 XXXXXXXXXX</a></li>
                <li><i className="fas fa-envelope"></i> info@rainleafretreat.com</li>
                <li><i className="fas fa-map-marker-alt"></i> Rainleaf Family Retreat, Near GHSS, Kaniyambetta, Wayanad, Kerala 673121</li>
              </ul>
              <div className="footer-social">
                <a href="#"><i className="fab fa-facebook-f"></i></a>
                <a href="#"><i className="fab fa-instagram"></i></a>
                <a href="#"><i className="fab fa-whatsapp"></i></a>
                <a href="#"><i className="fab fa-youtube"></i></a>
              </div>
            </div>
            <div className="footer-col">
              <h3>Useful Links</h3>
              <ul>
                <li><Link to="/">Home</Link></li>
                <li><a href="/#about">About Us</a></li>
                <li><a href="/#villas">Our Villas</a></li>
                <li><Link to="/services">Services</Link></li>
                <li><Link to="/contact">Contact Us</Link></li>
              </ul>
            </div>
            <div className="footer-col">
              <h3>Gallery</h3>
              <div className="footer-gallery">
                {galleryThumbs.map((img) => (
                  <a href="/#gallery" key={img.alt}>
                    <img src={img.src} alt={img.alt} loading="lazy" />
                  </a>
                ))}
              </div>
            </div>
            <div className="footer-col footer-col-newsletter">
              <h3>Newsletter</h3>
              <p>Subscribe to get the latest offers and updates from Rainleaf Family Retreat.</p>
              <form className="footer-newsletter-form" onSubmit={(e) => e.preventDefault()}>
                <input type="email" placeholder="Your Email" />
                <button type="submit">Subscribe</button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="footer-bottom">
        <div className="container">
          <p>&copy; 2026 Rainleaf Family Retreat. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
