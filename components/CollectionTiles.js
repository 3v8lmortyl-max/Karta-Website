import Link from 'next/link';

const TILES = [
  { title: 'Caps',            href: '/shop?q=Cap',                   bg: 'linear-gradient(150deg,#7a1f2b,#3a0e16)' },
  { title: 'Yacht Collection',href: '/collections/wear-art',         bg: 'linear-gradient(150deg,#2a2118,#0e0b08)' },
  { title: 'Wear Art',        href: '/collections/wear-art',         bg: 'linear-gradient(150deg,#2c2c40,#6f5cff)' },
  { title: 'Limited Edition', href: '/collections/limited-edition',  bg: 'linear-gradient(150deg,#caa15a,#5a3f1d)' },
  { title: 'Best Sellers',    href: '/shop?collection=best-sellers', bg: 'linear-gradient(150deg,#274060,#0d1b2a)' },
];

export default function CollectionTiles() {
  return (
    <section className="section-cover">
      <div className="cover-track">
        {TILES.map((t) => (
          <Link key={t.title} href={t.href} className="cover-card">
            <span className="cover-bg" style={{ background: t.bg }} />
            <span className="cover-title">{t.title}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
