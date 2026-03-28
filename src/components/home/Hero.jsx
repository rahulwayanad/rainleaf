import { Link } from 'react-router-dom';

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero-overlay"></div>
      <div className="container hero-content">
        <p className="hero-subtitle">Welcome to Rainleaf Family Retreat</p>
        <h1 className="hero-title">YOUR PRIVATE GETAWAY<br />IN WAYANAD</h1>
        <p className="hero-desc">3 exclusive private villas with swimming pool, nestled in the serene hills of Wayanad, Kerala. The perfect family retreat.</p>
        <div className="hero-buttons">
          <a href="/#villas" className="btn btn-primary">Explore Villas</a>
          <Link to="/contact" className="btn btn-outline">Book Now</Link>
        </div>
      </div>
      <div className="hero-scroll">
        <span>Scroll Down</span>
        <i className="fas fa-chevron-down"></i>
      </div>
    </section>
  );
}
