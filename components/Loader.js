'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

export default function Loader() {
  const [done, setDone] = useState(false);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const MIN = 1400;
    const start = performance.now();
    const finish = () => setTimeout(() => setDone(true), Math.max(0, MIN - (performance.now() - start)));
    if (document.readyState === 'complete') finish();
    else window.addEventListener('load', finish, { once: true });
    const safety = setTimeout(() => setDone(true), 4500);
    return () => { window.removeEventListener('load', finish); clearTimeout(safety); };
  }, []);

  useEffect(() => {
    if (gone) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [gone]);

  useEffect(() => {
    if (!done) return;
    const t = setTimeout(() => setGone(true), 650);
    return () => clearTimeout(t);
  }, [done]);

  if (gone) return null;

  return (
    <div className={`loader ${done ? 'loader-hide' : ''}`} role="status" aria-label="Loading">
      <div className="loader-inner">
        <Image src="/karta-wordmark.png" alt="Karta" width={200} height={75} priority className="loader-logo" />
        <div className="loader-bar"><span /></div>
      </div>
    </div>
  );
}
