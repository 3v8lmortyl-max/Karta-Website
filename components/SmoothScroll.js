'use client';

import { useEffect } from 'react';

export default function SmoothScroll({ children }) {
  useEffect(() => {
    // Skip on mobile (touch devices) — browser native scroll is already smooth
    // Lenis on mobile causes extra JavaScript overhead which makes it feel laggier
    const isMobile = window.matchMedia('(pointer: coarse)').matches;
    if (isMobile) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let lenis;
    import('lenis').then(({ default: Lenis }) => {
      lenis = new Lenis({
        duration: 1.1,
        easing: (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        wheelMultiplier: 1,
        prevent: (node) =>
          node.hasAttribute?.('data-lenis-prevent') ||
          !!node.closest?.('[data-lenis-prevent]'),
      });

      let raf;
      const loop = (time) => {
        lenis.raf(time);
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);

      return () => {
        cancelAnimationFrame(raf);
        lenis.destroy();
      };
    });
  }, []);

  return children;
}
