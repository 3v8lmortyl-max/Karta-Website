import { supabasePublic } from './supabase';

const FALLBACK_GRADIENTS = [
  'linear-gradient(150deg,#7a1f2b,#3a0e16)',
  'linear-gradient(150deg,#2a2118,#0e0b08)',
  'linear-gradient(150deg,#2c2c40,#6f5cff)',
  'linear-gradient(150deg,#caa15a,#5a3f1d)',
  'linear-gradient(150deg,#274060,#0d1b2a)',
];

export async function getSlides() {
  const sb = supabasePublic();
  const { data, error } = await sb.from('slides').select('*').order('sort_order', { ascending: true });
  if (error) { console.error('getSlides error:', error.message); return []; }
  return (data || []).map((row, i) => ({
    id: row.id,
    title: row.title,
    href: row.href || '/shop',
    bg: row.image ? `url('${row.image}')` : FALLBACK_GRADIENTS[i % FALLBACK_GRADIENTS.length],
  }));
}
