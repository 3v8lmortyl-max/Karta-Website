'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Dashboard() {
  const [products, setProducts] = useState(null);
  const [error, setError] = useState('');

  const load = async () => {
    const res = await fetch('/api/admin/products');
    if (!res.ok) { setError('Failed to load products.'); return; }
    const data = await res.json();
    setProducts(data.products);
  };
  useEffect(() => { load(); }, []);

  const logout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    window.location.reload();
  };

  const remove = async (id) => {
    if (!confirm('Delete this product? This cannot be undone.')) return;
    const res = await fetch(`/api/admin/products/${id}`, { method: 'DELETE' });
    if (res.ok) setProducts((p) => p.filter((x) => x.id !== id));
    else alert('Failed to delete.');
  };

  const totalStock = (stock) => Object.values(stock || {}).reduce((a, b) => a + (Number(b) || 0), 0);

  return (
    <div className="admin-shell">
      <header className="admin-header">
        <h1>Krta Admin</h1>
        <Link href="/admin/settings" className="admin-gear" aria-label="Settings">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
        </Link>
        <div className="admin-header-actions">
          <Link href="/admin/slides" className="admin-btn admin-btn-ghost">Homepage slides</Link>
          <Link href="/admin/products/new" className="admin-btn admin-btn-dark">+ New product</Link>
          <button className="admin-btn admin-btn-ghost" onClick={logout}>Log out</button>
        </div>
      </header>

      {error && <p className="admin-error">{error}</p>}

      {!products ? (
        <p className="admin-muted">Loading products…</p>
      ) : products.length === 0 ? (
        <p className="admin-muted">No products yet. Click "New product" to add one.</p>
      ) : (
        <div className="admin-table">
          <div className="admin-row admin-row-head">
            <span>Image</span><span>Name</span><span>Price</span><span>Sizes</span><span>Stock</span><span>Featured</span><span></span>
          </div>
          {products.map((p) => (
            <div className="admin-row" key={p.id}>
              <span className="admin-thumb" style={{ backgroundImage: p.images?.[0] ? `url(${p.images[0]})` : 'none' }} />
              <span>{p.name}</span>
              <span>₹{p.price?.toLocaleString('en-IN')}</span>
              <span>{(p.sizes || []).join(', ') || '—'}</span>
              <span>{totalStock(p.stock)}</span>
              <span>{p.featured ? 'Yes' : 'No'}</span>
              <span className="admin-row-actions">
                <Link href={`/admin/products/${p.id}`} className="admin-link">Edit</Link>
                <button className="admin-link admin-link-danger" onClick={() => remove(p.id)}>Delete</button>
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
