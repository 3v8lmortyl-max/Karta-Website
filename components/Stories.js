import Link from 'next/link';

const STORIES = [
  { label: 'New Drop',    href: '/shop?collection=new-arrivals',     bg: 'linear-gradient(145deg,#cdb8ff,#7c5cff)' },
  { label: 'Hand-Painted',href: '/collections/wear-art',             bg: 'linear-gradient(145deg,#ffd9a8,#e2693c)' },
  { label: 'Acid Wash',   href: '/shop?q=Acid%20Wash',               bg: 'linear-gradient(145deg,#cfd8e6,#6f86c9)' },
  { label: 'Limited',     href: '/collections/limited-edition',      bg: 'linear-gradient(145deg,#e7e2da,#b59b78)' },
  { label: 'Outerwear',   href: '/shop?q=Jacket',                    bg: 'linear-gradient(145deg,#aeb9d6,#2a3650)' },
  { label: 'Accessories', href: '/shop?q=Scarf',                     bg: 'linear-gradient(145deg,#f4b89a,#c14d28)' },
  { label: 'Best Sellers',href: '/shop?collection=best-sellers',     bg: 'linear-gradient(145deg,#f3efe7,#cfc4ae)' },
  { label: 'Studio',      href: '/about',                            bg: 'linear-gradient(145deg,#1b1b1b,#3a3a3a)' },
];

export default function Stories() {
  return (
    <div className="stories-wrap">
      <div className="container">
        <div className="stories">
          {STORIES.map((s) => (
            <Link key={s.label} href={s.href} className="story">
              <span className="story-img" style={{ background: s.bg }} />
              <span className="story-label">{s.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
