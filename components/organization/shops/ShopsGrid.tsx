"use client";

import React from "react";
import type { OrganizationShopOverview } from "@/types/organization";
import { OrganizationShopsCardsGrid } from "./OrganizationShopsCardsGrid";

interface ShopsGridProps {
  shops: OrganizationShopOverview[];
  onCreateShop?: () => void;
  createHref?: string;
  searchTerm?: string;
  canDelete?: boolean;
  onDelete?: (shopId: string) => void;
}

export const ShopsGrid: React.FC<ShopsGridProps> = ({
  shops,
  onCreateShop,
  createHref,
  searchTerm,
  canDelete,
  onDelete,
}) => {
  return (
    <OrganizationShopsCardsGrid
      shops={shops}
      onCreateShop={onCreateShop}
      createHref={createHref}
      searchTerm={searchTerm}
      canDelete={canDelete}
      onDelete={onDelete}
    />
  );
};
