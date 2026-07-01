import { NextResponse } from 'next/server';
import { adminCookieName, makeAdminToken, verifyAdminPassword } from '../../../../lib/admin-auth';

export async function POST(req) {
  const { password } = await req.json();
  if (!password) return NextResponse.json({ error: 'Incorrect password' }, { status: 401 });

  const ok = await verifyAdminPassword(password);
  if (!ok) return NextResponse.json({ error: 'Incorrect password' }, { status: 401 });

  const res = NextResponse.json({ ok: true });
  res.cookies.set(adminCookieName(), makeAdminToken(), {
    httpOnly: true, secure: true, sameSite: 'lax', path: '/', maxAge: 60 * 60 * 24 * 14, // 14 days
  });
  return res;
}
