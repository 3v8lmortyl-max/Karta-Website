import { getProducts } from '../../lib/products';
import ShopContent from '../../components/ShopContent';

export const revalidate = 30;
export const metadata = { title: 'Shop — Krta' };

export default async function ShopPage() {
  const products = await getProducts();
  return <ShopContent products={products} />;
}
