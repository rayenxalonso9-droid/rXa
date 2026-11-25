"use client";
import Link from "next/link";
import { useCart } from "@/lib/cart-store";
import { ShoppingBag, Menu, X, Search, User } from "lucide-react";
import { useState } from "react";

export function Header() {
  const items = useCart((s) => s.items);
  const count = items.reduce((s, i) => s + i.quantity, 0);
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");

  return (
    <header className="sticky top-0 z-50 bg-[#e4e1da]/90 backdrop-blur border-b border-[#d0cec7]">
      <div className="container-page flex items-center justify-between h-16">
        <Link href="/" className="orzr-brand text-3xl tracking-[.05em] font-black">rXa™</Link>
        <nav className="hidden md:flex items-center gap-8 text-[11px] tracking-[.18em] site-nav">
          <Link href="/shop" className="hover:opacity-60">SHOP</Link>
          <Link href="/collections" className="hover:opacity-60">COLLECTIONS</Link>
          <Link href="/about" className="hover:opacity-60">ABOUT</Link>
          <Link href="/contact" className="hover:opacity-60">CONTACT</Link>
        </nav>
        <div className="flex items-center gap-5">
          <form action="/shop" className="hidden md:flex items-center gap-2">
            <input name="q" value={q} onChange={(e) => setQ(e.target.value)} placeholder="SEARCH" className="bg-transparent border-b border-[#c9cbc0] text-[10px] tracking-[.18em] w-28 focus:outline-none focus:border-[#20211f]" />
            <button type="submit" aria-label="search"><Search size={16} /></button>
          </form>
          <Link href="/account" aria-label="account"><User size={18} /></Link>
          <Link href="/cart" className="relative" aria-label="cart">
            <ShoppingBag size={18} />
            {count > 0 && <span className="absolute -top-2 -right-2 bg-[var(--accent)] text-white text-[9px] rounded-full w-4 h-4 flex items-center justify-center font-bold">{count}</span>}
          </Link>
          <button className="md:hidden" onClick={() => setOpen(!open)} aria-label="menu"><Menu size={20} /></button>
        </div>
      </div>
      {open && (
        <div className="md:hidden border-t border-[#d0cec7] bg-[#e4e1da]">
          <nav className="flex flex-col gap-4 p-6 text-[11px] tracking-[.18em]">
            <Link href="/shop" onClick={() => setOpen(false)}>SHOP</Link>
            <Link href="/collections" onClick={() => setOpen(false)}>COLLECTIONS</Link>
            <Link href="/about" onClick={() => setOpen(false)}>ABOUT</Link>
            <Link href="/contact" onClick={() => setOpen(false)}>CONTACT</Link>
          </nav>
        </div>
      )}
    </header>
  );
}
