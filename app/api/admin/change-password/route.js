import { NextResponse } from 'next/server';
import { isAdminAuthed, verifyAdminPassword, setAdminPassword } from '../../../../lib/admin-auth';

export async function POST(req) {
  if (!isAdminAuthed()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { currentPassword, newPassword } = await req.json();
  if (!currentPassword || !newPassword) {
    return NextResponse.json({ error: 'Both current and new password are required.' }, { status: 400 });
  }
  if (newPassword.length < 6) {
    return NextResponse.json({ error: 'New password must be at least 6 characters.' }, { status: 400 });
  }

  const ok = await verifyAdminPassword(currentPassword);
  if (!ok) return NextResponse.json({ error: 'Current password is incorrect.' }, { status: 401 });

  try {
    await setAdminPassword(newPassword);
  } catch (e) {
    return NextResponse.json({ error: e.message || 'Failed to update password.' }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
