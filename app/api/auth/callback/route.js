import { NextResponse } from 'next/server';
import { supabaseServer } from '../../../../lib/supabase-server';

// Handles both the Google OAuth redirect and email confirmation links.
export async function GET(req) {
  const url = new URL(req.url);
  const code = url.searchParams.get('code');
  const next = url.searchParams.get('next') || '/account';

  if (code) {
    const supabase = supabaseServer();
    await supabase.auth.exchangeCodeForSession(code);
  }

  return NextResponse.redirect(new URL(next, url.origin));
}
