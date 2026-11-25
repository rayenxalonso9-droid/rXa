import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-page py-24 text-center">
      <p className="eyebrow mb-3">404</p>
      <h1 className="text-4xl font-light tracking-[.16em] mb-6">PAGE NOT FOUND</h1>
      <Link href="/" className="btn-primary inline-block">RETURN HOME</Link>
    </div>
  );
}
