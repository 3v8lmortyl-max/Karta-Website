import Link from 'next/link';
import Image from 'next/image';
import { rawImageUrl } from '../lib/img';

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
            {items.map((p) => {
              const url = rawImageUrl(p.image);
              return (
                <Link key={p.id} href={`/products/${p.id}`} className="caps-tile">
                  {url ? (
                    <span className="caps-img">
                      <Image src={url} alt={p.name} fill sizes="(min-width: 760px) 30vw, 45vw" style={{ objectFit: 'contain' }} />
                    </span>
                  ) : (
                    <span className="caps-img" style={{ backgroundImage: p.image }} />
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
