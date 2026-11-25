"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem, Product } from "./types";

type CartState = {
  items: CartItem[];
  add: (product: Product, quantity?: number, size?: string | null, color?: string | null) => void;
  remove: (productId: string, size: string | null, color: string | null) => void;
  setQty: (productId: string, size: string | null, color: string | null, qty: number) => void;
  clear: () => void;
};

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      add: (product, quantity = 1, size = null, color = null) => {
        const items = [...get().items];
        const idx = items.findIndex((i) => i.product.id === product.id && i.size === size && i.color === color);
        if (idx >= 0) items[idx] = { ...items[idx], quantity: items[idx].quantity + quantity };
        else items.push({ product, quantity, size, color });
        set({ items });
      },
      remove: (productId, size, color) => set({ items: get().items.filter((i) => !(i.product.id === productId && i.size === size && i.color === color)) }),
      setQty: (productId, size, color, qty) => set({ items: get().items.map((i) => (i.product.id === productId && i.size === size && i.color === color ? { ...i, quantity: Math.max(1, qty) } : i)) }),
      clear: () => set({ items: [] }),
    }),
    { name: "rxa-cart" }
  )
);

export function cartSubtotal(items: CartItem[]) {
  return items.reduce((s, i) => s + (i.product.sale_price ?? i.product.price) * i.quantity, 0);
}
export function cartShipping(subtotal: number) {
  return subtotal >= 500 || subtotal === 0 ? 0 : 25;
}
export function cartTotal(items: CartItem[]) {
  const sub = cartSubtotal(items);
  return sub + cartShipping(sub);
}
