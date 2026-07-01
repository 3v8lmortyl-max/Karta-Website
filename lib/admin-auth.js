import { cookies } from 'next/headers';
import crypto from 'crypto';
import { supabaseAdmin } from './supabase';

const COOKIE = 'krta_admin_session';

// Session cookie is signed with a fixed server secret so it stays valid even
// after the admin changes their password (their password lives in the DB, not
// in what's used to sign sessions).
function sessionSecret() {
  return process.env.SUPABASE_SERVICE_ROLE_KEY || 'dev-secret';
}
function sign(value) {
  const h = crypto.createHmac('sha256', sessionSecret()).update(value).digest('hex');
  return `${value}.${h}`;
}
function verifySession(token) {
  if (!token) return false;
  const [value, sig] = token.split('.');
  if (!value || !sig) return false;
  return sign(value) === token;
}

export function isAdminAuthed() {
  const token = cookies().get(COOKIE)?.value;
  return verifySession(token);
}

export function adminCookieName() { return COOKIE; }

export function makeAdminToken() {
  return sign('ok-' + Date.now());
}

// ---- Password storage (DB-backed, with env-var fallback for first login) ----

function hashPassword(password, salt) {
  return crypto.scryptSync(password, salt, 64).toString('hex');
}

export async function verifyAdminPassword(password) {
  const sb = supabaseAdmin();
  const { data } = await sb.from('admin_settings').select('password_hash, password_salt').eq('id', 1).single();

  if (data && data.password_hash && data.password_salt) {
    const hash = hashPassword(password, data.password_salt);
    return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(data.password_hash, 'hex'));
  }

  // No custom password set yet — fall back to the ADMIN_PASSWORD env var (first-time login).
  return !!process.env.ADMIN_PASSWORD && password === process.env.ADMIN_PASSWORD;
}

export async function setAdminPassword(newPassword) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = hashPassword(newPassword, salt);
  const sb = supabaseAdmin();
  const { error } = await sb.from('admin_settings').upsert({
    id: 1, password_hash: hash, password_salt: salt, updated_at: new Date().toISOString(),
  });
  if (error) throw new Error(error.message);
}
