import { NextResponse } from 'next/server';
import { trackByAwb } from '../../../lib/shiprocket';

export async function GET(req) {
  const awb = new URL(req.url).searchParams.get('awb')?.trim();
  if (!awb) return NextResponse.json({ error: 'Please enter an AWB number.' }, { status: 400 });

  try {
    const result = await trackByAwb(awb);
    // TEMP-DEBUG: returning the raw Shiprocket payload alongside our parsed shape
    // so we can see their actual field names and fix parsing to match.
    return NextResponse.json({ tracking: result });
  } catch (err) {
    console.error('Shiprocket tracking error:', err);
    // TEMP-DEBUG: exposing the real error message to diagnose the current issue.
    // Remove this detail once Shiprocket tracking is confirmed working end-to-end.
    return NextResponse.json({
      error: 'Tracking lookup is temporarily unavailable. Please try again shortly.',
      debug: String(err?.message || err),
    }, { status: 502 });
  }
}
