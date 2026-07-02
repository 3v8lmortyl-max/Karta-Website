'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { useUI } from '../lib/store';
import { formatINR } from '../lib/products';
import { CloseIcon, SearchIcon } from './Icons';

const ORDER_SUPPORT_WA = 'https://wa.me/919014612268?text=' +
  encodeURIComponent("Hi Krta! I need help with an order.");

export default function SearchOverlay() {
  const { searchOpen, closeSearch } = useUI();
  const [q, setQ] = useState('');
  const [products, setProducts] = useState([]);
  const inputRef = useRef(null);

  useEffect(() => {
    if (searchOpen && inputRef.current) {
      setTimeout(() => inputRef.current.focus(), 350);
    }
    if (!searchOpen) setQ('');
  }, [searchOpen]);

  // Load the catalog once the overlay opens (cheap: cached after first open)
  useEffect(() => {
    if (searchOpen && products.length === 0) {
      fetch('/api/products').then((r) => r.json()).then((d) => setProducts(d.products || [])).catch(() => {});
    }
  }, [searchOpen, products.length]);

  const results = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return [];
    return products.filter((p) => {
      const hay = [
        p.name,
        p.category,
        p.collection,
        p.color,
        ...(p.tags || []),
      ]
        .join(' ')
        .toLowerCase();
      return hay.includes(term);
    });
  }, [q]);

  return (
    <AnimatePresence>
      {searchOpen && (
        <motion.div
          className="search-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="search-top">
            <div className="search-field">
              <SearchIcon size={24} />
              <input
                ref={inputRef}
                type="search"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search pieces, collections, colours…"
                className="search-input"
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck="false"
                name="krta-search"
                data-lpignore="true"
                data-1p-ignore
              />
            </div>
            <button className="icon-btn" onClick={closeSearch} aria-label="Close search">
              <CloseIcon />
            </button>
          </div>

          <div className="search-body">
            {q.trim() === '' && (
              <>
                <div className="search-quicklinks">
                  <h3 className="search-section-title">Collections</h3>
                  <Link href="/shop?collection=new-arrivals" className="search-quicklink" onClick={closeSearch}>New Arrivals</Link>
                  <Link href="/shop?collection=best-sellers" className="search-quicklink" onClick={closeSearch}>Best Sellers</Link>
                  <Link href="/shop?collection=limited-edition" className="search-quicklink" onClick={closeSearch}>Limited Edition</Link>
                  <Link href="/shop?q=Cap" className="search-quicklink" onClick={closeSearch}>Caps</Link>
                </div>

                <div className="search-footlinks">
                  <div className="search-footlinks-col">
                    <Link href="/about" onClick={closeSearch}>Our Story</Link>
                    <Link href="/about" onClick={closeSearch}>Collaborations</Link>
                    <Link href="/journal" onClick={closeSearch}>Media &amp; Press</Link>
                  </div>
                  <div className="search-footlinks-col">
                    <Link href="/login" onClick={closeSearch}>Members Login</Link>
                    <Link href="/about" onClick={closeSearch}>Careers</Link>
                    <a href={ORDER_SUPPORT_WA} target="_blank" rel="noopener noreferrer" onClick={closeSearch}>Order Support</a>
                  </div>
                </div>
              </>
            )}
            {q.trim() !== '' && results.length === 0 && (
              <p className="search-hint">No pieces match “{q}”.</p>
            )}
            <div className="search-results">
              {results.map((p) => (
                <Link
                  key={p.id}
                  href={`/products/${p.id}`}
                  className="search-result"
                  onClick={closeSearch}
                >
                  <div className="search-result-img" style={{ backgroundImage: p.image }} />
                  <div className="search-result-meta">
                    <span className="search-result-name">{p.name}</span>
                    <span className="search-result-sub">
                      {p.collection} · {formatINR(p.salePrice || p.price)}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
