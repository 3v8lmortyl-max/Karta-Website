import Link from 'next/link';

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero-bg" />
      <div className="hero-content container">
        <Link href="/shop" className="hero-cta">Shop now</Link>
      </div>
    </section>
  );
}
