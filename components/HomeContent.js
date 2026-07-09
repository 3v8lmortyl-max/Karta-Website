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

  // Keep "Latest drop" and "Limited Edition" from ever repeating the same product —
  // previously both pools drew from bestSellers/newArrivals too, so the same items
  // could appear in both sections on the same scroll.
  const dedupe = (list) => {
    const seen = new Set();
    return list.filter((p) => (seen.has(p.id) ? false : (seen.add(p.id), true)));
  };
  const latestDrop = dedupe([...newArrivals, ...bestSellers]).slice(0, 4);
  const usedIds = new Set(latestDrop.map((p) => p.id));
  const limitedEdition = limited.filter((p) => !usedIds.has(p.id)).slice(0, 6);

  return (
    <>
      <Hero />

      <ProductGrid title="Latest drop" discoverHref="/shop?collection=new-arrivals" dark={false}
        items={latestDrop} />

      <CapsCard title="Krta Caps" discoverHref="/shop?q=Cap" items={caps} />

      <CollectionTiles slides={slides} />

      <ProductGrid title="Limited Edition" discoverHref="/shop?collection=limited-edition" dark={false}
        items={limitedEdition} />

      <CustomBanner />
      <BrandStory />
    </>
  );
}
