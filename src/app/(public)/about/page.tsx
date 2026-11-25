import Image from "next/image";

export default function AboutPage() {
  return (
    <div className="container-page py-12">
      <p className="eyebrow mb-3">ABOUT</p>
      <h1 className="text-4xl font-bold tracking-[.16em] mb-8">rXa™</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="space-y-6 text-[#64615c] leading-relaxed">
          <p>rXa™ is a study in volume, proportion and quiet structure. We design premium clothing for considered everyday wear — pieces that hold their shape, age with grace, and never demand attention.</p>
          <p>Our philosophy is reduction: remove what is unnecessary, refine what remains. Natural fabrics, generous silhouettes, and the space between body and cloth.</p>
          <p>Each collection is a conversation between material and form. We believe good clothing should feel inevitable.</p>
        </div>
        <div className="relative aspect-[4/5] bg-[#eeebe5] overflow-hidden">
          <Image src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=900&q=80" alt="rXa™" fill className="object-cover" />
        </div>
      </div>
      <section className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { title: "MATERIAL", body: "We source natural and recycled fibers chosen for hand, drape and longevity." },
          { title: "CRAFT", body: "Considered construction, quiet details, and finishes that reward a closer look." },
          { title: "LONGEVITY", body: "Pieces designed to be worn for years, not seasons." },
        ].map((v) => (
          <div key={v.title} className="border-t border-[#d0cec7] pt-6">
            <h3 className="text-[11px] tracking-[.2em] mb-3">{v.title}</h3>
            <p className="text-[#64615c] text-sm leading-relaxed">{v.body}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
