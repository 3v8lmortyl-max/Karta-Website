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

// ---- Brute-force protection (DB-backed, so it survives serverless cold starts) ----
// After MAX_ATTEMPTS consecutive failures the account locks for LOCK_MINUTES. A
// successful login clears the counter. State lives in admin_settings (id=1) rather
// than in memory, because Vercel spins functions up and down and in-memory counters
// wouldn't reliably persist between requests.
const MAX_ATTEMPTS = 5;
const LOCK_MINUTES = 15;

export async function getAdminLockState() {
  const sb = supabaseAdmin();
  const { data } = await sb.from('admin_settings').select('failed_attempts, locked_until').eq('id', 1).single();
  const lockedUntil = data?.locked_until ? new Date(data.locked_until) : null;
  if (lockedUntil && lockedUntil.getTime() > Date.now()) {
    return { locked: true, retryAfterSeconds: Math.ceil((lockedUntil.getTime() - Date.now()) / 1000) };
  }
  return { locked: false, retryAfterSeconds: 0 };
}

export async function recordAdminLoginFailure() {
  const sb = supabaseAdmin();
  const { data } = await sb.from('admin_settings').select('failed_attempts').eq('id', 1).single();
  const attempts = (data?.failed_attempts || 0) + 1;
  const patch = { id: 1, failed_attempts: attempts };
  if (attempts >= MAX_ATTEMPTS) {
    patch.locked_until = new Date(Date.now() + LOCK_MINUTES * 60 * 1000).toISOString();
    patch.failed_attempts = 0; // reset the counter once locked; the lock itself is the gate
  }
  await sb.from('admin_settings').upsert(patch);
}

export async function clearAdminLoginFailures() {
  const sb = supabaseAdmin();
  await sb.from('admin_settings').upsert({ id: 1, failed_attempts: 0, locked_until: null });
}
