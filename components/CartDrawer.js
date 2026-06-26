'use client';

import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { useUI, useCart } from '../lib/store';
import { CloseIcon, PlusIcon, MinusIcon } from './Icons';
import { formatINR } from '../lib/products';

export default function CartDrawer() {
  const { cartOpen, closeCart } = useUI();
  const { items, remove, updateQty } = useCart();
  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);

  return (
    <AnimatePresence>
      {cartOpen && (
        <>
          <motion.div
            className="overlay-scrim"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            onClick={closeCart}
          />
          <motion.aside
            className="drawer drawer-right"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', ease: [0.16, 1, 0.3, 1], duration: 0.55 }}
          >
            <div className="drawer-head">
              <span className="drawer-eyebrow">Cart ({items.length})</span>
              <button className="icon-btn" onClick={closeCart} aria-label="Close cart">
                <CloseIcon />
              </button>
            </div>

            {items.length === 0 ? (
              <div className="drawer-empty">
                <p className="empty-title">Your cart is empty.</p>
                <button className="btn-line" onClick={closeCart}>
                  Continue Shopping
                </button>
              </div>
            ) : (
              <>
                <div className="cart-items">
                  {items.map((i) => (
                    <div className="cart-item" key={`${i.id}-${i.size}`}>
                      <div className="cart-item-img" style={{ background: i.image }} />
                      <div className="cart-item-meta">
                        <div className="cart-item-top">
                          <span className="cart-item-name">{i.name}</span>
                          <button
                            className="cart-remove"
                            onClick={() => remove(i.id, i.size)}
                            aria-label="Remove item"
                          >
                            <CloseIcon size={16} />
                          </button>
                        </div>
                        <span className="cart-item-size">Size {i.size}</span>
                        <div className="cart-item-bottom">
                          <div className="qty">
                            <button onClick={() => updateQty(i.id, i.size, i.qty - 1)} aria-label="Decrease">
                              <MinusIcon />
                            </button>
                            <span>{i.qty}</span>
                            <button onClick={() => updateQty(i.id, i.size, i.qty + 1)} aria-label="Increase">
                              <PlusIcon />
                            </button>
                          </div>
                          <span className="cart-item-price">{formatINR(i.price * i.qty)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="cart-foot">
                  <div className="cart-subtotal">
                    <span>Subtotal</span>
                    <span>{formatINR(subtotal)}</span>
                  </div>
                  <p className="cart-note">Shipping & taxes calculated at checkout.</p>
                  <Link href="/checkout" className="btn-solid" onClick={closeCart}>
                    Checkout
                  </Link>
                  <button className="btn-line" onClick={closeCart}>
                    Continue Shopping
                  </button>
                </div>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
