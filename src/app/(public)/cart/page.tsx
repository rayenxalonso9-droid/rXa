"use client";
import Link from "next/link";
import Image from "next/image";
import { useCart, cartSubtotal, cartShipping, cartTotal } from "@/lib/cart-store";
import { Trash2 } from "lucide-react";

export default function CartPage() {
  const items = useCart((s) => s.items);
  const remove = useCart((s) => s.remove);
  const setQty = useCart((s) => s.setQty);
  const clear = useCart((s) => s.clear);
  const sub = cartSubtotal(items);
  const ship = cartShipping(sub);
  const total = cartTotal(items);

  if (items.length === 0) {
    return (
      <div className="container-page py-24 text-center">
        <p className="eyebrow mb-3">CART</p>
        <h1 className="text-3xl font-light tracking-[.16em] mb-6">YOUR CART IS EMPTY</h1>
        <Link href="/shop" className="btn-primary inline-block">CONTINUE SHOPPING</Link>
      </div>
    );
  }

  return (
    <div className="container-page py-12">
      <p className="eyebrow mb-3">CART</p>
      <h1 className="text-3xl font-light tracking-[.16em] mb-10">YOUR BAG</h1>
      <div className="grid grid-cols-1 md:grid-cols-[1fr_360px] gap-12">
        <div className="space-y-6">
          {items.map((i) => (
            <div key={`${i.product.id}-${i.size}-${i.color}`} className="flex gap-4 border-b border-[#d0cec7] pb-6">
              <div className="relative w-24 h-32 bg-[#eeebe5] flex-shrink-0">
                <Image src={i.product.images[0]} alt={i.product.name} fill className="object-cover" />
              </div>
              <div className="flex-1">
                <h3 className="text-[11px] tracking-[.18em]">{i.product.name}</h3>
                <p className="text-[10px] text-[#64615c] mt-1">{i.color} / SIZE {i.size}</p>
                <p className="mt-2">${i.product.sale_price ?? i.product.price}</p>
                <div className="flex items-center gap-3 mt-3">
                  <button onClick={() => setQty(i.product.id, i.size, i.color, i.quantity - 1)} className="w-8 h-8 border border-[#c9cbc0]">-</button>
                  <span>{i.quantity}</span>
                  <button onClick={() => setQty(i.product.id, i.size, i.color, i.quantity + 1)} className="w-8 h-8 border border-[#c9cbc0]">+</button>
                  <button onClick={() => remove(i.product.id, i.size, i.color)} className="ml-auto text-[#64615c]"><Trash2 size={16} /></button>
                </div>
              </div>
            </div>
          ))}
          <button onClick={clear} className="text-[10px] tracking-[.18em] text-[#64615c] underline">CLEAR CART</button>
        </div>
        <div className="bg-[#eeebe5] p-6 h-fit">
          <div className="eyebrow mb-4">ORDER SUMMARY</div>
          <div className="flex justify-between text-sm mb-2"><span>Subtotal</span><span>${sub.toFixed(2)}</span></div>
          <div className="flex justify-between text-sm mb-2"><span>Shipping</span><span>{ship === 0 ? "FREE" : `$${ship.toFixed(2)}`}</span></div>
          <div className="flex justify-between font-semibold mt-4 pt-4 border-t border-[#d0cec7]"><span>Total</span><span>${total.toFixed(2)}</span></div>
          <Link href="/checkout" className="btn-primary w-full block text-center mt-6">CHECKOUT</Link>
        </div>
      </div>
    </div>
  );
}
