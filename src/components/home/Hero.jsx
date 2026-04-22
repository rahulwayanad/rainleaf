import { Link } from 'react-router-dom';

export default function Hero() {
  return (
    <section className="hero" aria-label="Rainleaf Family Retreat — Wayanad's best private pool villa resort">
      <div className="hero-overlay"></div>
      <div className="container hero-content">
        <p className="hero-subtitle">Welcome to Rainleaf Family Retreat</p>
        <h1 className="hero-title">YOUR PRIVATE GETAWAY<br />IN WAYANAD</h1>
        <p className="hero-desc">The top-rated luxury <strong>private pool villa resort in Wayanad, Kerala</strong>. 3 exclusive villas near Kaniyambetta, each with a private swimming pool, complimentary Kerala breakfast, bonfire and guided trekking — the perfect family retreat.</p>
        <div className="hero-buttons">
          <a href="/#villas" className="btn btn-primary">Explore Villas</a>
          <Link to="/availability" className="btn btn-outline">Book Now</Link>
        </div>
      </div>
      <div className="hero-scroll">
        <span>Scroll Down</span>
        <i className="fas fa-chevron-down" aria-hidden="true"></i>
      </div>
    </section>
  );
}
