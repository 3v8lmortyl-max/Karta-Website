'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useUI, useWishlist, useCart } from '../lib/store';
import { CloseIcon } from './Icons';
import { formatINR } from '../lib/products';

export default function WishlistDrawer() {
  const { wishlistOpen, closeWishlist, openCart } = useUI();
  const { items, remove } = useWishlist();
  const addToCart = useCart((s) => s.add);

  const moveToCart = (p) => {
    addToCart(p, p.sizes?.[0] || 'M', 1);
    remove(p.id);
    closeWishlist();
    openCart();
  };

  return (
    <AnimatePresence>
      {wishlistOpen && (
        <>
          <motion.div
            className="overlay-scrim"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            onClick={closeWishlist}
          />
          <motion.aside
            className="drawer drawer-right"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', ease: [0.16, 1, 0.3, 1], duration: 0.55 }}
          >
            <div className="drawer-head">
              <span className="drawer-eyebrow">Wishlist ({items.length})</span>
              <button className="icon-btn" onClick={closeWishlist} aria-label="Close wishlist">
                <CloseIcon />
              </button>
            </div>

            {items.length === 0 ? (
              <div className="drawer-empty">
                <p className="empty-title">Your wishlist is empty.</p>
                <button className="btn-line" onClick={closeWishlist}>
                  Continue Shopping
                </button>
              </div>
            ) : (
              <div className="cart-items">
                {items.map((p) => (
                  <div className="cart-item" key={p.id}>
                    <div className="cart-item-img" style={{ background: p.image }} />
                    <div className="cart-item-meta">
                      <div className="cart-item-top">
                        <span className="cart-item-name">{p.name}</span>
                        <button
                          className="cart-remove"
                          onClick={() => remove(p.id)}
                          aria-label="Remove from wishlist"
                        >
                          <CloseIcon size={16} />
                        </button>
                      </div>
                      <span className="cart-item-price">{formatINR(p.salePrice || p.price)}</span>
                      <button className="btn-line btn-line-sm" onClick={() => moveToCart(p)}>
                        Move to Cart
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
