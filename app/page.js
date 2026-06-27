'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import { ArrowRight } from '../components/Icons';
import { products } from '../lib/products';

function useRevealAll() {
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('revealed'); obs.unobserve(e.target); } }),
      { rootMargin: '-30px', threshold: 0.08 }
    );
    document.querySelectorAll('.fade-up').forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);
}

const LOOKBOOK = [
  { name: 'New Arrivals', href: '/shop?collection=new-arrivals', bg: 'linear-gradient(150deg,#d9d2c6,#a9b2c2)' },
  { name: 'Hand-Painted', href: '/collections/wear-art', bg: 'linear-gradient(150deg,#e7c79a,#c06a3a)' },
  { name: 'Limited Editions', href: '/collections/limited-edition', bg: 'linear-gradient(150deg,#bcc6e6,#5f6f9e)' },
  { name: 'The Studio', href: '/about', bg: 'linear-gradient(150deg,#e9e4db,#bcae97)' },
];

const COLLECTION_TILES = [
  { title: 'Wear Art', href: '/collections/wear-art', bg: 'linear-gradient(135deg,#cdb189 0%,#7c4a2b 100%)', span: true },
  { title: 'New Arrivals', href: '/shop?collection=new-arrivals', bg: 'linear-gradient(135deg,#9aa6c6 0%,#33406a 100%)' },
  { title: 'Limited Editions', href: '/collections/limited-edition', bg: 'linear-gradient(135deg,#1c1c1c 0%,#444 100%)' },
];

const STORES = [
  { name: 'The Studio', status: 'Open now', addr: 'Bichkunda, Kamareddy District, Telangana 503235', href: 'https://maps.google.com', tone: 'linear-gradient(150deg,#e8e2d8,#c9bda6)' },
  { name: 'Hyderabad', status: 'Coming soon', addr: 'Banjara Hills — opening 2026. Appointments by request.', href: 'https://maps.google.com', tone: 'linear-gradient(150deg,#c7d0e2,#8593b3)' },
  { name: 'Online', status: 'Open 24/7', addr: 'Worldwide shipping. Every piece made to order in the studio.', href: '/shop', tone: 'linear-gradient(150deg,#e9cfa6,#c98a4e)' },
];

const POPULAR = ['Oversized Tees','Hand-Painted Shirts','Acid Wash','Wide Trousers','Artist Jackets','Statement Hoodies','Silk Scarves','Limited Editions','Black','Bone','Ochre','Indigo','Rust','New Arrivals'];

