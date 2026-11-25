"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      router.push("/account");
      router.refresh();
    } catch (err: any) {
      setError(err?.message ?? "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container-page py-24 max-w-md mx-auto">
      <p className="eyebrow mb-3">ACCOUNT</p>
      <h1 className="text-3xl font-light tracking-[.16em] mb-8">LOGIN</h1>
      <form onSubmit={submit} className="space-y-4">
        <input required type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-transparent border-b border-[#c9cbc0] py-3 text-sm focus:outline-none focus:border-[#20211f]" />
        <input required type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-transparent border-b border-[#c9cbc0] py-3 text-sm focus:outline-none focus:border-[#20211f]" />
        {error && <p className="text-red-700 text-sm">{error}</p>}
        <button type="submit" disabled={loading} className="btn-primary w-full">{loading ? "..." : "LOGIN"}</button>
      </form>
      <p className="mt-6 text-sm text-[#64615c]">No account? <Link href="/account/register" className="underline">Register</Link></p>
    </div>
  );
}
