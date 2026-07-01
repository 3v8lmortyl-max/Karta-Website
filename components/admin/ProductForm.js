'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const SIZE_OPTIONS = ['XS', 'S', 'M', 'L', 'One Size'];
const IMAGE_SLOT_LABELS = ['Front', 'Back', 'Styled angle', 'Close-up detail'];

function slugify(name) {
  return name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export default function ProductForm({ initial }) {
  const router = useRouter();
  const isEdit = !!initial;
  const [name, setName] = useState(initial?.name || '');
  const [price, setPrice] = useState(initial?.price ?? '');
  const [salePrice, setSalePrice] = useState(initial?.sale_price ?? '');
  const [category, setCategory] = useState(initial?.category || '');
  const [collection, setCollection] = useState(initial?.collection || '');
  const [color, setColor] = useState(initial?.color || '');
  const [sizes, setSizes] = useState(initial?.sizes || []);
  const [featured, setFeatured] = useState(initial?.featured || false);
  const [images, setImages] = useState(initial?.images || []);
  const [details, setDetails] = useState((initial?.details || []).join('\n'));
  const [description, setDescription] = useState(initial?.description || '');
  const [stock, setStock] = useState(initial?.stock || {});
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const toggleSize = (s) => setSizes((cur) => cur.includes(s) ? cur.filter((x) => x !== s) : [...cur, s]);
  const setStockFor = (s, v) => setStock((cur) => ({ ...cur, [s]: Number(v) || 0 }));

  const uploadFile = async (file) => {
    setUploading(true); setError('');
    const form = new FormData(); form.append('file', file);
    const res = await fetch('/api/admin/upload', { method: 'POST', body: form });
    setUploading(false);
    if (!res.ok) { setError('Image upload failed.'); return; }
    const data = await res.json();
    setImages((cur) => [...cur, data.url]);
  };

  const onFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    files.forEach(uploadFile);
    e.target.value = '';
  };

  const removeImage = (url) => setImages((cur) => cur.filter((u) => u !== url));

  // Common-sense gate: don't let the admin start uploading photos for a product
  // that doesn't even have a name, price, or a size yet.
  const readyForImages = name.trim().length > 0 && String(price).trim().length > 0 && sizes.length > 0;
  const emptySlots = readyForImages
    ? IMAGE_SLOT_LABELS.slice(images.length + 1).filter(() => images.length < IMAGE_SLOT_LABELS.length)
    : [];

  const save = async (e) => {
    e.preventDefault();
    setSaving(true); setError('');
    const payload = {
      name, price: Number(price), sale_price: salePrice === '' ? null : Number(salePrice),
      category, collection, color, sizes, featured, images,
      details: details.split('\n').map((s) => s.trim()).filter(Boolean),
      description, stock,
    };
    let res;
    if (isEdit) {
      res = await fetch(`/api/admin/products/${initial.id}`, {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload),
      });
    } else {
      const id = slugify(name);
      res = await fetch('/api/admin/products', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, ...payload }),
      });
    }
    setSaving(false);
    if (res.ok) router.push('/admin');
    else { const d = await res.json().catch(() => ({})); setError(d.error || 'Failed to save.'); }
  };

  return (
    <form className="admin-form" onSubmit={save}>
      <label className="admin-field">
        <span>Product name</span>
        <input className="admin-input" value={name} onChange={(e) => setName(e.target.value)} required />
      </label>

      <div className="admin-field-row">
        <label className="admin-field">
          <span>Price (₹)</span>
          <input className="admin-input" type="number" value={price} onChange={(e) => setPrice(e.target.value)} required />
        </label>
        <label className="admin-field">
          <span>Sale price (₹, optional)</span>
          <input className="admin-input" type="number" value={salePrice} onChange={(e) => setSalePrice(e.target.value)} />
        </label>
      </div>

      <div className="admin-field-row">
        <label className="admin-field">
          <span>Category</span>
          <input className="admin-input" value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Tops, Cap, Bottoms…" />
        </label>
        <label className="admin-field">
          <span>Collection</span>
          <input className="admin-input" value={collection} onChange={(e) => setCollection(e.target.value)} placeholder="New Arrivals, Caps…" />
        </label>
        <label className="admin-field">
          <span>Color</span>
          <input className="admin-input" value={color} onChange={(e) => setColor(e.target.value)} />
        </label>
      </div>

      <div className="admin-field">
        <span>Sizes & stock</span>
        <div className="admin-size-grid">
          {SIZE_OPTIONS.map((s) => (
            <div key={s} className={`admin-size-box ${sizes.includes(s) ? 'on' : ''}`}>
              <button type="button" className="admin-size-toggle" onClick={() => toggleSize(s)}>{s}</button>
              {sizes.includes(s) && (
                <input
                  className="admin-stock-input" type="number" min="0" placeholder="Stock"
                  value={stock[s] ?? ''} onChange={(e) => setStockFor(s, e.target.value)}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      <label className="admin-field admin-checkbox">
        <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} />
        <span>Featured (shows in homepage grids)</span>
      </label>

      <div className="admin-field">
        <span>Images</span>
        {!readyForImages ? (
          <p className="admin-hint">
            Fill in the product name, price, and at least one size before adding images.
          </p>
        ) : (
          <>
            <div className="admin-image-grid">
              {images.map((url, i) => (
                <div className="admin-image-tile" key={url}>
                  <div className="admin-image-preview" style={{ backgroundImage: `url(${url})` }} />
                  <span className="admin-image-label">{IMAGE_SLOT_LABELS[i] || `Image ${i + 1}`}</span>
                  <button type="button" className="admin-image-remove" onClick={() => removeImage(url)}>×</button>
                </div>
              ))}
              {images.length < IMAGE_SLOT_LABELS.length && (
                <label className="admin-image-upload">
                  {uploading ? 'Uploading…' : `+ Add ${IMAGE_SLOT_LABELS[images.length]} photo`}
                  <input type="file" accept="image/*" multiple hidden onChange={onFileChange} />
                </label>
              )}
              {emptySlots.map((label, i) => (
                <div className="admin-image-slot-empty" key={label + i}>
                  <span>{label}</span>
                  <small>Not added yet</small>
                </div>
              ))}
            </div>
            <p className="admin-hint">
              Add up to {IMAGE_SLOT_LABELS.length} photos — front, back, a styled angle, and a close-up of the print or detail work. These become the swipeable gallery on the product page.
            </p>
          </>
        )}
      </div>

      <label className="admin-field">
        <span>Details (one bullet per line)</span>
        <textarea className="admin-textarea" rows={5} value={details} onChange={(e) => setDetails(e.target.value)} />
      </label>

      <label className="admin-field">
        <span>Description</span>
        <textarea className="admin-textarea" rows={5} value={description} onChange={(e) => setDescription(e.target.value)} />
      </label>

      {error && <p className="admin-error">{error}</p>}

      <div className="admin-form-actions">
        <button className="admin-btn admin-btn-dark" disabled={saving || uploading}>
          {saving ? 'Saving…' : isEdit ? 'Save changes' : 'Create product'}
        </button>
      </div>
    </form>
  );
}
