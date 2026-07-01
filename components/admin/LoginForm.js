'use client';
import { useState } from 'react';

export default function LoginForm() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    const res = await fetch('/api/admin/login', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password }),
    });
    setLoading(false);
    if (res.ok) window.location.reload();
    else setError('Incorrect password.');
  };

  return (
    <div className="admin-login">
      <form className="admin-login-card" onSubmit={submit}>
        <h1 className="admin-login-title">Krta Admin</h1>
        <p className="admin-login-sub">Enter the admin password to continue.</p>
        <input
          type="password" autoFocus value={password} onChange={(e) => setPassword(e.target.value)}
          placeholder="Password" className="admin-input"
        />
        {error && <p className="admin-error">{error}</p>}
        <button className="admin-btn admin-btn-dark" disabled={loading || !password}>
          {loading ? 'Checking…' : 'Enter'}
        </button>
      </form>
    </div>
  );
}
