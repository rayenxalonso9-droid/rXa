"use client";
import { useEffect, useState } from "react";
import { getProducts } from "@/lib/data";
// client-side: use sample data + supabase client
import { sampleProducts } from "@/lib/sample-data";
import { createClient } from "@/lib/supabase/client";
import type { Product } from "@/lib/types";
import { Plus, Pencil, Trash2 } from "lucide-react";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>(sampleProducts);
  const [editing, setEditing] = useState<Product | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<Partial<Product>>({ name: "", slug: "", description: "", price: 0, stock_quantity: 0, status: "active", featured: false, bestseller: false, available_sizes: ["1", "2", "3"], available_colors: [], images: [] });

  async function load() {
    const hasSb = !!process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (hasSb) {
      const sb = createClient();
      const { data } = await sb.from("products").select("*").order("created_at", { ascending: false });
      if (data) setProducts(data as any);
    } else {
      setProducts(sampleProducts);
    }
  }

  useEffect(() => { load(); }, []);

  async function save() {
    const sb = createClient();
    const payload = {
      name: form.name,
      slug: form.slug || form.name?.toLowerCase().replace(/\s+/g, "-"),
      description: form.description,
      price: Number(form.price),
      sale_price: form.sale_price ? Number(form.sale_price) : null,
      stock_quantity: Number(form.stock_quantity),
      status: form.status,
      featured: !!form.featured,
      bestseller: !!form.bestseller,
      available_sizes: form.available_sizes,
      available_colors: form.available_colors,
      images: form.images,
    };
    if (editing) {
      await sb.from("products").update(payload).eq("id", editing.id);
    } else {
      await sb.from("products").insert(payload);
    }
    setShowForm(false);
    setEditing(null);
    load();
  }

  async function remove(id: string) {
    if (!confirm("Delete this product?")) return;
    const sb = createClient();
    await sb.from("products").delete().eq("id", id);
    load();
  }

  function startEdit(p: Product) {
    setEditing(p);
    setForm(p);
    setShowForm(true);
  }

  function startNew() {
    setEditing(null);
    setForm({ name: "", slug: "", description: "", price: 0, stock_quantity: 0, status: "active", featured: false, bestseller: false, available_sizes: ["1", "2", "3"], available_colors: [], images: [], sale_price: null });
    setShowForm(true);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="eyebrow mb-3">PRODUCTS</p>
          <h1 className="text-3xl font-light tracking-[.16em]">MANAGE PRODUCTS</h1>
        </div>
        <button onClick={startNew} className="btn-primary flex items-center gap-2"><Plus size={14} /> NEW PRODUCT</button>
      </div>

      {showForm && (
        <div className="bg-white border border-[#d0cec7] p-6 mb-8">
          <h2 className="text-lg font-light tracking-[.16em] mb-4">{editing ? "EDIT PRODUCT" : "NEW PRODUCT"}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input placeholder="Name" value={form.name ?? ""} onChange={(e) => setForm({ ...form, name: e.target.value })} className="bg-transparent border-b border-[#c9cbc0] py-2 text-sm focus:outline-none" />
            <input placeholder="Slug" value={form.slug ?? ""} onChange={(e) => setForm({ ...form, slug: e.target.value })} className="bg-transparent border-b border-[#c9cbc0] py-2 text-sm focus:outline-none" />
            <input type="number" placeholder="Price" value={form.price ?? 0} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} className="bg-transparent border-b border-[#c9cbc0] py-2 text-sm focus:outline-none" />
            <input type="number" placeholder="Sale price" value={form.sale_price ?? ""} onChange={(e) => setForm({ ...form, sale_price: e.target.value ? Number(e.target.value) : null })} className="bg-transparent border-b border-[#c9cbc0] py-2 text-sm focus:outline-none" />
            <input type="number" placeholder="Stock" value={form.stock_quantity ?? 0} onChange={(e) => setForm({ ...form, stock_quantity: Number(e.target.value) })} className="bg-transparent border-b border-[#c9cbc0] py-2 text-sm focus:outline-none" />
            <input placeholder="Images (comma separated URLs)" value={(form.images ?? []).join(", ")} onChange={(e) => setForm({ ...form, images: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) })} className="bg-transparent border-b border-[#c9cbc0] py-2 text-sm focus:outline-none" />
            <input type="file" accept="image/*" multiple onChange={async (e) => {
              const files = Array.from(e.target.files ?? []);
              if (!files.length) return;
              const sb = createClient();
              const urls: string[] = [...(form.images ?? [])];
              for (const f of files) {
                const path = `products/${Date.now()}-${f.name}`;
                const { error } = await sb.storage.from("product-images").upload(path, f);
                if (!error) {
                  const { data } = sb.storage.from("product-images").getPublicUrl(path);
                  urls.push(data.publicUrl);
                }
              }
              setForm({ ...form, images: urls });
            }} className="text-sm" />
            <input placeholder="Colors (comma separated)" value={(form.available_colors ?? []).join(", ")} onChange={(e) => setForm({ ...form, available_colors: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) })} className="bg-transparent border-b border-[#c9cbc0] py-2 text-sm focus:outline-none" />
            <select value={form.status ?? "active"} onChange={(e) => setForm({ ...form, status: e.target.value as any })} className="bg-transparent border border-[#c9cbc0] py-2 px-2 text-sm">
              <option value="active">Active</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>
            <textarea placeholder="Description" value={form.description ?? ""} onChange={(e) => setForm({ ...form, description: e.target.value })} className="md:col-span-2 bg-transparent border border-[#c9cbc0] py-2 px-2 text-sm" rows={3} />
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={!!form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} /> Featured</label>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={!!form.bestseller} onChange={(e) => setForm({ ...form, bestseller: e.target.checked })} /> Bestseller</label>
          </div>
          <div className="flex gap-3 mt-4">
            <button onClick={save} className="btn-primary">SAVE</button>
            <button onClick={() => { setShowForm(false); setEditing(null); }} className="btn-ghost">CANCEL</button>
          </div>
        </div>
      )}

      <div className="bg-white border border-[#d0cec7] overflow-auto">
        <table className="w-full text-sm">
          <thead className="text-[10px] tracking-[.18em] text-[#64615c]">
            <tr><th className="text-left p-4">NAME</th><th className="text-left p-4">PRICE</th><th className="text-left p-4">STOCK</th><th className="text-left p-4">STATUS</th><th className="text-right p-4">ACTIONS</th></tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-t border-[#eeebe5]">
                <td className="p-4">{p.name}</td>
                <td className="p-4">${p.sale_price ?? p.price}</td>
                <td className="p-4">{p.stock_quantity}</td>
                <td className="p-4">{p.status}</td>
                <td className="p-4 text-right space-x-2">
                  <button onClick={() => startEdit(p)} className="text-[#64615c]"><Pencil size={14} /></button>
                  <button onClick={() => remove(p.id)} className="text-red-700"><Trash2 size={14} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
