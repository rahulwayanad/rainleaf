import { useNavigate, useSearchParams } from 'react-router-dom';
import SEO from '../components/common/SEO';
import StructuredData from '../components/common/StructuredData';
import PageHero from '../components/common/PageHero';
import villas from '../data/villas';
import villaDetails from '../data/villaDetails.json';

export default function AvailabilityPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Carry forward any dates/guests passed in via URL (e.g. from the home page CTA).
  const checkIn  = searchParams.get('check_in')  || '';
  const checkOut = searchParams.get('check_out') || '';
  const guests   = searchParams.get('guests')    || '2';

  const handleBookNow = (villa) => {
    navigate(`/property/${villa.id}`, {
      state: { checkIn, checkOut, guests },
    });
  };

  return (
    <>
      <SEO
        title="Book Your Stay - Rainleaf Family Retreat"
        canonicalPath="/availability"
        description="Book your perfect stay at Rainleaf Family Retreat in Wayanad with our 3 private pool villas."
      />
      <StructuredData page="availability" />
      <PageHero title="BOOK YOUR STAY" breadcrumbLabel="Booking" />

      <section className="availability-section section">
        <div className="container">
          <div className="properties-grid">
            {villas.map(villa => (
              <div key={villa.id} className="property-card">
                <div className="property-images">
                  <img
                    src={villaDetails[villa.id]?.images?.[0] || villa.image}
                    alt={villa.alt}
                    className="property-main-image"
                  />
                </div>

                <div className="property-details">
                  <h3>{villa.name}</h3>
                  <p className="property-location">{villa.location}</p>
                  <p className="property-description">{villa.description}</p>

                  <div className="property-features">
                    <span>{villa.bedrooms} bedroom{villa.bedrooms !== 1 ? 's' : ''}</span>
                    <span>{villa.beds} bed{villa.beds !== 1 ? 's' : ''}</span>
                    <span>{villa.bathrooms} bath{villa.bathrooms !== 1 ? 's' : ''}</span>
                    <span>Up to {villa.guests} guests</span>
                  </div>

                  {villa.rating > 0 && (
                    <div className="property-rating">
                      <span>★ {villa.rating}</span>
                      <span>({villa.reviews} reviews)</span>
                    </div>
                  )}

                  <div className="property-price">
                    <strong>{villa.price}</strong>
                    <span> per night</span>
                  </div>

                  <button
                    className="btn btn-primary btn-full"
                    onClick={() => handleBookNow(villa)}
                  >
                    Book Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
