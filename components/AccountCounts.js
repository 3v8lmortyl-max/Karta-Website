import Link from 'next/link';
import { supabaseServer } from '../lib/supabase-server';

export default async function AccountCounts({ userId }) {
  const supabase = supabaseServer();
  const [{ count: orderCount }, { count: addressCount }] = await Promise.all([
    supabase.from('orders').select('id', { count: 'exact', head: true }).eq('user_id', userId),
    supabase.from('addresses').select('id', { count: 'exact', head: true }).eq('user_id', userId),
  ]);

  return (
    <>
      <Link href="/account/orders" className="account-card">
        <h3>Order History</h3>
        <p>{orderCount || 0} order{orderCount === 1 ? '' : 's'}</p>
      </Link>
      <Link href="/account/addresses" className="account-card">
        <h3>Saved Addresses</h3>
        <p>{addressCount || 0} address{addressCount === 1 ? '' : 'es'}</p>
      </Link>
    </>
  );
}
