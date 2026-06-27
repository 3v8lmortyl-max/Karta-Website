import Link from 'next/link';

const COLS = [
  { title: 'Shop by category', items: ['Oversized Tees','Hand-Painted Shirts','Acid Wash Tees','Designer Shirts','Artist Jackets','Statement Hoodies','Printed Sweatshirts'] },
  { title: 'Shop by style', items: ['Wearable Art','Abstract Prints','Casual Shirts','Full-Sleeve','Wide Trousers','Crew Neck','Baggy Denim'] },
  { title: 'Shop by colour', items: ['Black','Bone','Ochre','Rust','Indigo','Clay','Slate'] },
];

export default function PopularSearches() {
  return (
    <section className="section popular">
      <div className="container">
        <p className="popular-title">Popular searches</p>
        <div className="popular-cols">
          {COLS.map((c) => (
            <div className="popular-col" key={c.title}>
              <h4>{c.title}</h4>
              <div>
                {c.items.map((it) => (
                  <Link key={it} href={`/shop?q=${encodeURIComponent(it)}`}>{it}</Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
