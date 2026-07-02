'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useUI, useCart } from '../lib/store';
import { supabaseBrowser } from '../lib/supabase-browser';
import { PlusIcon, SearchIcon, BagIcon, BookmarkIcon, UserIcon } from './Icons';

export default function Header() {
  const { openMenu, openSearch, openCart, openWishlist } = useUI();
  const cartCount = useCart((s) => s.items.reduce((n, i) => n + i.qty, 0));
  const [signedIn, setSignedIn] = useState(null); // null = not yet known
  const router = useRouter();

  useEffect(() => {
    const supabase = supabaseBrowser();
    supabase.auth.getUser().then(({ data }) => setSignedIn(!!data.user));
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => setSignedIn(!!session?.user));
    // Prefetch both possible destinations so the tap feels instant either way.
    router.prefetch('/account');
    router.prefetch('/login');
    return () => sub.subscription.unsubscribe();
  }, []);

  return (
    <header className="site-header">
      <div className="header-inner">
        <div className="header-pill">
          <button className="pill-btn" onClick={openMenu} aria-label="Open menu"><PlusIcon size={18} /></button>
          <Link href="/" className="header-logo" aria-label="Krta home">
            <Image src="/karta-logo-mark.png" alt="Krta" width={441} height={148} priority className="header-logo-img" />
          </Link>
        </div>
        <div className="header-right">
          <button className="icon-btn" onClick={openSearch} aria-label="Search"><SearchIcon /></button>
          <button className="icon-btn" onClick={openWishlist} aria-label="Saved items"><BookmarkIcon /></button>
          <Link href={signedIn ? '/account' : '/login'} className="icon-btn" aria-label={signedIn ? 'My account' : 'Log in'}>
            <UserIcon />
          </Link>
          <button className="icon-btn icon-badge" onClick={openCart} aria-label="Open cart">
            <BagIcon />
            {cartCount > 0 && <span className="badge">{cartCount}</span>}
          </button>
        </div>
      </div>
    </header>
  );
}
