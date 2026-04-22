import { Link } from 'react-router-dom';

export default function AboutSection() {
  return (
    <section id="about" className="about section">
      <div className="container">
        <div className="section-header">
          <span className="section-tag"><i className="fas fa-leaf" aria-hidden="true"></i> About Us</span>
          <h2 className="section-title">Welcome to Rainleaf Family Retreat<br /><small style={{fontSize:'0.5em',fontWeight:400,letterSpacing:'1px'}}>Best Private Pool Villa Resort in Wayanad, Kerala</small></h2>
        </div>
        <div className="about-grid">
          <div className="about-images">
            <div className="about-img about-img-1">
              <img src="/images/about-aerial.jpeg" alt="Aerial view of Rainleaf Family Retreat — private pool villa resort in Wayanad, Kerala" loading="lazy" width="800" height="600" />
            </div>
            <div className="about-img about-img-2">
              <img src="/images/gallery-pool-night.jpeg" alt="Private swimming pool at night at Rainleaf Wayanad resort" loading="lazy" width="800" height="600" />
            </div>
            <div className="about-experience">
              <span className="exp-number">3</span>
              <span className="exp-text">Private<br />Villas</span>
            </div>
          </div>
          <div className="about-content">
            <p className="about-text"><strong>Rainleaf Family Retreat</strong> is the top-rated <strong>private pool villa resort in Wayanad, Kerala</strong>. Tucked into the lush green hills near Kaniyambetta, our retreat offers 3 beautifully designed private villas — each with its own swimming pool — perfect for families and honeymoon couples seeking privacy, luxury and tranquility in Wayanad.</p>
            <p className="about-text">Surrounded by the Western Ghats, wake up to misty mountain views, enjoy authentic Kerala cuisine, experience bonfire nights under the stars, and explore the best trekking trails in Wayanad. Whether you're looking for a luxury Wayanad resort, a family villa with pool, or a honeymoon hideaway near Kalpetta, Meppadi or Banasura Sagar Dam — your perfect holiday starts here.</p>
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
            <Link to="/availability" className="btn btn-primary">Book Your Stay</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
