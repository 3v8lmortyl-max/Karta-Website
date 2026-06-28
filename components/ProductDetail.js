'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import ProductCard from './ProductCard';
import { useCart, useUI, useWishlist } from '../lib/store';
import { formatINR } from '../lib/products';
import { BookmarkIcon } from './Icons';

const DEFAULT_DETAILS = [
  'Premium heavyweight cotton',
  '240 GSM fabric',
  'Hand-finished art print',
  'Oversized fit',
  'Ribbed crew neckline',
  'Garment-washed for softness',
];
const DEFAULT_WASHCARE = [
  'Machine wash cold, inside out',
  'Do not bleach',
  'Tumble dry low',
  'Warm iron — avoid the print',
  'Do not dry clean',
];
const DEFAULT_SHIPPING =
  'Dispatched within 2–4 business days. Free shipping across India on orders above ₹2,000. Easy 7-day returns and exchanges on unworn pieces.';

const SIZE_GUIDE = [['S', 40, 27], ['M', 42, 28], ['L', 44, 29]];

// Build at least 4 gallery slides. Real photos (product.images) take priority;
// otherwise derive tonal variations from the placeholder gradients.
function buildGallery(p) {
  if (Array.isArray(p.images) && p.images.length) return p.images;
  const a = p.image;
  const b = p.image2 || p.image;
  const tweak = (g, deg) => g.replace(/\(\s*-?\d+deg/, `(${deg}deg`);
  return [a, b, tweak(a, 300), tweak(b, 25)];
}

export default function ProductDetail({ product, related = [] }) {
  const gallery = buildGallery(product);
  const sizes = product.sizes && product.sizes.length ? product.sizes : ['XS', 'S', 'M', 'L'];

  const [slide, setSlide] = useState(0);
  const [size, setSize] = useState(sizes[0]);
  const [tab, setTab] = useState('details');
  const [showGuide, setShowGuide] = useState(false);
  const startX = useRef(null);

  const add = useCart((s) => s.add);
  const openCart = useUI((s) => s.openCart);
  const toggleWish = useWishlist((s) => s.toggle);
  const inWish = useWishlist((s) => !!s.items.find((i) => i.id === product.id));

  const onTouchStart = (e) => { startX.current = e.touches[0].clientX; };
  const onTouchEnd = (e) => {
    if (startX.current == null) return;
    const dx = e.changedTouches[0].clientX - startX.current;
    if (dx > 40) setSlide((s) => (s - 1 + gallery.length) % gallery.length);
    else if (dx < -40) setSlide((s) => (s + 1) % gallery.length);
    startX.current = null;
  };

  const addToBag = () => { add(product, size, 1); openCart(); };

  const details = product.details || DEFAULT_DETAILS;
  const description = product.description ||
    `The ${product.name} is finished by hand in the Krta studio, so every piece carries small, deliberate variations that make it one of a kind. Cut from premium fabric in a relaxed, layerable silhouette that pairs easily with denim, cargos and everyday staples.`;
  const washcare = product.washcare || DEFAULT_WASHCARE;
  const shipping = product.shipping || DEFAULT_SHIPPING;
  const drop = product.collection || '2026 Drop';

  return (
    <div className="pdp">
      <div className="container">
        <nav className="pdp-crumb">
          <Link href="/">Home</Link><span>›</span>
          <Link href={`/shop?collection=${encodeURIComponent(drop)}`}>{drop}</Link><span>›</span>
          <span className="pdp-crumb-current">{product.name}</span>
        </nav>

        <div className="pdp-main">
          {/* Gallery */}
          <div className="pdp-gallery">
            <div className="pdp-stage" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
              <div className="pdp-track" style={{ transform: `translateX(-${slide * 100}%)` }}>
                {gallery.map((g, i) => <span key={i} className="pdp-slide" style={{ background: g }} />)}
              </div>
              <span className="pdp-counter">{slide + 1} / {gallery.length}</span>
            </div>
            <div className="pdp-thumbs">
              {gallery.map((g, i) => (
                <button key={i} className={`pdp-thumb ${i === slide ? 'on' : ''}`} style={{ background: g }} onClick={() => setSlide(i)} aria-label={`Image ${i + 1}`} />
              ))}
            </div>
          </div>

          {/* Info */}
          <div className="pdp-info">
            <div className="pdp-titlerow">
              <h1 className="pdp-name">{product.name}</h1>
              <button className={`pdp-save ${inWish ? 'on' : ''}`} onClick={() => toggleWish(product)} aria-label="Save to wishlist">
                <BookmarkIcon filled={inWish} size={22} />
              </button>
            </div>

            <div className="pdp-price">
              {product.salePrice
                ? (<><span className="price-sale">{formatINR(product.salePrice)}</span> <span className="price-was">{formatINR(product.price)}</span></>)
                : formatINR(product.price)}
            </div>

            <div className="pdp-sizehead">
              <span>Select size</span>
              <button className="pdp-guide-btn" onClick={() => setShowGuide((v) => !v)}>Size Guide</button>
            </div>
            <div className="pdp-sizes">
              {sizes.map((s) => (
                <button key={s} className={`pdp-size ${size === s ? 'on' : ''}`} onClick={() => setSize(s)}>{s}</button>
              ))}
            </div>
            {showGuide && (
              <div className="pdp-guide">
                <div className="pdp-guide-row pdp-guide-head"><span>Size</span><span>Chest (in)</span><span>Length (in)</span></div>
                {SIZE_GUIDE.map(([s, c, l]) => (
                  <div className="pdp-guide-row" key={s}><span>{s}</span><span>{c}</span><span>{l}</span></div>
                ))}
              </div>
            )}

            <button className="btn-line pdp-btn" onClick={addToBag}>Add to Bag</button>
            <button className="btn-solid pdp-btn" onClick={addToBag}>Buy Now</button>

            <div className="pdp-tabs">
              {[['details', 'Details & Description'], ['washcare', 'Washcare'], ['shipping', 'Shipping']].map(([k, label]) => (
                <button key={k} className={`pdp-tab ${tab === k ? 'on' : ''}`} onClick={() => setTab(k)}>{label}</button>
              ))}
            </div>

            <div className="pdp-tabpanel">
              {tab === 'details' && (
                <>
                  <h3 className="pdp-subhead">Details</h3>
                  <ul className="pdp-list">{details.map((d, i) => <li key={i}>{d}</li>)}</ul>
                  <h3 className="pdp-subhead">Description</h3>
                  <p className="pdp-desc">{description}</p>
                </>
              )}
              {tab === 'washcare' && <ul className="pdp-list">{washcare.map((d, i) => <li key={i}>{d}</li>)}</ul>}
              {tab === 'shipping' && <p className="pdp-desc">{shipping}</p>}
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <section className="pdp-related">
            <h2 className="grid-title">You may also like</h2>
            <div className="pgrid">
              {related.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
