// Placeholder catalog. Gradient "swatches" stand in for product photography
// on a light, image-driven layout. `image` = front, `image2` = hover.

export const products = [
  { id: 'conflict-duality-tee', name: 'Conflict & Duality Tee', price: 1799, salePrice: null, category: 'Tops', collection: 'New Arrivals', color: 'White', sizes: ['S','M','L','XL','XXL'], featured: true,
    image: "url('/products/tee-main.jpg')", image2: "url('/products/tee-angle.jpg')",
    images: ["url('/products/tee-main.jpg')", "url('/products/tee-angle.jpg')", "url('/products/tee-detail.jpg')"],
    details: ['100% premium cotton', 'Oversized drop-shoulder fit', 'Back-printed Conflict & Duality artwork', 'Ribbed crew neckline', 'Garment-washed finish'],
    description: 'Conflict & Duality \u2014 a panther and leopard locked in struggle, framed by hand-lettered script. Only one rule exists: survive, dominate, and reign. Oversized heavyweight cotton. Krta Worldwide, Estd. 2025.' },
  { id: 'krta-panther-cap', name: 'Krta Panther Cap', price: 1499, salePrice: null, category: 'Cap', collection: 'Caps', color: 'Black', sizes: ['One Size'], featured: true,
    image: "url('/products/cap-main.jpg')", image2: "url('/products/cap-detail.jpg')",
    images: ["url('/products/cap-main.jpg')", "url('/products/cap-detail.jpg')", "url('/products/cap-side.jpg')"],
    details: ['Structured 6-panel cap', 'Adjustable metal buckle strap', 'Hand-painted panther & Krta script', '100% cotton twill', 'One size fits most'],
    description: 'The Krta Panther cap carries a hand-painted black panther over a washed sky motif, finished with the signature red Krta script. Structured crown, curved brim and an adjustable metal strap.' },
  { id: 'p1', name: 'Brushed Ink Tee', price: 4800, salePrice: null, category: 'Tops', collection: 'New Arrivals', color: 'Charcoal', sizes: ['XS','S','M','L','XL','XXL'], featured: true,
    image: 'linear-gradient(150deg,#e7e2da 0%,#cfc7ba 100%)', image2: 'linear-gradient(150deg,#1b1b1b 0%,#3a3a3a 100%)' },
  { id: 'p2', name: 'Acid Wash Wide Trouser', price: 9200, salePrice: 7800, category: 'Bottoms', collection: 'Limited Edition', color: 'Ochre', sizes: ['S','M','L','XL'], featured: true,
    image: 'linear-gradient(150deg,#f0c98a 0%,#d68b3c 100%)', image2: 'linear-gradient(150deg,#caa15a 0%,#7c5a2c 100%)' },
  { id: 'p3', name: 'Mesh Veil Overshirt', price: 6500, salePrice: null, category: 'Outerwear', collection: 'New Arrivals', color: 'Black', sizes: ['S','M','L'], featured: true,
    image: 'linear-gradient(150deg,#cdd3dc 0%,#9aa6b6 100%)', image2: 'linear-gradient(150deg,#1d2530 0%,#39414d 100%)' },
  { id: 'p4', name: 'Pigment Study Hoodie', price: 8800, salePrice: null, category: 'Tops', collection: 'New Arrivals', color: 'Slate', sizes: ['S','M','L','XL','XXL'], featured: true,
    image: 'linear-gradient(150deg,#b9c6e8 0%,#6f86c9 100%)', image2: 'linear-gradient(150deg,#1a3fd6 0%,#13287f 100%)' },
  { id: 'p5', name: 'Canvas Cargo', price: 10500, salePrice: null, category: 'Bottoms', collection: 'Best Sellers', color: 'Clay', sizes: ['S','M','L','XL'], featured: false,
    image: 'linear-gradient(150deg,#e3d6c4 0%,#b59b78 100%)', image2: 'linear-gradient(150deg,#7a6446 0%,#473a28 100%)' },
  { id: 'p6', name: 'Stroke Knit', price: 7200, salePrice: null, category: 'Tops', collection: 'Best Sellers', color: 'Bone', sizes: ['S','M','L','XL'], featured: false,
    image: 'linear-gradient(150deg,#f3efe7 0%,#ddd6c8 100%)', image2: 'linear-gradient(150deg,#cfc4ae 0%,#9b8f73 100%)' },
  { id: 'p7', name: 'Raw Edge Denim Jacket', price: 12500, salePrice: null, category: 'Outerwear', collection: 'Limited Edition', color: 'Indigo', sizes: ['S','M','L','XL'], featured: false,
    image: 'linear-gradient(150deg,#aeb9d6 0%,#5f6f9e 100%)', image2: 'linear-gradient(150deg,#2a3650 0%,#161d2c 100%)' },
  { id: 'p8', name: 'Gesture Silk Scarf', price: 3800, salePrice: 3200, category: 'Accessories', collection: 'Best Sellers', color: 'Rust', sizes: ['One Size'], featured: false,
    image: 'linear-gradient(150deg,#f4b89a 0%,#e2693c 100%)', image2: 'linear-gradient(150deg,#c14d28 0%,#7a2f18 100%)' },
];

export const collections = [
  { slug: 'wear-art', title: 'Wear Art', description: 'The signature line. Wearable artwork.' },
  { slug: 'limited-edition', title: 'Limited Edition', description: 'Numbered, one-time pieces.' },
  { slug: 'new-arrivals', title: 'New Arrivals', description: 'The latest from the studio.' },
  { slug: 'best-sellers', title: 'Best Sellers', description: 'Collector favourites.' },
];

export function formatINR(n) {
  return 'RS. ' + n.toLocaleString('en-IN');
}
