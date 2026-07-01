import { supabasePublic } from './supabase';

// Normalize a DB row -> the shape components expect (image/image2 as CSS background strings).
function toCard(row) {
  const imgs = (row.images || []).map((u) => `url('${u}')`);
  return {
    id: row.id,
    name: row.name,
    price: row.price,
    salePrice: row.sale_price ?? null,
    category: row.category,
    collection: row.collection,
    color: row.color,
    sizes: row.sizes || [],
    featured: row.featured,
    image: imgs[0] || 'linear-gradient(150deg,#e5e3df 0%,#c9c6c0 100%)',
    image2: imgs[1] || imgs[0] || 'linear-gradient(150deg,#c9c6c0 0%,#a19d95 100%)',
    images: imgs,
    details: row.details || [],
    description: row.description || '',
    stock: row.stock || {},
  };
}

// Fetch all products from the database (server-side, read-only anon key).
export async function getProducts() {
  const sb = supabasePublic();
  const { data, error } = await sb.from('products').select('*').order('created_at', { ascending: false });
  if (error) { console.error('getProducts error:', error.message); return []; }
  return (data || []).map(toCard);
}

export async function getProduct(id) {
  const sb = supabasePublic();
  const { data, error } = await sb.from('products').select('*').eq('id', id).single();
  if (error || !data) return null;
  return toCard(data);
}

export const collections = [
  { slug: 'wear-art', title: 'Wear Art', description: 'The signature line. Wearable artwork.' },
  { slug: 'limited-edition', title: 'Limited Edition', description: 'Numbered, one-time pieces.' },
  { slug: 'new-arrivals', title: 'New Arrivals', description: 'The latest from the studio.' },
  { slug: 'best-sellers', title: 'Best Sellers', description: 'Collector favourites.' },
];

export function formatINR(n) {
  return 'RS. ' + Number(n || 0).toLocaleString('en-IN');
}
