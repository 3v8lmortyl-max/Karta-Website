import HomeContent from '../components/HomeContent';
import { getProducts } from '../lib/products';
import { getSlides } from '../lib/slides';

export const revalidate = 30; // re-check the database every 30s so admin edits show up quickly

export default async function Home() {
  const [products, slides] = await Promise.all([getProducts(), getSlides()]);
  return <HomeContent products={products} slides={slides} />;
}
