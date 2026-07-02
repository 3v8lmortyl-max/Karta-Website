import { redirect } from 'next/navigation';
import Link from 'next/link';
import AddressManager from '../../../components/AddressManager';

export const metadata = { title: 'Saved Addresses — Krta' };

// Auth check happens client-side inside AddressManager on load (keeps this page simple);
// the API routes are the real security boundary via RLS + session check.
export default function AddressesPage() {
  return (
    <div className="account-page container">
      <Link href="/account" className="account-back">← Account</Link>
      <h1 className="account-name">Saved Addresses</h1>
      <AddressManager />
    </div>
  );
}
