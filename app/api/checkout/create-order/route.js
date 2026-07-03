import { NextResponse } from 'next/server';
import { supabaseServer } from '../../../../lib/supabase-server';
import { supabaseAdmin } from '../../../../lib/supabase';
import { razorpayServer } from '../../../../lib/razorpay';

// Creates a pending order in our DB + a matching Razorpay order.
// Server re-prices every line from the database — never trusts amounts sent by the client.
export async function POST(req) {
  const body = await req.json();
  const { items, shipping, } = body; // items: [{id, size, qty}], shipping: {full_name, phone, line1, line2, city, state, pincode}

  if (!Array.isArray(items) || items.length === 0) {
    return NextResponse.json({ error: 'Cart is empty.' }, { status: 400 });
  }
  if (!shipping?.full_name || !shipping?.phone || !shipping?.line1 || !shipping?.city || !shipping?.state || !shipping?.pincode) {
    return NextResponse.json({ error: 'Complete shipping address is required.' }, { status: 400 });
  }

  const supabase = supabaseServer();
  const { data: { user } } = await supabase.auth.getUser();

  const admin = supabaseAdmin();

  // Re-price server-side: fetch real products, ignore any price the client might have sent.
  const ids = [...new Set(items.map((i) => i.id))];
  const { data: products, error: prodErr } = await admin.from('products').select('id, name, price, sale_price, images, sizes, stock').in('id', ids);
  if (prodErr) return NextResponse.json({ error: 'Could not verify products.' }, { status: 500 });

  let amount = 0;
  const orderItems = [];
  for (const line of items) {
    const p = products.find((x) => x.id === line.id);
    if (!p) return NextResponse.json({ error: `Product not found: ${line.id}` }, { status: 400 });
    const qty = Math.max(1, Math.min(10, Number(line.qty) || 1));
    const unitPrice = p.sale_price && p.sale_price < p.price ? p.sale_price : p.price;
    amount += unitPrice * qty;
    orderItems.push({
      id: p.id, name: p.name, size: line.size, qty,
      price: unitPrice, image: (p.images || [])[0] || null,
    });
  }

  if (amount <= 0) return NextResponse.json({ error: 'Invalid order amount.' }, { status: 400 });

  // Create the Razorpay order first (amount is in paise).
  let rpOrder;
  try {
    const razorpay = razorpayServer();
    rpOrder = await razorpay.orders.create({
      amount: amount * 100,
      currency: 'INR',
      receipt: `krta_${Date.now()}`,
      notes: { user_id: user?.id || 'guest' },
    });
  } catch (e) {
    console.error('Razorpay order creation failed:', e);
    return NextResponse.json({ error: 'Could not start payment. Please try again.' }, { status: 502 });
  }

  // Store the pending order in our DB, linked to the Razorpay order id.
  const { data: order, error: insertErr } = await admin.from('orders').insert({
    razorpay_order_id: rpOrder.id,
    customer_name: shipping.full_name,
    customer_phone: shipping.phone,
    customer_email: user?.email || shipping.email || null,
    customer_address: [shipping.line1, shipping.line2, shipping.city, shipping.state, shipping.pincode].filter(Boolean).join(', '),
    shipping_snapshot: shipping,
    items: orderItems,
    amount,
    status: 'pending',
    user_id: user?.id || null,
  }).select().single();

  if (insertErr) {
    console.error('Order insert failed:', insertErr);
    return NextResponse.json({ error: 'Could not save your order. Please try again.' }, { status: 500 });
  }

  return NextResponse.json({
    orderId: order.id,
    razorpayOrderId: rpOrder.id,
    amount: rpOrder.amount,
    currency: rpOrder.currency,
    keyId: process.env.RAZORPAY_KEY_ID,
  });
}
