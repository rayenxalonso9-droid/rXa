import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "rXa™ — Premium Clothing",
  description: "rXa™. A study in volume, proportion and quiet structure.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
