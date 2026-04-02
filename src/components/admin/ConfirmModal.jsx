export default function ConfirmModal({ message, onConfirm, onCancel, confirmLabel = 'Confirm', danger = false }) {
  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-box" onClick={e => e.stopPropagation()} style={{ maxWidth: 360, textAlign: 'center' }}>
        <div style={{ fontSize: 36, marginBottom: 12 }}>{danger ? '🗑️' : '💾'}</div>
        <p style={{ fontSize: 15, color: '#374151', marginBottom: 24, lineHeight: 1.5 }}>{message}</p>
        <div style={{ display: 'flex', gap: 10 }}>
          <button
            className="btn btn-full"
            style={{ background: '#f3f4f6', color: '#374151' }}
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            className="btn btn-full"
            style={{ background: danger ? '#ef4444' : '#5a8f4a', color: '#fff' }}
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
