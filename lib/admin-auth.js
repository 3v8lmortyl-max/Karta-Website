import { cookies } from 'next/headers';
import crypto from 'crypto';

const COOKIE = 'krta_admin_session';

function sign(value) {
  const h = crypto.createHmac('sha256', process.env.ADMIN_PASSWORD || 'dev-secret').update(value).digest('hex');
  return `${value}.${h}`;
}
function verify(token) {
  if (!token) return false;
  const [value, sig] = token.split('.');
  if (!value || !sig) return false;
  return sign(value) === token;
}

export function isAdminAuthed() {
  const token = cookies().get(COOKIE)?.value;
  return verify(token);
}

export function adminCookieName() { return COOKIE; }

export function makeAdminToken() {
  return sign('ok-' + Date.now());
}
