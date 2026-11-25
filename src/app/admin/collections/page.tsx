"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { sampleCollections } from "@/lib/sample-data";
import type { Collection } from "@/lib/types";
import { Plus, Trash2 } from "lucide-react";

export default function AdminCollectionsPage() {
  const [items, setItems] = useState<Collection[]>(sampleCollections);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  async function load() {
    if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
      const sb = createClient();
      const { data } = await sb.from("collections").select("*").order("name");
      if (data) setItems(data as any);
    }
  }
  useEffect(() => { load(); }, []);

  async function add() {
    if (!name) return;
    const sb = createClient();
    await sb.from("collections").insert({ name, slug: name.toLowerCase().replace(/\s+/g, "-"), description, status: "active" });
    setName(""); setDescription("");
    load();
  }
  async function remove(id: string) {
    if (!confirm("Delete?")) return;
    const sb = createClient();
    await sb.from("collections").delete().eq("id", id);
    load();
  }

  return (
    <div>
      <p className="eyebrow mb-3">COLLECTIONS</p>
      <h1 className="text-3xl font-light tracking-[.16em] mb-8">MANAGE COLLECTIONS</h1>
      <div className="flex gap-3 mb-8">
        <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} className="bg-transparent border-b border-[#c9cbc0] py-2 text-sm focus:outline-none" />
        <input placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} className="bg-transparent border-b border-[#c9cbc0] py-2 text-sm focus:outline-none flex-1" />
        <button onClick={add} className="btn-primary flex items-center gap-2"><Plus size={14} /> ADD</button>
      </div>
      <div className="bg-white border border-[#d0cec7]">
        <table className="w-full text-sm">
          <thead className="text-[10px] tracking-[.18em] text-[#64615c]"><tr><th className="text-left p-4">NAME</th><th className="text-left p-4">STATUS</th><th className="text-right p-4">ACTIONS</th></tr></thead>
          <tbody>
            {items.map((c) => (
              <tr key={c.id} className="border-t border-[#eeebe5]">
                <td className="p-4">{c.name}</td>
                <td className="p-4">{c.status}</td>
                <td className="p-4 text-right"><button onClick={() => remove(c.id)} className="text-red-700"><Trash2 size={14} /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
