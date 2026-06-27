'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useUI, useCart } from '../lib/store';
import { MenuIcon, SearchIcon, BagIcon } from './Icons';

const NAV = [
  { label: 'New In', href: '/shop?collection=new-arrivals' },
  { label: 'Collections', href: '/collections' },
  { label: 'Wear Art', href: '/collections/wear-art' },
  { label: 'Studio', href: '/about' },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const { openMenu, openSearch, openCart } = useUI();
  const cartCount = useCart((s) => s.items.reduce((n, i) => n + i.qty, 0));

  useEffect(() => {
    let raf = null;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => { setScrolled(window.scrollY > 20); raf = null; });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={`site-header ${scrolled ? 'is-scrolled' : ''}`}>
      <div className="header-inner">
        <div className="header-left">
          <button className="icon-btn" onClick={openMenu} aria-label="Open menu"><MenuIcon /></button>
          <nav className="header-nav">
            {NAV.map((n) => <Link key={n.href} href={n.href}>{n.label}</Link>)}
          </nav>
          <button className="icon-btn" onClick={openSearch} aria-label="Search" style={{ display: 'none' }}><SearchIcon /></button>
        </div>

        <Link href="/" className="header-logo" aria-label="Karta home">
          <Image src="/karta-wordmark.png" alt="Karta" width={160} height={60} priority />
        </Link>

        <div className="header-right">
          <button className="icon-btn" onClick={openSearch} aria-label="Search"><SearchIcon /></button>
          <button className="icon-btn icon-badge" onClick={openCart} aria-label="Open cart">
            <BagIcon />
            {cartCount > 0 && <span className="badge">{cartCount}</span>}
          </button>
        </div>
      </div>
    </header>
  );
}
