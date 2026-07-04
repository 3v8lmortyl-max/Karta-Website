import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { supabaseAdmin } from '../../../../lib/supabase';
import { decrementStockForItems } from '../../../../lib/stock';

// Called by the browser immediately after the Razorpay popup reports success.
// This gives the customer instant feedback, but is NOT the final source of truth —
// the webhook (server-to-server, can't be spoofed by the browser) is what actually
// confirms payment. This route double-checks the signature before updating anything.
function signaturesMatch(expectedHex, actualHex) {
  const expected = Buffer.from(expectedHex, 'hex');
  const actual = Buffer.from(actualHex || '', 'hex');
  if (expected.length !== actual.length) return false;
  return crypto.timingSafeEqual(expected, actual);
}

export async function POST(req) {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await req.json();
  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return NextResponse.json({ error: 'Missing payment details.' }, { status: 400 });
  }

  const expected = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest('hex');

  if (!signaturesMatch(expected, razorpay_signature)) {
    return NextResponse.json({ error: 'Payment verification failed.' }, { status: 400 });
  }

  const admin = supabaseAdmin();
  // Same paid-transition guard as the webhook: whichever of the two fires first does the
  // real work (status flip + stock decrement); the other becomes a harmless no-op.
  const { data: order, error } = await admin.from('orders')
    .update({ razorpay_payment_id, razorpay_signature, status: 'paid' })
    .eq('razorpay_order_id', razorpay_order_id)
    .neq('status', 'paid')
    .select().maybeSingle();

  if (error) return NextResponse.json({ error: 'Could not update order.' }, { status: 500 });

  if (order) {
    await decrementStockForItems(admin, order.items);
    return NextResponse.json({ ok: true, orderId: order.id });
  }

  // Already marked paid (webhook beat us to it) — fetch it so the success page still works.
  const { data: existing } = await admin.from('orders')
    .select('id').eq('razorpay_order_id', razorpay_order_id).single();
  return NextResponse.json({ ok: true, orderId: existing?.id });
}
