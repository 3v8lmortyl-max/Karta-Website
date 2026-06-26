'use client';

import { useRef, useEffect, useState } from 'react';
import { useUI } from '../lib/store';
import { SoundOnIcon, SoundOffIcon } from './Icons';

export default function BackgroundVideo() {
  const videoRef = useRef(null);
  const [muted, setMuted] = useState(true);
  const [blur, setBlur] = useState(0);
  const [dark, setDark] = useState(0.25);
  const anyOpen = useUI(
    (s) => s.menuOpen || s.searchOpen || s.cartOpen || s.wishlistOpen
  );

  useEffect(() => {
    const v = videoRef.current;
    if (v) {
      v.muted = true;
      const p = v.play();
      if (p && p.catch) p.catch(() => {});
    }
  }, []);

  useEffect(() => {
    let raf = null;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        const y = window.scrollY;
        const vh = window.innerHeight;
        // Blur grows from 0 to ~14px across the first ~1.5 viewports
        const b = Math.min(14, (y / (vh * 1.5)) * 14);
        // Darken grows from 0.25 to ~0.72
        const d = Math.min(0.72, 0.25 + (y / (vh * 1.5)) * 0.47);
        setBlur(b);
        setDark(d);
        raf = null;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Extra darken when a drawer/overlay is open
  const overlayDark = anyOpen ? 0.55 : dark;

  const toggleSound = () => {
    const v = videoRef.current;
    if (!v) return;
    const next = !muted;
    v.muted = next;
    if (!next) {
      const p = v.play();
      if (p && p.catch) p.catch(() => {});
    }
    setMuted(next);
  };

  return (
    <div className="bg-video-wrap" aria-hidden="true">
      <video
        ref={videoRef}
        className="bg-video"
        style={{ filter: `blur(${blur}px)` }}
        src="/hero-video.mp4"
        poster="/hero-poster.jpg"
        autoPlay
        loop
        muted
        playsInline
      />
      <div
        className="bg-video-veil"
        style={{
          background: `linear-gradient(180deg, rgba(0,0,0,${Math.min(
            0.6,
            overlayDark + 0.1
          )}) 0%, rgba(0,0,0,${overlayDark * 0.5}) 30%, rgba(0,0,0,${overlayDark}) 100%)`,
        }}
      />
      {/* Sound toggle floats above everything, fixed bottom-right */}
      <button
        className="sound-toggle"
        onClick={toggleSound}
        aria-label={muted ? 'Unmute background video' : 'Mute background video'}
      >
        {muted ? <SoundOffIcon /> : <SoundOnIcon />}
      </button>
    </div>
  );
}
