'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const SIZE_OPTIONS = ['XS', 'S', 'M', 'L', 'XL', 'One Size'];
const IMAGE_SLOT_LABELS = ['Front', 'Back', 'Styled angle', 'Close-up detail'];
// These must match exactly what the storefront filters on (app/components/HomeContent.js).
const CATEGORY_OPTIONS = ['Tops', 'Bottoms', 'Outerwear', 'Cap', 'Accessories'];
const COLLECTION_OPTIONS = ['New Arrivals', 'Best Sellers', 'Limited Edition', 'Caps'];

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
  const setStockFor = (s, v) => {
    if (v === '') {
      // Let the field go genuinely blank while the admin is mid-edit, rather than
      // storing 0 and having it redisplay as "0" — that was the cause of new
      // digits appending after a stray 0 (e.g. typing "15" showing "015").
      setStock((cur) => { const next = { ...cur }; delete next[s]; return next; });
      return;
    }
    const n = parseInt(v, 10);
    setStock((cur) => ({ ...cur, [s]: Number.isNaN(n) ? 0 : n }));
  };

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
    setError('');
    if (salePrice !== '' && Number(salePrice) >= Number(price)) {
      setError('Sale price must be lower than the regular price — otherwise it will look like the price went up.');
      return;
    }
    setSaving(true);
    const normalizedStock = Object.fromEntries(sizes.map((s) => [s, stock[s] ?? 0]));
    const payload = {
      name, price: Number(price), sale_price: salePrice === '' ? null : Number(salePrice),
      category, collection, sizes, featured, images,
      details: details.split('\n').map((s) => s.trim()).filter(Boolean),
      description, stock: normalizedStock,
    };
    let res;
    try {
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
    } catch (networkErr) {
      setSaving(false);
      setError(`Failed to save. [network error: ${networkErr?.message || networkErr}]`);
      return;
    }
    setSaving(false);
    if (res.ok) { router.push('/admin'); return; }
    // TEMP-DEBUG: show the real status + raw body to diagnose the current save failure.
    const rawText = await res.text().catch(() => '');
    let parsed = null;
    try { parsed = JSON.parse(rawText); } catch {}
    const detail = parsed?.error
      ? parsed.error
      : `HTTP ${res.status}: ${rawText.slice(0, 300) || '(empty response)'}`;
    setError(`Failed to save. [${detail}]`);
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
          <small className="admin-hint">Must be lower than the regular price above.</small>
        </label>
      </div>

      <div className="admin-field-row">
        <label className="admin-field">
          <span>Category</span>
          <select className="admin-input" value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">Select category…</option>
            {CATEGORY_OPTIONS.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </label>
        <label className="admin-field">
          <span>Collection</span>
          <select className="admin-input" value={collection} onChange={(e) => setCollection(e.target.value)}>
            <option value="">Select collection…</option>
            {COLLECTION_OPTIONS.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
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
        {error && <p className="admin-error">{error}</p>}
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
