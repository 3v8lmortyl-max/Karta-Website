import { WhatsAppIcon } from './Icons';

const WA = 'https://wa.me/919014612268?text=' +
  encodeURIComponent("Hi Krta! I'd love to customise my own hand-painted design.");

export default function CustomBanner() {
  return (
    <section className="custom-banner container">
      <div className="custom-banner-inner">
        <div className="custom-banner-bg" />
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
