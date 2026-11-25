"use client";
import Image from "next/image";
import { useState } from "react";
import { useCart } from "@/lib/cart-store";
import type { Product } from "@/lib/types";

export function ProductDetailClient({ product }: { product: Product }) {
  const [imgIdx, setImgIdx] = useState(0);
  const [size, setSize] = useState<string | null>(product.available_sizes[0] ?? null);
  const [color, setColor] = useState<string | null>(product.available_colors[0] ?? null);
  const [qty, setQty] = useState(1);
  const add = useCart((s) => s.add);

  const price = product.sale_price ?? product.price;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
      <div>
        <div className="relative aspect-[3/4] bg-[#eeebe5] overflow-hidden">
          <Image src={product.images[imgIdx]} alt={product.name} fill className="object-cover" priority />
        </div>
        <div className="grid grid-cols-4 gap-3 mt-4">
          {product.images.map((src, i) => (
            <button key={i} onClick={() => setImgIdx(i)} className={`relative aspect-square bg-[#eeebe5] overflow-hidden border ${i === imgIdx ? "border-[#20211f]" : "border-transparent"}`}>
              <Image src={src} alt="" fill className="object-cover" />
            </button>
          ))}
        </div>
      </div>
      <div>
        <p className="eyebrow mb-3">{product.category?.name ?? "rXa™"}</p>
        <h1 className="text-3xl font-light tracking-[.16em] mb-4">{product.name}</h1>
        <div className="flex items-center gap-4 mb-6">
          <span className="text-2xl">${price}</span>
          {product.sale_price && <span className="text-[#64615c] line-through">${product.price}</span>}
        </div>
        <p className="text-[#64615c] leading-relaxed mb-8">{product.description}</p>

        {product.available_colors.length > 0 && (
          <div className="mb-6">
            <div className="eyebrow mb-3">COLOR — {color}</div>
            <div className="flex flex-wrap gap-2">
              {product.available_colors.map((c) => (
                <button key={c} onClick={() => setColor(c)} className={`px-4 py-2 text-[10px] tracking-[.18em] border ${color === c ? "border-[#20211f] bg-[#20211f] text-[#eeebe5]" : "border-[#c9cbc0]"}`}>{c}</button>
              ))}
            </div>
          </div>
        )}

        {product.available_sizes.length > 0 && (
          <div className="mb-6">
            <div className="eyebrow mb-3">SIZE — {size}</div>
            <div className="flex flex-wrap gap-2">
              {product.available_sizes.map((s) => (
                <button key={s} onClick={() => setSize(s)} className={`w-12 h-12 text-[11px] tracking-[.18em] border ${size === s ? "border-[#20211f] bg-[#20211f] text-[#eeebe5]" : "border-[#c9cbc0]"}`}>{s}</button>
              ))}
            </div>
          </div>
        )}

        <div className="mb-6">
          <div className="eyebrow mb-3">QUANTITY</div>
          <div className="flex items-center gap-3">
            <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-10 h-10 border border-[#c9cbc0]">-</button>
            <span className="w-10 text-center">{qty}</span>
            <button onClick={() => setQty(qty + 1)} className="w-10 h-10 border border-[#c9cbc0]">+</button>
          </div>
        </div>

        <div className="text-[11px] tracking-[.18em] mb-8">
          {product.stock_quantity > 0 ? (
            <span className="text-[#64615c]">IN STOCK — {product.stock_quantity} AVAILABLE</span>
          ) : (
            <span className="text-red-700">OUT OF STOCK</span>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button onClick={() => add(product, qty, size, color)} disabled={product.stock_quantity === 0} className="btn-primary flex-1">ADD TO CART</button>
          <button onClick={() => { add(product, qty, size, color); window.location.href = "/checkout"; }} disabled={product.stock_quantity === 0} className="btn-ghost flex-1">BUY NOW</button>
        </div>

        <div className="mt-10 border-t border-[#d0cec7] pt-6 text-sm text-[#64615c] space-y-2">
          <p>MATERIAL — {product.available_colors.join(" / ")}</p>
          <p>SHIPPING — Complimentary over $500</p>
          <p>RETURNS — 14 days</p>
        </div>
      </div>
    </div>
  );
}
