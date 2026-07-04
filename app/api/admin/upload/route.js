import { NextResponse } from 'next/server';
import { isAdminAuthed } from '../../../../lib/admin-auth';
import { supabaseAdmin } from '../../../../lib/supabase';

// Only real image types are accepted, and the stored extension is derived from the
// validated MIME type rather than the user-supplied filename — so a file can't be
// smuggled in under a misleading name. Size is capped to keep storage/bandwidth sane.
const ALLOWED = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
};
const MAX_BYTES = 8 * 1024 * 1024; // 8 MB

export async function POST(req) {
  if (!isAdminAuthed()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const form = await req.formData();
  const file = form.get('file');
  if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 });

  const type = (file.type || '').toLowerCase();
  const ext = ALLOWED[type];
  if (!ext) {
    return NextResponse.json({ error: 'Unsupported file type. Please upload a JPG, PNG, WebP, or GIF image.' }, { status: 400 });
  }
  if (typeof file.size === 'number' && file.size > MAX_BYTES) {
    return NextResponse.json({ error: 'File is too large. Maximum size is 8 MB.' }, { status: 400 });
  }

  const bytes = Buffer.from(await file.arrayBuffer());
  if (bytes.length > MAX_BYTES) {
    return NextResponse.json({ error: 'File is too large. Maximum size is 8 MB.' }, { status: 400 });
  }

  const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

  const sb = supabaseAdmin();
  const { error } = await sb.storage.from('product-images').upload(path, bytes, {
    contentType: type, upsert: false,
  });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const { data } = sb.storage.from('product-images').getPublicUrl(path);
  return NextResponse.json({ url: data.publicUrl });
}
