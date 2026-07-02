'use client';
import { useEffect, useState } from 'react';

const EMPTY = { label: 'Home', full_name: '', phone: '', line1: '', line2: '', city: '', state: '', pincode: '', is_default: false };

export default function AddressManager() {
  const [addresses, setAddresses] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');

  const load = async () => {
    const res = await fetch('/api/account/addresses');
    if (res.status === 401) { window.location.href = '/login?next=/account/addresses'; return; }
    const data = await res.json();
    setAddresses(data.addresses || []);
  };
  useEffect(() => { load(); }, []);

  const startNew = () => { setForm(EMPTY); setEditingId(null); setShowForm(true); };
  const startEdit = (a) => { setForm(a); setEditingId(a.id); setShowForm(true); };

  const save = async (e) => {
    e.preventDefault();
    setError('');
    const res = editingId
      ? await fetch(`/api/account/addresses/${editingId}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
      : await fetch('/api/account/addresses', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    if (!res.ok) { const d = await res.json().catch(() => ({})); setError(d.error || 'Failed to save.'); return; }
    setShowForm(false);
    load();
  };

  const remove = async (id) => {
    if (!confirm('Delete this address?')) return;
    await fetch(`/api/account/addresses/${id}`, { method: 'DELETE' });
    load();
  };

  return (
    <div className="address-manager">
      {!addresses ? (
        <p className="account-empty">Loading…</p>
      ) : (
        <>
          {addresses.length === 0 && !showForm && <p className="account-empty">No saved addresses yet.</p>}
          <div className="address-list">
            {addresses.map((a) => (
              <div className="address-card" key={a.id}>
                <div className="address-card-head">
                  <strong>{a.label}</strong>
                  {a.is_default && <span className="address-default-tag">Default</span>}
                </div>
                <p>{a.full_name} · {a.phone}</p>
                <p>{a.line1}{a.line2 ? `, ${a.line2}` : ''}</p>
                <p>{a.city}, {a.state} — {a.pincode}</p>
                <div className="address-card-actions">
                  <button className="admin-link" onClick={() => startEdit(a)}>Edit</button>
                  <button className="admin-link admin-link-danger" onClick={() => remove(a.id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>

          {!showForm ? (
            <button className="btn-line" onClick={startNew} style={{ marginTop: '1rem' }}>+ Add new address</button>
          ) : (
            <form className="admin-form" onSubmit={save} style={{ marginTop: '1.2rem', maxWidth: 480 }}>
              <label className="admin-field"><span>Label</span>
                <input className="admin-input" value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} placeholder="Home, Work…" />
              </label>
              <label className="admin-field"><span>Full name</span>
                <input className="admin-input" value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} required />
              </label>
              <label className="admin-field"><span>Phone</span>
                <input className="admin-input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required />
              </label>
              <label className="admin-field"><span>Address line 1</span>
                <input className="admin-input" value={form.line1} onChange={(e) => setForm({ ...form, line1: e.target.value })} required />
              </label>
              <label className="admin-field"><span>Address line 2 (optional)</span>
                <input className="admin-input" value={form.line2 || ''} onChange={(e) => setForm({ ...form, line2: e.target.value })} />
              </label>
              <div className="admin-field-row">
                <label className="admin-field"><span>City</span>
                  <input className="admin-input" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} required />
                </label>
                <label className="admin-field"><span>State</span>
                  <input className="admin-input" value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} required />
                </label>
                <label className="admin-field"><span>Pincode</span>
                  <input className="admin-input" value={form.pincode} onChange={(e) => setForm({ ...form, pincode: e.target.value })} required />
                </label>
              </div>
              <label className="admin-field admin-checkbox">
                <input type="checkbox" checked={form.is_default} onChange={(e) => setForm({ ...form, is_default: e.target.checked })} />
                <span>Set as default address</span>
              </label>
              {error && <p className="admin-error">{error}</p>}
              <div className="admin-form-actions">
                <button type="button" className="admin-btn admin-btn-ghost" onClick={() => setShowForm(false)}>Cancel</button>
                <button className="admin-btn admin-btn-dark">{editingId ? 'Save changes' : 'Add address'}</button>
              </div>
            </form>
          )}
        </>
      )}
    </div>
  );
}
