export default function MapSection() {
  return (
    <section className="contact-map">
      <iframe
        src="https://www.openstreetmap.org/export/embed.html?bbox=76.06%2C11.63%2C76.10%2C11.67&layer=mapnik&marker=11.65%2C76.08"
        width="100%"
        height="450"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        title="Rainleaf Family Retreat Location"
      ></iframe>
      <a
        href="https://maps.app.goo.gl/5CSZ4nXpJjuM5ck66"
        target="_blank"
        rel="noopener noreferrer"
        className="map-overlay"
      >
        <div className="map-overlay-content">
          <i className="fas fa-map-marker-alt"></i>
          <h3>Rainleaf Family Retreat</h3>
          <p>Near GHSS, Kaniyambetta, Wayanad, Kerala 673121</p>
          <span className="map-overlay-btn">Open in Google Maps <i className="fas fa-external-link-alt"></i></span>
        </div>
      </a>
    </section>
  );
}
