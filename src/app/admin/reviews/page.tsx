"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<any[]>([]);

  async function load() {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return;
    const sb = createClient();
    const { data } = await sb.from("reviews").select("*, customers(full_name), products(name)").order("created_at", { ascending: false });
    if (data) setReviews(data);
  }
  useEffect(() => { load(); }, []);

  async function remove(id: string) {
    if (!confirm("Delete review?")) return;
    const sb = createClient();
    await sb.from("reviews").delete().eq("id", id);
    load();
  }

  return (
    <div>
      <p className="eyebrow mb-3">REVIEWS</p>
      <h1 className="text-3xl font-light tracking-[.16em] mb-8">MANAGE REVIEWS</h1>
      <div className="bg-white border border-[#d0cec7] overflow-auto">
        <table className="w-full text-sm">
          <thead className="text-[10px] tracking-[.18em] text-[#64615c]"><tr><th className="text-left p-4">PRODUCT</th><th className="text-left p-4">AUTHOR</th><th className="text-left p-4">RATING</th><th className="text-left p-4">COMMENT</th><th className="text-right p-4">ACTIONS</th></tr></thead>
          <tbody>
            {reviews.map((r) => (
              <tr key={r.id} className="border-t border-[#eeebe5]">
                <td className="p-4">{r.products?.name}</td>
                <td className="p-4">{r.customers?.full_name}</td>
                <td className="p-4">{r.rating}/5</td>
                <td className="p-4 max-w-xs truncate">{r.comment}</td>
                <td className="p-4 text-right"><button onClick={() => remove(r.id)} className="text-red-700">Delete</button></td>
              </tr>
            ))}
            {reviews.length === 0 && <tr><td colSpan={5} className="p-4 text-[#64615c]">No reviews.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
