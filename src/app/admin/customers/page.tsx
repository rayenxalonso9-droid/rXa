"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<any[]>([]);

  async function load() {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return;
    const sb = createClient();
    const { data } = await sb.from("customers").select("*").order("created_at", { ascending: false });
    if (data) setCustomers(data);
  }
  useEffect(() => { load(); }, []);

  return (
    <div>
      <p className="eyebrow mb-3">CUSTOMERS</p>
      <h1 className="text-3xl font-light tracking-[.16em] mb-8">CUSTOMERS</h1>
      <div className="bg-white border border-[#d0cec7] overflow-auto">
        <table className="w-full text-sm">
          <thead className="text-[10px] tracking-[.18em] text-[#64615c]"><tr><th className="text-left p-4">NAME</th><th className="text-left p-4">EMAIL</th><th className="text-left p-4">PHONE</th><th className="text-left p-4">JOINED</th></tr></thead>
          <tbody>
            {customers.map((c) => (
              <tr key={c.id} className="border-t border-[#eeebe5]">
                <td className="p-4">{c.full_name}</td>
                <td className="p-4">{c.email}</td>
                <td className="p-4">{c.phone}</td>
                <td className="p-4">{new Date(c.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
            {customers.length === 0 && <tr><td colSpan={4} className="p-4 text-[#64615c]">No customers.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
