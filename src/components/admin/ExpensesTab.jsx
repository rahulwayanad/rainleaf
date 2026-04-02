import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const API = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const today = () => new Date().toISOString().split('T')[0];

export default function ExpensesTab() {
  const { token } = useAuth();
  const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };

  const [expenses,    setExpenses]    = useState([]);
  const [types,       setTypes]       = useState([]);
  const [loading,     setLoading]     = useState(false);

  // Filters
  const [showFilters, setShowFilters] = useState(false);
  const [filterFrom,  setFilterFrom]  = useState('');
  const [filterTo,    setFilterTo]    = useState('');
  const [filterType,  setFilterType]  = useState('');

  // Add expense modal
  const [showForm,    setShowForm]    = useState(false);
  const [form,        setForm]        = useState({ amount: '', expense_type_id: '', date: today(), paid_by: '', note: '' });
  const [saving,      setSaving]      = useState(false);

  // Manage types modal
  const [showTypes,   setShowTypes]   = useState(false);
  const [newTypeName, setNewTypeName] = useState('');
  const [typesSaving, setTypesSaving] = useState(false);

  // Edit modal
  const [editModal,   setEditModal]   = useState(null);
  const [editForm,    setEditForm]    = useState({});

  const fetchTypes = useCallback(async () => {
    const res = await fetch(`${API}/api/expenses/types`, { headers });
    if (res.ok) setTypes(await res.json());
  }, [token]);

  const fetchExpenses = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filterFrom) params.append('from_date', filterFrom);
      if (filterTo)   params.append('to_date',   filterTo);
      if (filterType) params.append('expense_type_id', filterType);
      const res = await fetch(`${API}/api/expenses?${params}`, { headers });
      if (res.ok) setExpenses(await res.json());
    } finally {
      setLoading(false);
    }
  }, [token, filterFrom, filterTo, filterType]);

  useEffect(() => { fetchTypes(); }, []);
  useEffect(() => { fetchExpenses(); }, [filterFrom, filterTo, filterType]);

  const total = expenses.reduce((s, e) => s + parseFloat(e.amount), 0);
  const hasFilters = filterFrom || filterTo || filterType;

  async function addExpense(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(`${API}/api/expenses`, {
        method: 'POST', headers,
        body: JSON.stringify({
          amount: parseFloat(form.amount),
          expense_type_id: parseInt(form.expense_type_id),
          date: form.date || today(),
          paid_by: form.paid_by || null,
          note: form.note || null,
        }),
      });
      if (res.ok) {
        setForm({ amount: '', expense_type_id: '', date: today(), paid_by: '', note: '' });
        setShowForm(false);
        fetchExpenses();
      }
    } finally {
      setSaving(false);
    }
  }

  async function deleteExpense(id) {
    if (!confirm('Delete this expense?')) return;
    await fetch(`${API}/api/expenses/${id}`, { method: 'DELETE', headers });
    setExpenses(prev => prev.filter(e => e.id !== id));
  }

  async function saveEdit(e) {
    e.preventDefault();
    const res = await fetch(`${API}/api/expenses/${editModal.id}`, {
      method: 'PATCH', headers,
      body: JSON.stringify({
        amount: parseFloat(editForm.amount),
        expense_type_id: parseInt(editForm.expense_type_id),
        date: editForm.date,
        paid_by: editForm.paid_by || null,
        note: editForm.note || null,
      }),
    });
    if (res.ok) { setEditModal(null); fetchExpenses(); }
  }

  function exportExpensesPDF() {
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text('Rainleaf Family Retreat — Expenses', 14, 14);

    const filters = [];
    if (filterType) { const t = types.find(t => t.id === parseInt(filterType)); if (t) filters.push(`Type: ${t.name}`); }
    if (filterFrom) filters.push(`From: ${filterFrom}`);
    if (filterTo)   filters.push(`To: ${filterTo}`);
    if (filters.length) {
      doc.setFontSize(9);
      doc.setTextColor(100);
      doc.text(`Filters: ${filters.join('  |  ')}`, 14, 22);
    }

    doc.setFontSize(9);
    doc.setTextColor(150);
    doc.text(`Exported: ${new Date().toLocaleString('en-IN')}  |  ${expenses.length} records  |  Total: ₹${total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`, 14, filters.length ? 28 : 22);

    autoTable(doc, {
      startY: filters.length ? 32 : 28,
      head: [['#', 'Date', 'Type', 'Amount (₹)', 'Paid By', 'Note']],
      body: expenses.map((e, i) => [
        i + 1,
        e.date,
        e.expense_type_name || '',
        Number(e.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 }),
        e.paid_by || '—',
        e.note    || '—',
      ]),
      styles: { fontSize: 9, cellPadding: 3 },
      headStyles: { fillColor: [44, 90, 44], textColor: 255, fontStyle: 'bold' },
      alternateRowStyles: { fillColor: [245, 250, 245] },
      foot: [['', '', 'Total', `₹${total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`, '', '']],
      footStyles: { fillColor: [240, 253, 244], textColor: [22, 101, 52], fontStyle: 'bold' },
    });

    const dateStr = new Date().toISOString().split('T')[0];
    doc.save(`rainleaf-expenses-${dateStr}.pdf`);
  }

  async function addType() {
    if (!newTypeName.trim()) return;
    setTypesSaving(true);
    try {
      const res = await fetch(`${API}/api/expenses/types`, {
        method: 'POST', headers,
        body: JSON.stringify({ name: newTypeName.trim() }),
      });
      if (res.ok) { setNewTypeName(''); fetchTypes(); }
    } finally {
      setTypesSaving(false);
    }
  }

  async function deleteType(id) {
    if (!confirm('Delete this expense type?')) return;
    await fetch(`${API}/api/expenses/types/${id}`, { method: 'DELETE', headers });
    fetchTypes();
  }

  return (
    <div>
      {/* Topbar */}
      <div className="admin-topbar">
        <h1 className="admin-page-title">Expenses</h1>
        <div style={{ display: 'flex', gap: 6 }}>
          <button className="btn btn-outline-admin" onClick={() => setShowTypes(true)}>
            ⚙ Types
          </button>
          <button className="btn btn-primary" onClick={() => setShowForm(true)}>
            + Add Expense
          </button>
          {expenses.length > 0 && (
            <button className="btn btn-outline-admin" onClick={exportExpensesPDF}>
              ⬇ PDF
            </button>
          )}
          <button className="btn btn-outline-admin" onClick={fetchExpenses}>↻</button>
        </div>
      </div>

      {/* Filter toggle */}
      <div className="admin-filters-wrap">
        <button className="admin-filter-toggle" onClick={() => setShowFilters(v => !v)}>
          ⚙ {showFilters ? 'Hide Filters' : 'Show Filters'}
          {hasFilters && <span className="admin-filter-active-dot" />}
        </button>
      </div>

      {showFilters && (
        <div className="admin-filters">
          <select className="admin-filter-select" value={filterType} onChange={e => setFilterType(e.target.value)}>
            <option value="">All Types</option>
            {types.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
          <input
            className="admin-filter-input" type="date" title="From date"
            value={filterFrom} onChange={e => setFilterFrom(e.target.value)}
          />
          <input
            className="admin-filter-input" type="date" title="To date"
            value={filterTo} onChange={e => setFilterTo(e.target.value)}
          />
          {hasFilters && (
            <button className="admin-btn admin-btn-delete" onClick={() => {
              setFilterFrom(''); setFilterTo(''); setFilterType(''); setShowFilters(false);
            }}>Clear</button>
          )}
        </div>
      )}

      {/* Summary */}
      {expenses.length > 0 && (
        <div style={{ margin: '12px 0', padding: '10px 16px', background: '#f0fdf4', borderRadius: 8, display: 'inline-block', fontWeight: 600, color: '#166534' }}>
          Total: ₹{total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          <span style={{ fontWeight: 400, color: '#6b7280', marginLeft: 10, fontSize: 13 }}>({expenses.length} entries)</span>
        </div>
      )}

      {/* Table */}
      {loading && <div className="admin-loading">Loading...</div>}
      {!loading && expenses.length === 0 && <div className="admin-empty">No expenses found.</div>}
      {!loading && expenses.length > 0 && (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Type</th>
                <th>Amount (₹)</th>
                <th>Paid By</th>
                <th>Note</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map(e => (
                <tr key={e.id}>
                  <td data-label="Date">{e.date}</td>
                  <td data-label="Type">
                    <span style={{ background: '#ede9fe', color: '#5b21b6', padding: '2px 10px', borderRadius: 12, fontSize: 12, fontWeight: 600 }}>
                      {e.expense_type_name}
                    </span>
                  </td>
                  <td data-label="Amount" style={{ fontWeight: 600 }}>₹{Number(e.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                  <td data-label="Paid By">{e.paid_by || '—'}</td>
                  <td data-label="Note" className="admin-msg-cell">{e.note || '—'}</td>
                  <td className="admin-actions">
                    <button
                      className="admin-btn"
                      style={{ background: '#dbeafe', color: '#1d4ed8' }}
                      onClick={() => { setEditModal(e); setEditForm({ amount: e.amount, expense_type_id: e.expense_type_id, date: e.date, paid_by: e.paid_by || '', note: e.note || '' }); }}
                    >Edit</button>
                    <button className="admin-btn admin-btn-delete" onClick={() => deleteExpense(e.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Add Expense Modal ─────────────────────────────────────────────── */}
      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal-box" onClick={e => e.stopPropagation()} style={{ maxWidth: 460 }}>
            <button className="modal-close" onClick={() => setShowForm(false)}>✕</button>
            <h3 className="modal-title">Add Expense</h3>
            <form className="contact-form" onSubmit={addExpense}>
              <div className="form-row">
                <div className="form-group">
                  <label>Amount (₹)</label>
                  <input type="number" min="0" step="0.01" required placeholder="0.00"
                    value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Date</label>
                  <input type="date" required
                    value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} />
                </div>
              </div>
              <div className="form-group">
                <label>Type</label>
                <select className="expense-type-select" required value={form.expense_type_id} onChange={e => setForm({ ...form, expense_type_id: e.target.value })}>
                  <option value="">Select Type</option>
                  {types.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Paid By <span style={{ color: '#9ca3af', fontWeight: 400 }}>(optional)</span></label>
                <input type="text" placeholder="e.g. Rajan"
                  value={form.paid_by} onChange={e => setForm({ ...form, paid_by: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Note <span style={{ color: '#9ca3af', fontWeight: 400 }}>(optional)</span></label>
                <input type="text" placeholder="Short note"
                  value={form.note} onChange={e => setForm({ ...form, note: e.target.value })} />
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button type="submit" className="btn btn-primary btn-full" disabled={saving}>
                  {saving ? 'Saving…' : 'Save Expense'}
                </button>
                <button type="button" className="btn btn-full" style={{ background: '#f3f4f6', color: '#374151' }} onClick={() => setShowForm(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Edit Expense Modal ────────────────────────────────────────────── */}
      {editModal && (
        <div className="modal-overlay" onClick={() => setEditModal(null)}>
          <div className="modal-box" onClick={e => e.stopPropagation()} style={{ maxWidth: 460 }}>
            <button className="modal-close" onClick={() => setEditModal(null)}>✕</button>
            <h3 className="modal-title">Edit Expense</h3>
            <form className="contact-form" onSubmit={saveEdit}>
              <div className="form-row">
                <div className="form-group">
                  <label>Amount (₹)</label>
                  <input type="number" min="0" step="0.01" required
                    value={editForm.amount} onChange={e => setEditForm({ ...editForm, amount: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Date</label>
                  <input type="date" required
                    value={editForm.date} onChange={e => setEditForm({ ...editForm, date: e.target.value })} />
                </div>
              </div>
              <div className="form-group">
                <label>Type</label>
                <select required value={editForm.expense_type_id} onChange={e => setEditForm({ ...editForm, expense_type_id: e.target.value })}>
                  {types.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Paid By <span style={{ color: '#9ca3af', fontWeight: 400 }}>(optional)</span></label>
                <input type="text" placeholder="Optional"
                  value={editForm.paid_by} onChange={e => setEditForm({ ...editForm, paid_by: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Note <span style={{ color: '#9ca3af', fontWeight: 400 }}>(optional)</span></label>
                <input type="text" placeholder="Optional"
                  value={editForm.note} onChange={e => setEditForm({ ...editForm, note: e.target.value })} />
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button type="submit" className="btn btn-primary btn-full">Save</button>
                <button type="button" className="btn btn-full" style={{ background: '#f3f4f6', color: '#374151' }} onClick={() => setEditModal(null)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Manage Types Modal ────────────────────────────────────────────── */}
      {showTypes && (
        <div className="modal-overlay" onClick={() => setShowTypes(false)}>
          <div className="modal-box" onClick={e => e.stopPropagation()} style={{ maxWidth: 420 }}>
            <button className="modal-close" onClick={() => setShowTypes(false)}>✕</button>
            <h3 className="modal-title">Expense Types</h3>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
              {types.length === 0 && <p style={{ color: '#9ca3af', fontSize: 14 }}>No types yet.</p>}
              {types.map(t => (
                <span key={t.id} style={{ display: 'flex', alignItems: 'center', gap: 4, background: '#f3f4f6', padding: '5px 12px', borderRadius: 20, fontSize: 13 }}>
                  {t.name}
                  <button onClick={() => deleteType(t.id)}
                    style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '0 2px', fontSize: 15, lineHeight: 1 }}>✕</button>
                </span>
              ))}
            </div>
            <div className="form-group">
              <label>Add New Type</label>
              <div style={{ display: 'flex', gap: 8 }}>
                <input
                  type="text" className="form-control" placeholder="Type name"
                  value={newTypeName}
                  onChange={e => setNewTypeName(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addType())}
                />
                <button className="btn btn-primary" onClick={addType} disabled={typesSaving} style={{ whiteSpace: 'nowrap' }}>
                  Add
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
