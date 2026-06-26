'use client';

import { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import { MenuIcon, SearchIcon, BagIcon, SoundOnIcon, SoundOffIcon } from '../components/Icons';

export default function Home() {
  const videoRef = useRef(null);
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    // Ensure autoplay works (muted autoplay is allowed by browsers)
    const v = videoRef.current;
    if (v) {
      v.muted = true;
      const p = v.play();
      if (p && p.catch) p.catch(() => {});
    }
  }, []);

  const toggleSound = () => {
    const v = videoRef.current;
    if (!v) return;
    const next = !muted;
    v.muted = next;
    if (!next) {
      // unmuting — ensure it's playing
      const p = v.play();
      if (p && p.catch) p.catch(() => {});
    }
    setMuted(next);
  };

  return (
    <main className="relative w-full h-[100svh] overflow-hidden bg-black">
      {/* Background video */}
      <video
        ref={videoRef}
        className="hero-video"
        src="/hero-video.mp4"
        poster="/hero-poster.jpg"
        autoPlay
        loop
        muted
        playsInline
      />
      <div className="hero-veil" />

      {/* Top bar */}
      <header className="absolute top-0 left-0 right-0 z-20 px-5 pt-5">
        <div className="flex items-center justify-between">
          {/* Left: menu + search */}
          <div className="flex items-center gap-5">
            <button className="icon-btn" aria-label="Menu"><MenuIcon /></button>
            <button className="icon-btn" aria-label="Search"><SearchIcon /></button>
          </div>

          {/* Center: logo */}
          <a href="/" aria-label="Karta home" className="absolute left-1/2 -translate-x-1/2">
            <Image
              src="/karta-logo.png"
              alt="Karta"
              width={110}
              height={57}
              priority
              style={{ height: '38px', width: 'auto' }}
            />
          </a>

          {/* Right: bag */}
          <div className="flex items-center">
            <button className="icon-btn" aria-label="Cart"><BagIcon /></button>
          </div>
        </div>
      </header>

      {/* SHOP ALL — bottom center */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20">
        <a href="/shop" className="shop-all">Shop All</a>
      </div>

      {/* Sound toggle — bottom right */}
      <button
        className="sound-toggle absolute bottom-8 right-5 z-20"
        onClick={toggleSound}
        aria-label={muted ? 'Unmute video' : 'Mute video'}
      >
        {muted ? <SoundOffIcon /> : <SoundOnIcon />}
      </button>
    </main>
  );
}
