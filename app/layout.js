import './globals.css';

export const metadata = {
  title: 'Karta — Wear Art, Wear Karta',
  description: 'Karta creates handmade artistic designs on quality fabric. Wearable art. Wear Art, Wear Karta.',
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
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
