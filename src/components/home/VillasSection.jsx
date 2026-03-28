import { Link } from 'react-router-dom';
import villas from '../../data/villas';

export default function VillasSection() {
  return (
    <section id="villas" className="rooms section section-dark">
      <div className="container">
        <div className="section-header section-header-light">
          <span className="section-tag"><i className="fas fa-home"></i> Our Villas</span>
          <h2 className="section-title">3 Private Villas<br />For Your Family</h2>
          <p className="section-desc">Each villa is a complete private house with its own swimming pool, designed for families who value privacy and comfort in Wayanad's beautiful landscape.</p>
        </div>
        <div className="rooms-grid">
          {villas.map((villa) => (
            <div className="room-card" key={villa.id}>
              <div className="room-img">
                <img src={villa.image} alt={villa.alt} />
              </div>
              <div className="room-info">
                <h3>{villa.name}</h3>
                <p>{villa.description}</p>
                <div className="room-amenities">
                  <span><i className="fas fa-swimming-pool"></i> Private Pool</span>
                  <span><i className="fas fa-wifi"></i> WiFi</span>
                  <span><i className="fas fa-home"></i> Full House</span>
                  <span><i className="fas fa-coffee"></i> Breakfast</span>
                </div>
                <Link to="/contact" className="btn btn-outline-light">Book Now</Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
