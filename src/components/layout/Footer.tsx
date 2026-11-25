import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-[#d0cec7] mt-24">
      <div className="container-page py-12 grid grid-cols-1 md:grid-cols-4 gap-8 text-[11px] tracking-[.18em]">
        <div>
          <div className="orzr-brand text-2xl mb-4">rXa™</div>
          <p className="text-[#64615c] normal-case tracking-normal text-sm leading-relaxed">A study in volume, proportion and quiet structure. Premium clothing for considered everyday wear.</p>
        </div>
        <div>
          <div className="eyebrow mb-3">Shop</div>
          <ul className="space-y-2">
            <li><Link href="/shop">All Products</Link></li>
            <li><Link href="/collections">Collections</Link></li>
            <li><Link href="/shop?featured=1">New Arrivals</Link></li>
          </ul>
        </div>
        <div>
          <div className="eyebrow mb-3">Company</div>
          <ul className="space-y-2">
            <li><Link href="/about">About</Link></li>
            <li><Link href="/contact">Contact</Link></li>
          </ul>
        </div>
        <div>
          <div className="eyebrow mb-3">Account</div>
          <ul className="space-y-2">
            <li><Link href="/account/login">Login</Link></li>
            <li><Link href="/account/register">Register</Link></li>
            <li><Link href="/account">My Account</Link></li>
          </ul>
        </div>
      </div>
      <div className="container-page pb-6 text-[9px] tracking-[.2em] text-[#64615c]">© 2026 rXa™. ALL RIGHTS RESERVED.</div>
    </footer>
  );
}
