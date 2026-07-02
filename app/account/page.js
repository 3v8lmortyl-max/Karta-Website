import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import { supabaseServer } from '../../lib/supabase-server';
import SignOutButton from '../../components/SignOutButton';
import OpenWishlistCard from '../../components/OpenWishlistCard';
import AccountCounts from '../../components/AccountCounts';
import AccountCountsSkeleton from '../../components/AccountCountsSkeleton';

export const metadata = { title: 'My Account — Krta' };

export default async function AccountPage() {
  const supabase = supabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login?next=/account');

  // Only fetch the profile name up front (fast, single row). Order/address
  // counts stream in separately below so the page paints immediately.
  const { data: profile } = await supabase.from('profiles').select('full_name').eq('id', user.id).single();
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
        <Suspense fallback={<AccountCountsSkeleton />}>
          <AccountCounts userId={user.id} />
        </Suspense>
        <OpenWishlistCard />
      </div>
    </div>
  );
}
