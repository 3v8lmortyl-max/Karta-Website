import './globals.css';
import { Archivo } from 'next/font/google';
import Loader from '../components/Loader';
import AnnouncementBar from '../components/AnnouncementBar';
import Header from '../components/Header';
import MenuDrawer from '../components/MenuDrawer';
import SearchOverlay from '../components/SearchOverlay';
import CartDrawer from '../components/CartDrawer';
import WishlistDrawer from '../components/WishlistDrawer';
import SmoothScroll from '../components/SmoothScroll';

const archivo = Archivo({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-archivo',
  display: 'swap',
});

export const metadata = {
  title: 'Karta — Wear Art, Wear Karta',
  description: 'Karta is a wearable-art streetwear label. Hand-finished pieces on premium fabric, shipped across India.',
  openGraph: {
    title: 'Karta — Wear Art, Wear Karta',
    description: 'Hand-finished wearable-art streetwear on premium fabric.',
    type: 'website',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#ffffff',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={archivo.variable}>
      <body>
        <Loader />
        <SmoothScroll>
          <AnnouncementBar />
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
