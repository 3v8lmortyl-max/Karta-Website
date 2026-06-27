'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useUI, useCart } from '../lib/store';
import { PlusIcon, SearchIcon, BagIcon, BookmarkIcon } from './Icons';

export default function Header() {
  const { openMenu, openSearch, openCart, openWishlist } = useUI();
  const cartCount = useCart((s) => s.items.reduce((n, i) => n + i.qty, 0));

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
          <button className="icon-btn icon-badge" onClick={openCart} aria-label="Open cart">
            <BagIcon />
            {cartCount > 0 && <span className="badge">{cartCount}</span>}
          </button>
        </div>
      </div>
    </header>
  );
}
