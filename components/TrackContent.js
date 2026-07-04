'use client';

import { useState } from 'react';

export default function TrackContent() {
  const [value, setValue] = useState('');

  const track = (e) => {
    e.preventDefault();
    const trimmed = value.trim();
    // Shiprocket's own public tracker — no account or API key needed on our side,
    // works for any AWB/Order ID they've shipped, same approach the old site used.
    const url = trimmed
      ? `https://www.shiprocket.in/shipment-tracking/?awb=${encodeURIComponent(trimmed)}`
      : 'https://www.shiprocket.in/shipment-tracking/';
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="policy-page container">
      <h1 className="policy-title">Track Your Order</h1>
      <p className="policy-intro">
        Once your order ships, we'll send you the AWB tracking number via WhatsApp or email.
        Enter it below to see live status from our shipping partner, Shiprocket.
      </p>
      <form className="auth-form" onSubmit={track} style={{ maxWidth: 420 }}>
        <label className="auth-field">
          <span>Order ID / AWB Number</span>
          <input
            className="auth-input"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="e.g. 141123221084922"
          />
        </label>
        <button className="btn-solid auth-submit" type="submit">Track Now</button>
      </form>
      <p className="policy-intro" style={{ marginTop: '1.4rem', fontSize: '0.86rem' }}>
        Can't find your AWB number? Message us on{' '}
        <a href="https://wa.me/919014612268" target="_blank" rel="noopener noreferrer">WhatsApp</a>{' '}
        with your order details and we'll look it up.
      </p>
    </div>
  );
}
