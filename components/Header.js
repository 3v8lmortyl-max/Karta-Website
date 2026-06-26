'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useUI, useCart, useWishlist } from '../lib/store';
import { MenuIcon, SearchIcon, BagIcon, HeartIcon } from './Icons';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const { openMenu, openSearch, openCart, openWishlist } = useUI();
  const cartCount = useCart((s) => s.items.reduce((n, i) => n + i.qty, 0));
  const wishCount = useWishlist((s) => s.items.length);

  useEffect(() => {
    let raf = null;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        setScrolled(window.scrollY > 30);
        raf = null;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={`site-header ${scrolled ? 'is-scrolled' : ''}`}>
      <div className="header-inner">
        {/* Left */}
        <div className="header-left">
          <button className="icon-btn" onClick={openMenu} aria-label="Open menu">
            <MenuIcon />
          </button>
          <button className="icon-btn" onClick={openSearch} aria-label="Open search">
            <SearchIcon />
          </button>
        </div>

        {/* Center logo */}
        <Link href="/" className="header-logo" aria-label="Karta home">
          <Image
            src="/karta-logo.png"
            alt="Karta"
            width={110}
            height={57}
            priority
            style={{ height: '34px', width: 'auto' }}
          />
        </Link>

        {/* Right */}
        <div className="header-right">
          <button className="icon-btn icon-badge" onClick={openWishlist} aria-label="Open wishlist">
            <HeartIcon />
            {wishCount > 0 && <span className="badge">{wishCount}</span>}
          </button>
          <button className="icon-btn icon-badge" onClick={openCart} aria-label="Open cart">
            <BagIcon />
            {cartCount > 0 && <span className="badge">{cartCount}</span>}
          </button>
        </div>
      </div>
    </header>
  );
}
