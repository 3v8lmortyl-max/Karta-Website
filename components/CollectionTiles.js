import Link from 'next/link';

const TILES = [
  { title: 'Wear Art',        href: '/collections/wear-art',         wide: true,  bg: 'linear-gradient(120deg,#1b1b1b 0%,#3a3a3a 50%,#cdb8ff 130%)' },
  { title: 'Limited Edition', href: '/collections/limited-edition',  wide: false, bg: 'linear-gradient(150deg,#caa15a,#7c5a2c)' },
  { title: 'New Arrivals',    href: '/shop?collection=new-arrivals', wide: false, bg: 'linear-gradient(150deg,#6f86c9,#13287f)' },
  { title: 'Best Sellers',    href: '/shop?collection=best-sellers', wide: false, bg: 'linear-gradient(150deg,#e2693c,#7a2f18)' },
  { title: 'Accessories',     href: '/shop?q=Scarf',                 wide: false, bg: 'linear-gradient(150deg,#9b8f73,#473a28)' },
];

export default function CollectionTiles() {
  return (
    <section className="section">
      <div className="container">
        <div className="sec-head"><h2 className="sec-title">Discover collection</h2></div>
        <div className="ctiles">
          {TILES.map((t) => (
            <Link key={t.title} href={t.href} className={`ctile ${t.wide ? 'ctile-wide' : ''}`}>
              <span className="ctile-bg" style={{ background: t.bg }} />
              <span className="ctile-inner">
                <span className="ctile-title">{t.title}</span>
                <span className="ctile-cta">Shop now</span>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
