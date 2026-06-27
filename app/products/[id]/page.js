import { notFound } from 'next/navigation';
import { products } from '../../../lib/products';
import ProductDetail from '../../../components/ProductDetail';

export function generateStaticParams() {
  return products.map((p) => ({ id: String(p.id) }));
}

export function generateMetadata({ params }) {
  const product = products.find((p) => String(p.id) === params.id);
  if (!product) return { title: 'Product — Krta' };
  return { title: `${product.name} — Krta`, description: `Shop the ${product.name} at Krta. Hand-finished wearable art.` };
}

export default function ProductPage({ params }) {
  const product = products.find((p) => String(p.id) === params.id);
  if (!product) notFound();
  const related = products.filter((p) => p.id !== product.id).slice(0, 4);
  return <ProductDetail product={product} related={related} />;
}
