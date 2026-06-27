import './globals.css';
import { Hanken_Grotesk, Pinyon_Script } from 'next/font/google';
import Loader from '../components/Loader';
import Header from '../components/Header';
import MenuDrawer from '../components/MenuDrawer';
import SearchOverlay from '../components/SearchOverlay';
import CartDrawer from '../components/CartDrawer';
import WishlistDrawer from '../components/WishlistDrawer';
import SmoothScroll from '../components/SmoothScroll';
import Footer from '../components/Footer';

const sans = Hanken_Grotesk({ subsets: ['latin'], weight: ['400', '500', '600', '700', '800'], variable: '--font-sans', display: 'swap' });
const pinyon = Pinyon_Script({ subsets: ['latin'], weight: '400', variable: '--font-script', display: 'swap' });

export const metadata = {
  title: 'Krta — Wear Art, Wear Krta',
  description: 'Krta is a wearable-art streetwear label. Hand-finished pieces on premium fabric, shipped across India.',
  openGraph: { title: 'Krta — Wear Art, Wear Krta', description: 'Hand-finished wearable-art streetwear on premium fabric.', type: 'website' },
};

export const viewport = { width: 'device-width', initialScale: 1, viewportFit: 'cover', themeColor: '#ececea' };

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${sans.variable} ${pinyon.variable}`}>
      <body>
        <Loader />
        <SmoothScroll>
          <Header />
          <MenuDrawer />
          <SearchOverlay />
          <CartDrawer />
          <WishlistDrawer />
          <main>{children}</main>
          <Footer />
        </SmoothScroll>
      </body>
    </html>
  );
}
