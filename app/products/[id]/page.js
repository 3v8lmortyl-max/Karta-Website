import { notFound } from 'next/navigation';
import { getProduct, getProducts } from '../../../lib/products';
import ProductDetail from '../../../components/ProductDetail';

export const revalidate = 30;

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
