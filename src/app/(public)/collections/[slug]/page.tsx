import { notFound } from "next/navigation";
import Link from "next/link";
import { getCollectionBySlug, getProducts } from "@/lib/data";
import { ProductCard } from "@/components/product/ProductCard";
import Image from "next/image";

export default async function CollectionDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const collection = await getCollectionBySlug(slug);
  if (!collection) notFound();
  const products = await getProducts({ collection: collection.id });
  return (
    <div>
      <section className="relative h-[50vh] overflow-hidden">
        <Image src={collection.banner_url ?? "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1600&q=80"} alt={collection.name} fill className="object-cover" />
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
          <p className="eyebrow text-white/80 mb-3">COLLECTION</p>
          <h1 className="text-5xl font-light tracking-[.16em]">{collection.name.toUpperCase()}</h1>
          {collection.description && <p className="mt-4 max-w-xl text-center text-sm text-white/80">{collection.description}</p>}
        </div>
      </section>
      <div className="container-page py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {products.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </div>
    </div>
  );
}
