import { redirect } from 'next/navigation';
import Link from 'next/link';
import { supabaseServer } from '../../../lib/supabase-server';
import { formatINR } from '../../../lib/products';

export const metadata = { title: 'Order History — Krta' };

export default async function OrdersPage() {
  const supabase = supabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login?next=/account/orders');

  const { data: orders } = await supabase
    .from('orders')
    .select('id, items, amount, status, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  return (
    <div className="account-page container">
      <Link href="/account" className="account-back">← Account</Link>
      <h1 className="account-name">Order History</h1>

      {!orders || orders.length === 0 ? (
        <p className="account-empty">You haven't placed any orders yet. Once you check out, they'll show up here.</p>
      ) : (
        <div className="order-list">
          {orders.map((o) => (
            <div className="order-row" key={o.id}>
              <div>
                <p className="order-id">Order #{o.id.slice(0, 8).toUpperCase()}</p>
                <p className="order-date">{new Date(o.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                <p className="order-items">{(o.items || []).length} item{(o.items || []).length === 1 ? '' : 's'}</p>
              </div>
              <div className="order-right">
                <span className={`order-status status-${o.status}`}>{o.status}</span>
                <span className="order-amount">{formatINR(o.amount)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
