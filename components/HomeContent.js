'use client';

import { useEffect } from 'react';
import Hero from './Hero';
import ProductGrid from './ProductGrid';
import CapsCard from './CapsCard';
import CollectionTiles from './CollectionTiles';
import BrandStory from './BrandStory';
import CustomBanner from './CustomBanner';

function useRevealAll() {
  useEffect(() => {
    const els = document.querySelectorAll('.fade-up');
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('revealed'); obs.unobserve(e.target); } }),
      { rootMargin: '-30px', threshold: 0.08 }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);
}

export default function HomeContent({ products, slides }) {
  useRevealAll();

  const newArrivals = products.filter((p) => p.collection === 'New Arrivals');
  const bestSellers = products.filter((p) => p.collection === 'Best Sellers');
  const limited = products.filter((p) => p.collection === 'Limited Edition');
  const caps = products.filter((p) => p.category === 'Cap');

  return (
    <>
      <Hero />

      <ProductGrid title="Latest drop" discoverHref="/shop?collection=new-arrivals" dark={false}
        items={[...newArrivals, ...bestSellers].slice(0, 4)} />

      <CapsCard title="Krta Caps" discoverHref="/shop?q=Cap" items={caps} />

      <CollectionTiles slides={slides} />

      <ProductGrid title="Winter collection" discoverHref="/shop?collection=limited-edition" dark={false}
        items={[...bestSellers, ...limited, ...newArrivals].slice(0, 6)} />

      <CustomBanner />
      <BrandStory />
    </>
  );
}
