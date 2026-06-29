import Link from 'next/link';

const FOOTER = {
  connect: [
    { label: 'Call', href: 'tel:+919014612268' },
    { label: 'Text (WhatsApp)', href: 'https://wa.me/919014612268' },
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
  ],
  brand: [
    { label: 'Our Story', href: '/about' },
    { label: 'Walk-in Stores', href: '/about' },
    { label: 'Collaborations', href: '/about' },
    { label: 'Media', href: '/journal' },
  ],
};

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-script">krta</div>

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
