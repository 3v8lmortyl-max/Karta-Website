import { NextResponse } from 'next/server';
import { isAdminAuthed } from '../../../../../lib/admin-auth';
import { supabaseAdmin } from '../../../../../lib/supabase';

export async function PATCH(req, { params }) {
  if (!isAdminAuthed()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const body = await req.json();
  const sb = supabaseAdmin();
  const patch = {};
  for (const k of ['title', 'href', 'image', 'sort_order']) if (k in body) patch[k] = body[k];
  const { data, error } = await sb.from('slides').update(patch).eq('id', params.id).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ slide: data });
}

export async function DELETE(req, { params }) {
  if (!isAdminAuthed()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const sb = supabaseAdmin();
  const { error } = await sb.from('slides').delete().eq('id', params.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
