export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getOrdersForUser } from "@/lib/data";
import Link from "next/link";
import { LogOut } from "lucide-react";

export default async function AccountPage() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    // Demo mode
    return (
      <div className="container-page py-12">
        <p className="eyebrow mb-3">ACCOUNT</p>
        <h1 className="text-3xl font-light tracking-[.16em] mb-4">DEMO MODE</h1>
        <p className="text-[#64615c] text-sm">Connect Supabase to enable accounts. <Link href="/account/login" className="underline">Go to login</Link>.</p>
      </div>
    );
  }
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/account/login");

  const orders = await getOrdersForUser(user.id);
  const fullName = user.user_metadata?.full_name ?? user.email;

  async function signOut() {
    "use server";
    const sb = await createClient();
    await sb.auth.signOut();
  }

  return (
    <div className="container-page py-12">
      <p className="eyebrow mb-3">ACCOUNT</p>
      <h1 className="text-3xl font-light tracking-[.16em] mb-2">WELCOME, {String(fullName).toUpperCase()}</h1>
      <p className="text-[#64615c] text-sm mb-10">{user.email}</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-[#eeebe5] p-6">
          <div className="eyebrow mb-2">ORDERS</div>
          <div className="text-3xl font-light">{orders.length}</div>
        </div>
        <div className="bg-[#eeebe5] p-6">
          <div className="eyebrow mb-2">TOTAL SPENT</div>
          <div className="text-3xl font-light">${orders.reduce((s, o) => s + o.total_amount, 0).toFixed(2)}</div>
        </div>
        <div className="bg-[#eeebe5] p-6 flex items-center justify-between">
          <div>
            <div className="eyebrow mb-2">SESSION</div>
            <div className="text-sm">Signed in</div>
          </div>
          <form action={signOut}>
            <button type="submit" className="btn-ghost"><LogOut size={16} /></button>
          </form>
        </div>
      </div>

      <h2 className="text-xl font-light tracking-[.16em] mb-6">ORDER HISTORY</h2>
      {orders.length === 0 ? (
        <p className="text-[#64615c] text-sm">No orders yet.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((o) => (
            <div key={o.id} className="border border-[#d0cec7] p-6">
              <div className="flex justify-between items-center mb-3">
                <span className="text-[11px] tracking-[.18em]">ORDER #{o.id.slice(0, 8).toUpperCase()}</span>
                <span className="text-[10px] tracking-[.18em] text-[#64615c]">{new Date(o.created_at).toLocaleDateString()}</span>
              </div>
              <div className="text-sm mb-2">{o.items?.length ?? 0} item(s) — ${o.total_amount.toFixed(2)}</div>
              <div className="text-[10px] tracking-[.18em] text-[#64615c]">STATUS: {o.order_status.toUpperCase()} / PAYMENT: {o.payment_status.toUpperCase()}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
