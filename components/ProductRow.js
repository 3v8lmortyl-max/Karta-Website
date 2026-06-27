import Link from 'next/link';
import ProductCard from './ProductCard';

export default function ProductRow({ title, discoverHref, viewAllHref, items }) {
  if (!items || items.length === 0) return null;
  return (
    <section className="section">
      <div className="container">
        <div className="sec-head">
          <h2 className="sec-title">{title}</h2>
          {discoverHref && <Link href={discoverHref} className="sec-link">Discover more</Link>}
        </div>
        <div className="prow-track">
          {items.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
        </div>
        {viewAllHref && (
          <div className="prow-foot">
            <Link href={viewAllHref} className="btn-line btn-wide">View all</Link>
          </div>
        )}
      </div>
    </section>
  );
}
