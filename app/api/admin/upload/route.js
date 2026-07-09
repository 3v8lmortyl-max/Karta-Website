import { NextResponse } from 'next/server';
import { isAdminAuthed } from '../../../../lib/admin-auth';
import { supabaseAdmin } from '../../../../lib/supabase';

// Only real image/video types are accepted, and the stored extension is derived from
// the validated MIME type rather than the user-supplied filename — so a file can't be
// smuggled in under a misleading name.
const ALLOWED = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
  'video/mp4': 'mp4',
};
const MAX_BYTES_IMAGE = 8 * 1024 * 1024; // 8 MB
// Vercel's serverless functions hard-cap the request body at 4.5MB (FUNCTION_PAYLOAD_TOO_LARGE
// past that, regardless of anything we set here) — this file is proxied through this route
// on its way to storage, so video is capped well under that platform ceiling.
const MAX_BYTES_VIDEO = 4 * 1024 * 1024; // 4 MB — keep slide videos short and compressed

export async function POST(req) {
  if (!isAdminAuthed()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const form = await req.formData();
  const file = form.get('file');
  if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 });

  const type = (file.type || '').toLowerCase();
  const ext = ALLOWED[type];
  if (!ext) {
    return NextResponse.json({ error: 'Unsupported file type. Please upload a JPG, PNG, WebP, GIF, or MP4.' }, { status: 400 });
  }
  const isVideo = type.startsWith('video/');
  const maxBytes = isVideo ? MAX_BYTES_VIDEO : MAX_BYTES_IMAGE;
  const maxLabel = isVideo ? '4 MB' : '8 MB';
  if (typeof file.size === 'number' && file.size > maxBytes) {
    return NextResponse.json({ error: `File is too large. Maximum size is ${maxLabel}.` }, { status: 400 });
  }

  const bytes = Buffer.from(await file.arrayBuffer());
  if (bytes.length > maxBytes) {
    return NextResponse.json({ error: `File is too large. Maximum size is ${maxLabel}.` }, { status: 400 });
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
