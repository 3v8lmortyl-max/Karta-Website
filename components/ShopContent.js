'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import ProductCard from './ProductCard';

const FILTERS = ['View all', 'Tops', 'Bottoms', 'Outerwear', 'Cap', 'Accessories'];

// The known, correctly-cased collection names — matched against the URL slug so the
// page title and filter chip always show proper title case ("Limited Edition"),
// not a raw slug with dashes swapped for spaces ("limited edition").
const KNOWN_COLLECTIONS = ['New Arrivals', 'Best Sellers', 'Limited Edition', 'Caps'];
const slugify = (s) => s.toLowerCase().replace(/\s+/g, '-');
function collectionLabel(slug) {
  const match = KNOWN_COLLECTIONS.find((c) => slugify(c) === slug.toLowerCase());
  if (match) return match;
  // Fallback for any collection not in the known list above — still title-case it
  // properly rather than showing raw-lowercase-with-dashes.
  return slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function ShopContent({ products }) {
  const params = useSearchParams();
  const initialCategory = params.get('q') || 'View all';
  const initialCollection = params.get('collection');
  const [active, setActive] = useState(
    FILTERS.includes(initialCategory) ? initialCategory : 'View all'
  );

  const filtered = useMemo(() => {
    let list = products;
    if (initialCollection) {
      list = list.filter((p) => (p.collection || '').toLowerCase().replace(/\s+/g, '-') === initialCollection.toLowerCase());
    }
    if (active !== 'View all') {
      list = list.filter((p) => p.category === active);
    }
    return list;
  }, [products, active, initialCollection]);

  const collectionName = initialCollection ? collectionLabel(initialCollection) : null;

  return (
    <div className="shop-page container">
      <h1 className="shop-title">{collectionName || 'All Products'}</h1>

      {collectionName && (
        <div className="shop-active-filter">
          <span>Showing: {collectionName}</span>
          <Link href="/shop" className="shop-active-filter-clear">Clear ×</Link>
        </div>
      )}

      <div className="shop-filters">
        {FILTERS.map((f) => (
          <button
            key={f}
            className={`shop-filter-pill ${active === f ? 'on' : ''}`}
            onClick={() => setActive(f)}
          >
            {f}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="admin-muted" style={{ padding: '2rem 0' }}>No products in this category yet.</p>
      ) : (
        <div className="pgrid">
          {filtered.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
        </div>
      )}
    </div>
  );
}
