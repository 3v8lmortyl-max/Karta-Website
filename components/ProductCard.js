'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useWishlist, useCart, useUI } from '../lib/store';
import { HeartIcon, PlusIcon } from './Icons';
import { formatINR } from '../lib/products';

export default function ProductCard({ product, index = 0 }) {
  const { has, toggle } = useWishlist();
  const addToCart = useCart((s) => s.add);
  const openCart = useUI((s) => s.openCart);
  const wished = has(product.id);

  const quickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, product.sizes?.[0] || 'M', 1);
    openCart();
  };

  const toggleWish = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggle(product);
  };

  return (
    <motion.div
      className="product-card"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.7, delay: (index % 2) * 0.08, ease: [0.16, 1, 0.3, 1] }}
    >
      <Link href={`/products/${product.id}`} className="product-link">
        <div className="product-media">
          <div className="product-image" style={{ background: product.image }} />
          {product.salePrice && <span className="product-tag">Sale</span>}
          <button
            className={`product-wish ${wished ? 'is-on' : ''}`}
            onClick={toggleWish}
            aria-label="Toggle wishlist"
          >
            <HeartIcon size={17} filled={wished} />
          </button>
          {/* Circular + quick-add, bottom-right (Zicabella style) */}
          <button className="product-plus" onClick={quickAdd} aria-label="Quick add">
            <PlusIcon size={20} />
          </button>
        </div>
        <div className="product-info">
          <span className="product-name">{product.name}</span>
          <span className="product-price">
            {product.salePrice ? (
              <>
                <span className="price-sale">{formatINR(product.salePrice)}</span>
                <span className="price-was">{formatINR(product.price)}</span>
              </>
            ) : (
              formatINR(product.price)
            )}
          </span>
        </div>
      </Link>
    </motion.div>
  );
}
