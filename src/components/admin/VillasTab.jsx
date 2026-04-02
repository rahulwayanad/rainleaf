import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';

const API = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const EMPTY_ROOM = { name: '', max_guests: 2, is_ac: true, has_attached_bathroom: true };

const EMPTY_VILLA = {
  name: '',
  description: '',
  image_url: '',
  is_active: true,
  amenities: [],
  rooms: [],
};

export default function VillasTab() {
  const { token } = useAuth();
  const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };

  const [villas, setVillas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState(null);       // null | 'add' | villa object (edit)
  const [form, setForm] = useState(EMPTY_VILLA);
  const [amenityInput, setAmenityInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const fetchVillas = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/villas/all`, { headers });
      setVillas(await res.json());
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { fetchVillas(); }, []);

  function openAdd() {
    setForm(EMPTY_VILLA);
    setAmenityInput('');
    setError('');
    setModal('add');
  }

  function openEdit(villa) {
    setForm({
      name: villa.name,
      description: villa.description || '',
      image_url: villa.image_url || '',
      is_active: villa.is_active,
      amenities: [...villa.amenities],
      rooms: villa.rooms.map((r) => ({ ...r })),
    });
    setAmenityInput('');
    setError('');
    setModal(villa);
  }

  // ── Amenities ───────────────────────────────────────────────────────────────
  function addAmenity() {
    const val = amenityInput.trim();
    if (!val || form.amenities.includes(val)) return;
    setForm({ ...form, amenities: [...form.amenities, val] });
    setAmenityInput('');
  }

  function removeAmenity(a) {
    setForm({ ...form, amenities: form.amenities.filter((x) => x !== a) });
  }

  // ── Rooms ────────────────────────────────────────────────────────────────────
  function addRoom() {
    setForm({ ...form, rooms: [...form.rooms, { ...EMPTY_ROOM }] });
  }

  function updateRoom(i, field, value) {
    const updated = form.rooms.map((r, idx) =>
      idx === i ? { ...r, [field]: value } : r
    );
    setForm({ ...form, rooms: updated });
  }

  function removeRoom(i) {
    setForm({ ...form, rooms: form.rooms.filter((_, idx) => idx !== i) });
  }

  // ── Save ─────────────────────────────────────────────────────────────────────
  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const isEdit = modal !== 'add';
      const url = isEdit ? `${API}/api/villas/${modal.id}` : `${API}/api/villas`;
      const method = isEdit ? 'PUT' : 'POST';
      const payload = {
        ...form,
        rooms: form.rooms.map((r) => ({
          ...r,
          max_guests: parseInt(r.max_guests),
          is_ac: Boolean(r.is_ac),
          has_attached_bathroom: Boolean(r.has_attached_bathroom),
        })),
      };
      const res = await fetch(url, { method, headers, body: JSON.stringify(payload) });
      if (!res.ok) throw new Error(await res.text());
      await fetchVillas();
      setModal(null);
    } catch (err) {
      setError(err.message || 'Failed to save villa.');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(villa) {
    if (!confirm(`Delete "${villa.name}"? This cannot be undone.`)) return;
    await fetch(`${API}/api/villas/${villa.id}`, { method: 'DELETE', headers });
    setVillas((prev) => prev.filter((v) => v.id !== villa.id));
  }

  return (
    <div>
      <div className="admin-topbar">
        <h1 className="admin-page-title">Villas</h1>
        <button className="btn btn-primary" onClick={openAdd}>
          + Add Villa
        </button>
      </div>

      {loading && <div className="admin-loading">Loading…</div>}

      {!loading && (
        <div className="villas-admin-grid">
          {villas.length === 0 && <div className="admin-empty">No villas yet. Click "Add Villa" to create one.</div>}
          {villas.map((villa) => (
            <div key={villa.id} className={`villa-admin-card${villa.is_active ? '' : ' villa-admin-card--inactive'}`}>
              {villa.image_url && (
                <div className="villa-admin-img">
                  <img src={villa.image_url} alt={villa.name} />
                </div>
              )}
              <div className="villa-admin-body">
                <div className="villa-admin-header">
                  <h3>{villa.name}</h3>
                  <span className={`admin-status-badge`} style={{ background: villa.is_active ? '#22c55e' : '#aaa' }}>
                    {villa.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
                {villa.description && <p className="villa-admin-desc">{villa.description}</p>}

                {/* Rooms summary */}
                {villa.rooms.length > 0 && (
                  <div className="villa-admin-rooms">
                    <strong>{villa.rooms.length} Room{villa.rooms.length > 1 ? 's' : ''}</strong>
                    <div className="villa-rooms-list">
                      {villa.rooms.map((r, i) => (
                        <span key={i} className="villa-room-tag">
                          {r.name} · {r.max_guests} guests · {r.is_ac ? 'AC' : 'Non-AC'} · {r.has_attached_bathroom ? 'Attached Bath' : 'Common Bath'}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Amenities */}
                {villa.amenities.length > 0 && (
                  <div className="villa-admin-amenities">
                    {villa.amenities.map((a) => (
                      <span key={a} className="villa-amenity-tag">{a}</span>
                    ))}
                  </div>
                )}

                <div className="villa-admin-actions">
                  <button className="admin-btn admin-btn-read" onClick={() => openEdit(villa)}>Edit</button>
                  <button className="admin-btn admin-btn-delete" onClick={() => handleDelete(villa)}>Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Modal */}
      {modal && (
        <div className="modal-overlay" onClick={() => !saving && setModal(null)}>
          <div className="modal-box villa-modal-box" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setModal(null)} disabled={saving}>✕</button>
            <h3 className="modal-title">{modal === 'add' ? 'Add New Villa' : `Edit ${modal.name}`}</h3>

            {error && <div className="form-alert form-alert--error">{error}</div>}

            <form onSubmit={handleSave} className="villa-form">

              {/* Basic Info */}
              <div className="villa-form-section">
                <h4>Basic Info</h4>
                <div className="form-row">
                  <div className="form-group">
                    <label>Villa Name *</label>
                    <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required placeholder="e.g. Villa 1" />
                  </div>
                  <div className="form-group">
                    <label>Image URL</label>
                    <input type="text" value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} placeholder="https://..." />
                  </div>
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <textarea rows="2" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Short description…" />
                </div>
                <div className="form-group form-group-inline">
                  <input type="checkbox" id="is_active" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} />
                  <label htmlFor="is_active">Active (visible to guests)</label>
                </div>
              </div>

              {/* Rooms */}
              <div className="villa-form-section">
                <div className="villa-section-header">
                  <h4>Rooms</h4>
                  <button type="button" className="admin-btn admin-btn-read" onClick={addRoom}>+ Add Room</button>
                </div>
                {form.rooms.length === 0 && <p className="villa-form-hint">No rooms added yet.</p>}
                {form.rooms.map((room, i) => (
                  <div key={i} className="villa-room-row">
                    <div className="form-row">
                      <div className="form-group">
                        <label>Room Name</label>
                        <input type="text" value={room.name} onChange={(e) => updateRoom(i, 'name', e.target.value)} placeholder="e.g. Bedroom 1" required />
                      </div>
                      <div className="form-group" style={{ maxWidth: 120 }}>
                        <label>Max Guests</label>
                        <input type="number" min="1" max="10" value={room.max_guests} onChange={(e) => updateRoom(i, 'max_guests', e.target.value)} />
                      </div>
                    </div>
                    <div className="villa-room-toggles">
                      <label className="villa-toggle">
                        <input type="checkbox" checked={room.is_ac} onChange={(e) => updateRoom(i, 'is_ac', e.target.checked)} />
                        AC
                      </label>
                      <label className="villa-toggle">
                        <input type="checkbox" checked={room.has_attached_bathroom} onChange={(e) => updateRoom(i, 'has_attached_bathroom', e.target.checked)} />
                        Attached Bathroom
                      </label>
                      <button type="button" className="admin-btn admin-btn-delete" onClick={() => removeRoom(i)}>Remove</button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Amenities */}
              <div className="villa-form-section">
                <h4>Amenities</h4>
                <div className="villa-amenity-input">
                  <input
                    type="text"
                    value={amenityInput}
                    onChange={(e) => setAmenityInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addAmenity())}
                    placeholder="e.g. Private Pool, WiFi, Breakfast…"
                  />
                  <button type="button" className="admin-btn admin-btn-read" onClick={addAmenity}>Add</button>
                </div>
                <div className="villa-amenity-tags">
                  {form.amenities.map((a) => (
                    <span key={a} className="villa-amenity-tag villa-amenity-tag--removable">
                      {a} <button type="button" onClick={() => removeAmenity(a)}>×</button>
                    </span>
                  ))}
                </div>
              </div>

              <button type="submit" className="btn btn-primary btn-full" disabled={saving}>
                {saving ? 'Saving…' : modal === 'add' ? 'Create Villa' : 'Save Changes'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
