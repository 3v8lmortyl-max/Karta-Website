import './globals.css';
import Header from '../components/Header';
import MenuDrawer from '../components/MenuDrawer';
import SearchOverlay from '../components/SearchOverlay';
import CartDrawer from '../components/CartDrawer';
import WishlistDrawer from '../components/WishlistDrawer';
import BackgroundVideo from '../components/BackgroundVideo';
import SmoothScroll from '../components/SmoothScroll';

export const metadata = {
  title: 'Karta — Wear Art, Wear Karta',
  description: 'Karta creates handmade artistic designs on quality fabric. Wearable art.',
  openGraph: {
    title: 'Karta — Wear Art, Wear Karta',
    description: 'Handmade artistic designs on quality fabric. Wearable art.',
    type: 'website',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <SmoothScroll>
          <BackgroundVideo />
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
