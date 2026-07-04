// Decrements per-size stock for each line item in a paid order.
// NOTE: this is a read-modify-write, not a single atomic SQL statement — under very
// high concurrent checkout volume for the same size, two requests could both read the
// same stock value before either writes. Acceptable at current traffic; if that ever
// becomes a real risk, replace with a Postgres function that does the update in one
// statement (e.g. stock = jsonb_set(stock, '{size}', to_jsonb(greatest(0, (stock->>size)::int - qty)))).
export async function decrementStockForItems(admin, items) {
  for (const line of items || []) {
    if (!line?.id || !line?.size) continue;
    const { data: product, error: fetchErr } = await admin
      .from('products')
      .select('id, stock')
      .eq('id', line.id)
      .single();
    if (fetchErr || !product) {
      console.error('Stock decrement: could not fetch product', line.id, fetchErr);
      continue;
    }
    const currentStock = product.stock || {};
    const current = Number(currentStock[line.size] ?? 0);
    const qty = Number(line.qty) || 1;
    const updatedStock = { ...currentStock, [line.size]: Math.max(0, current - qty) };
    const { error: updateErr } = await admin
      .from('products')
      .update({ stock: updatedStock })
      .eq('id', line.id);
    if (updateErr) {
      console.error('Stock decrement: failed to update product', line.id, updateErr);
    }
  }
}
