import Link from 'next/link';

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero-bg" />
      <div className="hero-content container">
        <p className="hero-kicker">Summer ’26</p>
        <h1 className="hero-title">Wearable Art</h1>
        <p className="hero-sub">Hand-finished pieces on premium fabric. Made to be seen, felt, and remembered.</p>
        <Link href="/shop" className="hero-cta">Shop now</Link>
      </div>
    </section>
  );
}
