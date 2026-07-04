import { NextResponse } from 'next/server';
import { supabaseServer } from '../../../../../lib/supabase-server';
import { supabaseAdmin } from '../../../../../lib/supabase';

// Same pattern as the list route: authenticate via session, then read/write via admin
// client scoped to the authenticated user's id (so users can only touch their own rows).

const ALLOWED_FIELDS = ['label', 'full_name', 'phone', 'line1', 'line2', 'city', 'state', 'pincode', 'is_default'];
function pickAllowed(body) {
  const out = {};
  for (const key of ALLOWED_FIELDS) if (key in body) out[key] = body[key];
  return out;
}

export async function PATCH(req, { params }) {
  const supabase = supabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const body = await req.json();
  const safe = pickAllowed(body);
  const admin = supabaseAdmin();
  const { data, error } = await admin.from('addresses').update(safe).eq('id', params.id).eq('user_id', user.id).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ address: data });
}

export async function DELETE(req, { params }) {
  const supabase = supabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const admin = supabaseAdmin();
  const { error } = await admin.from('addresses').delete().eq('id', params.id).eq('user_id', user.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
