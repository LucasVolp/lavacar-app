"use client";

import React from "react";
import type { OrganizationShopOverview } from "@/types/organization";
import { OrganizationShopsCardsGrid } from "@/components/organization/shops/OrganizationShopsCardsGrid";

interface RecentShopsProps {
  shops: OrganizationShopOverview[];
  organizationId: string;
}

export const RecentShops: React.FC<RecentShopsProps> = ({ shops, organizationId }) => {
  return (
    <section>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-zinc-900 dark:text-white">Lojas da Organização</h2>
      </div>

      <OrganizationShopsCardsGrid
        shops={shops}
        createHref={`/organization/${organizationId}/shops/new`}
      />
    </section>
  );
};
