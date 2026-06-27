'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import Hero from '../components/Hero';
import ProductGrid from '../components/ProductGrid';
import CapsCard from '../components/CapsCard';
import CollectionTiles from '../components/CollectionTiles';
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
    { label: 'Text (WhatsApp)', href: 'https://wa.me/919000000010' },
    { label: 'Instagram', href: 'https://instagram.com' },
    { label: 'YouTube', href: 'https://youtube.com' },
    { label: 'LinkedIn', href: 'https://linkedin.com' },
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
    { label: 'Walk-in Stores', href: '/about' },
    { label: 'Collaborations', href: '/about' },
    { label: 'Careers', href: '/about' },
    { label: 'Media', href: '/journal' },
    { label: 'Blogs', href: '/journal' },
  ],
};

export default function Home() {
  useRevealAll();

  const newArrivals = products.filter((p) => p.collection === 'New Arrivals');
  const bestSellers = products.filter((p) => p.collection === 'Best Sellers');
  const limited = products.filter((p) => p.collection === 'Limited Edition');
  const caps = products; // placeholder set for the "Krta Caps" carousel

  return (
    <>
      <Hero />

      <ProductGrid title="Latest drop" discoverHref="/shop?collection=new-arrivals" dark={false}
        items={[...newArrivals, ...bestSellers].slice(0, 4)} />

      <CapsCard title="Krta Caps" discoverHref="/shop?q=Cap" items={caps} />

      <CollectionTiles />

      <ProductGrid title="Winter collection" discoverHref="/collections/limited-edition" dark={false}
        items={[...bestSellers, ...limited, ...newArrivals].slice(0, 6)} />

      <BrandStory />

      <PopularSearches />

      <footer className="footer">
        <div className="container">
          <div className="footer-script">krta</div>

          <div className="footer-grid">
            <div className="footer-colset">
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
            </div>

            <div className="footer-col">
              <h4>We are Krta</h4>
              {FOOTER.brand.map((l) => <Link key={l.label} href={l.href}>{l.label}</Link>)}
            </div>
          </div>


          <div className="footer-copy">© 2026 Krta. All rights reserved.</div>
        </div>
      </footer>
    </>
  );
}
