import { createClient } from '@supabase/supabase-js';

// Public client: safe for the storefront (anon key, RLS-restricted to reads).
export function supabasePublic() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

// Admin client: SERVER-ONLY. Uses the service_role key which bypasses RLS.
// Never import this in a Client Component or expose it to the browser.
export function supabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { persistSession: false } }
  );
}
