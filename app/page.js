'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import ProductCard from '../components/ProductCard';
import { ArrowRight } from '../components/Icons';
import { products } from '../lib/products';

// 3D emblem loads only when its section enters viewport
const Emblem3D = dynamic(() => import('../components/Emblem3D'), {
  ssr: false,
  loading: () => (
    <div style={{ height: 480, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9a958d', fontSize: '0.75rem', letterSpacing: '0.3em' }}>
      KARTA
    </div>
  ),
});

// Lightweight reveal hook
function useRevealAll(selector = '.fade-up') {
  useEffect(() => {
    const els = document.querySelectorAll(selector);
    const obs = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('revealed'); obs.unobserve(e.target); } }),
      { rootMargin: '-30px', threshold: 0.08 }
    );
    els.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);
}

function SectionHead({ eyebrow, title, sub, href, hrefLabel }) {
  return (
    <div className="section-head">
      <div className="section-head-row">
        <div>
          <p className="eyebrow fade-up">{eyebrow}</p>
          <h2 className="section-title fade-up" style={{ transitionDelay: '60ms' }} dangerouslySetInnerHTML={{ __html: title }} />
          {sub && <p className="section-sub fade-up" style={{ transitionDelay: '100ms' }}>{sub}</p>}
        </div>
        {href && (
          <Link href={href} className="view-all fade-up" style={{ transitionDelay: '120ms' }}>
            {hrefLabel} <ArrowRight size={15} />
          </Link>
        )}
      </div>
    </div>
  );
}

