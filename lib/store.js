'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// UI state — drawers, overlays, menu
export const useUI = create((set) => ({
  menuOpen: false,
  searchOpen: false,
  cartOpen: false,
  wishlistOpen: false,
  openMenu: () => set({ menuOpen: true, searchOpen: false, cartOpen: false, wishlistOpen: false }),
  closeMenu: () => set({ menuOpen: false }),
  openSearch: () => set({ searchOpen: true, menuOpen: false, cartOpen: false, wishlistOpen: false }),
  closeSearch: () => set({ searchOpen: false }),
  openCart: () => set({ cartOpen: true, menuOpen: false, searchOpen: false, wishlistOpen: false }),
  closeCart: () => set({ cartOpen: false }),
  openWishlist: () => set({ wishlistOpen: true, menuOpen: false, searchOpen: false, cartOpen: false }),
  closeWishlist: () => set({ wishlistOpen: false }),
  closeAll: () => set({ menuOpen: false, searchOpen: false, cartOpen: false, wishlistOpen: false }),
}));

// Cart — persisted to localStorage
export const useCart = create(
  persist(
    (set, get) => ({
      items: [], // { id, name, price, image, size, qty }
      add: (product, size = 'M', qty = 1) => {
        const items = get().items;
        const key = `${product.id}-${size}`;
        const existing = items.find((i) => `${i.id}-${i.size}` === key);
        if (existing) {
          set({
            items: items.map((i) =>
              `${i.id}-${i.size}` === key ? { ...i, qty: i.qty + qty } : i
            ),
          });
        } else {
          set({
            items: [
              ...items,
              {
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                size,
                qty,
              },
            ],
          });
        }
      },
      remove: (id, size) =>
        set({ items: get().items.filter((i) => !(i.id === id && i.size === size)) }),
      updateQty: (id, size, qty) =>
        set({
          items: get().items
            .map((i) => (i.id === id && i.size === size ? { ...i, qty: Math.max(1, qty) } : i))
            .filter((i) => i.qty > 0),
        }),
      clear: () => set({ items: [] }),
      count: () => get().items.reduce((n, i) => n + i.qty, 0),
      subtotal: () => get().items.reduce((s, i) => s + i.price * i.qty, 0),
    }),
    { name: 'karta-cart' }
  )
);

// Wishlist — persisted to localStorage
export const useWishlist = create(
  persist(
    (set, get) => ({
      items: [], // full product objects
      toggle: (product) => {
        const items = get().items;
        const exists = items.find((i) => i.id === product.id);
        if (exists) {
          set({ items: items.filter((i) => i.id !== product.id) });
        } else {
          set({ items: [...items, product] });
        }
      },
      remove: (id) => set({ items: get().items.filter((i) => i.id !== id) }),
      has: (id) => !!get().items.find((i) => i.id === id),
      count: () => get().items.length,
      clear: () => set({ items: [] }),
    }),
    { name: 'karta-wishlist' }
  )
);
