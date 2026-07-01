import { NextResponse } from 'next/server';
import { isAdminAuthed } from '../../../../lib/admin-auth';
import { supabaseAdmin } from '../../../../lib/supabase';

export async function POST(req) {
  if (!isAdminAuthed()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const form = await req.formData();
  const file = form.get('file');
  if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 });

  const bytes = Buffer.from(await file.arrayBuffer());
  const ext = (file.name.split('.').pop() || 'jpg').toLowerCase();
  const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

  const sb = supabaseAdmin();
  const { error } = await sb.storage.from('product-images').upload(path, bytes, {
    contentType: file.type || 'image/jpeg', upsert: false,
  });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const { data } = sb.storage.from('product-images').getPublicUrl(path);
  return NextResponse.json({ url: data.publicUrl });
}