export default function Home() {
  useRevealAll('.fade-up');

  const featured = products.filter(p => p.featured);
  const newArrivals = products.filter(p => p.collection === 'New Arrivals');
  const bestSellers = products.filter(p => p.collection === 'Best Sellers');
  const limited = products.filter(p => p.collection === 'Limited Edition');

  return (
    <>
      {/* HERO */}
      <section className="hero">
        <div className="hero-shopall">
          <Link href="/shop" className="shop-all-link">Shop All</Link>
        </div>
      </section>

      {/* FEATURED */}
      <section className="section section-tint">
        <div className="container">
          <SectionHead eyebrow="Featured" title="Wear Art Collection" sub="Each piece individually crafted. No two identical." href="/collections/wear-art" hrefLabel="View Collection" />
          <div className="product-grid">{featured.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}</div>
        </div>
      </section>

      {/* STORY */}
      <section className="section section-solid">
        <div className="container">
          <div className="story">
            <div className="story-text">
              <p className="eyebrow fade-up">Our Philosophy</p>
              <h2 className="section-title fade-up" style={{ transitionDelay: '60ms' }}>
                We don&apos;t sell clothes.<br />We create wearable art.
              </h2>
              <p className="story-body fade-up" style={{ transitionDelay: '100ms' }}>
                Every Karta garment begins as a blank canvas. Our artists spend hours applying hand-painted techniques directly onto premium fabric — sumi ink, pigment washes, gestural brushwork. The result is clothing that carries the unpredictability and soul of fine art.
              </p>
              <p className="story-body fade-up" style={{ transitionDelay: '130ms' }}>
                No two pieces are ever the same. When you wear Karta, you wear something that has never existed before, and never will again.
              </p>
              <Link href="/about" className="view-all fade-up" style={{ marginTop: '2rem', display: 'inline-flex', transitionDelay: '160ms' }}>
                Our Story <ArrowRight size={15} />
              </Link>
            </div>
            <div className="story-visual fade-up" style={{ transitionDelay: '80ms' }} />
          </div>
        </div>
      </section>

      {/* 3D EMBLEM */}
      <section className="section section-tint">
        <div className="container">
          <div className="emblem-section">
            <p className="eyebrow fade-up">The Mark</p>
            <h2 className="section-title fade-up" style={{ transitionDelay: '60ms' }}>Karta</h2>
            <Emblem3D />
            <p className="emblem-hint">Drag to rotate · Spin freely</p>
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section className="section section-solid">
        <div className="container">
          <SectionHead eyebrow="The Process" title="Made by hand,<br/>worn with intention." sub="From blank fabric to finished artwork — every step is done by hand." />
          <div className="process-grid">
            {[
              { step: '01', name: 'Select the Fabric', bg: 'linear-gradient(135deg,#1c1a18,#2a2520)' },
              { step: '02', name: 'Paint the Art', bg: 'linear-gradient(135deg,#1a1c1e,#28303a)' },
              { step: '03', name: 'Finish & Sign', bg: 'linear-gradient(135deg,#1e1a14,#382e1e)' },
            ].map((s, i) => (
              <div key={s.step} className="process-card card-reveal" style={{ background: s.bg, transitionDelay: `${i * 80}ms` }}>
                <div className="process-overlay" />
                <div className="process-card-label">
                  <p className="process-step">{s.step}</p>
                  <h3 className="process-name">{s.name}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* NEW ARRIVALS */}
      {newArrivals.length > 0 && (
        <section className="section section-tint">
          <div className="container">
            <SectionHead eyebrow="Just Dropped" title="New Arrivals" href="/shop?collection=new-arrivals" hrefLabel="See All" />
            <div className="product-grid">{newArrivals.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}</div>
          </div>
        </section>
      )}

      {/* BEST SELLERS */}
      {bestSellers.length > 0 && (
        <section className="section section-solid">
          <div className="container">
            <SectionHead eyebrow="Collector Favourites" title="Best Sellers" href="/shop?collection=best-sellers" hrefLabel="See All" />
            <div className="product-grid">{bestSellers.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}</div>
          </div>
        </section>
      )}

      {/* LIMITED */}
      {limited.length > 0 && (
        <section className="section section-tint">
          <div className="container">
            <SectionHead eyebrow="Numbered Pieces" title="Limited Editions" sub="Once they&apos;re gone, they&apos;re gone." href="/collections/limited-edition" hrefLabel="View All" />
            <div className="product-grid">{limited.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}</div>
          </div>
        </section>
      )}

      {/* NEWSLETTER */}
      <section className="section section-solid">
        <div className="container">
          <div className="newsletter">
            <p className="eyebrow fade-up">Stay in the Studio</p>
            <h2 className="section-title fade-up" style={{ transitionDelay: '60ms' }}>New drops. Artist notes.<br />First access.</h2>
            <div className="newsletter-form fade-up" style={{ transitionDelay: '100ms' }}>
              <input className="newsletter-input" type="email" placeholder="Your email address" />
              <button className="btn-solid" style={{ whiteSpace: 'nowrap', padding: '0 1.6rem' }}>Subscribe</button>
            </div>
          </div>
        </div>
      </section>

      {/* POPULAR SEARCHES */}
      <section className="section section-tint">
        <div className="container">
          <div className="popular">
            <h2 className="popular-title fade-up">Popular Searches</h2>
            {[
              { group: 'Shop by Category', items: ['Oversized Tees','Hand-Painted Shirts','Acid Wash','Designer Shirts','Artist Jackets','Statement Hoodies','Printed Sweatshirts','Graphic Tees'] },
              { group: 'Shop by Style', items: ['Wearable Art','Abstract Prints','Casual Shirts','Full-Sleeve','Wide Trousers','Crew Neck','Printed Tees','Baggy Denim'] },
              { group: 'Shop by Colour', items: ['Black','Bone','Ochre','Rust','Indigo','Clay'] },
              { group: 'Shop by Season', items: ['Spring','Summer','Autumn','Winter'] },
            ].map((g) => (
              <div className="popular-group" key={g.group}>
                <p className="popular-group-title">{g.group}</p>
                <div className="popular-tags">
                  {g.items.map(it => (
                    <Link href={`/shop?q=${encodeURIComponent(it)}`} key={it} className="popular-tag">{it}</Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-grid">
          <div>
            <Image src="/karta-logo.png" alt="Karta" width={110} height={57} style={{ height: '34px', width: 'auto', marginBottom: '1rem' }} />
            <p className="footer-tag">Wear Art. Wear Karta.</p>
          </div>
          <div className="footer-col">
            <h4>Shop</h4>
            <Link href="/shop">All Products</Link>
            <Link href="/collections">Collections</Link>
            <Link href="/shop?tag=new">New Arrivals</Link>
            <Link href="/collections/limited-edition">Limited Editions</Link>
          </div>
          <div className="footer-col">
            <h4>Company</h4>
            <Link href="/about">About Karta</Link>
            <Link href="/journal">Journal</Link>
            <Link href="/contact">Contact</Link>
            <Link href="/track">Order Tracking</Link>
          </div>
          <div className="footer-col">
            <h4>Legal</h4>
            <Link href="/privacy">Privacy Policy</Link>
            <Link href="/shipping">Shipping Policy</Link>
            <Link href="/returns">Returns</Link>
            <Link href="/terms">Terms</Link>
            <Link href="/faq">FAQ</Link>
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
