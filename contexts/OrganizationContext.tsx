"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Organization } from "@/types/organization";
import { Shop } from "@/types/shop";

interface OrganizationContextData {
  organization: Organization | null;
  selectedShop: Shop | null;

  setOrganization: (org: Organization) => void;
  setSelectedShop: (shop: Shop | null) => void;
  clearContext: () => void;

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

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.getItem(STORAGE_KEYS.ORGANIZATION);
      localStorage.getItem(STORAGE_KEYS.SHOP);
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
