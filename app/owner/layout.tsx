import { OwnerLayout } from "@/components/layout";
import type React from "react";

export default function OwnerLayoutWrapper({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <OwnerLayout>{children}</OwnerLayout>;
}
