import { notFound } from 'next/navigation';
import { getProduct, getProducts } from '../../../lib/products';
import ProductDetail from '../../../components/ProductDetail';

export const revalidate = 30;

// Pre-render every product page at build/deploy time instead of on first visit — this
// is what actually removes the "loading gap" people were seeing the first time a page
// hadn't been visited yet (e.g. a brand-new product just added and immediately linked
// from a homepage slide). revalidate=30 above still keeps them fresh after that.
export async function generateStaticParams() {
  try {
    const products = await getProducts();
    return products.map((p) => ({ id: p.id }));
  } catch (err) {
    console.error('generateStaticParams: could not fetch products, falling back to on-demand rendering', err);
    return [];
  }
}

export async function generateMetadata({ params }) {
  const product = await getProduct(params.id);
  if (!product) return { title: 'Product — Krta' };
  return { title: `${product.name} — Krta`, description: `Shop the ${product.name} at Krta. Hand-finished wearable art.` };
}

export default async function ProductPage({ params }) {
  const product = await getProduct(params.id);
  if (!product) notFound();
  const all = await getProducts();
  const related = all.filter((p) => p.id !== product.id).slice(0, 4);
  return <ProductDetail product={product} related={related} />;
}
