'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import { useUI } from '../lib/store';
import { SoundOnIcon, SoundOffIcon } from './Icons';

export default function BackgroundVideo() {
  const videoRef = useRef(null);
  const [muted, setMuted] = useState(true);
  const blurRef = useRef(0);
  const darkRef = useRef(0.25);
  const veilRef = useRef(null);
  const vidRef = useRef(null);
  const rafRef = useRef(null);
  const anyOpen = useUI((s) => s.menuOpen || s.searchOpen || s.cartOpen || s.wishlistOpen);

  useEffect(() => {
    const v = videoRef.current;
    if (v) { v.muted = true; v.play().catch(() => {}); }
  }, []);

  // Use refs + direct DOM manipulation instead of React state for scroll updates
  // This avoids React re-renders on every scroll frame — huge performance win
  useEffect(() => {
    const onScroll = () => {
      if (rafRef.current) return;
      rafRef.current = requestAnimationFrame(() => {
        const y = window.scrollY;
        const vh = window.innerHeight;
        const prog = Math.min(1, y / (vh * 1.4));
        const blur = prog * 12;
        const dark = 0.22 + prog * 0.45;

        if (vidRef.current) {
          vidRef.current.style.filter = `blur(${blur.toFixed(1)}px)`;
        }
        if (veilRef.current) {
          veilRef.current.style.background =
            `linear-gradient(180deg, rgba(0,0,0,${(dark + 0.08).toFixed(2)}) 0%, rgba(0,0,0,${(dark * 0.45).toFixed(2)}) 30%, rgba(0,0,0,${dark.toFixed(2)}) 100%)`;
        }
        rafRef.current = null;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const toggleSound = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    const next = !muted;
    v.muted = next;
    if (!next) v.play().catch(() => {});
    setMuted(next);
  }, [muted]);

  return (
    <div className="bg-video-wrap" aria-hidden="true">
      <video
        ref={(el) => { videoRef.current = el; vidRef.current = el; }}
        className="bg-video"
        src="/hero-video.mp4"
        poster="/hero-poster.jpg"
        autoPlay loop muted playsInline
        preload="auto"
      />
      <div ref={veilRef} className="bg-video-veil" />
      <button className="sound-toggle" onClick={toggleSound}
        aria-label={muted ? 'Unmute video' : 'Mute video'}>
        {muted ? <SoundOffIcon /> : <SoundOnIcon />}
      </button>
    </div>
  );
}
