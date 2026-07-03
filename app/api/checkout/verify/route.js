import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { supabaseAdmin } from '../../../../lib/supabase';

// Called by the browser immediately after the Razorpay popup reports success.
// This gives the customer instant feedback, but is NOT the final source of truth —
// the webhook (server-to-server, can't be spoofed by the browser) is what actually
// confirms payment. This route double-checks the signature before updating anything.
export async function POST(req) {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await req.json();
  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return NextResponse.json({ error: 'Missing payment details.' }, { status: 400 });
  }

  const expected = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest('hex');

  if (expected !== razorpay_signature) {
    return NextResponse.json({ error: 'Payment verification failed.' }, { status: 400 });
  }

  const admin = supabaseAdmin();
  const { data: order, error } = await admin.from('orders')
    .update({ razorpay_payment_id, razorpay_signature, status: 'paid' })
    .eq('razorpay_order_id', razorpay_order_id)
    .select().single();

  if (error) return NextResponse.json({ error: 'Could not update order.' }, { status: 500 });
  return NextResponse.json({ ok: true, orderId: order.id });
}
