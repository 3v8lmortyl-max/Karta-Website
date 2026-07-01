import { NextResponse } from 'next/server';
import { isAdminAuthed } from '../../../../lib/admin-auth';
import { supabaseAdmin } from '../../../../lib/supabase';

export async function GET() {
  if (!isAdminAuthed()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const sb = supabaseAdmin();
  const { data, error } = await sb.from('products').select('*').order('created_at', { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ products: data });
}

export async function POST(req) {
  if (!isAdminAuthed()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const body = await req.json();
  if (!body.id || !body.name || body.price == null) {
    return NextResponse.json({ error: 'id, name and price are required' }, { status: 400 });
  }
  const sb = supabaseAdmin();
  const { data, error } = await sb.from('products').insert({
    id: body.id, name: body.name, price: body.price, sale_price: body.sale_price ?? null,
    category: body.category || null, collection: body.collection || null, color: body.color || null,
    sizes: body.sizes || [], featured: !!body.featured, images: body.images || [],
    details: body.details || [], description: body.description || '', stock: body.stock || {},
  }).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ product: data });
}
