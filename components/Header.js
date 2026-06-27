'use client';

import { useEffect, useState } from 'react';
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
  const { openMenu, openSearch, openCart } = useUI();
  const cartCount = useCart((s) => s.items.reduce((n, i) => n + i.qty, 0));

  return (
    <header className="site-header">
      <div className="header-inner">
        <div className="header-left">
          <button className="icon-btn" onClick={openMenu} aria-label="Open menu"><MenuIcon /></button>
          <nav className="header-nav">
            {NAV.map((n) => <Link key={n.href} href={n.href}>{n.label}</Link>)}
          </nav>
        </div>

        <Link href="/" className="header-logo" aria-label="Karta home">
          <span className="wordmark">Karta</span>
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
