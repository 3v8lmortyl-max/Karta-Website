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
            <form className="account-addr-form" onSubmit={save}>
              <input className="ck-input" value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} placeholder="Label (Home, Work…)" />
              <input className="ck-input" value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} placeholder="Full name" required />
              <div className="ck-phone-field">
                <span className="ck-phone-prefix">+91</span>
                <input
                  className="ck-input ck-phone-input"
                  type="tel"
                  inputMode="numeric"
                  placeholder="Phone number"
                  value={form.phone.replace(/^\+91/, '')}
                  onChange={(e) => setForm({ ...form, phone: '+91' + e.target.value.replace(/\D/g, '').slice(0, 10) })}
                  required
                />
              </div>
              <input className="ck-input" value={form.line1} onChange={(e) => setForm({ ...form, line1: e.target.value })} placeholder="Address line 1" required />
              <input className="ck-input" value={form.line2 || ''} onChange={(e) => setForm({ ...form, line2: e.target.value })} placeholder="Apartment, suite, etc. (optional)" />
              <input className="ck-input" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} placeholder="City" required />
              <div className="ck-input-row">
                <input className="ck-input" value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} placeholder="State" required />
                <input className="ck-input" value={form.pincode} onChange={(e) => setForm({ ...form, pincode: e.target.value })} placeholder="PIN code" required />
              </div>
              <label className="ck-checkbox">
                <input type="checkbox" checked={form.is_default} onChange={(e) => setForm({ ...form, is_default: e.target.checked })} />
                <span>Set as default address</span>
              </label>
              {error && <p className="admin-error">{error}</p>}
              <div className="account-addr-form-actions">
                <button type="button" className="btn-line" onClick={() => setShowForm(false)}>Cancel</button>
                <button className="btn-solid">{editingId ? 'Save changes' : 'Add address'}</button>
              </div>
            </form>
          )}
        </>
      )}
    </div>
  );
}
