'use client';
import { useUI } from '../lib/store';

export default function OpenWishlistCard() {
  const openWishlist = useUI((s) => s.openWishlist);
  return (
    <button className="account-card account-card-btn" onClick={openWishlist}>
      <h3>Wishlist</h3>
      <p>Saved on this device</p>
    </button>
  );
}
