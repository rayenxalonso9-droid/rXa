import Link from "next/link";
import Image from "next/image";
import type { Product } from "@/lib/types";

export function ProductCard({ product }: { product: Product }) {
  const price = product.sale_price ?? product.price;
  return (
    <Link href={`/products/${product.slug}`} className="product-card group block">
      <div className="relative aspect-[3/4] bg-[#eeebe5] overflow-hidden">
        <Image src={product.images[0]} alt={product.name} fill className="object-cover" sizes="(max-width:768px) 50vw, 25vw" />
        {product.sale_price && (
          <span className="absolute top-3 left-3 badge badge--solid">SALE</span>
        )}
      </div>
      <div className="mt-4">
        <h3 className="text-[11px] tracking-[.18em] font-normal">{product.name}</h3>
        <div className="flex items-center gap-3 mt-2 text-[12px]">
          <span className="group-hover:text-[var(--accent-dark)] transition-colors">${price}</span>
          {product.sale_price && <span className="text-[#64615c] line-through text-[11px]">${product.price}</span>}
          <span className="ml-auto text-[10px] tracking-[.18em] text-[var(--accent)] opacity-0 group-hover:opacity-100 transition-opacity">VIEW →</span>
        </div>
      </div>
    </Link>
  );
}
