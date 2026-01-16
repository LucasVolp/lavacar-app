"use client";

import React from "react";
import { OrganizationLayout } from "@/components/layout/OrganizationLayout";

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <OrganizationLayout>
      {children}
    </OrganizationLayout>
  );
}