import Link from "next/link";

export default async function CheckoutSuccessPage({ searchParams }: { searchParams: Promise<{ order?: string }> }) {
  const { order } = await searchParams;
  return (
    <div className="container-page py-24 text-center">
      <p className="eyebrow mb-3">ORDER CONFIRMED</p>
      <h1 className="text-3xl font-light tracking-[.16em] mb-4">THANK YOU</h1>
      <p className="text-[#64615c] mb-2">Your order has been placed successfully.</p>
      {order && <p className="text-[10px] tracking-[.18em] text-[#64615c] mb-8">ORDER #{order}</p>}
      <Link href="/shop" className="btn-primary inline-block">CONTINUE SHOPPING</Link>
    </div>
  );
}
