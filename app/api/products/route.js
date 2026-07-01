import { NextResponse } from 'next/server';
import { getProducts } from '../../../lib/products';

// Public read-only endpoint for client components (search) that need the catalog.
export async function GET() {
  const products = await getProducts();
  return NextResponse.json({ products });
}
