'use client';

import { useEffect, useState } from 'react';
import Script from 'next/script';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCart } from '../lib/store';
import { formatINR } from '../lib/products';
import { supabaseBrowser } from '../lib/supabase-browser';

const EMPTY_SHIPPING = { full_name: '', phone: '', email: '', line1: '', line2: '', city: '', state: '', pincode: '' };

// Ensures the phone number always carries the +91 country code before it's sent
// anywhere (order creation, Razorpay prefill) — regardless of whether it came from
// a fresh 10-digit entry or an older saved address that might already have it.
function normalizePhone(raw) {
  const digits = String(raw || '').replace(/\D/g, '');
  const last10 = digits.slice(-10);
  return last10 ? `+91${last10}` : '';
}

export default function CheckoutContent() {
  const router = useRouter();
  const items = useCart((s) => s.items);
  const clearCart = useCart((s) => s.clear);

  const [signedIn, setSignedIn] = useState(false);
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [useNewAddress, setUseNewAddress] = useState(true);
  const [shipping, setShipping] = useState(EMPTY_SHIPPING);
  const [saveAddress, setSaveAddress] = useState(true);

  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState('');
  const [addressSaveWarning, setAddressSaveWarning] = useState('');

  const subtotal = items.reduce((n, i) => n + i.price * i.qty, 0);

  useEffect(() => {
    const supabase = supabaseBrowser();
    supabase.auth.getUser().then(({ data }) => {
      const isIn = !!data.user;
      setSignedIn(isIn);
      if (isIn) {
        fetch('/api/account/addresses').then((r) => r.json()).then((d) => {
          const list = d.addresses || [];
          setSavedAddresses(list);
          if (list.length) {
            const def = list.find((a) => a.is_default) || list[0];
            setSelectedAddressId(def.id);
            setUseNewAddress(false);
          }
        }).catch(() => {});
        setShipping((s) => ({ ...s, email: data.user.email || '' }));
      }
    });
  }, []);

  const buildShippingPayload = () => {
    if (!useNewAddress) {
      const a = savedAddresses.find((x) => x.id === selectedAddressId);
      if (!a) return null;
      return { full_name: a.full_name, phone: normalizePhone(a.phone), line1: a.line1, line2: a.line2, city: a.city, state: a.state, pincode: a.pincode };
    }
    return { ...shipping, phone: normalizePhone(shipping.phone) };
  };

  // Whether the form currently has everything needed to place an order — drives the
  // Pay button's disabled state so it can't be clicked until the address (including a
  // real 10-digit phone number) and email are actually complete.
  const isPhoneValid = /^\d{10}$/.test(shipping.phone);
  const isFormComplete = useNewAddress
    ? !!(shipping.email && shipping.full_name && isPhoneValid && shipping.line1 && shipping.city && shipping.state && shipping.pincode)
    : !!(shipping.email && selectedAddressId);

  const openRazorpay = (order, shippingPayload) => {
    const rz = new window.Razorpay({
      key: order.keyId,
      amount: order.amount,
      currency: order.currency,
      name: 'Krta',
      description: 'Order payment',
      order_id: order.razorpayOrderId,
      prefill: {
        name: shippingPayload.full_name,
        contact: shippingPayload.phone,
        email: shipping.email,
      },
      handler: async (response) => {
        const res = await fetch('/api/checkout/verify', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(response),
        });
        if (res.ok) {
          clearCart();
          router.push(`/checkout/success?order=${order.orderId}`);
        } else {
          setError('Payment succeeded but we could not confirm it. Contact support with your payment ID: ' + response.razorpay_payment_id);
        }
      },
      modal: { ondismiss: () => setPlacing(false) },
      theme: { color: '#111111' },
    });
    rz.on('payment.failed', () => {
      setError('Payment failed. Please try again.');
      setPlacing(false);
    });
    rz.open();
  };

  const placeOrder = async (e) => {
    e.preventDefault();
    setError('');
    const shippingPayload = buildShippingPayload();
    if (!shippingPayload) { setError('Please choose or enter a shipping address.'); return; }
    if (!shippingPayload.full_name || !shippingPayload.phone || !shippingPayload.line1 || !shippingPayload.city || !shippingPayload.state || !shippingPayload.pincode) {
      setError('Please fill in all required address fields.');
      return;
    }
    if (useNewAddress && !isPhoneValid) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }
    setPlacing(true);

    // Save the new address for signed-in users who opted in. We re-check auth status
    // fresh here (rather than trusting the `signedIn` state set on page load) because
    // that state can still be false at submit time if getUser() hadn't resolved yet —
    // which would silently skip this block even though the user really is logged in.
    if (useNewAddress && saveAddress) {
      const supabase = supabaseBrowser();
      const { data: { user: freshUser } } = await supabase.auth.getUser();
      if (freshUser) {
        try {
          // Only pass the columns the addresses table actually has — shippingPayload
          // also carries `email` (needed for the order/customer record), and sending
          // that straight through made PostgREST reject the whole insert with a 400
          // ("column not found"), which silently dropped every saved address.
          const { full_name, phone, line1, line2, city, state, pincode } = shippingPayload;
          const addressPayload = { label: 'Home', full_name, phone, line1, line2, city, state, pincode, is_default: savedAddresses.length === 0 };
          const saveRes = await fetch('/api/account/addresses', {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(addressPayload),
          });
          if (!saveRes.ok) {
            const errBody = await saveRes.json().catch(() => ({}));
            console.error('Address save failed:', saveRes.status, errBody);
            setAddressSaveWarning(`Address wasn't saved to your account (${errBody.error || saveRes.status}), but your order will still go through.`);
          } else {
            const savedData = await saveRes.json().catch(() => ({}));
            console.log('Address saved successfully:', savedData);
          }
        } catch (e) {
          console.error('Address save request failed:', e);
          setAddressSaveWarning("Address wasn't saved to your account, but your order will still go through.");
        }
      } else {
        console.warn('Address save skipped: no authenticated user found at submit time.');
        setAddressSaveWarning("You're not signed in, so this address wasn't saved to your account.");
      }
    }

    const res = await fetch('/api/checkout/create-order', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: items.map((i) => ({ id: i.id, size: i.size, qty: i.qty })),
        shipping: shippingPayload,
      }),
    });

    if (!res.ok) {
      const d = await res.json().catch(() => ({}));
      setError(d.error || 'Could not start checkout. Please try again.');
      setPlacing(false);
      return;
    }
    const order = await res.json();
    openRazorpay(order, shippingPayload);
  };

  if (items.length === 0) {
    return (
      <div className="checkout-page container">
        <p className="account-empty">Your bag is empty.</p>
      </div>
    );
  }

  const itemCount = items.reduce((n, i) => n + i.qty, 0);

  return (
    <div className="checkout-page">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />

      {/* Minimal checkout header — brand + back to shopping */}
      <div className="checkout-brandbar">
        <div className="container checkout-brandbar-inner">
          <Link href="/" className="checkout-brand" aria-label="Krta home">
            <Image src="/karta-logo-mark.png" alt="Krta" width={441} height={148} priority className="checkout-brand-img" />
          </Link>
        </div>
      </div>

      {/* Sticky mini order bar — mirrors the "product pinned at top" pattern from the reference */}
      <div className="checkout-topbar">
        <div className="container checkout-topbar-inner">
          <div className="checkout-topbar-thumb" style={{ backgroundImage: items[0].image }} />
          <div className="checkout-topbar-info">
            <p className="checkout-topbar-name">{items[0].name}{itemCount > 1 ? ` + ${itemCount - 1} more` : ''}</p>
            <p className="checkout-topbar-qty">Qty {itemCount}</p>
          </div>
          <p className="checkout-topbar-total">{formatINR(subtotal)}</p>
        </div>
      </div>

      <div className="container checkout-body">
        <h1 className="checkout-title">Checkout</h1>

        <form onSubmit={placeOrder} className="checkout-grid" id="checkout-form">
          <div className="checkout-form-col">
            <section className="checkout-section">
              <h2>Contact</h2>
              <input className="ck-input" type="email" placeholder="Email" value={shipping.email}
                onChange={(e) => setShipping({ ...shipping, email: e.target.value })} required />
            </section>

            <section className="checkout-section">
              <h2>Shipping address</h2>

              {signedIn && savedAddresses.length > 0 && (
                <div className="checkout-address-choice">
                  {savedAddresses.map((a) => (
                    <label key={a.id} className={`checkout-address-option ${!useNewAddress && selectedAddressId === a.id ? 'on' : ''}`}>
                      <input type="radio" name="addr" checked={!useNewAddress && selectedAddressId === a.id}
                        onChange={() => { setUseNewAddress(false); setSelectedAddressId(a.id); }} />
                      <div>
                        <strong>{a.label}</strong>
                        <p>{a.full_name} · {a.phone}</p>
                        <p>{a.line1}{a.line2 ? `, ${a.line2}` : ''}, {a.city}, {a.state} — {a.pincode}</p>
                      </div>
                    </label>
                  ))}
                  <label className={`checkout-address-option ${useNewAddress ? 'on' : ''}`}>
                    <input type="radio" name="addr" checked={useNewAddress} onChange={() => setUseNewAddress(true)} />
                    <div><strong>Use a new address</strong></div>
                  </label>
                </div>
              )}

              {useNewAddress && (
                <div className="checkout-address-fields">
                  <input className="ck-input" placeholder="Full name" value={shipping.full_name} onChange={(e) => setShipping({ ...shipping, full_name: e.target.value })} required />
                  <div className="ck-phone-field">
                    <span className="ck-phone-prefix">+91</span>
                    <input
                      className={`ck-input ck-phone-input ${shipping.phone && !isPhoneValid ? 'ck-input-invalid' : ''}`}
                      type="tel"
                      inputMode="numeric"
                      placeholder="Phone number"
                      value={shipping.phone}
                      onChange={(e) => setShipping({ ...shipping, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                      required
                    />
                  </div>
                  {shipping.phone && !isPhoneValid && (
                    <p className="ck-field-hint">Enter all 10 digits ({shipping.phone.length}/10)</p>
                  )}
                  <input className="ck-input" placeholder="Address line 1" value={shipping.line1} onChange={(e) => setShipping({ ...shipping, line1: e.target.value })} required />
                  <input className="ck-input" placeholder="Apartment, suite, etc. (optional)" value={shipping.line2} onChange={(e) => setShipping({ ...shipping, line2: e.target.value })} />
                  <input className="ck-input" placeholder="City" value={shipping.city} onChange={(e) => setShipping({ ...shipping, city: e.target.value })} required />
                  <div className="ck-input-row">
                    <input className="ck-input" placeholder="State" value={shipping.state} onChange={(e) => setShipping({ ...shipping, state: e.target.value })} required />
                    <input className="ck-input" placeholder="PIN code" value={shipping.pincode} onChange={(e) => setShipping({ ...shipping, pincode: e.target.value })} required />
                  </div>
                  {signedIn && (
                    <label className="ck-checkbox">
                      <input type="checkbox" checked={saveAddress} onChange={(e) => setSaveAddress(e.target.checked)} />
                      <span>Save this address to my account</span>
                    </label>
                  )}
                </div>
              )}
            </section>

            {addressSaveWarning && <p className="checkout-warning">{addressSaveWarning}</p>}
            {error && <p className="admin-error checkout-error">{error}</p>}
          </div>

          <div className="checkout-summary-col">
            <div className="checkout-summary">
              <p className="checkout-summary-title">Order summary</p>
              {items.map((i) => (
                <div className="checkout-summary-row" key={`${i.id}-${i.size}`}>
                  <div className="checkout-summary-thumb" style={{ backgroundImage: i.image }} />
                  <div className="checkout-summary-info">
                    <p className="checkout-summary-name">{i.name}</p>
                    <p className="checkout-summary-size">Size {i.size} · Qty {i.qty}</p>
                  </div>
                  <p className="checkout-summary-price">{formatINR(i.price * i.qty)}</p>
                </div>
              ))}
              <div className="checkout-summary-total">
                <span>Total</span>
                <span>{formatINR(subtotal)}</span>
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* Sticky bottom pay bar — mirrors the reference's fixed "Pay now" bar */}
      <div className="checkout-paybar">
        <div className="container checkout-paybar-inner">
          <div className="checkout-paybar-total">
            <span>Total</span>
            <strong>{formatINR(subtotal)}</strong>
          </div>
          <button type="submit" form="checkout-form" className="btn-solid checkout-pay-btn" disabled={placing || !isFormComplete}>
            {placing ? 'Processing…' : 'Pay now'}
          </button>
        </div>
        <p className="checkout-secure-note">All transactions are secure and encrypted.</p>
      </div>
    </div>
  );
}
