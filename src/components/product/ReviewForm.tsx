"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export function ReviewForm({ productId }: { productId: string }) {
  const router = useRouter();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setError("Please log in to review."); setLoading(false); return; }
      const { error } = await supabase.from("reviews").insert({ customer_id: user.id, product_id: productId, rating, comment });
      if (error) throw error;
      setComment("");
      router.refresh();
    } catch (err: any) {
      setError(err?.message ?? "Failed to submit");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className="mt-8 space-y-4 max-w-xl">
      <div className="eyebrow mb-2">WRITE A REVIEW</div>
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((n) => (
          <button type="button" key={n} onClick={() => setRating(n)} className={`text-xl ${n <= rating ? "text-[#20211f]" : "text-[#c9cbc0]"}`}>★</button>
        ))}
      </div>
      <textarea required value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Your review" rows={3} className="w-full bg-transparent border border-[#c9cbc0] py-2 px-3 text-sm focus:outline-none" />
      {error && <p className="text-red-700 text-sm">{error}</p>}
      <button type="submit" disabled={loading} className="btn-primary">{loading ? "..." : "SUBMIT REVIEW"}</button>
    </form>
  );
}
