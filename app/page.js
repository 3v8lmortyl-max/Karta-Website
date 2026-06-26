'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import ProductCard from '../components/ProductCard';
import { ArrowRight } from '../components/Icons';
import { products } from '../lib/products';

const Emblem3D = dynamic(() => import('../components/Emblem3D'), {
  ssr: false,
  loading: () => <div style={{ height: 460, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9a958d', fontSize: '0.75rem', letterSpacing: '0.3em' }}>KARTA</div>,
});

const fade = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0 } };

function SectionHead({ eyebrow, title, sub, href, hrefLabel }) {
  return (
    <div className="section-head">
      <div className="section-head-row">
        <div>
          <motion.p className="eyebrow" variants={fade} initial="hidden" whileInView="show" viewport={{ once: true }} transition={{ duration: 0.5 }}>{eyebrow}</motion.p>
          <motion.h2 className="section-title" variants={fade} initial="hidden" whileInView="show" viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.05 }} dangerouslySetInnerHTML={{ __html: title }} />
          {sub && <motion.p className="section-sub" variants={fade} initial="hidden" whileInView="show" viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 }}>{sub}</motion.p>}
        </div>
        {href && (
          <motion.div variants={fade} initial="hidden" whileInView="show" viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.15 }}>
            <Link href={href} className="view-all">{hrefLabel} <ArrowRight size={15} /></Link>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default function Home() {
  const featured = products.filter(p => p.featured);
  const newArrivals = products.filter(p => p.collection === 'New Arrivals');
  const bestSellers = products.filter(p => p.collection === 'Best Sellers');
  const limited = products.filter(p => p.collection === 'Limited Edition');

  return (
    <>
      {/* HERO */}
      <section className="hero">
        <motion.div className="hero-shopall" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 1.2 }}>
          <Link href="/shop" className="shop-all-link">Shop All</Link>
        </motion.div>
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
              <motion.p className="eyebrow" variants={fade} initial="hidden" whileInView="show" viewport={{ once: true }} transition={{ duration: 0.5 }}>Our Philosophy</motion.p>
              <motion.h2 className="section-title" variants={fade} initial="hidden" whileInView="show" viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.05 }}>
                We don&apos;t sell clothes.<br />We create wearable art.
              </motion.h2>
              <motion.p className="story-body" variants={fade} initial="hidden" whileInView="show" viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 }}>
                Every Karta garment begins as a blank canvas. Our artists spend hours applying hand-painted techniques directly onto premium fabric — sumi ink, pigment washes, gestural brushwork. The result is clothing that carries the unpredictability and soul of fine art.
              </motion.p>
              <motion.p className="story-body" variants={fade} initial="hidden" whileInView="show" viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.15 }}>
                No two pieces are ever the same. When you wear Karta, you wear something that has never existed before, and never will again.
              </motion.p>
              <motion.div variants={fade} initial="hidden" whileInView="show" viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.2 }}>
                <Link href="/about" className="view-all" style={{ marginTop: '2rem', display: 'inline-flex' }}>Our Story <ArrowRight size={15} /></Link>
              </motion.div>
            </div>
            <motion.div className="story-visual" initial={{ opacity: 0, scale: 0.97 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }} />
          </div>
        </div>
      </section>

      {/* 3D EMBLEM */}
      <section className="section section-tint">
        <div className="container">
          <div className="emblem-section">
            <motion.p className="eyebrow" variants={fade} initial="hidden" whileInView="show" viewport={{ once: true }} transition={{ duration: 0.5 }}>The Mark</motion.p>
            <motion.h2 className="section-title" variants={fade} initial="hidden" whileInView="show" viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.05 }}>Karta</motion.h2>
            <Emblem3D />
            <p className="emblem-hint">Drag to rotate · Explore the emblem</p>
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
              <motion.div key={s.step} className="process-card" style={{ background: s.bg }}
                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ duration: 0.7, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}>
                <div className="process-overlay" />
                <div className="process-card-label">
                  <p className="process-step">{s.step}</p>
                  <h3 className="process-name">{s.name}</h3>
                </div>
              </motion.div>
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
            <SectionHead eyebrow="Numbered Pieces" title="Limited Editions" sub="Once they're gone, they're gone." href="/collections/limited-edition" hrefLabel="View All" />
            <div className="product-grid">{limited.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}</div>
          </div>
        </section>
      )}

      {/* NEWSLETTER */}
      <section className="section section-solid">
        <div className="container">
          <div className="newsletter">
            <motion.p className="eyebrow" variants={fade} initial="hidden" whileInView="show" viewport={{ once: true }} transition={{ duration: 0.5 }}>Stay in the Studio</motion.p>
            <motion.h2 className="section-title" variants={fade} initial="hidden" whileInView="show" viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.05 }}>
              New drops. Artist notes.<br />First access.
            </motion.h2>
            <motion.div className="newsletter-form" variants={fade} initial="hidden" whileInView="show" viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.12 }}>
              <input className="newsletter-input" type="email" placeholder="Your email address" />
              <button className="btn-solid" style={{ whiteSpace: 'nowrap', padding: '0 1.6rem' }}>Subscribe</button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* POPULAR SEARCHES */}
      <section className="section section-tint">
        <div className="container">
          <div className="popular">
            <h2 className="popular-title">Popular Searches</h2>
            {[
              { group: 'Shop by Category', items: ['Oversized Tees', 'Hand-Painted Shirts', 'Acid Wash', 'Designer Shirts', 'Artist Jackets', 'Statement Hoodies', 'Printed Sweatshirts', 'Graphic Tees'] },
              { group: 'Shop by Style', items: ['Wearable Art', 'Abstract Prints', 'Casual Shirts', 'Full-Sleeve', 'Wide Trousers', 'Crew Neck', 'Printed Tees', 'Baggy Denim'] },
              { group: 'Shop by Colour', items: ['Black', 'Bone', 'Ochre', 'Rust', 'Indigo', 'Clay'] },
              { group: 'Shop by Season', items: ['Spring', 'Summer', 'Autumn', 'Winter'] },
            ].map((g) => (
              <div className="popular-group" key={g.group}>
                <p className="popular-group-title">{g.group}</p>
                <div className="popular-tags">
                  {g.items.map((it) => (
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
