"use client";

import { ClientLayout } from "@/components/layout";
import { RequireAuth } from "@/components/auth/RequireAuth";
import type React from "react";

export default function ClientLayoutWrapper({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <RequireAuth>
      <ClientLayout>{children}</ClientLayout>
    </RequireAuth>
  );
}