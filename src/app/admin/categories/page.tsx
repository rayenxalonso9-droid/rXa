"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { sampleCategories } from "@/lib/sample-data";
import type { Category } from "@/lib/types";
import { Plus, Trash2 } from "lucide-react";

export default function AdminCategoriesPage() {
  const [items, setItems] = useState<Category[]>(sampleCategories);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");

  async function load() {
    if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
      const sb = createClient();
      const { data } = await sb.from("categories").select("*").order("name");
      if (data) setItems(data as any);
    }
  }
  useEffect(() => { load(); }, []);

  async function add() {
    if (!name) return;
    const sb = createClient();
    await sb.from("categories").insert({ name, slug: slug || name.toLowerCase().replace(/\s+/g, "-") });
    setName(""); setSlug("");
    load();
  }
  async function remove(id: string) {
    if (!confirm("Delete?")) return;
    const sb = createClient();
    await sb.from("categories").delete().eq("id", id);
    load();
  }

  return (
    <div>
      <p className="eyebrow mb-3">CATEGORIES</p>
      <h1 className="text-3xl font-light tracking-[.16em] mb-8">MANAGE CATEGORIES</h1>
      <div className="flex gap-3 mb-8">
        <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} className="bg-transparent border-b border-[#c9cbc0] py-2 text-sm focus:outline-none" />
        <input placeholder="Slug" value={slug} onChange={(e) => setSlug(e.target.value)} className="bg-transparent border-b border-[#c9cbc0] py-2 text-sm focus:outline-none" />
        <button onClick={add} className="btn-primary flex items-center gap-2"><Plus size={14} /> ADD</button>
      </div>
      <div className="bg-white border border-[#d0cec7]">
        <table className="w-full text-sm">
          <thead className="text-[10px] tracking-[.18em] text-[#64615c]"><tr><th className="text-left p-4">NAME</th><th className="text-left p-4">SLUG</th><th className="text-right p-4">ACTIONS</th></tr></thead>
          <tbody>
            {items.map((c) => (
              <tr key={c.id} className="border-t border-[#eeebe5]">
                <td className="p-4">{c.name}</td>
                <td className="p-4">{c.slug}</td>
                <td className="p-4 text-right"><button onClick={() => remove(c.id)} className="text-red-700"><Trash2 size={14} /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
