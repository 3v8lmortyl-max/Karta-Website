import { NextResponse } from 'next/server';
import { isAdminAuthed } from '../../../../lib/admin-auth';
import { supabaseAdmin } from '../../../../lib/supabase';

export async function GET() {
  if (!isAdminAuthed()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const sb = supabaseAdmin();
  const { data, error } = await sb.from('slides').select('*').order('sort_order', { ascending: true });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ slides: data });
}

export async function POST(req) {
  if (!isAdminAuthed()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const body = await req.json();
  if (!body.title) return NextResponse.json({ error: 'Title is required' }, { status: 400 });
  const sb = supabaseAdmin();
  const { data: existing } = await sb.from('slides').select('sort_order').order('sort_order', { ascending: false }).limit(1);
  const nextOrder = existing && existing.length ? existing[0].sort_order + 1 : 1;
  const { data, error } = await sb.from('slides').insert({
    title: body.title, href: body.href || '/shop', image: body.image || null, sort_order: body.sort_order ?? nextOrder,
  }).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ slide: data });
}
