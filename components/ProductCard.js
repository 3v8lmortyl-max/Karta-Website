'use client';

import { useRef, useEffect } from 'react';
import Link from 'next/link';
import { useCart, useUI } from '../lib/store';
import { PlusIcon } from './Icons';
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

  const quickAdd = (e) => {
    e.preventDefault(); e.stopPropagation();
    addToCart(product, product.sizes?.[0] || 'M', 1);
    openCart();
  };

  return (
    <div ref={ref} className="product-card card-reveal" style={{ transitionDelay: `${(index % 4) * 50}ms` }}>
      <Link href={`/products/${product.id}`} className="product-link">
        <div className="product-media">
          <div className="product-image main" style={{ background: product.image }} />
          <div className="product-image alt" style={{ background: product.image2 || product.image }} />
          {product.salePrice && <span className="product-tag">Sale</span>}
          <button className="product-plus" onClick={quickAdd} aria-label="Quick add"><PlusIcon size={18} /></button>
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
