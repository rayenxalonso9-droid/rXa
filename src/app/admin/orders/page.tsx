"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Order } from "@/lib/types";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);

  async function load() {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return;
    const sb = createClient();
    const { data } = await sb.from("orders").select("*, order_items(*)").order("created_at", { ascending: false });
    if (data) setOrders(data as any);
  }
  useEffect(() => { load(); }, []);

  async function updateStatus(id: string, status: string) {
    const sb = createClient();
    await sb.from("orders").update({ order_status: status }).eq("id", id);
    load();
  }

  return (
    <div>
      <p className="eyebrow mb-3">ORDERS</p>
      <h1 className="text-3xl font-light tracking-[.16em] mb-8">MANAGE ORDERS</h1>
      {!process.env.NEXT_PUBLIC_SUPABASE_URL && <p className="text-sm text-[#64615c] mb-4">Connect Supabase to view orders.</p>}
      <div className="bg-white border border-[#d0cec7] overflow-auto">
        <table className="w-full text-sm">
          <thead className="text-[10px] tracking-[.18em] text-[#64615c]">
            <tr><th className="text-left p-4">ORDER</th><th className="text-left p-4">TOTAL</th><th className="text-left p-4">STATUS</th><th className="text-left p-4">PAYMENT</th><th className="text-left p-4">DATE</th><th className="text-left p-4">UPDATE</th></tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} className="border-t border-[#eeebe5]">
                <td className="p-4">#{o.id.slice(0, 8).toUpperCase()}</td>
                <td className="p-4">${Number(o.total_amount).toFixed(2)}</td>
                <td className="p-4">{o.order_status}</td>
                <td className="p-4">{o.payment_status}</td>
                <td className="p-4">{new Date(o.created_at).toLocaleDateString()}</td>
                <td className="p-4">
                  <select value={o.order_status} onChange={(e) => updateStatus(o.id, e.target.value)} className="border border-[#c9cbc0] py-1 px-2 text-xs">
                    {["pending", "processing", "shipped", "delivered", "cancelled"].map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </td>
              </tr>
            ))}
            {orders.length === 0 && <tr><td colSpan={6} className="p-4 text-[#64615c]">No orders.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
