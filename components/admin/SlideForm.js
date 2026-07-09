'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SlideForm({ initial }) {
  const router = useRouter();
  const isEdit = !!initial;

  // A slide can link to a specific product page (picked from the catalog, so the
  // URL is always correct) or to any other custom link (a collection filter, /shop,
  // /collaborations, etc). Detect which mode an existing slide is in from its href.
  const initialHref = initial?.href || '/shop';
  const productMatch = initialHref.match(/^\/products\/(.+)$/);

  const [title, setTitle] = useState(initial?.title || '');
  const [linkMode, setLinkMode] = useState(productMatch ? 'product' : 'custom');
  const [productId, setProductId] = useState(productMatch ? productMatch[1] : '');
  const [customHref, setCustomHref] = useState(productMatch ? '/shop' : initialHref);
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [image, setImage] = useState(initial?.image || null);
  const [video, setVideo] = useState(initial?.video || null);
  const [mediaType, setMediaType] = useState(initial?.video ? 'video' : 'photo');
  const [sortOrder, setSortOrder] = useState(initial?.sort_order ?? 1);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/products')
      .then((r) => r.json())
      .then((d) => setProducts(d.products || []))
      .catch(() => setProducts([]))
      .finally(() => setProductsLoading(false));
  }, []);

  // The actual href that gets saved — derived from whichever mode is active.
  const href = linkMode === 'product' ? (productId ? `/products/${productId}` : '') : (customHref || '/shop');

  const onFileChange = async (e) => {
    const file = e.target.files && e.target.files[0];
    e.target.value = '';
    if (!file) return;
    setUploading(true); setError('');
    const form = new FormData(); form.append('file', file);
    const res = await fetch('/api/admin/upload', { method: 'POST', body: form });
    setUploading(false);
    if (!res.ok) {
      const d = await res.json().catch(() => ({}));
      setError(d.error || `${mediaType === 'video' ? 'Video' : 'Image'} upload failed.`);
      return;
    }
    const data = await res.json();
    if (mediaType === 'video') { setVideo(data.url); setImage(null); }
    else { setImage(data.url); setVideo(null); }
  };

  const save = async (e) => {
    e.preventDefault();
    if (!title.trim()) { setError('Title is required.'); return; }
    if (linkMode === 'product' && !productId) { setError('Please choose a product for this slide to link to.'); return; }
    setSaving(true); setError('');
    const payload = { title, href, image, video, sort_order: Number(sortOrder) || 1 };
    const res = isEdit
      ? await fetch(`/api/admin/slides/${initial.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      : await fetch('/api/admin/slides', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    setSaving(false);
    if (res.ok) router.push('/admin/slides');
    else { const d = await res.json().catch(() => ({})); setError(d.error || 'Failed to save.'); }
  };

  return (
    <form className="admin-form" onSubmit={save}>
      <label className="admin-field">
        <span>Slide title</span>
        <input className="admin-input" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Yacht Collection" required />
      </label>

      <div className="admin-field">
        <span>Where should this slide go when tapped?</span>
        <div className="admin-link-mode-toggle">
          <button
            type="button"
            className={`admin-link-mode-btn ${linkMode === 'product' ? 'active' : ''}`}
            onClick={() => setLinkMode('product')}
          >
            Link to a product
          </button>
          <button
            type="button"
            className={`admin-link-mode-btn ${linkMode === 'custom' ? 'active' : ''}`}
            onClick={() => setLinkMode('custom')}
          >
            Custom link
          </button>
        </div>
      </div>

      {linkMode === 'product' ? (
        <label className="admin-field">
          <span>Product</span>
          <select
            className="admin-input"
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
            disabled={productsLoading}
          >
            <option value="">{productsLoading ? 'Loading products…' : 'Select a product…'}</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
          <p className="admin-hint">Tapping the slide will take visitors straight to this product's page.</p>
        </label>
      ) : (
        <label className="admin-field">
          <span>Link (where it goes when tapped)</span>
          <input className="admin-input" value={customHref} onChange={(e) => setCustomHref(e.target.value)} placeholder="/shop?collection=..." />
        </label>
      )}

      <label className="admin-field">
        <span>Order (lower number shows first)</span>
        <input className="admin-input" type="number" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} />
      </label>

      <div className="admin-field">
        <span>Slide media</span>
        <div className="admin-link-mode-toggle">
          <button
            type="button"
            className={`admin-link-mode-btn ${mediaType === 'photo' ? 'active' : ''}`}
            onClick={() => setMediaType('photo')}
          >
            Photo
          </button>
          <button
            type="button"
            className={`admin-link-mode-btn ${mediaType === 'video' ? 'active' : ''}`}
            onClick={() => setMediaType('video')}
          >
            Video
          </button>
        </div>

        {error && <p className="admin-error" style={{ marginTop: '0.6rem' }}>{error}</p>}

        {mediaType === 'photo' ? (
          <div className="admin-image-grid" style={{ marginTop: '0.8rem' }}>
            <div className={`admin-image-slot ${image ? 'filled' : 'empty'}`}>
              {image ? (
                <div className="admin-image-preview" style={{ backgroundImage: `url(${image})` }} />
              ) : (
                <div className="admin-image-placeholder"><small>No image — a gradient will show instead</small></div>
              )}
              {image && (
                <button type="button" className="admin-image-remove" onClick={() => setImage(null)} aria-label="Remove slide image">×</button>
              )}
              <label className="admin-image-slot-action">
                {uploading ? 'Uploading…' : image ? 'Change' : '+ Add image'}
                <input type="file" accept="image/*" hidden onChange={onFileChange} />
              </label>
            </div>
            <p className="admin-hint">A tall (portrait) photo works best — this fills the sliding card on the homepage.</p>
          </div>
        ) : (
          <div className="admin-image-grid" style={{ marginTop: '0.8rem' }}>
            <div className={`admin-image-slot admin-video-slot ${video ? 'filled' : 'empty'}`}>
              {video ? (
                <video className="admin-image-preview" src={video} muted loop autoPlay playsInline />
              ) : (
                <div className="admin-image-placeholder"><small>No video yet</small></div>
              )}
              {video && (
                <button type="button" className="admin-image-remove" onClick={() => setVideo(null)} aria-label="Remove slide video">×</button>
              )}
              <label className="admin-image-slot-action">
                {uploading ? 'Uploading…' : video ? 'Change' : '+ Add video'}
                <input type="file" accept="video/mp4" hidden onChange={onFileChange} />
              </label>
            </div>
            <p className="admin-hint">
              Portrait video, 9:16 ratio (e.g. 1080×1920), MP4, under 4 MB, ideally 15 seconds or less —
              it loops silently and muted, so keep it short and compressed.
            </p>
          </div>
        )}
      </div>

      <div className="admin-form-actions">
        <button className="admin-btn admin-btn-dark" disabled={saving || uploading}>
          {saving ? 'Saving…' : isEdit ? 'Save changes' : 'Create slide'}
        </button>
      </div>
    </form>
  );
}
