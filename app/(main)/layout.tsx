import { MainLayout } from "@/components/layout";
import type React from "react";

export default function MainLayoutWrapper({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <MainLayout>{children}</MainLayout>;
}
