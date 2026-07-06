import { NextResponse } from 'next/server';
import { trackByAwb } from '../../../lib/shiprocket';

export async function GET(req) {
  const awb = new URL(req.url).searchParams.get('awb')?.trim();
  if (!awb) return NextResponse.json({ error: 'Please enter an AWB number.' }, { status: 400 });

  try {
    const result = await trackByAwb(awb);
    if (!result) {
      return NextResponse.json({ error: "We couldn't find a shipment with that AWB number." }, { status: 404 });
    }
    return NextResponse.json({ tracking: result });
  } catch (err) {
    console.error('Shiprocket tracking error:', err);
    return NextResponse.json({ error: 'Tracking lookup is temporarily unavailable. Please try again shortly.' }, { status: 502 });
  }
}
