'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import Stories from '../components/Stories';
import Hero from '../components/Hero';
import ProductRow from '../components/ProductRow';
import CollectionTiles from '../components/CollectionTiles';
import Stores from '../components/Stores';
import BrandStory from '../components/BrandStory';
import PopularSearches from '../components/PopularSearches';
import { products } from '../lib/products';

function useRevealAll() {
  useEffect(() => {
    const els = document.querySelectorAll('.fade-up');
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('revealed'); obs.unobserve(e.target); } }),
      { rootMargin: '-30px', threshold: 0.08 }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);
}

const FOOTER = {
  connect: [
    { label: 'Call', href: 'tel:+919000000010' },
    { label: 'WhatsApp', href: 'https://wa.me/919000000010' },
    { label: 'Instagram', href: 'https://instagram.com' },
    { label: 'YouTube', href: 'https://youtube.com' },
  ],
  support: [
    { label: 'Make a Return / Exchange', href: '/returns' },
    { label: 'Refund / Exchange Policy', href: '/returns' },
    { label: 'Track Your Order', href: '/track' },
    { label: 'Shipping Policy', href: '/shipping' },
    { label: "FAQ's", href: '/faq' },
    { label: 'Terms', href: '/terms' },
  ],
  brand: [
    { label: 'Our Story', href: '/about' },
    { label: 'Find Us', href: '/about' },
    { label: 'Collaborations', href: '/about' },
    { label: 'Careers', href: '/about' },
    { label: 'Journal', href: '/journal' },
  ],
};

export default function Home() {
  useRevealAll();

  const newArrivals = products.filter((p) => p.collection === 'New Arrivals');
  const bestSellers = products.filter((p) => p.collection === 'Best Sellers');
  const limited = products.filter((p) => p.collection === 'Limited Edition');
  const accessories = products.filter((p) => p.category === 'Accessories' || p.collection === 'Best Sellers');

  return (
    <>
      <Stories />
      <Hero />

      <ProductRow
        title="Latest drop"
        discoverHref="/shop?collection=new-arrivals"
        viewAllHref="/shop?collection=new-arrivals"
        items={newArrivals}
      />

      <CollectionTiles />

      <ProductRow
        title="Best sellers"
        discoverHref="/shop?collection=best-sellers"
        viewAllHref="/shop?collection=best-sellers"
        items={bestSellers}
      />

      <ProductRow
        title="Limited editions"
        discoverHref="/collections/limited-edition"
        viewAllHref="/collections/limited-edition"
        items={limited}
      />

      <Stores />

      <BrandStory />

      <PopularSearches />

      {/* FOOTER */}
      <footer className="footer">
        <div className="container">
          <div className="footer-brand">Karta</div>
          <div className="footer-cols">
            <div className="footer-col">
              <h4>Connect with us</h4>
              {FOOTER.connect.map((l) => (
                <a key={l.label} href={l.href} target={l.href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer">{l.label}</a>
              ))}
            </div>
            <div className="footer-col">
              <h4>Order Support</h4>
              {FOOTER.support.map((l) => <Link key={l.label} href={l.href}>{l.label}</Link>)}
            </div>
            <div className="footer-col">
              <h4>We are Karta</h4>
              {FOOTER.brand.map((l) => <Link key={l.label} href={l.href}>{l.label}</Link>)}
            </div>
          </div>
          <div className="footer-bottom">
            <span>© 2026 Karta. All rights reserved.</span>
            <span>Wear Art. Wear Karta.</span>
          </div>
        </div>
      </footer>
    </>
  );
}
