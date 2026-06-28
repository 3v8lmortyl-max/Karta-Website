import Link from 'next/link';

export default function CapsCard({ title, discoverHref, items }) {
  if (!items || items.length === 0) return null;
  return (
    <section className="section">
      <div className="container">
        <div className="caps-card">
          <div className="caps-head">
            <h2 className="grid-title">{title}</h2>
            {discoverHref && <Link href={discoverHref} className="pill-link pill-dark">Discover more</Link>}
          </div>
          <div className="caps-track">
            {items.map((p) => (
              <Link key={p.id} href={`/products/${p.id}`} className="caps-tile">
                <span className="caps-img" style={{ backgroundImage: p.image }} />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
