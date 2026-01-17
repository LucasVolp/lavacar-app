"use client";

import React from "react";
import { ShopAdminProvider } from "@/contexts/ShopAdminContext";
import { ShopLayout } from "@/components/layout/ShopLayout";

/**
 * Layout Administrativo do Shop
 * 
 * Rota: /shop/[shopId]/*
 * 
 * Fornece:
 * - Contexto do shop atual (ShopAdminProvider)
 * - Novo Layout SaaS (ShopLayout)
 */
export default function ShopAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ShopAdminProvider>
      <ShopLayout>{children}</ShopLayout>
    </ShopAdminProvider>
  );
}