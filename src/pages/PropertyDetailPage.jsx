import { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import SEO from '../components/common/SEO';
import StructuredData from '../components/common/StructuredData';
import villas from '../data/villas';
import villaDetails from '../data/villaDetails.json';

function addDays(dateStr, n) {
  const d = new Date(dateStr + 'T00:00:00');
  d.setDate(d.getDate() + n);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}

export default function PropertyDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const todayStr = new Date().toISOString().split('T')[0];

  const villa = useMemo(() => {
    const base = villas.find(v => String(v.id) === String(id));
    if (!base) return null;
    const fetched = villaDetails[id] || {};
    return {
      ...base,
      // Prefer fetched (real Airbnb) photos and copy when present, fall back to static.
      description: fetched.description || base.description,
      images: Array.isArray(fetched.images) && fetched.images.length > 0 ? fetched.images : base.images,
      rating: fetched.rating ?? base.rating,
      reviews: fetched.reviews || base.reviews,
    };
  }, [id]);

  const [checkIn,  setCheckIn]  = useState(location.state?.checkIn  || '');
  const [checkOut, setCheckOut] = useState(location.state?.checkOut || '');
  const [guests,   setGuests]   = useState(location.state?.guests   || '2');

  const images = villa
    ? (villa.images && villa.images.length > 0 ? villa.images : [villa.image])
    : [];

  // Lightbox
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const isLightboxOpen = lightboxIndex !== null;
  const touchStartXRef = useRef(null);

  const closeLightbox = useCallback(() => setLightboxIndex(null), []);
  const prevImage = useCallback(() => {
    setLightboxIndex(i => (i == null ? null : (i - 1 + images.length) % images.length));
  }, [images.length]);
  const nextImage = useCallback(() => {
    setLightboxIndex(i => (i == null ? null : (i + 1) % images.length));
  }, [images.length]);

  useEffect(() => {
    if (!isLightboxOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e) => {
      if (e.key === 'Escape') closeLightbox();
      else if (e.key === 'ArrowLeft') prevImage();
      else if (e.key === 'ArrowRight') nextImage();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [isLightboxOpen, closeLightbox, prevImage, nextImage]);

  const onTouchStart = (e) => { touchStartXRef.current = e.touches[0].clientX; };
  const onTouchEnd = (e) => {
    const start = touchStartXRef.current;
    if (start == null) return;
    const dx = e.changedTouches[0].clientX - start;
    if (Math.abs(dx) > 40) (dx < 0 ? nextImage() : prevImage());
    touchStartXRef.current = null;
  };

  const nights = checkIn && checkOut
    ? Math.max(1, Math.round((new Date(checkOut) - new Date(checkIn)) / 86400000))
    : 0;

  const totalPrice = villa && nights > 0 ? villa.priceValue * nights : 0;

  if (!villa) {
    return (
      <>
        <SEO title="Property Not Found" />
        <div className="container" style={{ textAlign: 'center', padding: '60px 20px' }}>
          <h2>Property not found</h2>
          <button className="btn btn-primary" onClick={() => navigate('/availability')}>
            Back to Properties
          </button>
        </div>
      </>
    );
  }

  const handleConfirmBooking = () => {
    if (!checkIn || !checkOut) {
      alert('Please select check-in and check-out dates');
      return;
    }
    const url = `https://airbnb.com/rooms/${villa.airbnbId}?checkin=${checkIn}&checkout=${checkOut}&adults=${guests}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <>
      <SEO
        title={`${villa.name} - Book Your Stay`}
        description={villa.description}
      />
      <StructuredData type="hotel" />

      <section className="property-detail-section section">
        <div className="container">
          <div className="property-header">
            <h1>{villa.name}</h1>
            <div className="property-meta">
              <span className="rating">★ {villa.rating} <span className="rating-reviews">({villa.reviews} reviews)</span></span>
              <span className="meta-dot">·</span>
              <span className="location">{villa.location}</span>
            </div>
          </div>

          <div className="property-gallery">
            {images.map((img, idx) => (
              <button
                key={idx}
                type="button"
                className={`gallery-tile${idx === 0 ? ' gallery-tile--hero' : ''}`}
                onClick={() => setLightboxIndex(idx)}
                aria-label={`View photo ${idx + 1} of ${images.length}`}
              >
                <img
                  src={img}
                  alt={idx === 0 ? (villa.alt || villa.name) : `${villa.name} photo ${idx + 1}`}
                  loading={idx === 0 ? 'eager' : 'lazy'}
                />
              </button>
            ))}
          </div>

          <div className="property-detail-layout">
            <div className="property-body">
              <div className="property-features">
                <div className="feature-item"><span className="feature-label">Type</span><span>{villa.roomType}</span></div>
                <div className="feature-item"><span className="feature-label">Bedrooms</span><span>{villa.bedrooms}</span></div>
                <div className="feature-item"><span className="feature-label">Beds</span><span>{villa.beds}</span></div>
                <div className="feature-item"><span className="feature-label">Bathrooms</span><span>{villa.bathrooms}</span></div>
              </div>

              <div className="property-description">
                <h3>About this place</h3>
                <p>{villa.description}</p>
              </div>

              {villa.amenities && villa.amenities.length > 0 && (
                <div className="property-amenities">
                  <h3>What this place offers</h3>
                  <div className="amenities-grid">
                    {villa.amenities.map((amenity, idx) => (
                      <span key={idx} className="amenity-tag">{amenity}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <aside className="property-info">
              <div className="booking-section">
                <div className="booking-price-header">
                  <strong>{villa.price}</strong>
                  <span>per night</span>
                </div>

                <div className="booking-form">
                  <div className="form-row">
                    <div className="form-group">
                      <label>Check In</label>
                      <input
                        type="date"
                        value={checkIn}
                        min={todayStr}
                        onChange={e => {
                          const val = e.target.value;
                          setCheckIn(val);
                          if (checkOut && checkOut <= val) setCheckOut(addDays(val, 1));
                        }}
                      />
                    </div>
                    <div className="form-group">
                      <label>Check Out</label>
                      <input
                        type="date"
                        value={checkOut}
                        min={checkIn ? addDays(checkIn, 1) : todayStr}
                        onChange={e => {
                          const val = e.target.value;
                          setCheckOut(checkIn && val <= checkIn ? addDays(checkIn, 1) : val);
                        }}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Guests</label>
                    <select value={guests} onChange={e => setGuests(e.target.value)}>
                      {Array.from({ length: villa.guests }, (_, i) => i + 1).map(n => (
                        <option key={n} value={n}>{n} Guest{n > 1 ? 's' : ''}</option>
                      ))}
                    </select>
                  </div>

                  {nights > 0 && (
                    <div className="booking-summary">
                      <div className="summary-row">
                        <span>{villa.price} × {nights} night{nights > 1 ? 's' : ''}</span>
                        <span>₹{totalPrice.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="summary-row summary-total">
                        <span>Total</span>
                        <span>₹{totalPrice.toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                  )}

                  <button
                    className="btn btn-primary btn-full"
                    onClick={handleConfirmBooking}
                    disabled={!checkIn || !checkOut}
                  >
                    Confirm Booking on Airbnb
                  </button>

                  <p className="booking-note">You'll be redirected to Airbnb to complete payment.</p>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {isLightboxOpen && (
        <div
          className="lightbox"
          onClick={closeLightbox}
          role="dialog"
          aria-modal="true"
          aria-label={`${villa.name} photo gallery`}
        >
          <button
            className="lightbox-btn lightbox-close"
            onClick={(e) => { e.stopPropagation(); closeLightbox(); }}
            aria-label="Close gallery"
          >
            ×
          </button>
          <span className="lightbox-counter">{lightboxIndex + 1} / {images.length}</span>
          {images.length > 1 && (
            <button
              className="lightbox-btn lightbox-nav lightbox-prev"
              onClick={(e) => { e.stopPropagation(); prevImage(); }}
              aria-label="Previous photo"
            >
              ‹
            </button>
          )}
          <img
            className="lightbox-image"
            src={images[lightboxIndex]}
            alt={`${villa.name} photo ${lightboxIndex + 1}`}
            onClick={(e) => e.stopPropagation()}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
            draggable={false}
          />
          {images.length > 1 && (
            <button
              className="lightbox-btn lightbox-nav lightbox-next"
              onClick={(e) => { e.stopPropagation(); nextImage(); }}
              aria-label="Next photo"
            >
              ›
            </button>
          )}
        </div>
      )}
    </>
  );
}
