"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart, cartSubtotal, cartShipping, cartTotal } from "@/lib/cart-store";
import { createClient } from "@/lib/supabase/client";

export default function CheckoutPage() {
  const items = useCart((s) => s.items);
  const clear = useCart((s) => s.clear);
  const router = useRouter();
  const [form, setForm] = useState({ fullName: "", email: "", phone: "", address: "", city: "", zip: "", country: "United States", payment: "card" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sub = cartSubtotal(items);
  const ship = cartShipping(sub);
  const total = cartTotal(items);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (items.length === 0) return;
    setLoading(true);
    setError(null);
    try {
      const supabase = createClient();
      const { data: userData } = await supabase.auth.getUser();
      const userId = userData.user?.id ?? null;

      // create customer record if authed
      let customerId: string | null = null;
      if (userId) {
        const { data: c } = await supabase.from("customers").upsert({ id: userId, full_name: form.fullName, email: form.email, phone: form.phone }, { onConflict: "id" }).select().single();
        customerId = c?.id ?? null;
      }

      const shippingAddress = `${form.fullName}, ${form.address}, ${form.city} ${form.zip}, ${form.country}`;
      const { data: order, error: oErr } = await supabase.from("orders").insert({
        customer_id: customerId,
        total_amount: total,
        shipping_address: shippingAddress,
        payment_method: form.payment,
        payment_status: "pending",
        order_status: "pending",
      }).select().single();
      if (oErr) throw oErr;

      const orderItems = items.map((i) => ({
        order_id: order.id,
        product_id: i.product.id,
        product_name: i.product.name,
        size: i.size,
        color: i.color,
        quantity: i.quantity,
        unit_price: i.product.sale_price ?? i.product.price,
      }));
      const { error: iErr } = await supabase.from("order_items").insert(orderItems);
      if (iErr) throw iErr;

      clear();
      router.push(`/checkout/success?order=${order.id}`);
    } catch (err: any) {
      // Demo mode: simulate success
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
        clear();
        router.push("/checkout/success");
        return;
      }
      setError(err?.message ?? "Checkout failed");
    } finally {
      setLoading(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="container-page py-24 text-center">
        <h1 className="text-3xl font-light tracking-[.16em] mb-6">NOTHING TO CHECKOUT</h1>
        <Link href="/shop" className="btn-primary inline-block">SHOP NOW</Link>
      </div>
    );
  }

  return (
    <div className="container-page py-12">
      <p className="eyebrow mb-3">CHECKOUT</p>
      <h1 className="text-3xl font-light tracking-[.16em] mb-10">COMPLETE YOUR ORDER</h1>
      <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-[1fr_360px] gap-12">
        <div className="space-y-8">
          <div>
            <div className="eyebrow mb-4">CONTACT INFORMATION</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input required placeholder="Full name" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} className="bg-transparent border-b border-[#c9cbc0] py-3 text-sm focus:outline-none focus:border-[#20211f]" />
              <input required type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="bg-transparent border-b border-[#c9cbc0] py-3 text-sm focus:outline-none focus:border-[#20211f]" />
              <input placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="bg-transparent border-b border-[#c9cbc0] py-3 text-sm focus:outline-none focus:border-[#20211f]" />
            </div>
          </div>
          <div>
            <div className="eyebrow mb-4">SHIPPING ADDRESS</div>
            <div className="grid grid-cols-1 gap-4">
              <input required placeholder="Street address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="bg-transparent border-b border-[#c9cbc0] py-3 text-sm focus:outline-none focus:border-[#20211f]" />
              <div className="grid grid-cols-2 gap-4">
                <input required placeholder="City" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="bg-transparent border-b border-[#c9cbc0] py-3 text-sm focus:outline-none focus:border-[#20211f]" />
                <input required placeholder="ZIP / Postal" value={form.zip} onChange={(e) => setForm({ ...form, zip: e.target.value })} className="bg-transparent border-b border-[#c9cbc0] py-3 text-sm focus:outline-none focus:border-[#20211f]" />
              </div>
              <input placeholder="Country" value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} className="bg-transparent border-b border-[#c9cbc0] py-3 text-sm focus:outline-none focus:border-[#20211f]" />
            </div>
          </div>
          <div>
            <div className="eyebrow mb-4">PAYMENT METHOD</div>
            <div className="space-y-2">
              {["card", "paypal", "bank"].map((m) => (
                <label key={m} className="flex items-center gap-3 text-sm">
                  <input type="radio" name="payment" value={m} checked={form.payment === m} onChange={(e) => setForm({ ...form, payment: e.target.value })} />
                  <span className="tracking-[.18em] text-[11px]">{m.toUpperCase()}</span>
                </label>
              ))}
            </div>
          </div>
          {error && <p className="text-red-700 text-sm">{error}</p>}
        </div>
        <div className="bg-[#eeebe5] p-6 h-fit">
          <div className="eyebrow mb-4">ORDER SUMMARY</div>
          {items.map((i) => (
            <div key={`${i.product.id}-${i.size}-${i.color}`} className="flex justify-between text-xs mb-2">
              <span className="truncate">{i.product.name} × {i.quantity}</span>
              <span>${((i.product.sale_price ?? i.product.price) * i.quantity).toFixed(2)}</span>
            </div>
          ))}
          <div className="flex justify-between text-sm mt-4 pt-4 border-t border-[#d0cec7]"><span>Subtotal</span><span>${sub.toFixed(2)}</span></div>
          <div className="flex justify-between text-sm mb-2"><span>Shipping</span><span>{ship === 0 ? "FREE" : `$${ship.toFixed(2)}`}</span></div>
          <div className="flex justify-between font-semibold mt-4 pt-4 border-t border-[#d0cec7]"><span>Total</span><span>${total.toFixed(2)}</span></div>
          <button type="submit" disabled={loading} className="btn-primary w-full mt-6">{loading ? "PROCESSING..." : "PLACE ORDER"}</button>
        </div>
      </form>
    </div>
  );
}
