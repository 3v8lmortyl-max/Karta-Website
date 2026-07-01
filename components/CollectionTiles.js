'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

export default function CollectionTiles({ slides }) {
  const TILES = slides && slides.length ? slides : [];
  const n = TILES.length;
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const startX = useRef(null);

  // auto-advance
  useEffect(() => {
    if (paused || n === 0) return;
    const id = setInterval(() => setActive((a) => (a + 1) % n), 3500);
    return () => clearInterval(id);
  }, [paused, n]);

  if (n === 0) return null;

  const go = (i) => setActive(((i % n) + n) % n);

  const onTouchStart = (e) => { startX.current = e.touches[0].clientX; setPaused(true); };
  const onTouchEnd = (e) => {
    if (startX.current == null) return;
    const dx = e.changedTouches[0].clientX - startX.current;
    if (dx > 40) go(active - 1);
    else if (dx < -40) go(active + 1);
    startX.current = null;
    setPaused(false);
  };

  return (
    <section
      className="section-cover"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div
        className="cover-viewport"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <div className="cover-stage">
          {TILES.map((t, i) => {
            let off = i - active;
            if (off > n / 2) off -= n;
            if (off < -n / 2) off += n;
            const abs = Math.abs(off);
            const style = {
              transform: `translateX(-50%) translateX(${off * 62}%) scale(${off === 0 ? 1 : 0.82})`,
              opacity: abs <= 1 ? (off === 0 ? 1 : 0.5) : 0,
              zIndex: 10 - abs,
              pointerEvents: off === 0 ? 'auto' : 'none',
            };
            return (
              <Link key={t.id} href={t.href} className="cover-slide" style={style} aria-hidden={off !== 0}>
                <span className="cover-bg" style={{ background: t.bg }} />
                <span className="cover-title">{t.title}</span>
              </Link>
            );
          })}
        </div>
      </div>

      <div className="cover-dots">
        {TILES.map((t, i) => (
          <button key={i} className={`cover-dot ${i === active ? 'on' : ''}`} onClick={() => go(i)} aria-label={`Show ${t.title}`} />
        ))}
      </div>
    </section>
  );
}
