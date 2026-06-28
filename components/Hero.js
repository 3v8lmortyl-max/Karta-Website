import Link from 'next/link';

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero-bg" />
      <div className="hero-content container">
        <Link href="/shop" className="hero-cta">Shop now</Link>

        <div className="scroll-hint" aria-hidden="true">
          <span className="scroll-chevrons">
            <svg viewBox="0 0 24 12" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3l9 7 9-7" /></svg>
            <svg viewBox="0 0 24 12" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3l9 7 9-7" /></svg>
          </span>
        </div>
      </div>
    </section>
  );
}
