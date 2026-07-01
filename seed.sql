-- Run this in Supabase SQL Editor AFTER running schema.sql
insert into products (id, name, price, sale_price, category, collection, color, sizes, featured, images, details, description, stock)
values
(
  'conflict-duality-tee', 'Conflict & Duality Tee', 2999, null,
  'Tops', 'New Arrivals', 'White', array['S','M','L'], true,
  array['/products/tee-main.jpg','/products/tee-angle.jpg','/products/tee-detail.jpg'],
  array['100% premium cotton','Oversized drop-shoulder fit','Back-printed Conflict & Duality artwork','Ribbed crew neckline','Garment-washed finish'],
  'Conflict & Duality — a panther and leopard locked in struggle, framed by hand-lettered script. Only one rule exists: survive, dominate, and reign. Oversized heavyweight cotton. Krta Worldwide, Estd. 2025.',
  '{"S": 10, "M": 10, "L": 10}'
),
(
  'krta-panther-cap', 'KRTA Phantom Cap', 1999, null,
  'Cap', 'Caps', 'Black', array['One Size'], true,
  array['/products/cap-main.jpg','/products/cap-detail.jpg','/products/cap-side.jpg'],
  array['Structured 6-panel cap','Adjustable metal buckle strap','Hand-painted panther & Krta script','100% cotton twill','One size fits most'],
  'The Krta Panther cap carries a hand-painted black panther over a washed sky motif, finished with the signature red Krta script. Structured crown, curved brim and an adjustable metal strap.',
  '{"One Size": 20}'
)
on conflict (id) do nothing;
