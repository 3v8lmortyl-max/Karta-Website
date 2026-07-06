'use client';

import { useState } from 'react';

export default function TrackContent() {
  const [value, setValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  const track = async (e) => {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed) return;
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const res = await fetch(`/api/track?awb=${encodeURIComponent(trimmed)}`);
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Something went wrong. Please try again.'); return; }
      setResult(data.tracking);
    } catch (err) {
      setError('Could not reach tracking right now. Please try again shortly.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="policy-page container">
      <h1 className="policy-title">Track Your Order</h1>
      <p className="policy-intro">
        Once your order ships, we'll send you the AWB tracking number via WhatsApp or email.
        Enter it below to see live status.
      </p>
      <form className="auth-form" onSubmit={track} style={{ maxWidth: 420 }}>
        <label className="auth-field">
          <span>AWB Number</span>
          <input
            className="auth-input"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="e.g. 141123221084922"
          />
        </label>
        <button className="btn-solid auth-submit" type="submit" disabled={loading}>
          {loading ? 'Tracking…' : 'Track Now'}
        </button>
      </form>

      {error && <p className="auth-error" style={{ marginTop: '1.2rem' }}>{error}</p>}

      {result && (
        <div className="track-result">
          <div className="track-result-status">
            <span className="track-result-label">Status</span>
            <span className="track-result-value">{result.status || 'Unknown'}</span>
          </div>
          <div className="track-result-meta">
            {result.courier && <span>Courier: {result.courier}</span>}
            {result.destination && <span>Destination: {result.destination}</span>}
            {result.edd && <span>Expected: {result.edd}</span>}
            {result.deliveredDate && <span>Delivered: {result.deliveredDate}</span>}
          </div>
          {result.history?.length > 0 && (
            <ul className="track-result-history">
              {result.history.map((h, i) => (
                <li key={i}>
                  <span className="track-result-history-date">{h.date}</span>
                  <span>{h.activity}{h.location ? ` — ${h.location}` : ''}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      <p className="policy-intro" style={{ marginTop: '1.4rem', fontSize: '0.86rem' }}>
        Can't find your AWB number? Message us on{' '}
        <a href="https://wa.me/919014612268" target="_blank" rel="noopener noreferrer">WhatsApp</a>{' '}
        with your order details and we'll look it up.
      </p>
    </div>
  );
}
