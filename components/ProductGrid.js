import Link from 'next/link';
import ProductCard from './ProductCard';

export default function ProductGrid({ title, discoverHref, dark = false, items }) {
  if (!items || items.length === 0) return null;
  return (
    <section className="section">
      <div className="container">
        <div className="grid-head">
          <h2 className="grid-title">{title}</h2>
          {discoverHref && (
            <Link href={discoverHref} className={`pill-link ${dark ? 'pill-dark' : 'pill-light'}`}>Discover more</Link>
          )}
        </div>
        <div className="pgrid">
          {items.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
        </div>
      </div>
    </section>
  );
}
