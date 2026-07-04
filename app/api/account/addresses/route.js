import { NextResponse } from 'next/server';
import { supabaseServer } from '../../../../lib/supabase-server';
import { supabaseAdmin } from '../../../../lib/supabase';

// Auth check uses the session client; the actual DB read/write uses the admin client
// with an explicit user_id filter. This mirrors the (working) order-creation route.
// We rely on verifying the session first + always scoping to the authenticated user's
// id — RLS is a second layer, but this pattern doesn't depend on the session JWT being
// forwarded into the RLS check (which was silently failing before, so no address saved).

export async function GET() {
  const supabase = supabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const admin = supabaseAdmin();
  const { data, error } = await admin.from('addresses').select('*').eq('user_id', user.id).order('created_at', { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ addresses: data });
}

export async function POST(req) {
  const supabase = supabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const body = await req.json();
  // Never trust a client-sent user_id — always force it to the authenticated user.
  const { user_id: _ignore, id: _ignore2, ...safe } = body;
  const admin = supabaseAdmin();
  const { data, error } = await admin.from('addresses').insert({ ...safe, user_id: user.id }).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ address: data });
}
