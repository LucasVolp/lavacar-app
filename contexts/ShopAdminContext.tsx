"use client";

import React, { createContext, useContext, ReactNode } from "react";
import { useParams } from "next/navigation";
import { useShopById } from "@/hooks/useShops";
import { Shop } from "@/types/shop";

/**
 * Contexto do Shop Administrativo
 * 
 * Fornece o shop atual para todas as telas administrativas.
 * O shopId vem da URL (/shop/[shopId]).
 */

interface ShopAdminContextData {
  shop: Shop | null;
  shopId: string;
  isLoading: boolean;
  error: Error | null;
}

const ShopAdminContext = createContext<ShopAdminContextData>({} as ShopAdminContextData);

export function ShopAdminProvider({ children }: { children: ReactNode }) {
  const params = useParams();
  const shopId = params?.shopId as string;

  const { data: shop, isLoading, error } = useShopById(shopId);

  const value: ShopAdminContextData = {
    shop: shop ?? null,
    shopId,
    isLoading,
    error: error as Error | null,
  };

  return (
    <ShopAdminContext.Provider value={value}>
      {children}
    </ShopAdminContext.Provider>
  );
}

export function useShopAdmin() {
  const context = useContext(ShopAdminContext);
  if (!context) {
    throw new Error("useShopAdmin deve ser usado dentro de ShopAdminProvider");
  }
  return context;
}
