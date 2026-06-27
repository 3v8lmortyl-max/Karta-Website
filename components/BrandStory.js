'use client';

import { useState } from 'react';

export default function BrandStory() {
  const [open, setOpen] = useState(false);
  return (
    <section className="section brandstory">
      <div className="container brandstory-inner">
        <h2>Karta — Wearable Art, Hand-Finished in India</h2>
        <p>
          Karta is a wearable-art label built on a simple idea: clothing can carry the soul of a piece of art.
          Every garment begins as a blank canvas and is finished by hand — pigment washes, gestural brushwork,
          and considered detailing on premium fabric. The result is streetwear with the unpredictability and
          presence of an original work.
        </p>
        {open && (
          <>
            <h3>Made by hand, worn with intention</h3>
            <p>
              No two pieces are ever identical. Small variations in dye, stroke, and finish are part of the
              language — they are what make each piece yours and no one else’s. We design in limited runs so the
              work stays personal rather than mass-produced.
            </p>
            <h3>Premium fabric, gender-neutral fits</h3>
            <p>
              Our cuts are relaxed, layerable, and made to be worn by anyone who appreciates good design. From
              oversized tees and hand-painted shirts to artist jackets and wide trousers, every piece is built
              from quality fabric chosen for comfort and longevity.
            </p>
            <h3>A studio, not a factory</h3>
            <p>
              Karta is an independent studio rooted in India and shipping nationwide. We move at the pace of the
              work — releasing drops when they’re ready, not when a calendar says so.
            </p>
          </>
        )}
        <button className="readmore" onClick={() => setOpen((o) => !o)}>
          {open ? 'Read less' : 'Read more'}
        </button>
      </div>
    </section>
  );
}
