'use client';

import { useEffect, useRef } from 'react';
import { WhatsAppIcon } from './Icons';

const WA = 'https://wa.me/919014612268?text=' +
  encodeURIComponent("Hi Krta! I'd love to customise my own hand-painted design.");

const CLIPS = [
  { video: '/video/custom-design.mp4', poster: '/video/custom-design-poster.jpg', bg: '/video/custom-design-blur-bg.jpg' },
  { video: '/video/custom-design-2.mp4', poster: '/video/custom-design-2-poster.jpg', bg: '/video/custom-design-2-blur-bg.jpg' },
];

function VideoPanel({ clip, registerRef }) {
  const videoRef = useRef(null);

  // Only decode/play while the panel is actually on screen. Visibility is only half
  // the story though — see the scroll-pause logic in the parent for the other half.
  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    registerRef(el);
    const io = new IntersectionObserver(
      ([entry]) => { el.dataset.visible = entry.isIntersecting ? '1' : '0'; },
      { threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [registerRef]);

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
  const videos = useRef([]);
  const registerRef = (el) => {
    if (!videos.current.includes(el)) videos.current.push(el);
  };

  // Two videos decoding at once is real work for a phone's GPU, and doing that decode
  // WHILE the browser is also trying to composite a scroll gesture is exactly what was
  // causing the lag. Pausing both for the duration of the scroll (then resuming once
  // it settles, only for whichever panel is actually visible) removes that contention
  // at the one moment it matters most, without losing the autoplay feel once still.
  useEffect(() => {
    let idleTimer = null;
    const resume = () => {
      videos.current.forEach((el) => {
        if (el.dataset.visible === '1') el.play().catch(() => {});
      });
    };
    const onScroll = () => {
      videos.current.forEach((el) => el.pause());
      clearTimeout(idleTimer);
      idleTimer = setTimeout(resume, 150);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    resume();
    return () => { window.removeEventListener('scroll', onScroll); clearTimeout(idleTimer); };
  }, []);

  return (
    <section className="custom-banner container">
      <div className="custom-banner-inner">
        <div className="custom-banner-video-row">
          {CLIPS.map((clip) => <VideoPanel key={clip.video} clip={clip} registerRef={registerRef} />)}
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
