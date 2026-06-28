'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import Hero from '../components/Hero';
import ProductGrid from '../components/ProductGrid';
import CapsCard from '../components/CapsCard';
import CollectionTiles from '../components/CollectionTiles';
import BrandStory from '../components/BrandStory';
import { products } from '../lib/products';

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

export default function Home() {
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

      <CollectionTiles />

      <ProductGrid title="Winter collection" discoverHref="/collections/limited-edition" dark={false}
        items={[...bestSellers, ...limited, ...newArrivals].slice(0, 6)} />

      <BrandStory />

    </>
  );
}
