'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function SettingsForm() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const save = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    if (newPassword !== confirmPassword) { setError('New passwords do not match.'); return; }
    setSaving(true);
    const res = await fetch('/api/admin/change-password', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ currentPassword, newPassword }),
    });
    setSaving(false);
    if (res.ok) {
      setSuccess('Password updated. Use your new password next time you log in.');
      setCurrentPassword(''); setNewPassword(''); setConfirmPassword('');
    } else {
      const d = await res.json().catch(() => ({}));
      setError(d.error || 'Failed to update password.');
    }
  };

  return (
    <form className="admin-form" onSubmit={save} style={{ maxWidth: 420 }}>
      <p className="admin-hint">Change the password used to log into this admin panel.</p>

      <label className="admin-field">
        <span>Current password</span>
        <input className="admin-input" type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required />
      </label>

      <label className="admin-field">
        <span>New password</span>
        <input className="admin-input" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required minLength={6} />
        <small className="admin-hint">At least 6 characters.</small>
      </label>

      <label className="admin-field">
        <span>Confirm new password</span>
        <input className="admin-input" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required minLength={6} />
      </label>

      {error && <p className="admin-error">{error}</p>}
      {success && <p className="admin-success">{success}</p>}

      <div className="admin-form-actions" style={{ justifyContent: 'space-between' }}>
        <Link href="/admin" className="admin-btn admin-btn-ghost">← Back</Link>
        <button className="admin-btn admin-btn-dark" disabled={saving}>{saving ? 'Saving…' : 'Update password'}</button>
      </div>
    </form>
  );
}
