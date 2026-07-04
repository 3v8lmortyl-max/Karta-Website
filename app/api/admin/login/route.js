import { NextResponse } from 'next/server';
import {
  adminCookieName, makeAdminToken, verifyAdminPassword,
  getAdminLockState, recordAdminLoginFailure, clearAdminLoginFailures,
} from '../../../../lib/admin-auth';

export async function POST(req) {
  const { password } = await req.json();
  if (!password) return NextResponse.json({ error: 'Incorrect password' }, { status: 401 });

  // Reject immediately if the account is currently locked from too many failures.
  const lock = await getAdminLockState();
  if (lock.locked) {
    const mins = Math.ceil(lock.retryAfterSeconds / 60);
    return NextResponse.json(
      { error: `Too many attempts. Try again in about ${mins} minute${mins === 1 ? '' : 's'}.` },
      { status: 429 }
    );
  }

  const ok = await verifyAdminPassword(password);
  if (!ok) {
    await recordAdminLoginFailure();
    // Small fixed delay slows down automated guessing without hurting a real user much.
    await new Promise((r) => setTimeout(r, 600));
    return NextResponse.json({ error: 'Incorrect password' }, { status: 401 });
  }

  await clearAdminLoginFailures();
  const res = NextResponse.json({ ok: true });
  res.cookies.set(adminCookieName(), makeAdminToken(), {
    httpOnly: true, secure: true, sameSite: 'lax', path: '/', maxAge: 60 * 60 * 24 * 14, // 14 days
  });
  return res;
}
