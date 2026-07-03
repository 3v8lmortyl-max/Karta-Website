import Link from 'next/link';
import { supabaseAdmin } from '../../../lib/supabase';
import { formatINR } from '../../../lib/products';

export const metadata = { title: 'Order confirmed — Krta' };

export default async function CheckoutSuccessPage({ searchParams }) {
  const orderId = searchParams.order;
  let order = null;
  if (orderId) {
    const admin = supabaseAdmin();
    const { data } = await admin.from('orders').select('id, amount, items, status, created_at').eq('id', orderId).single();
    order = data;
  }

  return (
    <div className="checkout-page container checkout-success">
      <div className="checkout-success-icon">✓</div>
      <h1 className="checkout-title">Thank you for your order</h1>
      {order ? (
        <>
          <p className="checkout-success-sub">
            Order #{order.id.slice(0, 8).toUpperCase()} — {formatINR(order.amount)}
          </p>
          <p className="checkout-success-note">
            We've received your order and will begin preparing it. You'll find this order in your account under Order History.
          </p>
        </>
      ) : (
        <p className="checkout-success-note">Your payment was received. Thank you for shopping with Krta.</p>
      )}
      <div className="checkout-success-actions">
        <Link href="/account/orders" className="btn-line">View order history</Link>
        <Link href="/shop" className="btn-solid">Continue shopping</Link>
      </div>
    </div>
  );
}
