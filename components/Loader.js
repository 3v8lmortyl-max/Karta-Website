'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

export default function Loader() {
  const [done, setDone] = useState(false); // begin fade-out
  const [gone, setGone] = useState(false); // remove from DOM

  // Decide when to start fading out (after window load, with a graceful minimum)
  useEffect(() => {
    const MIN = 1500;          // keep the screen up at least this long
    const start = performance.now();

    const finish = () => {
      const wait = Math.max(0, MIN - (performance.now() - start));
      setTimeout(() => setDone(true), wait);
    };

    if (document.readyState === 'complete') finish();
    else window.addEventListener('load', finish, { once: true });

    const safety = setTimeout(() => setDone(true), 4500); // never hang forever

    return () => {
      window.removeEventListener('load', finish);
      clearTimeout(safety);
    };
  }, []);

  // Lock scroll while the loader is visible
  useEffect(() => {
    if (gone) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [gone]);

  // Unmount after the fade-out transition completes
  useEffect(() => {
    if (!done) return;
    const t = setTimeout(() => setGone(true), 650);
    return () => clearTimeout(t);
  }, [done]);

  if (gone) return null;

  return (
    <div className={`loader ${done ? 'loader-hide' : ''}`} aria-hidden={done} role="status" aria-label="Loading">
      <div className="loader-inner">
        <Image
          src="/karta-logo.png"
          alt="Karta"
          width={160}
          height={83}
          priority
          className="loader-logo"
        />
        <div className="loader-bar"><span /></div>
        <p className="loader-tag">Wear Art. Wear Karta.</p>
      </div>
    </div>
  );
}
