export const dynamic = "force-dynamic";
import { getProducts } from "@/lib/data";
import Link from "next/link";
import Image from "next/image";
import { ProductCard } from "@/components/product/ProductCard";
import { NewsletterForm } from "@/components/product/NewsletterForm";

export default async function Home() {
  const featured = await getProducts({ featured: true, limit: 4 });
  const bestsellers = await getProducts({ bestseller: true, limit: 4 });
  const newest = await getProducts({ limit: 8 });

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden" style={{ background: "radial-gradient(ellipse at 17% 6%, #b9b6ad 0%, #d2cfc7 33%, #e2dfd8 61%, #eeece7 100%)", minHeight: "90vh" }}>
        <div className="container-page pt-24 pb-16 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="fade-in">
            <p className="eyebrow mb-6">rXa™ / COLLECTION 01</p>
            <h1 className="text-5xl md:text-7xl font-light tracking-[.12em] leading-[1.1] mb-8">A STUDY IN<br/><span style={{ color: "var(--accent)" }}>VOLUME</span> AND<br/>QUIET STRUCTURE.</h1>
            <p className="text-[#64615c] max-w-md leading-relaxed mb-10">Premium clothing shaped by proportion. Considered silhouettes, natural fabrics, and the space between body and cloth.</p>
            <div className="flex gap-4">
              <Link href="/shop" className="btn-primary">SHOP THE COLLECTION</Link>
              <Link href="/collections" className="btn-ghost">EXPLORE</Link>
            </div>
          </div>
          <div className="relative aspect-[3/4] hidden md:block">
            <Image src={featured[0]?.images[0] ?? "/next.svg"} alt="rXa™" fill className="object-cover" priority />
          </div>
        </div>
      </section>

      {/* Featured */}
      <section className="container-page py-24">
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="eyebrow mb-3">SELECTED</p>
            <h2 className="text-3xl font-light tracking-[.16em]">FEATURED PIECES</h2>
          </div>
          <Link href="/shop" className="text-[11px] tracking-[.18em] border-b border-[#20211f] pb-1">VIEW ALL</Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* Bestsellers */}
      <section className="container-page py-12">
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="eyebrow mb-3">MOST LOVED</p>
            <h2 className="text-3xl font-light tracking-[.16em]">BEST SELLERS</h2>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {bestsellers.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* Newsletter */}
      <section className="bg-[#eeebe5] py-20 mt-12">
        <div className="container-page text-center max-w-xl mx-auto">
          <p className="eyebrow mb-3">STAY IN TOUCH</p>
          <h2 className="text-3xl font-light tracking-[.16em] mb-6">JOIN THE rXa™ LIST</h2>
          <p className="text-[#64615c] mb-8 text-sm leading-relaxed">Receive new arrivals, collection notes and exclusive previews.</p>
          <NewsletterForm />
        </div>
      </section>
    </div>
  );
}
