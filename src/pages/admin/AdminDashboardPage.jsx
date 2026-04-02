import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import VillasTab from '../../components/admin/VillasTab';
import AdminCalendarTab from '../../components/admin/AdminCalendarTab';
import ExpensesTab from '../../components/admin/ExpensesTab';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const API = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const STATUS_COLORS = {
  pending: '#f59e0b',
  confirmed: '#22c55e',
  cancelled: '#ef4444',
};

const PAYMENT_LABELS = {
  not_paid: 'Not Paid', partially_paid: 'Partial', fully_paid: 'Fully Paid',
};

export default function AdminDashboardPage() {
  const { token, logout } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState('contacts');

  const [contacts, setContacts] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [villasMap, setVillasMap] = useState({});
  const [loading, setLoading] = useState(false);

  // Payment modal
  const [payModal, setPayModal] = useState(null);
  const [payForm,  setPayForm]  = useState({ payment_status:'not_paid', amount_paid:'0', extra_amount:'0', discount_amount:'0' });

  // Booking filters
  const [showFilters,    setShowFilters]    = useState(false);
  const [filterStatus,  setFilterStatus]  = useState('pending');
  const [filterVilla,   setFilterVilla]   = useState('all');
  const [filterSearch,  setFilterSearch]  = useState('');
  const [filterDateFrom, setFilterDateFrom] = useState('');
  const [filterDateTo,   setFilterDateTo]   = useState('');

  const headers = { Authorization: `Bearer ${token}` };

  const fetchContacts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/contacts`, { headers });
      if (res.status === 401) { logout(); navigate('/admin'); return; }
      setContacts(await res.json());
    } finally {
      setLoading(false);
    }
  }, [token]);

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    try {
      const [bookRes, villasRes] = await Promise.all([
        fetch(`${API}/api/bookings`, { headers }),
        fetch(`${API}/api/villas/all`, { headers }),
      ]);
      if (bookRes.status === 401) { logout(); navigate('/admin'); return; }
      setBookings(await bookRes.json());
      const villas = await villasRes.json();
      if (Array.isArray(villas)) {
        const map = {};
        villas.forEach(v => { map[v.id] = v.name; });
        setVillasMap(map);
      }
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (tab === 'contacts') fetchContacts();
    else fetchBookings();
  }, [tab]);

  async function markRead(id) {
    await fetch(`${API}/api/contacts/${id}/read`, { method: 'PATCH', headers });
    setContacts((prev) => prev.map((c) => c.id === id ? { ...c, is_read: true } : c));
  }

  async function deleteContact(id) {
    if (!confirm('Delete this message?')) return;
    await fetch(`${API}/api/contacts/${id}`, { method: 'DELETE', headers });
    setContacts((prev) => prev.filter((c) => c.id !== id));
  }

  async function updateBookingStatus(id, status) {
    const res = await fetch(`${API}/api/bookings/${id}/status`, {
      method: 'PATCH',
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    const updated = await res.json();
    setBookings((prev) => prev.map((b) => b.id === id ? updated : b));
  }

  async function updatePayment(e) {
    e.preventDefault();
    const res = await fetch(`${API}/api/bookings/${payModal.id}/payment`, {
      method: 'PATCH',
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        payment_status:  payForm.payment_status,
        amount_paid:     parseFloat(payForm.amount_paid)     || 0,
        extra_amount:    parseFloat(payForm.extra_amount)    || 0,
        discount_amount: parseFloat(payForm.discount_amount) || 0,
      }),
    });
    const updated = await res.json();
    setBookings(prev => prev.map(b => b.id === payModal.id ? updated : b));
    setPayModal(null);
  }

  async function deleteBooking(id) {
    if (!confirm('Delete this booking?')) return;
    await fetch(`${API}/api/bookings/${id}`, { method: 'DELETE', headers });
    setBookings((prev) => prev.filter((b) => b.id !== id));
  }

  function handleLogout() {
    logout();
    navigate('/admin');
  }

  function exportBookingsPDF() {
    const doc = new jsPDF({ orientation: 'landscape' });

    doc.setFontSize(16);
    doc.text('Rainleaf Family Retreat — Bookings', 14, 14);

    const filters = [];
    if (filterStatus !== 'all') filters.push(`Status: ${filterStatus}`);
    if (filterVilla  !== 'all') filters.push(`Villa: ${villasMap[filterVilla] || filterVilla}`);
    if (filterDateFrom) filters.push(`From: ${filterDateFrom}`);
    if (filterDateTo)   filters.push(`To: ${filterDateTo}`);
    if (filterSearch)   filters.push(`Search: ${filterSearch}`);
    if (filters.length) {
      doc.setFontSize(9);
      doc.setTextColor(100);
      doc.text(`Filters: ${filters.join('  |  ')}`, 14, 22);
    }

    doc.setFontSize(9);
    doc.setTextColor(150);
    doc.text(`Exported: ${new Date().toLocaleString('en-IN')}  |  ${filteredBookings.length} records`, 14, filters.length ? 28 : 22);

    autoTable(doc, {
      startY: filters.length ? 32 : 28,
      head: [['#', 'Customer', 'Phone', 'Villa', 'Check In', 'Check Out', 'Guests', 'Status', 'Payment', 'Paid (₹)', 'Booked On']],
      body: filteredBookings.map((b, i) => [
        i + 1,
        b.customer_name,
        b.phone,
        b.villa_id ? (villasMap[b.villa_id] || `Villa ${b.villa_id}`) : 'Any',
        b.check_in,
        b.check_out,
        b.guests,
        b.status,
        PAYMENT_LABELS[b.payment_status],
        Number(b.amount_paid).toLocaleString('en-IN'),
        new Date(b.created_at).toLocaleDateString('en-IN'),
      ]),
      styles: { fontSize: 8, cellPadding: 3 },
      headStyles: { fillColor: [44, 90, 44], textColor: 255, fontStyle: 'bold' },
      alternateRowStyles: { fillColor: [245, 250, 245] },
    });

    const dateStr = new Date().toISOString().split('T')[0];
    doc.save(`rainleaf-bookings-${dateStr}.pdf`);
  }

  const unreadCount  = contacts.filter((c) => !c.is_read).length;
  const pendingCount = bookings.filter((b) => b.status === 'pending').length;

  const villasList = Object.entries(villasMap).map(([id, name]) => ({ id: parseInt(id), name }));

  const filteredBookings = bookings.filter(b => {
    if (filterStatus !== 'all' && b.status !== filterStatus) return false;
    if (filterVilla  !== 'all' && b.villa_id !== parseInt(filterVilla)) return false;
    if (filterDateFrom && b.check_in < filterDateFrom) return false;
    if (filterDateTo   && b.check_out > filterDateTo)  return false;
    if (filterSearch) {
      const q = filterSearch.toLowerCase();
      if (
        !b.customer_name?.toLowerCase().includes(q) &&
        !b.phone?.toLowerCase().includes(q) &&
        !b.email?.toLowerCase().includes(q)
      ) return false;
    }
    return true;
  });

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar-logo">
          <span className="logo-icon">&#127807;</span>
          <span>RAINLEAF<br /><small>Admin</small></span>
        </div>
        <nav className="admin-nav">
          <button
            className={`admin-nav-item${tab === 'contacts' ? ' active' : ''}`}
            onClick={() => setTab('contacts')}
          >
            <span className="admin-nav-icon">✉</span>
            Messages
            {unreadCount > 0 && <span className="admin-badge">{unreadCount}</span>}
          </button>
          <button
            className={`admin-nav-item${tab === 'bookings' ? ' active' : ''}`}
            onClick={() => setTab('bookings')}
          >
            <span className="admin-nav-icon">📅</span>
            Bookings
            {pendingCount > 0 && <span className="admin-badge">{pendingCount}</span>}
          </button>
          <button
            className={`admin-nav-item${tab === 'calendar' ? ' active' : ''}`}
            onClick={() => setTab('calendar')}
          >
            <span className="admin-nav-icon">🗓</span>
            Calendar
          </button>
          <button
            className={`admin-nav-item${tab === 'villas' ? ' active' : ''}`}
            onClick={() => setTab('villas')}
          >
            <span className="admin-nav-icon">🏡</span>
            Villas
          </button>
          <button
            className={`admin-nav-item${tab === 'expenses' ? ' active' : ''}`}
            onClick={() => setTab('expenses')}
          >
            <span className="admin-nav-icon">💸</span>
            Expenses
          </button>
        </nav>
        <button className="admin-logout-btn" onClick={handleLogout}>
          ⬅ Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        {tab === 'villas'    && <VillasTab />}
        {tab === 'calendar'  && <AdminCalendarTab token={token} />}
        {tab === 'expenses'  && <ExpensesTab />}

        {tab !== 'villas' && tab !== 'calendar' && tab !== 'expenses' && <>
        <div className="admin-topbar">
          <h1 className="admin-page-title">
            {tab === 'contacts' ? 'Contact Messages' : 'Bookings'}
          </h1>
          {tab === 'bookings' && filteredBookings.length > 0 && (
            <button className="btn btn-outline-admin" onClick={exportBookingsPDF}>
              ⬇ PDF
            </button>
          )}
          <button className="btn btn-outline-admin" onClick={tab === 'contacts' ? fetchContacts : fetchBookings}>
            ↻ Refresh
          </button>
        </div>

        {loading && <div className="admin-loading">Loading...</div>}

        {/* Contacts Table */}
        {!loading && tab === 'contacts' && (
          contacts.length === 0 ? (
            <div className="admin-empty">No messages yet.</div>
          ) : (
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Subject</th>
                    <th>Message</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {contacts.map((c) => (
                    <tr key={c.id} className={c.is_read ? '' : 'admin-row-unread'}>
                      <td data-label="Name">{c.name}</td>
                      <td data-label="Email"><a href={`mailto:${c.email}`}>{c.email}</a></td>
                      <td data-label="Phone">{c.phone || '—'}</td>
                      <td data-label="Subject">{c.subject || '—'}</td>
                      <td data-label="Message" className="admin-msg-cell">{c.message}</td>
                      <td data-label="Date" className="admin-date">{new Date(c.created_at).toLocaleDateString('en-IN')}</td>
                      <td className="admin-actions">
                        {!c.is_read && (
                          <button className="admin-btn admin-btn-read" onClick={() => markRead(c.id)}>
                            Mark Read
                          </button>
                        )}
                        <button className="admin-btn admin-btn-delete" onClick={() => deleteContact(c.id)}>
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        )}

        {/* Bookings Filters */}
        {!loading && tab === 'bookings' && (
          <div className="admin-filters-wrap">
          <button
            className="admin-filter-toggle"
            onClick={() => setShowFilters(v => !v)}
          >
            ⚙ {showFilters ? 'Hide Filters' : 'Show Filters'}
            {(filterStatus !== 'all' || filterVilla !== 'all' || filterSearch || filterDateFrom || filterDateTo) && (
              <span className="admin-filter-active-dot" />
            )}
          </button>
          </div>
        )}
        {!loading && tab === 'bookings' && showFilters && (
          <div className="admin-filters">
            <input
              className="admin-filter-input"
              type="text"
              placeholder="Search name / phone / email"
              value={filterSearch}
              onChange={e => setFilterSearch(e.target.value)}
            />
            <select className="admin-filter-select" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <select className="admin-filter-select" value={filterVilla} onChange={e => setFilterVilla(e.target.value)}>
              <option value="all">All Villas</option>
              {villasList.map(v => (
                <option key={v.id} value={v.id}>{v.name}</option>
              ))}
            </select>
            <input
              className="admin-filter-input"
              type="date"
              placeholder="From"
              value={filterDateFrom}
              onChange={e => setFilterDateFrom(e.target.value)}
              title="Check-in from"
            />
            <input
              className="admin-filter-input"
              type="date"
              placeholder="To"
              value={filterDateTo}
              onChange={e => setFilterDateTo(e.target.value)}
              title="Check-out to"
            />
            {(filterStatus !== 'all' || filterVilla !== 'all' || filterSearch || filterDateFrom || filterDateTo) && (
              <button className="admin-btn admin-btn-delete" onClick={() => {
                setFilterStatus('all'); setFilterVilla('all');
                setFilterSearch(''); setFilterDateFrom(''); setFilterDateTo('');
                setShowFilters(false);
              }}>
                Clear
              </button>
            )}
          </div>
        )}

        {/* Bookings Table */}
        {!loading && tab === 'bookings' && (
          filteredBookings.length === 0 ? (
            <div className="admin-empty">{bookings.length === 0 ? 'No bookings yet.' : 'No bookings match the filters.'}</div>
          ) : (
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Customer</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Villa</th>
                    <th>Check In</th>
                    <th>Check Out</th>
                    <th>Guests</th>
                    <th>Requests</th>
                    <th>Status</th>
                    <th>Payment</th>
                    <th>Paid</th>
                    <th>Extra</th>
                    <th>Discount</th>
                    <th>Booked On</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBookings.map((b) => (
                    <tr key={b.id}>
                      <td data-label="Customer">{b.customer_name}</td>
                      <td data-label="Email">{b.email ? <a href={`mailto:${b.email}`}>{b.email}</a> : '—'}</td>
                      <td data-label="Phone">{b.phone}</td>
                      <td data-label="Villa">{b.villa_id ? (villasMap[b.villa_id] || `Villa ${b.villa_id}`) : 'Any'}</td>
                      <td data-label="Check In">{b.check_in}</td>
                      <td data-label="Check Out">{b.check_out}</td>
                      <td data-label="Guests">{b.guests}</td>
                      <td data-label="Requests" className="admin-msg-cell">{b.special_requests || '—'}</td>
                      <td data-label="Status">
                        <span className="admin-status-badge" style={{ background: STATUS_COLORS[b.status] }}>
                          {b.status}
                        </span>
                      </td>
                      <td data-label="Payment">
                        <span className={`admin-payment-badge admin-payment-badge--${b.payment_status}`}>
                          {PAYMENT_LABELS[b.payment_status]}
                        </span>
                      </td>
                      <td data-label="Paid">₹{Number(b.amount_paid).toLocaleString('en-IN')}</td>
                      <td data-label="Extra">₹{Number(b.extra_amount).toLocaleString('en-IN')}</td>
                      <td data-label="Discount">₹{Number(b.discount_amount).toLocaleString('en-IN')}</td>
                      <td data-label="Booked On" className="admin-date">{new Date(b.created_at).toLocaleDateString('en-IN')}</td>
                      <td className="admin-actions">
                        {b.status === 'pending' && (
                          <button className="admin-btn admin-btn-confirm" onClick={() => updateBookingStatus(b.id, 'confirmed')}>Confirm</button>
                        )}
                        {b.status !== 'cancelled' && (
                          <button className="admin-btn admin-btn-cancel" onClick={() => updateBookingStatus(b.id, 'cancelled')}>Cancel</button>
                        )}
                        <button
                          className="admin-btn"
                          style={{ background:'#ede9fe', color:'#5b21b6' }}
                          onClick={() => {
                            setPayModal(b);
                            setPayForm({
                              payment_status:  b.payment_status,
                              amount_paid:     String(b.amount_paid),
                              extra_amount:    String(b.extra_amount),
                              discount_amount: String(b.discount_amount),
                            });
                          }}
                        >
                          💰 Payment
                        </button>
                        <button className="admin-btn admin-btn-delete" onClick={() => deleteBooking(b.id)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        )}
        </>}
      </main>

      {/* ── Payment Modal ──────────────────────────────────────────────────── */}
      {payModal && (
        <div className="modal-overlay" onClick={() => setPayModal(null)}>
          <div className="modal-box" onClick={e => e.stopPropagation()} style={{ maxWidth: 420 }}>
            <button className="modal-close" onClick={() => setPayModal(null)}>✕</button>
            <h3 className="modal-title">Payment — {payModal.customer_name}</h3>
            <p className="modal-dates">{payModal.check_in} → {payModal.check_out}</p>
            <form className="contact-form" onSubmit={updatePayment}>
              <div className="form-group">
                <label>Payment Status</label>
                <select
                  className={`admin-payment-select admin-payment-select--${payForm.payment_status}`}
                  value={payForm.payment_status}
                  onChange={e => setPayForm({ ...payForm, payment_status: e.target.value })}
                >
                  <option value="not_paid">● Not Paid</option>
                  <option value="partially_paid">● Partially Paid</option>
                  <option value="fully_paid">● Fully Paid</option>
                </select>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Amount Paid (₹)</label>
                  <input type="number" min="0" step="0.01" value={payForm.amount_paid}
                    onChange={e => setPayForm({ ...payForm, amount_paid: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Discount (₹)</label>
                  <input type="number" min="0" step="0.01" value={payForm.discount_amount}
                    onChange={e => setPayForm({ ...payForm, discount_amount: e.target.value })} />
                </div>
              </div>
              <div className="form-group">
                <label>Extra Amount Collected (₹)</label>
                <input type="number" min="0" step="0.01" value={payForm.extra_amount}
                  onChange={e => setPayForm({ ...payForm, extra_amount: e.target.value })} />
              </div>
              <div style={{ display:'flex', gap:10 }}>
                <button type="submit" className="btn btn-primary btn-full">Save Payment</button>
                <button type="button" className="btn btn-full" style={{ background:'#f3f4f6', color:'#374151' }} onClick={() => setPayModal(null)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Mobile Footer ───────────────────────────────────────────────────── */}
      <footer className="admin-mobile-footer">
        <span className="admin-mobile-footer-brand">&#127807; Rainleaf Admin</span>
        <button className="admin-mobile-logout" onClick={handleLogout}>
          ⬅ Logout
        </button>
      </footer>
    </div>
  );
}
