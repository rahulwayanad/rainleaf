import { Link } from 'react-router-dom';

export default function AboutSection() {
  return (
    <section id="about" className="about section">
      <div className="container">
        <div className="section-header">
          <span className="section-tag"><i className="fas fa-leaf"></i> About Us</span>
          <h2 className="section-title">Welcome to<br />Rainleaf Family Retreat</h2>
        </div>
        <div className="about-grid">
          <div className="about-images">
            <div className="about-img about-img-1">
              <img src="/images/about-aerial.jpeg" alt="Aerial view of Rainleaf Family Retreat" loading="lazy" />
            </div>
            <div className="about-img about-img-2">
              <img src="/images/gallery-pool-night.jpeg" alt="Private pool at night" loading="lazy" />
            </div>
            <div className="about-experience">
              <span className="exp-number">3</span>
              <span className="exp-text">Private<br />Villas</span>
            </div>
          </div>
          <div className="about-content">
            <p className="about-text">Rainleaf Family Retreat is your private paradise in the lush green hills of Wayanad, Kerala. Located near Kaniyambetta, our retreat offers 3 beautifully designed private villas, each with its own swimming pool - perfect for families seeking privacy and tranquility.</p>
            <p className="about-text">Surrounded by nature, wake up to misty mountain views, enjoy home-cooked Kerala cuisine, and explore the adventurous trekking trails of Wayanad. Your family's perfect holiday starts here.</p>
            <div className="about-features">
              <div className="about-feature">
                <i className="fas fa-home"></i>
                <div>
                  <h4>Private Villas</h4>
                  <p>Entire house exclusively for your family</p>
                </div>
              </div>
              <div className="about-feature">
                <i className="fas fa-swimming-pool"></i>
                <div>
                  <h4>Private Pool</h4>
                  <p>Each villa comes with its own swimming pool</p>
                </div>
              </div>
            </div>
            <Link to="/contact" className="btn btn-primary">Book Your Stay</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
