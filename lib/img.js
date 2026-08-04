// Components historically received images as CSS background strings ("url('https://…')")
// and cart items in localStorage still hold that shape. This extracts the raw URL so it
// can go through next/image (which caches + resizes via Vercel instead of hitting
// Supabase full-size on every view). Gradient placeholders return null — callers keep
// their old background-rendering fallback for those.
export function rawImageUrl(value) {
  if (!value || typeof value !== 'string') return null;
  const m = /^url\(\s*['"]?(.+?)['"]?\s*\)$/.exec(value.trim());
  if (m) return m[1];
  if (value.startsWith('http://') || value.startsWith('https://') || value.startsWith('/')) return value;
  return null; // gradients & anything else
}
