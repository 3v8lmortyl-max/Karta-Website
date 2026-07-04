import Link from 'next/link';
import Image from 'next/image';

const VISITOR_WA = 'https://wa.me/919014612268?text=' +
  encodeURIComponent("Hey! I'm a visitor from Krta's website.");

const FOOTER = {
  connect: [
    { label: 'Call', href: 'tel:+919014612268' },
    { label: 'Text (WhatsApp)', href: VISITOR_WA },
    { label: 'Instagram', href: 'https://instagram.com/krta.in' },
    { label: 'YouTube', href: 'https://youtube.com' },
  ],
  support: [
    { label: 'Make a Return / Exchange', href: '/returns' },
    { label: 'Refund / Exchange Policy', href: '/returns' },
    { label: 'Track Your Order', href: '/track' },
    { label: 'Shipping Policy', href: '/shipping' },
    { label: "FAQ's", href: '/faq' },
    { label: 'Terms', href: '/terms' },
    { label: 'Privacy Policy', href: '/privacy' },
  ],
  brand: [
    { label: 'Our Story', href: '/about' },
    { label: 'Walk-in Stores', href: '/stores' },
    { label: 'Collaborations', href: '/collaborations' },
  ],
};

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <Image src="/karta-logo-mark.png" alt="Krta" width={441} height={148} className="footer-logo-img" />

        <div className="footer-grid">
          <div className="footer-colset">
            <div className="footer-col">
              <h4>Connect with us</h4>
              {FOOTER.connect.map((l) => (
                <a key={l.label} href={l.href} target={l.href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer">{l.label}</a>
              ))}
            </div>
            <div className="footer-col">
              <h4>Order Support</h4>
              {FOOTER.support.map((l) => <Link key={l.label} href={l.href}>{l.label}</Link>)}
            </div>
          </div>

          <div className="footer-col">
            <h4>We are Krta</h4>
            {FOOTER.brand.map((l) => <Link key={l.label} href={l.href}>{l.label}</Link>)}
          </div>
        </div>

        <div className="footer-copy">© 2026 Krta. All rights reserved.</div>
      </div>
    </footer>
  );
}
