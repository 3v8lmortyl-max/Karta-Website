import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { supabaseAdmin } from '../../../../lib/supabase';
import { decrementStockForItems } from '../../../../lib/stock';

// The ONLY fully-trusted confirmation of payment. Razorpay calls this server-to-server
// after a payment event — the browser is never involved, so this can't be spoofed by a
// customer closing the tab early or tampering with client-side requests.
function signaturesMatch(expectedHex, actualHex) {
  const expected = Buffer.from(expectedHex, 'hex');
  const actual = Buffer.from(actualHex || '', 'hex');
  if (expected.length !== actual.length) return false;
  return crypto.timingSafeEqual(expected, actual);
}

export async function POST(req) {
  const rawBody = await req.text(); // MUST read raw text — signature won't match parsed JSON
  const signature = req.headers.get('x-razorpay-signature');

  const expected = crypto
    .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET)
    .update(rawBody)
    .digest('hex');

  if (!signaturesMatch(expected, signature)) {
    console.error('Webhook signature mismatch — possible spoofed request.');
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  const event = JSON.parse(rawBody);
  const admin = supabaseAdmin();

  if (event.event === 'payment.captured') {
    const payment = event.payload.payment.entity;
    // Only decrement stock on the actual transition into 'paid' — checkout/verify may
    // have already marked this order paid a moment earlier, in which case this update
    // matches zero rows and we skip decrementing to avoid double-counting the sale.
    const { data: order } = await admin.from('orders').update({
      status: 'paid',
      razorpay_payment_id: payment.id,
    }).eq('razorpay_order_id', payment.order_id).neq('status', 'paid').select().maybeSingle();

    if (order) {
      await decrementStockForItems(admin, order.items);
    }
  }

  if (event.event === 'payment.failed') {
    const payment = event.payload.payment.entity;
    await admin.from('orders').update({
      status: 'failed',
    }).eq('razorpay_order_id', payment.order_id);
  }

  return NextResponse.json({ received: true });
}
