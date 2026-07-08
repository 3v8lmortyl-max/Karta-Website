import { NextResponse } from 'next/server';
import { getProducts } from '../../../lib/products';

export const revalidate = 30; // re-check the database every 30s so new products show up quickly

// Public read-only endpoint for client components (search, admin slide picker) that
// need the catalog.
export async function GET() {
  const products = await getProducts();
  return NextResponse.json({ products });
}
