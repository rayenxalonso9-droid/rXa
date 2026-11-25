import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { LayoutDashboard, Package, FolderTree, Layers, ShoppingBag, Users, Star, Settings } from "lucide-react";

const NAV = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/categories", label: "Categories", icon: FolderTree },
  { href: "/admin/collections", label: "Collections", icon: Layers },
  { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { href: "/admin/customers", label: "Customers", icon: Users },
  { href: "/admin/reviews", label: "Reviews", icon: Star },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const hasSupabase = !!process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (hasSupabase) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect("/account/login?next=/admin");
    const allowed = (process.env.ADMIN_EMAILS ?? "").split(",").map((e) => e.trim().toLowerCase()).filter(Boolean);
    if (allowed.length && !allowed.includes((user.email ?? "").toLowerCase())) {
      redirect("/");
    }
  }

  return (
    <div className="min-h-screen flex bg-[#f4f3ef]">
      <aside className="w-60 border-r border-[#d0cec7] bg-white p-6 hidden md:block">
        <div className="orzr-brand text-2xl mb-8">rXa™ ADMIN</div>
        <nav className="space-y-1">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className="flex items-center gap-3 px-3 py-2 text-[11px] tracking-[.18em] hover:bg-[#eeebe5] rounded">
              <n.icon size={16} /> {n.label.toUpperCase()}
            </Link>
          ))}
        </nav>
      </aside>
      <main className="flex-1 p-8 overflow-auto">{children}</main>
    </div>
  );
}
