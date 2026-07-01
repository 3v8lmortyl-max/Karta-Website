import HomeContent from '../components/HomeContent';
import { getProducts } from '../lib/products';

export const revalidate = 30; // re-check the database every 30s so admin edits show up quickly

export default async function Home() {
  const products = await getProducts();
  return <HomeContent products={products} />;
}
