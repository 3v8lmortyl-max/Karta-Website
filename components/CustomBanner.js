import { WhatsAppIcon } from './Icons';

const WA = 'https://wa.me/919014612268?text=' +
  encodeURIComponent("Hi Krta! I'd love to customise my own hand-painted design.");

export default function CustomBanner() {
  return (
    <section className="custom-banner container">
      <div className="custom-banner-inner">
        <video
          className="custom-banner-bg custom-banner-bg-blur"
          src="/video/custom-design.mp4"
          poster="/video/custom-design-poster.jpg"
          autoPlay muted loop playsInline preload="metadata"
          aria-hidden="true"
        />
        <video
          className="custom-banner-bg custom-banner-bg-sharp"
          src="/video/custom-design.mp4"
          poster="/video/custom-design-poster.jpg"
          autoPlay muted loop playsInline preload="metadata"
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
