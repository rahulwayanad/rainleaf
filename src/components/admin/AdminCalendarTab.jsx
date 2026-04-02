import { useState, useEffect, useCallback } from 'react';

const API = import.meta.env.VITE_API_URL || 'http://localhost:8000';
const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const WEEK_DAYS = ['Su','Mo','Tu','We','Th','Fr','Sa'];

function toDateStr(y, m, d) {
  return `${y}-${String(m).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
}
function addDays(dateStr, n) {
  const d = new Date(dateStr + 'T00:00:00');
  d.setDate(d.getDate() + n);
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}
function fmtDate(d) {
  if (!d) return '';
  return new Date(d + 'T00:00:00').toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' });
}

export default function AdminCalendarTab({ token }) {
  const now = new Date();
  const [year,  setYear]  = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [villas,     setVillas]     = useState([]);
  const [bookedDays, setBookedDays] = useState({});
  const [bookings,   setBookings]   = useState([]);
  const [loading,    setLoading]    = useState(false);

  const [detailModal, setDetailModal] = useState(null);
  const [bookModal,   setBookModal]   = useState(null);
  const [bookForm,    setBookForm]    = useState({ customer_name: '', email: '', phone: '', guests: 2 });
  const [bookStatus,  setBookStatus]  = useState(null);

  const headers = { Authorization: `Bearer ${token}` };

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [calRes, bookingsRes] = await Promise.all([
        fetch(`${API}/api/availability/calendar?year=${year}&month=${month}`),
        fetch(`${API}/api/bookings`, { headers }),
      ]);
      const calData      = await calRes.json();
      const bookingsData = await bookingsRes.json();
      setVillas(calData.villas || []);
      setBookedDays(calData.booked_days || {});
      setBookings(Array.isArray(bookingsData) ? bookingsData : []);
    } finally {
      setLoading(false);
    }
  }, [year, month, token]);

  useEffect(() => { fetchData(); }, [fetchData]);

  function prevMonth() {
    if (month === 1) { setYear(y => y - 1); setMonth(12); }
    else setMonth(m => m - 1);
  }
  function nextMonth() {
    if (month === 12) { setYear(y => y + 1); setMonth(1); }
    else setMonth(m => m + 1);
  }

  function getBookingForDay(villaId, dateStr) {
    return bookings.find(b =>
      b.villa_id === villaId &&
      b.check_in <= dateStr &&
      b.check_out > dateStr &&
      b.status !== 'cancelled'
    );
  }

  function getDayStatus(villaId, dateStr) {
    const b = getBookingForDay(villaId, dateStr);
    return b ? b.status : null;
  }

  function handleDayClick(villa, day) {
    const dateStr = toDateStr(year, month, day);
    const today   = toDateStr(...(d => [d.getFullYear(), d.getMonth()+1, d.getDate()])(new Date()));
    const booked  = (bookedDays[dateStr] || []).includes(villa.id);
    if (booked) {
      const booking = getBookingForDay(villa.id, dateStr);
      setDetailModal(booking || { _noRecord: true, date: dateStr, villa });
    } else {
      if (dateStr < today) return;
      setBookModal({ villa, date: dateStr, checkOut: addDays(dateStr, 1) });
      setBookForm({ customer_name: '', email: '', phone: '', guests: 2 });
      setBookStatus(null);
    }
  }

  async function updateStatus(id, status) {
    await fetch(`${API}/api/bookings/${id}/status`, {
      method: 'PATCH',
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    setDetailModal(prev => ({ ...prev, status }));
    fetchData();
  }

  async function handleQuickBook(e) {
    e.preventDefault();
    setBookStatus('loading');
    try {
      const res = await fetch(`${API}/api/bookings`, {
        method: 'POST',
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...bookForm,
          email: bookForm.email || null,
          guests: parseInt(bookForm.guests),
          check_in:  bookModal.date,
          check_out: bookModal.checkOut,
          villa_id:  bookModal.villa.id,
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || 'Booking failed.');
      }
      setBookStatus('success');
      fetchData();
    } catch (err) {
      setBookStatus(err.message || 'Something went wrong.');
    }
  }

  const daysInMonth    = new Date(year, month, 0).getDate();
  const firstDayOfWeek = new Date(year, month - 1, 1).getDay();
  const todayStr       = now.toISOString().split('T')[0];

  return (
    <div className="admin-cal-wrap">
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div className="admin-topbar">
        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
          <button className="cal-nav-btn" onClick={prevMonth}>‹</button>
          <h1 className="admin-page-title" style={{ margin:0 }}>
            {MONTH_NAMES[month - 1]} {year}
          </h1>
          <button className="cal-nav-btn" onClick={nextMonth}>›</button>
        </div>
        <button className="btn btn-outline-admin" onClick={fetchData}>↻ Refresh</button>
      </div>

      {loading && <div className="admin-loading">Loading…</div>}

      {/* ── One calendar per villa ───────────────────────────────────────── */}
      {!loading && (
        <div className="admin-cal-grid">
          {villas.map(villa => (
            <div key={villa.id} className="admin-cal-card">
              <h3 className="admin-cal-villa-name">{villa.name}</h3>

              {/* Week headers */}
              <div className="admin-mini-cal">
                {WEEK_DAYS.map(d => (
                  <div key={d} className="admin-mini-head">{d}</div>
                ))}

                {/* Empty cells before first day */}
                {Array.from({ length: firstDayOfWeek }).map((_, i) => (
                  <div key={`e${i}`} className="admin-mini-cell admin-mini-cell--empty" />
                ))}

                {/* Day cells */}
                {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
                  const dateStr = toDateStr(year, month, day);
                  const booked  = (bookedDays[dateStr] || []).includes(villa.id);
                  const status  = booked ? getDayStatus(villa.id, dateStr) : null;
                  const isToday = dateStr === todayStr;
                  const isPast  = dateStr < todayStr;
                  return (
                    <div
                      key={day}
                      className={[
                        'admin-mini-cell',
                        isPast && !booked              ? 'admin-mini-cell--past'      : '',
                        !booked && !isPast             ? 'admin-mini-cell--free'      : '',
                        status === 'pending'           ? 'admin-mini-cell--pending'   : '',
                        status === 'confirmed'         ? 'admin-mini-cell--confirmed' : '',
                        isToday                        ? 'admin-mini-cell--today'     : '',
                      ].filter(Boolean).join(' ')}
                      onClick={() => handleDayClick(villa, day)}
                      title={isPast && !booked ? 'Past date' : booked ? `${status} — click for details` : 'Free — click to book'}
                    >
                      {day}
                    </div>
                  );
                })}
              </div>

              {/* Legend */}
              <div className="admin-cal-legend">
                <span className="admin-cal-legend-item admin-cal-legend-item--confirmed">Confirmed</span>
                <span className="admin-cal-legend-item admin-cal-legend-item--pending">Pending</span>
                <span className="admin-cal-legend-item admin-cal-legend-item--free">Free</span>
              </div>
            </div>
          ))}

          {villas.length === 0 && !loading && (
            <div className="admin-empty">No active villas found.</div>
          )}
        </div>
      )}

      {/* ── Booking Detail Modal ─────────────────────────────────────────── */}
      {detailModal && (
        <div className="modal-overlay" onClick={() => setDetailModal(null)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setDetailModal(null)}>✕</button>
            {detailModal._noRecord ? (
              <>
                <h3 className="modal-title">Booking Info</h3>
                <p style={{ color:'#666' }}>
                  {detailModal.villa.name} is marked as booked on {fmtDate(detailModal.date)} but no matching booking record was found (may have been cancelled or deleted).
                </p>
              </>
            ) : (
              <>
                <h3 className="modal-title">Booking Details</h3>
                <table className="admin-detail-table">
                  <tbody>
                    <tr><td>Customer</td><td><strong>{detailModal.customer_name}</strong></td></tr>
                    <tr><td>Email</td><td><a href={`mailto:${detailModal.email}`}>{detailModal.email}</a></td></tr>
                    <tr><td>Phone</td><td><a href={`tel:${detailModal.phone}`}>{detailModal.phone}</a></td></tr>
                    <tr><td>Villa</td><td>{detailModal.villa_id}</td></tr>
                    <tr><td>Check In</td><td>{fmtDate(detailModal.check_in)}, 12:00 PM</td></tr>
                    <tr><td>Check Out</td><td>{fmtDate(detailModal.check_out)}, 11:00 AM</td></tr>
                    <tr><td>Guests</td><td>{detailModal.guests}</td></tr>
                    <tr><td>Status</td><td>
                      <span className="admin-status-badge" style={{
                        background: detailModal.status === 'confirmed' ? '#22c55e' : detailModal.status === 'pending' ? '#f59e0b' : '#ef4444'
                      }}>
                        {detailModal.status}
                      </span>
                    </td></tr>
                    {detailModal.special_requests && (
                      <tr><td>Requests</td><td>{detailModal.special_requests}</td></tr>
                    )}
                    <tr><td>Booked On</td><td>{new Date(detailModal.created_at).toLocaleDateString('en-IN')}</td></tr>
                  </tbody>
                </table>
                <div className="admin-detail-actions">
                  {detailModal.status === 'pending' && (
                    <button
                      className="btn admin-btn-confirm"
                      style={{ flex:1 }}
                      onClick={() => updateStatus(detailModal.id, 'confirmed')}
                    >
                      Confirm
                    </button>
                  )}
                  {detailModal.status !== 'cancelled' && (
                    <button
                      className="btn admin-btn-cancel"
                      style={{ flex:1 }}
                      onClick={() => updateStatus(detailModal.id, 'cancelled')}
                    >
                      Cancel
                    </button>
                  )}
                  <button
                    className="btn"
                    style={{ flex:1, background:'#f3f4f6', color:'#374151' }}
                    onClick={() => setDetailModal(null)}
                  >
                    Close
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* ── Quick Booking Modal ──────────────────────────────────────────── */}
      {bookModal && (
        <div className="modal-overlay" onClick={() => bookStatus !== 'loading' && setBookModal(null)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setBookModal(null)} disabled={bookStatus === 'loading'}>✕</button>

            {bookStatus === 'success' ? (
              <div className="modal-success">
                <h3>Booking Created</h3>
                <p><strong>{bookModal.villa.name}</strong></p>
                <p>{fmtDate(bookModal.date)}, 12:00 PM → {fmtDate(bookModal.checkOut)}, 11:00 AM</p>
                <button className="btn btn-primary" onClick={() => setBookModal(null)}>Close</button>
              </div>
            ) : (
              <>
                <h3 className="modal-title">New Booking — {bookModal.villa.name}</h3>
                <p className="modal-dates">
                  {fmtDate(bookModal.date)}, 12:00 PM → {fmtDate(bookModal.checkOut)}, 11:00 AM
                </p>
                {bookStatus && bookStatus !== 'loading' && (
                  <div className="form-alert form-alert--error">{bookStatus}</div>
                )}
                <form className="contact-form" onSubmit={handleQuickBook}>
                  <div className="form-group">
                    <input
                      type="text" placeholder="Customer Name" required
                      value={bookForm.customer_name}
                      onChange={e => setBookForm({ ...bookForm, customer_name: e.target.value })}
                    />
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <input
                        type="tel" placeholder="Phone Number" required
                        value={bookForm.phone}
                        onChange={e => setBookForm({ ...bookForm, phone: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <input
                        type="email" placeholder="Email (optional)"
                        value={bookForm.email}
                        onChange={e => setBookForm({ ...bookForm, email: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label style={{ fontSize:12, color:'#666' }}>Check Out</label>
                      <input
                        type="date" value={bookModal.checkOut}
                        min={addDays(bookModal.date, 1)}
                        onChange={e => setBookModal({ ...bookModal, checkOut: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label style={{ fontSize:12, color:'#666' }}>Guests</label>
                      <select className="expense-type-select" value={bookForm.guests} onChange={e => setBookForm({ ...bookForm, guests: e.target.value })}>
                        {[1,2,3,4,5,6,7,8,9,10,11,12].map(n => (
                          <option key={n} value={n}>{n} {n === 1 ? 'Guest' : 'Guests'}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <button type="submit" className="btn btn-primary btn-full" disabled={bookStatus === 'loading'}>
                    {bookStatus === 'loading' ? 'Creating…' : 'Create Booking'}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
