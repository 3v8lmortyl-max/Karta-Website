'use client';

import { useEffect, useRef } from 'react';
import { WhatsAppIcon } from './Icons';

const WA = 'https://wa.me/919014612268?text=' +
  encodeURIComponent("Hi Krta! I'd love to customise my own hand-painted design.");

export default function CustomBanner() {
  const videoRef = useRef(null);

  // Only decode/play the video while the banner is actually on screen. A <video> keeps
  // decoding frames even when scrolled out of view, which was adding real GPU/CPU load
  // (and, combined with a live CSS blur filter we've since removed, was the likely cause
  // of choppy scrolling and the flickering brightness behind the text).
  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) el.play().catch(() => {});
        else el.pause();
      },
      { threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section className="custom-banner container">
      <div className="custom-banner-inner">
        {/* Static pre-blurred/pre-dimmed image — cheap to render, unlike a live CSS blur
            filter on a playing video, and gives a stable, non-flickering backdrop. */}
        <div className="custom-banner-bg-static" />
        <video
          ref={videoRef}
          className="custom-banner-bg-sharp"
          src="/video/custom-design.mp4"
          poster="/video/custom-design-poster.jpg"
          muted loop playsInline preload="metadata"
          aria-hidden="true"
        />
        <div className="custom-banner-overlay">
          <p className="custom-banner-kicker">Hand-painted · One of one</p>
          <h2 className="custom-banner-title">Customise your own design</h2>
          <p className="custom-banner-sub">
            Want a piece made just for you? Message us on WhatsApp and our artists will bring your idea to life.
          </p>
          <a className="custom-wa-btn" href={WA} target="_blank" rel="noopener noreferrer">
            <WhatsAppIcon size={20} /> Chat on WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}
