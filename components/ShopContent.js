'use client';

import { useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import ProductCard from './ProductCard';

const FILTERS = ['View all', 'Tops', 'Bottoms', 'Outerwear', 'Cap', 'Accessories'];

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

  return (
    <div className="shop-page container">
      <h1 className="shop-title">{initialCollection ? initialCollection.replace(/-/g, ' ') : 'All Products'}</h1>

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
