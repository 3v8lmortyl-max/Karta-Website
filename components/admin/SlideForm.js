'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SlideForm({ initial }) {
  const router = useRouter();
  const isEdit = !!initial;
  const [title, setTitle] = useState(initial?.title || '');
  const [href, setHref] = useState(initial?.href || '/shop');
  const [image, setImage] = useState(initial?.image || null);
  const [sortOrder, setSortOrder] = useState(initial?.sort_order ?? 1);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const onFileChange = async (e) => {
    const file = e.target.files && e.target.files[0];
    e.target.value = '';
    if (!file) return;
    setUploading(true); setError('');
    const form = new FormData(); form.append('file', file);
    const res = await fetch('/api/admin/upload', { method: 'POST', body: form });
    setUploading(false);
    if (!res.ok) { setError('Image upload failed.'); return; }
    const data = await res.json();
    setImage(data.url);
  };

  const save = async (e) => {
    e.preventDefault();
    if (!title.trim()) { setError('Title is required.'); return; }
    setSaving(true); setError('');
    const payload = { title, href: href || '/shop', image, sort_order: Number(sortOrder) || 1 };
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

      <label className="admin-field">
        <span>Link (where it goes when tapped)</span>
        <input className="admin-input" value={href} onChange={(e) => setHref(e.target.value)} placeholder="/shop?collection=..." />
      </label>

      <label className="admin-field">
        <span>Order (lower number shows first)</span>
        <input className="admin-input" type="number" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} />
      </label>

      <div className="admin-field">
        <span>Image</span>
        {error && <p className="admin-error">{error}</p>}
        <div className="admin-image-grid">
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
        </div>
        <p className="admin-hint">A tall (portrait) photo works best — this fills the sliding card on the homepage.</p>
      </div>

      <div className="admin-form-actions">
        <button className="admin-btn admin-btn-dark" disabled={saving || uploading}>
          {saving ? 'Saving…' : isEdit ? 'Save changes' : 'Create slide'}
        </button>
      </div>
    </form>
  );
}
