import './globals.css';
import Loader from '../components/Loader';
import Header from '../components/Header';
import MenuDrawer from '../components/MenuDrawer';
import SearchOverlay from '../components/SearchOverlay';
import CartDrawer from '../components/CartDrawer';
import WishlistDrawer from '../components/WishlistDrawer';
import SmoothScroll from '../components/SmoothScroll';

export const metadata = {
  title: 'Karta — Wear Art, Wear Karta',
  description: 'Karta is a premium handmade wearable-art clothing brand from India. Hand-painted, one-of-one pieces on quality fabric.',
  openGraph: {
    title: 'Karta — Wear Art, Wear Karta',
    description: 'Premium handmade wearable art on quality fabric, designed and painted in India.',
    type: 'website',
  },
};

export const viewport = { width: 'device-width', initialScale: 1, viewportFit: 'cover', themeColor: '#ffffff' };

const ANNOUNCE = ['Free shipping across India', 'Hand-painted, one-of-one pieces', 'New drop live now', 'Wear Art. Wear Karta.'];

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Loader />
        <div className="announce">
          <div className="announce-track">
            <span>{ANNOUNCE.map((t, i) => <span key={'a' + i}>{t} ✦</span>)}</span>
            <span>{ANNOUNCE.map((t, i) => <span key={'b' + i}>{t} ✦</span>)}</span>
          </div>
        </div>
        <SmoothScroll>
          <Header />
          <MenuDrawer />
          <SearchOverlay />
          <CartDrawer />
          <WishlistDrawer />
          <main>{children}</main>
        </SmoothScroll>
      </body>
    </html>
  );
}
