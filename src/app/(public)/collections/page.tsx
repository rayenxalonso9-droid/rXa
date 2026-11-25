export const dynamic = "force-dynamic";
import Link from "next/link";
import { getCollections, getProducts } from "@/lib/data";
import Image from "next/image";

export default async function CollectionsPage() {
  const collections = await getCollections();
  return (
    <div className="container-page py-12">
      <p className="eyebrow mb-3">COLLECTIONS</p>
      <h1 className="text-4xl font-light tracking-[.16em] mb-12">ALL COLLECTIONS</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {collections.map((c) => (
          <Link key={c.id} href={`/collections/${c.slug}`} className="group block">
            <div className="relative aspect-[16/9] bg-[#eeebe5] overflow-hidden">
              <Image src={c.banner_url ?? "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=80"} alt={c.name} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
            </div>
            <h2 className="mt-4 text-xl font-light tracking-[.16em]">{c.name}</h2>
            <p className="text-[#64615c] text-sm mt-2">{c.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
