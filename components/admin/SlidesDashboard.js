'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function SlidesDashboard() {
  const [slides, setSlides] = useState(null);
  const [error, setError] = useState('');

  const load = async () => {
    const res = await fetch('/api/admin/slides');
    if (!res.ok) { setError('Failed to load slides.'); return; }
    const data = await res.json();
    setSlides(data.slides);
  };
  useEffect(() => { load(); }, []);

  const remove = async (id) => {
    if (!confirm('Delete this slide? This cannot be undone.')) return;
    const res = await fetch(`/api/admin/slides/${id}`, { method: 'DELETE' });
    if (res.ok) setSlides((s) => s.filter((x) => x.id !== id));
    else alert('Failed to delete.');
  };

  return (
    <div className="admin-shell">
      <header className="admin-header">
        <h1>Homepage Slides</h1>
        <div className="admin-header-actions">
          <Link href="/admin" className="admin-btn admin-btn-ghost">← Back to products</Link>
          <Link href="/admin/slides/new" className="admin-btn admin-btn-dark">+ New slide</Link>
        </div>
      </header>

      <p className="admin-hint" style={{ marginBottom: '1rem' }}>
        These are the sliding cards shown below "Krta Caps" on the homepage. Order top-to-bottom is left-to-right on the site.
      </p>

      {error && <p className="admin-error">{error}</p>}

      {!slides ? (
        <p className="admin-muted">Loading slides…</p>
      ) : slides.length === 0 ? (
        <p className="admin-muted">No slides yet. Click "New slide" to add one.</p>
      ) : (
        <div className="admin-table">
          <div className="admin-row admin-row-head">
            <span>Image</span><span>Title</span><span>Link</span><span>Order</span><span></span><span></span><span></span>
          </div>
          {slides.map((s) => (
            <div className="admin-row" key={s.id}>
              <span className="admin-thumb" style={{ backgroundImage: s.image ? `url(${s.image})` : 'none' }} />
              <span>{s.title}</span>
              <span>{s.href}</span>
              <span>{s.sort_order}</span>
              <span />
              <span />
              <span className="admin-row-actions">
                <Link href={`/admin/slides/${s.id}`} className="admin-link">Edit</Link>
                <button className="admin-link admin-link-danger" onClick={() => remove(s.id)}>Delete</button>
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
