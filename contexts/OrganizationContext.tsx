"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Organization } from "@/types/organization";
import { Shop } from "@/types/shop";

/**
 * Context para gerenciar estado global do painel owner
 * 
 * Fluxo de navegação:
 * 1. Usuário visualiza dashboard da organization (lista de shops)
 * 2. Seleciona um shop específico
 * 3. shopId é armazenado globalmente
 * 4. Todas as telas do painel usam esse shopId
 * 
 * ⚠️ Sem autenticação nesta fase - endpoints assumidos como públicos
 */

interface OrganizationContextData {
  // Estado
  organization: Organization | null;
  selectedShop: Shop | null;
  
  // Ações
  setOrganization: (org: Organization) => void;
  setSelectedShop: (shop: Shop | null) => void;
  clearContext: () => void;
  
  // Helpers
  isShopSelected: boolean;
}

const OrganizationContext = createContext<OrganizationContextData>({} as OrganizationContextData);

const STORAGE_KEYS = {
  ORGANIZATION: "owner_organization_id",
  SHOP: "owner_selected_shop_id",
} as const;

export function OrganizationProvider({ children }: { children: ReactNode }) {
  const [organization, setOrganizationState] = useState<Organization | null>(null);
  const [selectedShop, setSelectedShopState] = useState<Shop | null>(null);

  // Restaurar do localStorage ao montar
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedOrgId = localStorage.getItem(STORAGE_KEYS.ORGANIZATION);
      const savedShopId = localStorage.getItem(STORAGE_KEYS.SHOP);
      
      // Aqui poderíamos buscar os dados da API, mas como não temos autenticação,
      // apenas mantemos os IDs para referência
      if (savedOrgId) {
        console.log(`[OrganizationContext] Organization ID restaurado: ${savedOrgId}`);
      }
      if (savedShopId) {
        console.log(`[OrganizationContext] Shop ID restaurado: ${savedShopId}`);
      }
    }
  }, []);

  const setOrganization = (org: Organization) => {
    setOrganizationState(org);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEYS.ORGANIZATION, org.id);
    }
  };

  const setSelectedShop = (shop: Shop | null) => {
    setSelectedShopState(shop);
    if (typeof window !== "undefined") {
      if (shop) {
        localStorage.setItem(STORAGE_KEYS.SHOP, shop.id);
      } else {
        localStorage.removeItem(STORAGE_KEYS.SHOP);
      }
    }
  };

  const clearContext = () => {
    setOrganizationState(null);
    setSelectedShopState(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEYS.ORGANIZATION);
      localStorage.removeItem(STORAGE_KEYS.SHOP);
    }
  };

  const value: OrganizationContextData = {
    organization,
    selectedShop,
    setOrganization,
    setSelectedShop,
    clearContext,
    isShopSelected: selectedShop !== null,
  };

  return (
    <OrganizationContext.Provider value={value}>
      {children}
    </OrganizationContext.Provider>
  );
}

export const useOrganization = () => {
  const context = useContext(OrganizationContext);
  if (!context) {
    throw new Error("useOrganization deve ser usado dentro de OrganizationProvider");
  }
  return context;
};
