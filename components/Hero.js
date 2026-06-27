import Link from 'next/link';

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero-bg" />
      <div className="hero-content container">
        <Link href="/shop" className="hero-cta">Shop now</Link>

        <div className="scroll-hint" aria-hidden="true">
          <svg className="scroll-hand" viewBox="0 0 48 64" fill="#fff" xmlns="http://www.w3.org/2000/svg">
            <rect x="20" y="6" width="8" height="26" rx="4" />
            <circle cx="31" cy="26" r="3.1" />
            <circle cx="35.4" cy="28.5" r="2.7" />
            <rect x="13" y="25" width="24" height="31" rx="12" />
            <rect x="6.5" y="32" width="13" height="8" rx="4" transform="rotate(-22 13 36)" />
          </svg>
          <span className="scroll-chevrons">
            <svg viewBox="0 0 24 12" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3l9 7 9-7" /></svg>
            <svg viewBox="0 0 24 12" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3l9 7 9-7" /></svg>
          </span>
        </div>
      </div>
    </section>
  );
}
