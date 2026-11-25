export const dynamic = "force-dynamic";
import { notFound } from "next/navigation";
import { getProductBySlug, getProducts, getProductReviews } from "@/lib/data";
import { ProductDetailClient } from "@/components/product/ProductDetailClient";
import { ProductCard } from "@/components/product/ProductCard";
import { ReviewForm } from "@/components/product/ReviewForm";

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();
  const related = (await getProducts({ limit: 4 })).filter((p) => p.id !== product.id).slice(0, 4);
  const reviews = await getProductReviews(product.id);
  return (
    <div className="container-page py-12">
      <ProductDetailClient product={product} />
      <section className="mt-16">
        <p className="eyebrow mb-3">REVIEWS</p>
        <h2 className="text-2xl font-light tracking-[.16em] mb-8">CUSTOMER REVIEWS</h2>
        {reviews.length === 0 ? (
          <p className="text-[#64615c] text-sm">No reviews yet.</p>
        ) : (
          <div className="space-y-6">
            {reviews.map((r) => (
              <div key={r.id} className="border-b border-[#d0cec7] pb-6">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-[11px] tracking-[.18em]">{r.author}</span>
                  <span className="text-[#64615c] text-xs">{"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}</span>
                </div>
                <p className="text-sm text-[#64615c]">{r.comment}</p>
              </div>
            ))}
          </div>
        )}
        <ReviewForm productId={product.id} />
      </section>
      {related.length > 0 && (
        <section className="mt-24">
          <p className="eyebrow mb-3">YOU MAY ALSO LIKE</p>
          <h2 className="text-2xl font-light tracking-[.16em] mb-8">RELATED PRODUCTS</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {related.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}
    </div>
  );
}
