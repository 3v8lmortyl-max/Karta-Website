'use client';

import { useRef, useEffect } from 'react';
import Link from 'next/link';
import { useWishlist, useCart, useUI } from '../lib/store';
import { HeartIcon, PlusIcon } from './Icons';
import { formatINR } from '../lib/products';

// Lightweight reveal — pure CSS + IntersectionObserver (no Framer Motion)
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
  const { has, toggle } = useWishlist();
  const addToCart = useCart((s) => s.add);
  const openCart = useUI((s) => s.openCart);
  const wished = has(product.id);

  const quickAdd = (e) => {
    e.preventDefault(); e.stopPropagation();
    addToCart(product, product.sizes?.[0] || 'M', 1);
    openCart();
  };

  const toggleWish = (e) => {
    e.preventDefault(); e.stopPropagation();
    toggle(product);
  };

  return (
    <div
      ref={ref}
      className="product-card card-reveal"
      style={{ transitionDelay: `${(index % 2) * 60}ms` }}
    >
      <Link href={`/products/${product.id}`} className="product-link">
        <div className="product-media">
          <div className="product-image" style={{ background: product.image }} />
          {product.salePrice && <span className="product-tag">Sale</span>}
          <button className={`product-wish ${wished ? 'is-on' : ''}`} onClick={toggleWish} aria-label="Toggle wishlist">
            <HeartIcon size={17} filled={wished} />
          </button>
          <button className="product-plus" onClick={quickAdd} aria-label="Quick add">
            <PlusIcon size={20} />
          </button>
        </div>
        <div className="product-info">
          <span className="product-name">{product.name}</span>
          <span className="product-price">
            {product.salePrice ? (
              <><span className="price-sale">{formatINR(product.salePrice)}</span><span className="price-was">{formatINR(product.price)}</span></>
            ) : formatINR(product.price)}
          </span>
        </div>
      </Link>
    </div>
  );
}
