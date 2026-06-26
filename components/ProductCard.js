'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useWishlist, useCart, useUI } from '../lib/store';
import { HeartIcon } from './Icons';
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
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, delay: (index % 4) * 0.06, ease: [0.16, 1, 0.3, 1] }}
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
            <HeartIcon size={18} filled={wished} />
          </button>
          <button className="product-quickadd" onClick={quickAdd}>
            Quick Add
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
