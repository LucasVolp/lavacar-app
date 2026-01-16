"use client";

import { createContext, useContext, useState, ReactNode, useCallback } from "react";
import { Shop } from "@/types/shop";
import { shopService } from "@/services/shop";

interface ShopContextType {
  shop: Shop | null;
  shopId: string | null;
  isLoading: boolean;
  error: string | null;
  setShopBySlug: (slug: string) => Promise<void>;
  setShopById: (id: string) => Promise<void>;
  clearShop: () => void;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

interface ShopProviderProps {
  children: ReactNode;
}

export function ShopProvider({ children }: ShopProviderProps) {
  const [shop, setShop] = useState<Shop | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const shopId = shop?.id || null;

  const setShopBySlug = useCallback(async (slug: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const foundShop = await shopService.findBySlug(slug);
      
      if (!foundShop) {
        throw new Error("Loja não encontrada");
      }
      
      setShop(foundShop);
    } catch (err: unknown) {
      const error = err as Error;
      const errorMessage = error.message || "Erro ao carregar loja";
      setError(errorMessage);
      console.error("Erro ao buscar loja por slug:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const setShopById = useCallback(async (id: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const foundShop = await shopService.findOne(id);
      
      if (!foundShop) {
        throw new Error("Loja não encontrada");
      }
      
      setShop(foundShop);
    } catch (err: unknown) {
      const error = err as Error;
      const errorMessage = error.message || "Erro ao carregar loja";
      setError(errorMessage);
      console.error("Erro ao buscar loja por ID:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearShop = useCallback(() => {
    setShop(null);
    setError(null);
  }, []);

  return (
    <ShopContext.Provider
      value={{
        shop,
        shopId,
        isLoading,
        error,
        setShopBySlug,
        setShopById,
        clearShop,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
}

export function useShop() {
  const context = useContext(ShopContext);
  
  if (context === undefined) {
    throw new Error("useShop deve ser usado dentro de um ShopProvider");
  }
  
  return context;
}
