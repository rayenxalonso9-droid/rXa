"use client";
import { useState } from "react";

export default function ContactPage() {
  const [sent, setSent] = useState(false);
  return (
    <div className="container-page py-12 max-w-2xl">
      <p className="eyebrow mb-3">CONTACT</p>
      <h1 className="text-4xl font-light tracking-[.16em] mb-8">GET IN TOUCH</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
        <div className="space-y-4 text-sm text-[#64615c]">
          <p><span className="eyebrow block mb-1">EMAIL</span>hello@rXa™.com</p>
          <p><span className="eyebrow block mb-1">PHONE</span>+1 (555) 010-0200</p>
          <p><span className="eyebrow block mb-1">STUDIO</span>12 Quiet Street, New York, NY</p>
          <div className="flex gap-4 mt-4 text-[11px] tracking-[.18em]">
            <a href="#">INSTAGRAM</a>
            <a href="#">PINTEREST</a>
            <a href="#">NEWSLETTER</a>
          </div>
        </div>
        {sent ? (
          <p className="text-sm tracking-[.18em]">MESSAGE SENT. WE'LL BE IN TOUCH.</p>
        ) : (
          <form onSubmit={(e) => { e.preventDefault(); setSent(true); }} className="space-y-4">
            <input required placeholder="Name" className="w-full bg-transparent border-b border-[#c9cbc0] py-3 text-sm focus:outline-none focus:border-[#20211f]" />
            <input required type="email" placeholder="Email" className="w-full bg-transparent border-b border-[#c9cbc0] py-3 text-sm focus:outline-none focus:border-[#20211f]" />
            <textarea required placeholder="Message" rows={4} className="w-full bg-transparent border-b border-[#c9cbc0] py-3 text-sm focus:outline-none focus:border-[#20211f]" />
            <button type="submit" className="btn-primary">SEND MESSAGE</button>
          </form>
        )}
      </div>
    </div>
  );
}
