import { useNavigate } from 'react-router-dom';
import villas from '../../data/villas';
import villaDetails from '../../data/villaDetails.json';

const today    = new Date().toISOString().split('T')[0];
const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];

export default function VillasSection() {
  const navigate = useNavigate();

  function checkVilla() {
    const params = new URLSearchParams({ check_in: today, check_out: tomorrow, guests: '2' });
    navigate(`/availability?${params.toString()}`);
  }

  return (
    <section id="villas" className="rooms section section-dark">
      <div className="container">
        <div className="section-header section-header-light">
          <span className="section-tag"><i className="fas fa-home" aria-hidden="true"></i> Our Villas</span>
          <h2 className="section-title">3 Private Pool Villas in Wayanad<br />For Your Family</h2>
          <p className="section-desc">Each villa at Rainleaf Family Retreat is a complete private house with its own swimming pool — handpicked as one of the best private villa resorts in Wayanad, Kerala for families and honeymoon couples seeking privacy and comfort.</p>
        </div>
        <div className="rooms-grid">
          {villas.map((villa) => (
            <div className="room-card" key={villa.id}>
              <div className="room-img">
                <img
                  src={villaDetails[villa.id]?.images?.[0] || villa.image}
                  alt={villa.alt}
                  loading="lazy"
                  width="800"
                  height="600"
                />
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
                <button className="btn btn-outline-light" onClick={() => checkVilla()}>
                  Check Availability
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
