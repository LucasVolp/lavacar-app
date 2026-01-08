import { ShopHeader } from "@/components/shop/ShopHeader";

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen">
      <ShopHeader />
      {children}
    </div>
  );
}
