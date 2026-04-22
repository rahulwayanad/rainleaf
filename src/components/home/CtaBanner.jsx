import { Link } from 'react-router-dom';

export default function CtaBanner({ title, description, showStats = true, ctaText = 'Book Your Stay' }) {
  return (
    <section className="cta-banner">
      <div className="cta-overlay"></div>
      <div className="container cta-content">
        <h2>{title || 'Your Private Paradise — Top-Rated Wayanad Resort'}</h2>
        <p>{description || 'Escape to the misty hills of Wayanad, Kerala with your family. Private villas, private pools, bonfire nights, Kerala breakfast and guided trekking — book the best Wayanad resort direct for the lowest rate.'}</p>
        {showStats && (
          <div className="cta-stats">
            <div className="stat">
              <span className="stat-number">3</span>
              <span className="stat-label">Private Villas</span>
            </div>
            <div className="stat">
              <span className="stat-number">3</span>
              <span className="stat-label">Swimming Pools</span>
            </div>
            <div className="stat">
              <span className="stat-number">100%</span>
              <span className="stat-label">Privacy</span>
            </div>
            <div className="stat">
              <span className="stat-number">5<i className="fas fa-star" style={{ fontSize: '24px', marginLeft: '4px' }}></i></span>
              <span className="stat-label">Guest Experience</span>
            </div>
          </div>
        )}
        <Link to="/availability" className="btn btn-primary">{ctaText}</Link>
      </div>
    </section>
  );
}
