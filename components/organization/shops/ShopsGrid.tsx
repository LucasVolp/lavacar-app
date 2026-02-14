"use client";

import React from "react";
import type { OrganizationShopOverview } from "@/types/organization";
import { OrganizationShopsCardsGrid } from "./OrganizationShopsCardsGrid";

interface ShopsGridProps {
  shops: OrganizationShopOverview[];
  onCreateShop?: () => void;
  createHref?: string;
  searchTerm?: string;
}

export const ShopsGrid: React.FC<ShopsGridProps> = ({
  shops,
  onCreateShop,
  createHref,
  searchTerm,
}) => {
  return (
    <OrganizationShopsCardsGrid
      shops={shops}
      onCreateShop={onCreateShop}
      createHref={createHref}
      searchTerm={searchTerm}
    />
  );
};
