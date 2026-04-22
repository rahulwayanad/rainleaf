import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import SEO from '../components/common/SEO';
import StructuredData from '../components/common/StructuredData';
import PageHero from '../components/common/PageHero';

const API = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const WEEK_DAYS  = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const VILLA_COLORS = ['#5a8f4a','#3b82f6','#f59e0b','#8b5cf6','#ef4444','#06b6d4'];

function toDateStr(y, m, d) {
  return `${y}-${String(m).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
}
function addDays(dateStr, n) {
  const d = new Date(dateStr + 'T00:00:00');
  d.setDate(d.getDate() + n);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}
function fmt(d) {
  if (!d) return '';
  return new Date(d + 'T00:00:00').toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' });
}
function fmtCheckIn(d)  { return d ? `${fmt(d)}, 12:00 PM` : ''; }
function fmtCheckOut(d) { return d ? `${fmt(d)}, 11:00 AM` : ''; }

export default function AvailabilityPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];

  // Calendar state
  const [calYear,  setCalYear]  = useState(now.getFullYear());
  const [calMonth, setCalMonth] = useState(now.getMonth() + 1);
  const [calVillas,    setCalVillas]    = useState([]);
  const [bookedDays,   setBookedDays]   = useState({});
  const [calLoading,   setCalLoading]   = useState(false);
  const [filterVilla,  setFilterVilla]  = useState('all');

  // Selected range
  const [checkIn,  setCheckIn]  = useState(searchParams.get('check_in')  || '');
  const [checkOut, setCheckOut] = useState(searchParams.get('check_out') || '');
  const [guests,   setGuests]   = useState(searchParams.get('guests')    || '2');

  // Panel availability (for selected range)
  const [rangeAvail,   setRangeAvail]  = useState([]);
  const [villasMap,    setVillasMap]   = useState({});
  const [rangeLoading, setRangeLoading] = useState(false);

  // Booking modal
  const [bookModal,  setBookModal]  = useState(null);
  const [bookForm,   setBookForm]   = useState({ customer_name:'', email:'', phone:'', special_requests:'' });
  const [bookStatus, setBookStatus] = useState(null);

  // ── Fetch calendar ─────────────────────────────────────────────────────────
  const fetchCalendar = useCallback(async () => {
    setCalLoading(true);
    try {
      const [calRes, villasRes] = await Promise.all([
        fetch(`${API}/api/availability/calendar?year=${calYear}&month=${calMonth}`),
        fetch(`${API}/api/villas`),
      ]);
      const calData    = await calRes.json();
      const villasData = await villasRes.json();
      setCalVillas(calData.villas     || []);
      setBookedDays(calData.booked_days || {});
      const map = {};
      if (Array.isArray(villasData)) villasData.forEach(v => { map[v.id] = v; });
      setVillasMap(map);
    } catch { /* show empty calendar */ }
    finally { setCalLoading(false); }
  }, [calYear, calMonth]);

  useEffect(() => { fetchCalendar(); }, [fetchCalendar]);

  // ── Fetch range availability ───────────────────────────────────────────────
  const checkAvailability = useCallback(() => {
    if (!checkIn || !checkOut) return;
    setRangeLoading(true);
    setRangeAvail([]);
    fetch(`${API}/api/availability?check_in=${checkIn}&check_out=${checkOut}&guests=${guests}`)
      .then(r => r.json())
      .then(d => setRangeAvail(Array.isArray(d) ? d : []))
      .catch(() => setRangeAvail([]))
      .finally(() => setRangeLoading(false));
  }, [checkIn, checkOut, guests]);

  // Re-check when filter changes (if dates are already selected)
  useEffect(() => {
    if (checkIn && checkOut) checkAvailability();
  }, [filterVilla]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Calendar helpers ────────────────────────────────────────────────────────
  const daysInMonth    = new Date(calYear, calMonth, 0).getDate();
  const firstDayOfWeek = new Date(calYear, calMonth - 1, 1).getDay();

  function prevMonth() {
    if (calMonth === 1) { setCalYear(y => y-1); setCalMonth(12); }
    else setCalMonth(m => m-1);
  }
  function nextMonth() {
    if (calMonth === 12) { setCalYear(y => y+1); setCalMonth(1); }
    else setCalMonth(m => m+1);
  }

  function dayStr(day) { return toDateStr(calYear, calMonth, day); }
  function isPast(day) { return dayStr(day) < todayStr; }
  function isCheckIn(day)  { return dayStr(day) === checkIn; }
  function isCheckOut(day) { return dayStr(day) === checkOut; }
  function isInRange(day)  {
    const d = dayStr(day);
    return checkIn && checkOut && d > checkIn && d < checkOut;
  }
  function isVillaBooked(day, villaId) {
    return (bookedDays[dayStr(day)] || []).includes(villaId);
  }
  function getVillaColor(villaId) {
    const idx = calVillas.findIndex(v => v.id === villaId);
    return VILLA_COLORS[idx % VILLA_COLORS.length] || '#999';
  }

  function handleDayClick(day) {
    if (isPast(day)) return;
    const d = dayStr(day);
    setCheckIn(d);
    setCheckOut(addDays(d, 1));
  }

  const displayVillas = filterVilla === 'all'
    ? calVillas
    : calVillas.filter(v => v.id === parseInt(filterVilla));

  const nights = checkIn && checkOut
    ? Math.max(1, Math.round((new Date(checkOut) - new Date(checkIn)) / 86400000))
    : 0;

  // ── Booking submit ──────────────────────────────────────────────────────────
  async function handleBook(e) {
    e.preventDefault();
    if (!checkIn || !checkOut || checkOut <= checkIn) {
      setBookStatus('Check-out date must be after check-in date.');
      return;
    }
    setBookStatus('loading');
    try {
      const res = await fetch(`${API}/api/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...bookForm,
          check_in: checkIn,
          check_out: checkOut,
          guests: parseInt(guests),
          villa_id: bookModal.id,
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || 'Booking failed. Please try again.');
      }
      setBookStatus('success');
    } catch (err) {
      setBookStatus(err.message || 'Something went wrong. Please try again.');
    }
  }

  return (
    <>
      <SEO
        title="Check Availability & Book Wayanad Private Pool Villa"
        canonicalPath="/availability"
        description="Check live availability and book your private pool villa at Rainleaf Family Retreat — Wayanad's top-rated luxury family resort near Kaniyambetta, Kerala. Instant booking, best direct rate, complimentary breakfast."
        keywords="book Wayanad resort, Wayanad villa availability, private pool villa booking Wayanad, Rainleaf availability, Wayanad resort reservation, last minute Wayanad villa"
      />
      <StructuredData page="availability" />
      <PageHero title="AVAILABILITY" breadcrumbLabel="Availability" />

      <section className="availability-section section">
        <div className="container">
          <div className="cal-layout">

            {/* ── Calendar ───────────────────────────────────────────────── */}
            <div className="cal-main">
              {/* Toolbar */}
              <div className="cal-toolbar">
                <div className="cal-nav">
                  <button className="cal-nav-btn" onClick={prevMonth}>‹</button>
                  <h2 className="cal-month-title">{MONTH_NAMES[calMonth-1]} {calYear}</h2>
                  <button className="cal-nav-btn" onClick={nextMonth}>›</button>
                </div>
                <select
                  className="cal-filter"
                  value={filterVilla}
                  onChange={e => setFilterVilla(e.target.value)}
                >
                  <option value="all">All Villas</option>
                  {calVillas.map(v => (
                    <option key={v.id} value={v.id}>{v.name}</option>
                  ))}
                </select>
              </div>

              {/* Legend */}
              <div className="cal-legend">
                {displayVillas.map(v => (
                  <span key={v.id} className="cal-legend-item">
                    <span className="cal-dot cal-dot--label" style={{ background: getVillaColor(v.id) }}>
                      {v.name.charAt(0).toUpperCase()}
                    </span>
                    {v.name} — Available
                  </span>
                ))}
              </div>

              {/* Grid */}
              <div className="cal-grid">
                {WEEK_DAYS.map(d => (
                  <div key={d} className="cal-day-header">{d}</div>
                ))}

                {Array.from({ length: firstDayOfWeek }).map((_, i) => (
                  <div key={`e${i}`} className="cal-cell cal-cell--empty" />
                ))}

                {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
                  const past    = isPast(day);
                  const ci      = isCheckIn(day);
                  const co      = isCheckOut(day);
                  const inRange = isInRange(day);
                  return (
                    <div
                      key={day}
                      className={[
                        'cal-cell',
                        past    ? 'cal-cell--past'     : '',
                        inRange ? 'cal-cell--range'    : '',
                        ci      ? 'cal-cell--checkin'  : '',
                        co      ? 'cal-cell--checkout' : '',
                        dayStr(day) === todayStr ? 'cal-cell--today' : '',
                      ].filter(Boolean).join(' ')}
                      onClick={() => !past && handleDayClick(day)}
                    >
                      <span className="cal-day-num">{day}</span>
                      <div className="cal-villa-dots">
                        {displayVillas.filter(v => !isVillaBooked(day, v.id)).map(v => (
                          <span
                            key={v.id}
                            className="cal-dot cal-dot--label"
                            style={{
                              background: getVillaColor(v.id),
                              opacity: past ? 0.35 : 1,
                            }}
                            title={`${v.name}: Available`}
                          >
                            {v.name.charAt(0).toUpperCase()}
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              {calLoading && <div className="cal-loading">Loading calendar…</div>}
            </div>

            {/* ── Booking Panel ──────────────────────────────────────────── */}
            <div className={`cal-panel${checkIn ? ' cal-panel--open' : ''}`}>
              <div className="cal-panel-header">
                <h3>Book a Stay</h3>
                <button
                  className="cal-panel-close"
                  onClick={() => { setCheckIn(''); setCheckOut(''); }}
                >✕</button>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Check In</label>
                  <input type="date" value={checkIn} min={todayStr}
                    onChange={e => {
                      const val = e.target.value;
                      setCheckIn(val);
                      if (checkOut && checkOut <= val) setCheckOut(addDays(val, 1));
                    }} />
                </div>
                <div className="form-group">
                  <label>Check Out</label>
                  <input type="date" value={checkOut}
                    min={checkIn ? addDays(checkIn, 1) : todayStr}
                    onChange={e => {
                      const val = e.target.value;
                      setCheckOut(checkIn && val <= checkIn ? addDays(checkIn, 1) : val);
                    }} />
                </div>
              </div>

              <div className="form-group">
                <label>Guests</label>
                <select className="expense-type-select" value={guests} onChange={e => setGuests(e.target.value)}>
                  {[1,2,3,4,5,6,7,8,9,10,11,12].map(n => (
                    <option key={n} value={n}>{n} Guest{n > 1 ? 's' : ''}</option>
                  ))}
                </select>
                <p style={{ fontSize: 12, color: '#666', marginTop: 4 }}>
                  More than 12 guests?{' '}
                  <a href="/contact" style={{ color: 'var(--color-primary)', textDecoration: 'underline' }}>
                    Contact us
                  </a>
                </p>
              </div>

              {checkIn && checkOut && (
                <p className="cal-panel-summary">
                  {fmtCheckIn(checkIn)} → {fmtCheckOut(checkOut)}<br />
                  {nights} night{nights > 1 ? 's' : ''}
                </p>
              )}

              <button
                className="btn btn-primary btn-full"
                style={{ marginBottom: 14 }}
                disabled={!checkIn || !checkOut || rangeLoading}
                onClick={checkAvailability}
              >
                {rangeLoading ? 'Checking…' : 'Check Availability'}
              </button>

              {rangeLoading && <p className="cal-panel-loading">Checking availability…</p>}

              {!rangeLoading && rangeAvail.length > 0 && (
                <div className="cal-panel-villas">
                  {rangeAvail.every(a => !a.available) ? (
                    <p className="cal-panel-empty">No villas available for these dates.</p>
                  ) : (
                  <p className="cal-panel-subtitle">Available Villas</p>
                  )}
                  {rangeAvail
                  .filter(avail => avail.available)
                  .filter(avail => filterVilla === 'all' || avail.villa_id === parseInt(filterVilla))
                  .map(avail => {
                    const villa = villasMap[avail.villa_id];
                    if (!villa) return null;
                    const totalGuests = villa.rooms.reduce((s, r) => s + r.max_guests, 0);
                    return (
                      <div
                        key={avail.villa_id}
                        className={`cal-villa-item${avail.available ? '' : ' cal-villa-item--unavailable'}`}
                      >
                        {villa.image_url && (
                          <img src={villa.image_url} alt={villa.name} className="cal-villa-thumb" />
                        )}
                        <div className="cal-villa-info">
                          <strong>{villa.name}</strong>
                          {villa.rooms.length > 0 && (
                            <span>{villa.rooms.length} room{villa.rooms.length > 1 ? 's' : ''} · up to {totalGuests} guests</span>
                          )}
                        </div>
                        <button
                          className="btn btn-primary"
                          style={{ padding:'8px 14px', fontSize:12, whiteSpace:'nowrap' }}
                          onClick={() => {
                            setBookModal(villa);
                            setBookStatus(null);
                            setBookForm({ customer_name:'', email:'', phone:'', special_requests:'' });
                          }}
                        >
                          Book
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}

              {!rangeLoading && checkIn && checkOut && rangeAvail.length === 0 && (
                <p className="cal-panel-empty">No villas configured yet.</p>
              )}
            </div>

          </div>
        </div>
      </section>

      {/* ── Booking Modal ──────────────────────────────────────────────────── */}
      {bookModal && (
        <div className="modal-overlay" onClick={() => bookStatus !== 'loading' && setBookModal(null)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setBookModal(null)} disabled={bookStatus === 'loading'}>✕</button>

            {bookStatus === 'success' ? (
              <div className="modal-success">
                <h3>Booking Request Sent!</h3>
                <p>We'll confirm your <strong>{bookModal.name}</strong> booking shortly.</p>
                <p><strong>{fmtCheckIn(checkIn)}</strong> → <strong>{fmtCheckOut(checkOut)}</strong></p>
                <button className="btn btn-primary" onClick={() => { setBookModal(null); navigate('/'); }}>
                  Back to Home
                </button>
              </div>
            ) : (
              <>
                <h3 className="modal-title">Book {bookModal.name}</h3>
                <p className="modal-dates">
                  {fmtCheckIn(checkIn)} → {fmtCheckOut(checkOut)}<br />
                  {nights} night{nights > 1 ? 's' : ''} · {guests} guest(s)
                </p>
                {bookStatus && bookStatus !== 'loading' && bookStatus !== 'success' && (
                  <div className="form-alert form-alert--error">{bookStatus}</div>
                )}
                <form className="contact-form" onSubmit={handleBook}>
                  <div className="form-group">
                    <input type="text" placeholder="Your Full Name"
                      value={bookForm.customer_name}
                      onChange={e => setBookForm({...bookForm, customer_name: e.target.value})}
                      required autoFocus />
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <input type="email" placeholder="Email Address"
                        value={bookForm.email}
                        onChange={e => setBookForm({...bookForm, email: e.target.value})}
                        required />
                    </div>
                    <div className="form-group">
                      <input type="tel" placeholder="Phone Number"
                        value={bookForm.phone}
                        onChange={e => setBookForm({...bookForm, phone: e.target.value})}
                        required />
                    </div>
                  </div>
                  <div className="form-group">
                    <textarea rows="3" placeholder="Special requests (optional)"
                      value={bookForm.special_requests}
                      onChange={e => setBookForm({...bookForm, special_requests: e.target.value})} />
                  </div>
                  <button type="submit" className="btn btn-primary btn-full" disabled={bookStatus === 'loading'}>
                    {bookStatus === 'loading' ? 'Sending…' : 'Confirm Booking Request'}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
