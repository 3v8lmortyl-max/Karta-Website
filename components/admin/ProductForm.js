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
  const initialSlots = Array.from({ length: IMAGE_SLOT_LABELS.length }, (_, i) => (initial?.images || [])[i] || null);
  const [slots, setSlots] = useState(initialSlots);   // fixed 4 slots, null = empty
  const [slotUploading, setSlotUploading] = useState(Array(IMAGE_SLOT_LABELS.length).fill(false));
  const images = slots.filter(Boolean); // compact list actually saved to the DB
  const [details, setDetails] = useState((initial?.details || []).join('\n'));
  const [description, setDescription] = useState(initial?.description || '');
  const [stock, setStock] = useState(initial?.stock || {});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const toggleSize = (s) => setSizes((cur) => cur.includes(s) ? cur.filter((x) => x !== s) : [...cur, s]);
  const setStockFor = (s, v) => setStock((cur) => ({ ...cur, [s]: Number(v) || 0 }));

  const setSlotBusy = (i, val) => setSlotUploading((cur) => cur.map((v, idx) => (idx === i ? val : v)));

  // Each slot uploads exactly ONE image, replacing whatever was there before.
  const uploadToSlot = async (i, file) => {
    setSlotBusy(i, true); setError('');
    const form = new FormData(); form.append('file', file);
    const res = await fetch('/api/admin/upload', { method: 'POST', body: form });
    setSlotBusy(i, false);
    if (!res.ok) { setError('Image upload failed.'); return; }
    const data = await res.json();
    setSlots((cur) => cur.map((v, idx) => (idx === i ? data.url : v)));
  };

  const onSlotFileChange = (i, e) => {
    const file = e.target.files && e.target.files[0];
    e.target.value = '';
    if (file) uploadToSlot(i, file);
  };

  const removeSlot = (i) => setSlots((cur) => cur.map((v, idx) => (idx === i ? null : v)));
  const uploading = slotUploading.some(Boolean);

  // Common-sense gate: don't let the admin start uploading photos for a product
  // that doesn't even have a name, price, or a size yet.
  const readyForImages = name.trim().length > 0 && String(price).trim().length > 0 && sizes.length > 0;

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
              {IMAGE_SLOT_LABELS.map((label, i) => {
                const url = slots[i];
                const busy = slotUploading[i];
                return (
                  <div className={`admin-image-slot ${url ? 'filled' : 'empty'}`} key={label}>
                    {url ? (
                      <div className="admin-image-preview" style={{ backgroundImage: `url(${url})` }} />
                    ) : (
                      <div className="admin-image-placeholder"><small>Not added yet</small></div>
                    )}
                    <span className="admin-image-label">{label}</span>

                    {url && (
                      <button type="button" className="admin-image-remove" onClick={() => removeSlot(i)} aria-label={`Remove ${label} photo`}>×</button>
                    )}

                    <label className="admin-image-slot-action">
                      {busy ? 'Uploading…' : url ? 'Change' : '+ Add'}
                      <input type="file" accept="image/*" hidden onChange={(e) => onSlotFileChange(i, e)} />
                    </label>
                  </div>
                );
              })}
            </div>
            <p className="admin-hint">
              One photo per slot — front, back, a styled angle, and a close-up of the print or detail work. Tap "Change" to replace a photo already in a slot.
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
