"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    try {
      const supabase = createClient();
      const { error } = await supabase.from("newsletter").insert({ email });
      if (error) throw error;
      setStatus("done");
      setEmail("");
    } catch {
      setStatus("error");
    }
  }

  if (status === "done") return <p className="text-sm tracking-[.18em]">THANK YOU FOR SUBSCRIBING.</p>;

  return (
    <form onSubmit={submit} className="flex items-center gap-3 max-w-md mx-auto border-b border-[#20211f] pb-2">
      <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="EMAIL ADDRESS" className="flex-1 bg-transparent text-[11px] tracking-[.18em] focus:outline-none" />
      <button type="submit" disabled={status === "loading"} className="text-[11px] tracking-[.18em]">{status === "loading" ? "..." : "SUBSCRIBE"}</button>
      {status === "error" && <span className="text-red-700 text-xs">Error. Try again.</span>}
    </form>
  );
}
