import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { supabaseAdmin } from '../../../../lib/supabase';

// The ONLY fully-trusted confirmation of payment. Razorpay calls this server-to-server
// after a payment event — the browser is never involved, so this can't be spoofed by a
// customer closing the tab early or tampering with client-side requests.
export async function POST(req) {
  const rawBody = await req.text(); // MUST read raw text — signature won't match parsed JSON
  const signature = req.headers.get('x-razorpay-signature');

  const expected = crypto
    .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET)
    .update(rawBody)
    .digest('hex');

  if (signature !== expected) {
    console.error('Webhook signature mismatch — possible spoofed request.');
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  const event = JSON.parse(rawBody);
  const admin = supabaseAdmin();

  if (event.event === 'payment.captured') {
    const payment = event.payload.payment.entity;
    await admin.from('orders').update({
      status: 'paid',
      razorpay_payment_id: payment.id,
    }).eq('razorpay_order_id', payment.order_id);
  }

  if (event.event === 'payment.failed') {
    const payment = event.payload.payment.entity;
    await admin.from('orders').update({
      status: 'failed',
    }).eq('razorpay_order_id', payment.order_id);
  }

  return NextResponse.json({ received: true });
}
