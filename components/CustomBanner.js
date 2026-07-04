'use client';

import { useEffect, useRef } from 'react';
import { WhatsAppIcon } from './Icons';

const WA = 'https://wa.me/919014612268?text=' +
  encodeURIComponent("Hi Krta! I'd love to customise my own hand-painted design.");

const CLIPS = [
  { video: '/video/custom-design.mp4', poster: '/video/custom-design-poster.jpg', bg: '/video/custom-design-blur-bg.jpg' },
  { video: '/video/custom-design-2.mp4', poster: '/video/custom-design-2-poster.jpg', bg: '/video/custom-design-2-blur-bg.jpg' },
];

function VideoPanel({ clip }) {
  const videoRef = useRef(null);

  // Only decode/play while the panel is actually on screen — see note in the parent.
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
    <div className="custom-banner-panel">
      <div className="custom-banner-bg-static" style={{ backgroundImage: `url('${clip.bg}')` }} />
      <video
        ref={videoRef}
        className="custom-banner-bg-sharp"
        src={clip.video}
        poster={clip.poster}
        muted loop playsInline preload="metadata"
        aria-hidden="true"
      />
    </div>
  );
}

export default function CustomBanner() {
  return (
    <section className="custom-banner container">
      <div className="custom-banner-inner">
        <div className="custom-banner-video-row">
          {CLIPS.map((clip) => <VideoPanel key={clip.video} clip={clip} />)}
        </div>
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
