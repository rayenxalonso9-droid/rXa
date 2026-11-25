import { getProducts } from "@/lib/data";
import { sampleProducts } from "@/lib/sample-data";

export default async function AdminOverview() {
  const products = await getProducts();
  const totalProducts = products.length;
  const featured = products.filter((p) => p.featured).length;
  const lowStock = products.filter((p) => p.stock_quantity <= 3).length;

  const stats = [
    { label: "TOTAL PRODUCTS", value: totalProducts },
    { label: "FEATURED", value: featured },
    { label: "LOW STOCK", value: lowStock },
    { label: "COLLECTIONS", value: 1 },
  ];

  return (
    <div>
      <p className="eyebrow mb-3">OVERVIEW</p>
      <h1 className="text-3xl font-light tracking-[.16em] mb-8">DASHBOARD</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
        {stats.map((s) => (
          <div key={s.label} className="bg-white border border-[#d0cec7] p-6">
            <div className="eyebrow mb-2">{s.label}</div>
            <div className="text-3xl font-light">{s.value}</div>
          </div>
        ))}
      </div>
      <div className="bg-white border border-[#d0cec7] p-6">
        <div className="eyebrow mb-4">RECENT PRODUCTS</div>
        <table className="w-full text-sm">
          <thead className="text-[10px] tracking-[.18em] text-[#64615c]">
            <tr><th className="text-left pb-3">NAME</th><th className="text-left pb-3">PRICE</th><th className="text-left pb-3">STOCK</th><th className="text-left pb-3">STATUS</th></tr>
          </thead>
          <tbody>
            {products.slice(0, 8).map((p) => (
              <tr key={p.id} className="border-t border-[#eeebe5]">
                <td className="py-3">{p.name}</td>
                <td className="py-3">${p.sale_price ?? p.price}</td>
                <td className="py-3">{p.stock_quantity}</td>
                <td className="py-3">{p.status.toUpperCase()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