export default function Home() {
  useRevealAll();
  const newArrivals = products.filter(p => p.collection === 'New Arrivals');
  const bestSellers = products.filter(p => p.collection === 'Best Sellers' || p.collection === 'Limited Edition');

  return (
    <>
      {/* HERO */}
      <section className="hero">
        <div className="hero-inner">
          <p className="hero-kicker fade-up">Handmade Wearable Art · Est. Telangana</p>
          <h1 className="hero-title fade-up" style={{ transitionDelay: '80ms' }}>Wear Art.<br />Wear Karta.</h1>
          <div className="hero-actions fade-up" style={{ transitionDelay: '160ms' }}>
            <Link href="/shop" className="btn-solid">Shop All</Link>
            <Link href="/collections/wear-art" className="btn-line">The Collection</Link>
          </div>
        </div>
      </section>

      {/* LOOKBOOK */}
      <section className="section">
        <div className="lookbook">
          {LOOKBOOK.map((l, i) => (
            <Link key={l.name} href={l.href} className="look-tile fade-up" style={{ transitionDelay: `${i * 60}ms` }}>
              <div className="look-tile-bg" style={{ background: l.bg }} />
              <div className="look-tile-content">
                <span className="look-tile-name">{l.name}</span>
                <span className="look-tile-shop">Shop Now <ArrowRight size={13} /></span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* LATEST DROP */}
      <section className="section section-tint">
        <div className="section-head">
          <div>
            <p className="eyebrow fade-up">Just Dropped</p>
            <h2 className="section-title fade-up" style={{ transitionDelay: '60ms' }}>Latest Drop</h2>
          </div>
          <Link href="/shop?collection=new-arrivals" className="view-all fade-up">Discover More <ArrowRight size={14} /></Link>
        </div>
        <div className="product-grid">
          {newArrivals.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
        </div>
      </section>

      {/* DISCOVER COLLECTION */}
      <section className="section" style={{ paddingBottom: 0 }}>
        <div className="section-head">
          <div>
            <p className="eyebrow fade-up">Explore</p>
            <h2 className="section-title fade-up" style={{ transitionDelay: '60ms' }}>Discover Collection</h2>
          </div>
        </div>
        <div className="collections-stack">
          {COLLECTION_TILES.map((c) => (
            <Link key={c.title} href={c.href} className={`coll-tile ${c.span ? 'span-2' : ''}`}>
              <div className="coll-tile-bg" style={{ background: c.bg }} />
              <div className="coll-tile-inner">
                <h3 className="coll-tile-title">{c.title}</h3>
                <span className="coll-tile-cta">Shop Now <ArrowRight size={14} /></span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* BEST SELLERS */}
      <section className="section section-tint">
        <div className="section-head">
          <div>
            <p className="eyebrow fade-up">Collector Favourites</p>
            <h2 className="section-title fade-up" style={{ transitionDelay: '60ms' }}>Best Sellers</h2>
          </div>
          <Link href="/shop" className="view-all fade-up">View All <ArrowRight size={14} /></Link>
        </div>
        <div className="product-grid">
          {bestSellers.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
        </div>
      </section>

      {/* STORES */}
      <section className="section">
        <div className="section-head">
          <div>
            <p className="eyebrow fade-up">Find Us</p>
            <h2 className="section-title fade-up" style={{ transitionDelay: '60ms' }}>Visit the Studio</h2>
          </div>
        </div>
        <div className="stores-grid">
          {STORES.map((s) => (
            <div key={s.name} className="store-card fade-up">
              <div className="store-img" style={{ background: s.tone }}>
                <span className="store-status">{s.status}</span>
              </div>
              <div className="store-body">
                <h3 className="store-name">{s.name}</h3>
                <p className="store-addr">{s.addr}</p>
                <Link href={s.href} className="store-link">Get Direction <ArrowRight size={13} /></Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* EDITORIAL / SEO */}
      <section className="section section-tint">
        <div className="editorial">
          <h2 className="fade-up">Handmade Wearable Art from India</h2>
          <p className="lead fade-up">Karta begins where fashion ends and art starts. Every garment leaves the studio as a one-of-one piece — hand-painted, pigment-washed, and signed. No two are ever alike.</p>
          <p className="fade-up">Born in Telangana, Karta blends the discipline of fine art with the ease of everyday streetwear. We work in small batches on premium, responsibly sourced fabric, letting the unpredictability of the brush define each drop. The result is clothing with the soul of a canvas and the comfort of your favourite tee.</p>
          <h3 className="fade-up">What Makes Karta Different</h3>
          <p className="fade-up">Where most labels print at scale, we paint by hand. Sumi ink, pigment study dyes, raw-edge construction and gestural brushwork turn each tee, trouser and jacket into a wearable artwork. It is slow fashion with intention — made to be seen, felt, and kept.</p>
          <h3 className="fade-up">Wearable Art for Every Season</h3>
          <p className="fade-up">From lightweight hand-painted tees for summer to heavyweight pigment hoodies and raw denim for winter, the Karta wardrobe is built to layer across the year. Unisex by design, our pieces are made for anyone who treats getting dressed as a form of self-expression.</p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-top">
          <div className="footer-col">
            <h4>Karta</h4>
            <p className="footer-tagline">Handmade wearable art on premium fabric. Designed and painted in Telangana, India. Wear Art. Wear Karta.</p>
          </div>
          <div className="footer-col">
            <h4>Connect</h4>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer">YouTube</a>
            <a href="https://wa.me/910000000000" target="_blank" rel="noopener noreferrer">WhatsApp</a>
            <a href="mailto:hello@karta.studio">Email</a>
          </div>
          <div className="footer-col">
            <h4>Order Support</h4>
            <Link href="/returns">Returns & Exchange</Link>
            <Link href="/shipping">Shipping Policy</Link>
            <Link href="/track">Track Your Order</Link>
            <Link href="/faq">FAQ</Link>
            <Link href="/terms">Terms</Link>
          </div>
          <div className="footer-col">
            <h4>We Are Karta</h4>
            <Link href="/about">Our Story</Link>
            <Link href="/about">The Studio</Link>
            <Link href="/collaborations">Collaborations</Link>
            <Link href="/careers">Careers</Link>
          </div>
        </div>

        <div className="footer-pop">
          <h4>Popular Searches</h4>
          <div className="footer-tags">
            {POPULAR.map(t => <Link key={t} href={`/shop?q=${encodeURIComponent(t)}`}>{t}</Link>)}
          </div>
        </div>

        <div className="footer-bottom">
          <span>© 2026 Karta. All rights reserved.</span>
          <span>Wear Art. Wear Karta.</span>
        </div>
      </footer>
    </>
  );
}
