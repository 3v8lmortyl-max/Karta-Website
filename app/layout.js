import './globals.css';

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
      <body>{children}</body>
    </html>
  );
}
