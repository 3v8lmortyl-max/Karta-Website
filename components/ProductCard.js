'use client';

import { useRef, useEffect, useState } from 'react';
import Link from 'next/link';
import { useCart, useUI, useWishlist } from '../lib/store';
import { PlusIcon, BookmarkIcon } from './Icons';
import { formatINR } from '../lib/products';

function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.classList.add('revealed'); obs.disconnect(); } },
      { rootMargin: '-40px', threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

export default function ProductCard({ product, index = 0 }) {
  const ref = useReveal();
  const addToCart = useCart((s) => s.add);
  const openCart = useUI((s) => s.openCart);
  const toggleWish = useWishlist((s) => s.toggle);
  const inWish = useWishlist((s) => !!s.items.find((i) => i.id === product.id));

  const gallery = (product.images && product.images.length)
    ? product.images
    : [product.image, product.image2].filter(Boolean);

  const [idx, setIdx] = useState(0);
  const startX = useRef(null);
  const moved = useRef(false);

  const onTouchStart = (e) => { startX.current = e.touches[0].clientX; moved.current = false; };
  const onTouchMove = (e) => {
    if (startX.current != null && Math.abs(e.touches[0].clientX - startX.current) > 8) moved.current = true;
  };
  const onTouchEnd = (e) => {
    if (startX.current == null) return;
    const dx = e.changedTouches[0].clientX - startX.current;
    if (dx > 40) setIdx((i) => (i - 1 + gallery.length) % gallery.length);
    else if (dx < -40) setIdx((i) => (i + 1) % gallery.length);
    startX.current = null;
  };
  // Cancel navigation if the touch was a swipe, not a tap
  const onClickCapture = (e) => { if (moved.current) { e.preventDefault(); e.stopPropagation(); moved.current = false; } };

  const quickAdd = (e) => { e.preventDefault(); e.stopPropagation(); addToCart(product, product.sizes?.[0] || 'M', 1); openCart(); };
  const wish = (e) => { e.preventDefault(); e.stopPropagation(); toggleWish(product); };
  const dot = (e, i) => { e.preventDefault(); e.stopPropagation(); setIdx(i); };

  return (
    <div ref={ref} className="product-card card-reveal" style={{ transitionDelay: `${(index % 2) * 60}ms` }}>
      <Link href={`/products/${product.id}`} className="product-link" onClickCapture={onClickCapture}>
        <div className="product-media" onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}>
          <div className="product-track" style={{ transform: `translateX(-${idx * 100}%)` }}>
            {gallery.map((g, i) => (
              <div key={i} className="product-slide" style={{ backgroundImage: g }} />
            ))}
          </div>
          <button className="product-bookmark" onClick={wish} aria-label="Save to wishlist">
            <BookmarkIcon filled={inWish} size={20} />
          </button>
          {gallery.length > 1 && (
            <div className="product-dots">
              {gallery.map((_, i) => (
                <span key={i} className={i === idx ? 'on' : ''} onClick={(e) => dot(e, i)} />
              ))}
            </div>
          )}
        </div>
        <div className="product-info">
          <div className="product-text">
            <span className="product-name">{product.name}</span>
            <span className="product-price">
              {product.salePrice
                ? (<><span className="price-sale">{formatINR(product.salePrice)}</span><span className="price-was">{formatINR(product.price)}</span></>)
                : formatINR(product.price)}
            </span>
          </div>
          <button className="product-plus" onClick={quickAdd} aria-label="Quick add"><PlusIcon size={22} /></button>
        </div>
      </Link>
    </div>
  );
}
