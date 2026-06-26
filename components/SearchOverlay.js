'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { useUI } from '../lib/store';
import { products, formatINR } from '../lib/products';
import { CloseIcon, SearchIcon } from './Icons';

export default function SearchOverlay() {
  const { searchOpen, closeSearch } = useUI();
  const [q, setQ] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (searchOpen && inputRef.current) {
      setTimeout(() => inputRef.current.focus(), 350);
    }
    if (!searchOpen) setQ('');
  }, [searchOpen]);

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
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search pieces, collections, colours…"
                className="search-input"
              />
            </div>
            <button className="icon-btn" onClick={closeSearch} aria-label="Close search">
              <CloseIcon />
            </button>
          </div>

          <div className="search-body">
            {q.trim() === '' && (
              <p className="search-hint">Start typing to explore the collection.</p>
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
                  <div className="search-result-img" style={{ background: p.image }} />
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
