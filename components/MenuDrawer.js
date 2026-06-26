'use client';

import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { useUI } from '../lib/store';
import { CloseIcon } from './Icons';

const links = [
  { label: 'Home', href: '/' },
  { label: 'Shop', href: '/shop' },
  { label: 'Collections', href: '/collections' },
  { label: 'About', href: '/about' },
  { label: 'Journal', href: '/journal' },
  { label: 'Contact', href: '/contact' },
];

const secondary = [
  { label: 'Wishlist', href: '/wishlist' },
  { label: 'Order Tracking', href: '/track' },
  { label: 'Login', href: '/account' },
];

export default function MenuDrawer() {
  const { menuOpen, closeMenu } = useUI();

  return (
    <AnimatePresence>
      {menuOpen && (
        <>
          <motion.div
            className="overlay-scrim"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            onClick={closeMenu}
          />
          <motion.aside
            className="drawer drawer-left"
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'tween', ease: [0.16, 1, 0.3, 1], duration: 0.55 }}
          >
            <div className="drawer-head">
              <span className="drawer-eyebrow">Menu</span>
              <button className="icon-btn" onClick={closeMenu} aria-label="Close menu">
                <CloseIcon />
              </button>
            </div>

            <nav className="menu-nav">
              {links.map((l, i) => (
                <motion.div
                  key={l.href}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.12 + i * 0.05, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Link href={l.href} className="menu-link" onClick={closeMenu}>
                    {l.label}
                  </Link>
                </motion.div>
              ))}
            </nav>

            <div className="menu-secondary">
              {secondary.map((l, i) => (
                <motion.div
                  key={l.href}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 + i * 0.05, duration: 0.5 }}
                >
                  <Link href={l.href} className="menu-link-sm" onClick={closeMenu}>
                    {l.label}
                  </Link>
                </motion.div>
              ))}
            </div>

            <div className="menu-foot">
              <p className="menu-tag">Wear Art. Wear Karta.</p>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
