import { Suspense } from "react";
import { ShopClient } from "@/components/shop/ShopClient";

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="container-page py-12">LOADING...</div>}>
      <ShopClient />
    </Suspense>
  );
}
