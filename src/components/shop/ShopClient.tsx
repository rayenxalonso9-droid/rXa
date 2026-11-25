"use client";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ProductCard } from "@/components/product/ProductCard";
import { sampleProducts, sampleCategories } from "@/lib/sample-data";
import type { Product } from "@/lib/types";

export function ShopClient() {
  const params = useSearchParams();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>(sampleProducts);
  const [loading, setLoading] = useState(false);

  const q = params.get("q") ?? "";
  const category = params.get("category") ?? "";
  const sort = params.get("sort") ?? "newest";
  const minPrice = params.get("min") ?? "";
  const maxPrice = params.get("max") ?? "";

  useEffect(() => {
    setLoading(true);
    let list = [...sampleProducts];
    if (q) {
      const qq = q.toLowerCase();
      list = list.filter((p) => p.name.toLowerCase().includes(qq) || p.description.toLowerCase().includes(qq));
    }
    if (category) list = list.filter((p) => p.category_id === category);
    if (minPrice) list = list.filter((p) => (p.sale_price ?? p.price) >= Number(minPrice));
    if (maxPrice) list = list.filter((p) => (p.sale_price ?? p.price) <= Number(maxPrice));
    if (sort === "price-asc") list.sort((a, b) => (a.sale_price ?? a.price) - (b.sale_price ?? b.price));
    if (sort === "price-desc") list.sort((a, b) => (b.sale_price ?? b.price) - (a.sale_price ?? a.price));
    if (sort === "newest") list.sort((a, b) => +new Date(b.created_at) - +new Date(a.created_at));
    setProducts(list);
    setLoading(false);
  }, [q, category, sort, minPrice, maxPrice]);

  function updateParam(key: string, value: string) {
    const sp = new URLSearchParams(params.toString());
    if (value) sp.set(key, value); else sp.delete(key);
    router.push(`/shop?${sp.toString()}`);
  }

  return (
    <div className="container-page py-12">
      <div className="mb-10">
        <p className="eyebrow mb-3">SHOP</p>
        <h1 className="text-4xl font-light tracking-[.16em]">ALL PRODUCTS</h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-[260px_1fr] gap-10">
        <aside className="space-y-8">
          <div>
            <div className="eyebrow mb-3">SEARCH</div>
            <input value={q} onChange={(e) => updateParam("q", e.target.value)} placeholder="Search..." className="w-full bg-transparent border-b border-[#c9cbc0] py-2 text-sm focus:outline-none focus:border-[#20211f]" />
          </div>
          <div>
            <div className="eyebrow mb-3">CATEGORY</div>
            <div className="space-y-2">
              <button onClick={() => updateParam("category", "")} className={`block text-sm ${!category ? "font-semibold" : ""}`}>All</button>
              {sampleCategories.map((c) => (
                <button key={c.id} onClick={() => updateParam("category", c.id)} className={`block text-sm ${category === c.id ? "font-semibold" : ""}`}>{c.name}</button>
              ))}
            </div>
          </div>
          <div>
            <div className="eyebrow mb-3">PRICE</div>
            <div className="flex gap-2">
              <input type="number" placeholder="Min" value={minPrice} onChange={(e) => updateParam("min", e.target.value)} className="w-full bg-transparent border-b border-[#c9cbc0] py-2 text-sm focus:outline-none" />
              <input type="number" placeholder="Max" value={maxPrice} onChange={(e) => updateParam("max", e.target.value)} className="w-full bg-transparent border-b border-[#c9cbc0] py-2 text-sm focus:outline-none" />
            </div>
          </div>
          <div>
            <div className="eyebrow mb-3">SORT</div>
            <select value={sort} onChange={(e) => updateParam("sort", e.target.value)} className="w-full bg-transparent border border-[#c9cbc0] py-2 px-2 text-sm">
              <option value="newest">Newest</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </aside>
        <div>
          {loading ? (
            <p className="text-sm tracking-[.18em]">LOADING...</p>
          ) : products.length === 0 ? (
            <p className="text-sm tracking-[.18em]">NO PRODUCTS FOUND.</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {products.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
