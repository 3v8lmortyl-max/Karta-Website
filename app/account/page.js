import { redirect } from 'next/navigation';
import Link from 'next/link';
import { supabaseServer } from '../../lib/supabase-server';
import SignOutButton from '../../components/SignOutButton';
import OpenWishlistCard from '../../components/OpenWishlistCard';

export const metadata = { title: 'My Account — Krta' };

export default async function AccountPage() {
  const supabase = supabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login?next=/account');

  const { data: profile } = await supabase.from('profiles').select('full_name, phone').eq('id', user.id).single();
  const { count: orderCount } = await supabase.from('orders').select('id', { count: 'exact', head: true }).eq('user_id', user.id);
  const { count: addressCount } = await supabase.from('addresses').select('id', { count: 'exact', head: true }).eq('user_id', user.id);

  const displayName = profile?.full_name || user.user_metadata?.full_name || user.email;

  return (
    <div className="account-page container">
      <div className="account-head">
        <div>
          <p className="account-kicker">My Account</p>
          <h1 className="account-name">{displayName}</h1>
          <p className="account-email">{user.email}</p>
        </div>
        <SignOutButton />
      </div>

      <div className="account-grid">
        <Link href="/account/orders" className="account-card">
          <h3>Order History</h3>
          <p>{orderCount || 0} order{orderCount === 1 ? '' : 's'}</p>
        </Link>
        <Link href="/account/addresses" className="account-card">
          <h3>Saved Addresses</h3>
          <p>{addressCount || 0} address{addressCount === 1 ? '' : 'es'}</p>
        </Link>
        <OpenWishlistCard />
      </div>
    </div>
  );
}
